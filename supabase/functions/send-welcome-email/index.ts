// ============================================================
// strQ — Welkomstmail Edge Function
// Triggered door Supabase Database Webhook bij nieuwe waitlist insert
// Stuurt welkomstmail via Resend in de juiste taal
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const FROM_EMAIL = "Q <hello@strq.app>"; // Vereist: geverifieerd domein in Resend
const UNSUBSCRIBE_BASE_URL = `${SUPABASE_URL}/functions/v1/unsubscribe`;

// ── Unsubscribe footer text per taal ──
const unsubText: Record<string, string> = {
  nl: "Geen mails meer ontvangen? Uitschrijven",
  en: "Don't want these emails? Unsubscribe",
  fr: "Plus d'e-mails ? Se desinscrire",
  de: "Keine E-Mails mehr? Abmelden",
  es: "No quieres mas correos? Darse de baja",
  pt: "Não quer mais e-mails? Cancelar inscrição",
  qu: "¿Manachu correota munankichu? Pichay",
};

// ── Privacy footer per taal ──
const privacyFooter: Record<string, string> = {
  nl: "Geen cookies. Geen tracking. Wel een schildpad met een bril.",
  en: "No cookies. No tracking. Just a turtle with glasses.",
  fr: "Pas de cookies. Pas de tracking. Juste une tortue avec des lunettes.",
  de: "Keine Cookies. Kein Tracking. Nur eine Schildkrote mit Brille.",
  es: "Sin cookies. Sin tracking. Solo una tortuga con gafas.",
  pt: "Sem cookies. Sem rastreamento. Só uma tartaruga de óculos.",
  qu: "Mana cookies. Mana rastreamiento. Huk tortuga lentesyuqlla.",
};

