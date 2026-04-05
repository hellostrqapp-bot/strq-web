import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sport, referral_source, utm_source, utm_medium, utm_campaign } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    // Supabase nog niet geconfigureerd? Log het email naar console
    if (!supabase) {
      console.log(`[waitlist] ${email} (Supabase niet geconfigureerd)`, { sport, referral_source, utm_source });
      return NextResponse.json({ status: "registered" });
    }

    // Detecteer taal uit referer
    const referer = request.headers.get("referer") || "";
    const localeMatch = referer.match(/\/(en|fr|de|es)\/?/);
    const locale = localeMatch ? localeMatch[1] : "nl";

    // Bouw insert object — alleen niet-lege velden meesturen
    const insertData: Record<string, string> = {
      email: email.toLowerCase().trim(),
      locale,
      source: "landing",
    };

    if (sport && sport !== "none") insertData.sport = sport;
    if (referral_source?.trim()) insertData.referral_source = referral_source.trim();
    if (utm_source?.trim()) insertData.utm_source = utm_source.trim();
    if (utm_medium?.trim()) insertData.utm_medium = utm_medium.trim();
    if (utm_campaign?.trim()) insertData.utm_campaign = utm_campaign.trim();

    const { error } = await supabase.from("waitlist").insert(insertData);

    if (error) {
      // Duplicate email = already on list, still return success
      if (error.code === "23505") {
        return NextResponse.json({ status: "already_registered" });
      }
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Er ging iets mis" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "registered" });
  } catch {
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 }
    );
  }
}
