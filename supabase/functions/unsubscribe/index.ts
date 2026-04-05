// ============================================================
// strQ — Unsubscribe Edge Function
// One-click unsubscribe via token (geen email in URL = privacy)
// Ondersteunt zowel GET (link in mail) als POST
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const unsubscribePageHtml = (success: boolean, locale: string) => {
  const messages: Record<string, { title: string; body: string; error: string }> = {
    nl: {
      title: "Uitgeschreven",
      body: "Je ontvangt geen verdere e-mails meer van strQ. Mocht je je bedenken, mail dan hello@strq.app.",
      error: "Er ging iets mis. Probeer het opnieuw of mail hello@strq.app.",
    },
    en: {
      title: "Unsubscribed",
      body: "You won't receive any more emails from strQ. Changed your mind? Email hello@strq.app.",
      error: "Something went wrong. Try again or email hello@strq.app.",
    },
    fr: {
      title: "Désinscrit",
      body: "Tu ne recevras plus d'e-mails de strQ. Tu changes d'avis ? Écris à hello@strq.app.",
      error: "Quelque chose s'est mal passé. Réessaie ou écris à hello@strq.app.",
    },
    de: {
      title: "Abgemeldet",
      body: "Du erhältst keine weiteren E-Mails mehr von strQ. Meinung geändert? Schreib an hello@strq.app.",
      error: "Etwas ist schiefgegangen. Versuch es nochmal oder schreib an hello@strq.app.",
    },
    es: {
      title: "Dado de baja",
      body: "No recibirás más correos de strQ. ¿Cambiaste de opinión? Escribe a hello@strq.app.",
      error: "Algo salió mal. Inténtalo de nuevo o escribe a hello@strq.app.",
    },
    pt: {
      title: "Cancelado",
      body: "Você não receberá mais e-mails do strQ. Mudou de ideia? Escreva para hello@strq.app.",
      error: "Algo deu errado. Tente novamente ou escreva para hello@strq.app.",
    },
    qu: {
      title: "Pichay tukusqa",
      body: "Manaña strQ correokunata chaskinkichu. Yuyayniykita tikrarqanki? hello@strq.app-man qillqay.",
      error: "Imapas pantay karqan. Watiqmanta ruway utaq hello@strq.app-man qillqay.",
    },
  };

  const msg = messages[locale] || messages["nl"];
  const title = success ? msg.title : "Error";
  const body = success ? msg.body : msg.error;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — strQ</title></head>
<body style="margin:0;padding:0;background:#1A1A2E;font-family:'Inter',-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:400px;margin:0 auto;padding:40px 24px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">&#128034;</div>
    <h1 style="color:#FFFFFF;font-size:22px;font-weight:700;margin:0 0 12px;">str<span style="color:#6C3483;">Q</span></h1>
    <h2 style="color:#FFFFFF;font-size:18px;font-weight:600;margin:0 0 16px;">${title}</h2>
    <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin:0;">${body}</p>
    <div style="margin-top:32px;display:inline-flex;gap:3px;">
      <span style="width:16px;height:2px;background:#E74C3C;border-radius:1px;"></span>
      <span style="width:16px;height:2px;background:#E67E22;border-radius:1px;"></span>
      <span style="width:16px;height:2px;background:#F1C40F;border-radius:1px;"></span>
      <span style="width:16px;height:2px;background:#27AE60;border-radius:1px;"></span>
      <span style="width:16px;height:2px;background:#2980B9;border-radius:1px;"></span>
      <span style="width:16px;height:2px;background:#8E44AD;border-radius:1px;"></span>
    </div>
  </div>
</body></html>`;
};

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  // Detect locale from query param (used in email link) or default to nl
  const locale = url.searchParams.get("locale") || "nl";

  if (!token) {
    return new Response(unsubscribePageHtml(false, locale), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data, error } = await supabase
      .from("waitlist")
      .update({ unsubscribed: true })
      .eq("unsubscribe_token", token)
      .select("email")
      .single();

    if (error || !data) {
      console.error("Unsubscribe error:", error);
      return new Response(unsubscribePageHtml(false, locale), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    console.log(`Unsubscribed: ${data.email}`);

    return new Response(unsubscribePageHtml(true, locale), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return new Response(unsubscribePageHtml(false, locale), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
});
