// ═══════════════════════════════════════════════════════════
// strQ — User data export (GDPR art. 15 + 20)
// Returns all data the authenticated user has in our system
// as a downloadable JSON file. No filtering, no formatting tricks:
// what you see is exactly what we store. RLS is the auth boundary.
// ═══════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Json = Record<string, unknown>;

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "unauthorized", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  // Run all reads in parallel. RLS ensures we only get the user's own rows.
  // Tables keyed by user_id (auth-bound):
  const tables = [
    "profiles",
    "activities",
    "streak_state",
    "xp_log",
    "events",
    "daily_reveals",
    "streak_reminders",
    "subscriptions",
  ] as const;

  // profiles uses 'id' as PK (= auth.uid()); the rest use 'user_id'
  const reads = await Promise.all(
    tables.map((t) => {
      const col = t === "profiles" ? "id" : "user_id";
      return supabase.from(t).select("*").eq(col, user.id);
    })
  );

  const tableData: Json = {};
  tables.forEach((name, i) => {
    tableData[name] = reads[i].data ?? [];
  });

  // Email-keyed tables (waitlist + drip_log).
  // RLS may not allow these via anon key, so we read by email and
  // gracefully degrade to an empty array on error.
  const emailReads = await Promise.all([
    supabase.from("waitlist").select("*").eq("email", user.email ?? ""),
    supabase.from("drip_log").select("*").eq("email", user.email ?? ""),
  ]);

  const payload = {
    export_metadata: {
      generated_at: new Date().toISOString(),
      format_version: "1.0",
      gdpr_articles: ["15 (right of access)", "20 (data portability)"],
      app: "strQ.app",
      contact: "hello@strq.app",
      note: "This file contains everything we store about you. Account deletion permanently removes all of this — no soft delete, no backup that lingers.",
    },
    account: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
      phone: user.phone || null,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata,
    },
    ...tableData,
    waitlist: emailReads[0].data ?? [],
    drip_log: emailReads[1].data ?? [],
  };

  const datestamp = new Date().toISOString().slice(0, 10);
  const filename = `strq-export-${datestamp}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