// ── Email wrapper (shared across all templates) ──
function buildEmail(content: string, locale: string, unsubToken?: string): string {
  const unsubLink = unsubToken
    ? `<p style="color:rgba(255,255,255,0.2);font-size:11px;margin:8px 0 0;">
        <a href="${UNSUBSCRIBE_BASE_URL}?token=${unsubToken}&locale=${locale}"
           style="color:rgba(255,255,255,0.3);text-decoration:underline;">${unsubText[locale] || unsubText["nl"]}</a>
      </p>`
    : "";

  const unsubHeader = unsubToken
    ? `<meta name="List-Unsubscribe" content="<${UNSUBSCRIBE_BASE_URL}?token=${unsubToken}&locale=${locale}>">`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${unsubHeader}</head>
<body style="margin:0;padding:0;background:#1A1A2E;font-family:'Inter',-apple-system,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:8px;">&#128034;</div>
      <h1 style="color:#FFFFFF;font-size:24px;font-weight:700;margin:0;">str<span style="color:#6C3483;">Q</span></h1>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px 24px;">
      ${content}
    </div>
    <div style="text-align:center;margin-top:32px;">
      <div style="display:inline-flex;gap:3px;">
        <span style="width:20px;height:2px;background:#E74C3C;border-radius:1px;"></span>
        <span style="width:20px;height:2px;background:#E67E22;border-radius:1px;"></span>
        <span style="width:20px;height:2px;background:#F1C40F;border-radius:1px;"></span>
        <span style="width:20px;height:2px;background:#27AE60;border-radius:1px;"></span>
        <span style="width:20px;height:2px;background:#2980B9;border-radius:1px;"></span>
        <span style="width:20px;height:2px;background:#8E44AD;border-radius:1px;"></span>
      </div>
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:12px 0 0;">strQ.app — ${privacyFooter[locale] || privacyFooter["nl"]}</p>
      ${unsubLink}
    </div>
  </div>
</body></html>`;
}

// ── Email body content per taal ──
const bodyContent: Record<string, { subject: string; body: string }> = {
  nl: {
    subject: "Welkom bij strQ — je staat op de lijst!",
    body: `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hey! Leuk dat je erbij bent.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Je staat nu op de waitlist van strQ — de app die consistentie beloont op weg naar je sportevenement. Duolingo, maar dan voor sport.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">We bouwen nu aan de eerste versie. Zodra die klaar is, ben jij een van de eersten die hem mag testen.</p>
      <div style="border-left:3px solid #6C3483;padding-left:16px;margin:24px 0;">
        <p style="color:#A569BD;font-size:14px;font-style:italic;margin:0;">"Slow and steady wins the race." — Q</p>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Tot snel!<br>Team strQ</p>`,
  },
  en: {
    subject: "Welcome to strQ — you're on the list!",
    body: `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hey! Great to have you.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">You're now on the strQ waitlist — the app that rewards consistency on your way to your sports event. Duolingo, but for fitness.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">We're building the first version right now. When it's ready, you'll be among the first to try it.</p>
      <div style="border-left:3px solid #6C3483;padding-left:16px;margin:24px 0;">
        <p style="color:#A569BD;font-size:14px;font-style:italic;margin:0;">"Slow and steady wins the race." — Q</p>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">See you soon!<br>Team strQ</p>`,
  },
  fr: {
    subject: "Bienvenue chez strQ — tu es sur la liste !",
    body: `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Salut ! Content de te voir ici.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Tu es sur la waitlist de strQ — l'appli qui recompense la regularite sur le chemin de ton evenement sportif. Duolingo, mais pour le sport.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">On construit la premiere version en ce moment. Quand elle sera prete, tu seras parmi les premiers a la tester.</p>
      <div style="border-left:3px solid #6C3483;padding-left:16px;margin:24px 0;">
        <p style="color:#A569BD;font-size:14px;font-style:italic;margin:0;">"Slow and steady wins the race." — Q</p>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">A bientot !<br>Team strQ</p>`,
  },
  de: {
    subject: "Willkommen bei strQ — du bist auf der Liste!",
    body: `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hey! Schon, dass du dabei bist.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Du stehst jetzt auf der Warteliste von strQ — die App, die Bestandigkeit auf dem Weg zu deinem Sportevent belohnt. Duolingo, aber fur Sport.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Wir bauen gerade die erste Version. Sobald sie fertig ist, bist du einer der Ersten, die sie testen durfen.</p>
      <div style="border-left:3px solid #6C3483;padding-left:16px;margin:24px 0;">
        <p style="color:#A569BD;font-size:14px;font-style:italic;margin:0;">"Slow and steady wins the race." — Q</p>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Bis bald!<br>Team strQ</p>`,
  },
  es: {
    subject: "Bienvenido a strQ — estas en la lista!",
    body: `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hola! Que bueno que estas aqui.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Estas en la lista de espera de strQ — la app que premia la constancia en tu camino hacia tu evento deportivo. Duolingo, pero para el deporte.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Estamos construyendo la primera version ahora mismo. Cuando este lista, seras de los primeros en probarla.</p>
      <div style="border-left:3px solid #6C3483;padding-left:16px;margin:24px 0;">
        <p style="color:#A569BD;font-size:14px;font-style:italic;margin:0;">"Slow and steady wins the race." — Q</p>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Hasta pronto!<br>Team strQ</p>`,
  },
  pt: {
    subject: "Bem-vindo ao strQ — você está na lista!",
    body: `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Ei! Que bom ter você aqui.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Você está na lista de espera do strQ — o app que recompensa consistência no caminho do seu evento esportivo. Duolingo, mas para esporte.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Estamos construindo a primeira versão agora. Quando estiver pronta, você será um dos primeiros a testar.</p>
      <div style="border-left:3px solid #6C3483;padding-left:16px;margin:24px 0;">
        <p style="color:#A569BD;font-size:14px;font-style:italic;margin:0;">"Slow and steady wins the race." — Q</p>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Até logo!<br>Team strQ</p>`,
  },
  qu: {
    subject: "Hamuykuy strQ-man — listapim kanki!",
    body: `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Rimaykullayki! Allinmi kaypi kanayki.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Kunanqa strQ suyay listapim kanki — kay app ruwayniykita yupaychan deporteniykiman rishaspa. Duolingo hina, ichaqa deportepaq.</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Ñawpaq versionta ruwashankiku. Listam kaptin, qamqa ñawpaqmi pruebanki.</p>
      <div style="border-left:3px solid #6C3483;padding-left:16px;margin:24px 0;">
        <p style="color:#A569BD;font-size:14px;font-style:italic;margin:0;">"Allimanta allimanta atipanki." — Q</p>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Tupananchiskama!<br>Team strQ</p>`,
  },
};

// ── Handler ──
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.json();

    // Supabase Database Webhook stuurt: { type, table, record, ... }
    const record = payload.record;

    if (!record?.email) {
      return new Response("No email in record", { status: 400 });
    }

    const locale = record.locale || "nl";
    const template = bodyContent[locale] || bodyContent["nl"];
    const unsubToken = record.unsubscribe_token || undefined;

    const htmlContent = buildEmail(template.body, locale, unsubToken);

    // Bouw headers voor List-Unsubscribe (RFC 8058)
    const emailHeaders: Record<string, string> = {};
    if (unsubToken) {
      const unsubUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsubToken}&locale=${locale}`;
      emailHeaders["List-Unsubscribe"] = `<${unsubUrl}>`;
      emailHeaders["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }

    // Stuur welkomstmail via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [record.email],
        subject: template.subject,
        html: htmlContent,
        headers: emailHeaders,
        tags: [
          { name: "type", value: "welcome" },
          { name: "locale", value: locale },
          { name: "sport", value: record.sport || "unknown" },
        ],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend error:", error);
      return new Response(`Resend error: ${error}`, { status: 500 });
    }

    const data = await res.json();
    console.log(`Welcome email sent to ${record.email} (${locale}):`, data.id);

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(`Error: ${error}`, { status: 500 });
  }
});
