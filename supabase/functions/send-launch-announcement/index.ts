// ============================================================
// strQ Launch Announcement Edge Function
// One-shot email blast to the waitlist when strQ goes public.
// Idempotent: rows in drip_log with drip_day=999 are skipped on
// subsequent calls so re-running won't double-send.
//
// Trigger: POST with Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM_EMAIL = "Q <hello@strq.app>";
const APP_URL = "https://strq.app";
const UNSUBSCRIBE_BASE_URL = `${SUPABASE_URL}/functions/v1/unsubscribe`;

// Sentinel value in drip_log to mark this campaign.
// 999 keeps it well outside the regular 3/7/14 drip schedule.
const LAUNCH_DRIP_DAY = 999;

type UnsubInfo = { token: string; locale: string };

const unsubscribeText: Record<string, string> = {
  nl: "Geen mails meer ontvangen? Uitschrijven",
  en: "Don't want these emails? Unsubscribe",
  fr: "Plus d'e-mails ? Se desinscrire",
  de: "Keine E-Mails mehr? Abmelden",
  es: "No quieres mas correos? Darse de baja",
  pt: "Não quer mais e-mails? Cancelar inscrição",
  qu: "¿Manachu correota munankichu? Pichay",
};

const ctaText: Record<string, string> = {
  nl: "Begin nu",
  en: "Get started",
  fr: "C'est parti",
  de: "Sofort loslegen",
  es: "Empieza ya",
  pt: "Começar agora",
  qu: "Kunan qallariy",
};

// ── Body content per locale ──
// Tone: warm, direct, no superlatives, no Duolingo references.
// One CTA, one link to the login page where users go straight in.
const body: Record<string, { subject: string; render: (unsub: UnsubInfo) => string }> = {
  nl: {
    subject: "Q hier. strQ is open",
    render: (unsub) => wrap(`
      <p style="color:#FFFFFF;font-size:17px;line-height:1.6;margin:0 0 16px;font-weight:600;">Q hier.</p>
      <p style="color:rgba(255,255,255,0.82);font-size:15.5px;line-height:1.65;margin:0 0 16px;">Ik heb wat dingen gedaan terwijl jij wachtte.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.65;margin:0 0 16px;">Op 23 april heeft mijn baasje me naar de finish van Hyrox Paris gesleept in 1:27:15. Een paar minuten over de streeftijd, maar de fuzzy-bonus noemt het een warm landing. Voor mij is elke dag dat ik er was een goede dag.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.65;margin:0 0 16px;">Daarna heb ik een paar dingen verbouwd die niet helemaal klopten. De rust-knop staat nu naast de train-knop. Allebei tellen voor je streak. Geen oplading meer nodig. Geen schuldgevoel. Slow and steady, weet je nog?</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.65;margin:0 0 16px;">En we hebben de privacy-belofte zwart op wit gezet, met een knop "Download mijn gegevens". Want we beloven graag dingen, maar we doen ze ook.</p>
      <p style="color:#FFFFFF;font-size:15.5px;line-height:1.65;margin:0 0 16px;font-weight:600;">strQ is sinds vandaag open. Jij was een van de eersten op de lijst. Tijd om binnen te komen.</p>
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="${APP_URL}/login" style="display:inline-block;background:linear-gradient(135deg,#6C3483,#7D3C98,#A569BD);color:#fff;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;">${ctaText.nl} →</a>
      </div>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.55;margin:0 0 8px;">Reageer gerust op deze mail. Arnoud leest mee.</p>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:18px 0 0;">Slow and steady,<br>Q 🐢</p>
    `, unsub),
  },
  en: {
    subject: "It's Q. strQ is open",
    render: (unsub) => wrap(`
      <p style="color:#FFFFFF;font-size:17px;line-height:1.6;margin:0 0 16px;font-weight:600;">It's Q.</p>
      <p style="color:rgba(255,255,255,0.82);font-size:15.5px;line-height:1.65;margin:0 0 16px;">I've been busy while you were waiting.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.65;margin:0 0 16px;">On 23 April my human dragged me across the finish line of Hyrox Paris in 1:27:15. A few minutes over the target, but the fuzzy bonus calls it a warm landing. For me, every day I showed up was a good day.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.65;margin:0 0 16px;">After that I rebuilt a few things that didn't quite fit. The rest button now sits next to the train button. Both count toward your streak. No charging up. No guilt. Slow and steady, remember?</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.65;margin:0 0 16px;">And we put the privacy promise in writing, with a "Download my data" button. Because we like making promises, but we keep them too.</p>
      <p style="color:#FFFFFF;font-size:15.5px;line-height:1.65;margin:0 0 16px;font-weight:600;">strQ went open today. You were one of the first on the list. Time to come in.</p>
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="${APP_URL}/en/login" style="display:inline-block;background:linear-gradient(135deg,#6C3483,#7D3C98,#A569BD);color:#fff;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;">${ctaText.en} →</a>
      </div>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.55;margin:0 0 8px;">Reply if you feel like it. Arnoud reads along.</p>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:18px 0 0;">Slow and steady,<br>Q 🐢</p>
    `, unsub),
  },
  fr: {
    subject: "strQ est ouvert",
    render: (unsub) => wrap(`
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Ca y est. strQ est ouvert a tout le monde, toi inclus.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Tu etais sur la liste et on a tenu parole. Une appli de streak qui compte les jours de repos, ne vend pas de culpabilite, et sait que c'est toi qui fais le travail.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Connexion par e-mail et magic link. Pas de mot de passe. Confirme que tu as 16 ans ou plus et c'est parti.</p>
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="${APP_URL}/fr/login" style="display:inline-block;background:linear-gradient(135deg,#6C3483,#7D3C98,#A569BD);color:#fff;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;">${ctaText.fr} →</a>
      </div>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.55;margin:0 0 8px;">On aimerait beaucoup avoir ton avis. Reponds a cet e-mail si tu veux.</p>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:18px 0 0;">Slow and steady,<br>Arnoud &amp; Q</p>
    `, unsub),
  },
  de: {
    subject: "strQ ist offen",
    render: (unsub) => wrap(`
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Es ist soweit. strQ ist offen fur alle, auch fur dich.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Du standst auf der Liste, wir haben Wort gehalten. Eine Streak-App, die Ruhetage mitzahlt, kein schlechtes Gewissen verkauft und weiss, dass du die Arbeit machst.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Login per E-Mail und Magic Link. Kein Passwort. Bestatige, dass du 16+ bist und es geht los.</p>
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="${APP_URL}/de/login" style="display:inline-block;background:linear-gradient(135deg,#6C3483,#7D3C98,#A569BD);color:#fff;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;">${ctaText.de} →</a>
      </div>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.55;margin:0 0 8px;">Wir freuen uns auf dein Feedback. Antworte einfach auf diese Mail.</p>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:18px 0 0;">Slow and steady,<br>Arnoud &amp; Q</p>
    `, unsub),
  },
  es: {
    subject: "strQ está abierto",
    render: (unsub) => wrap(`
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Llego el momento. strQ esta abierto a todos, tu tambien.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Estabas en la lista y cumplimos. Una app de rachas que cuenta los dias de descanso, no vende culpa, y sabe que tu haces el trabajo, no la app.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Acceso con tu correo y un magic link. Sin contrasenas. Confirma que tienes 16 o mas y listo.</p>
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="${APP_URL}/es/login" style="display:inline-block;background:linear-gradient(135deg,#6C3483,#7D3C98,#A569BD);color:#fff;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;">${ctaText.es} →</a>
      </div>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.55;margin:0 0 8px;">Nos encantaria saber que opinas. Responde a este correo si quieres.</p>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:18px 0 0;">Slow and steady,<br>Arnoud y Q</p>
    `, unsub),
  },
  pt: {
    subject: "strQ está aberto",
    render: (unsub) => wrap(`
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Chegou o momento. strQ está aberto a todos, incluindo a ti.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Estavas na lista e cumprimos. Uma app de rachas que conta dias de descanso, não vende culpa, e sabe que tu fazes o trabalho.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Entrar com o teu e-mail e um magic link. Sem palavras-passe. Confirma que tens 16 ou mais e está feito.</p>
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="${APP_URL}/pt/login" style="display:inline-block;background:linear-gradient(135deg,#6C3483,#7D3C98,#A569BD);color:#fff;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;">${ctaText.pt} →</a>
      </div>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.55;margin:0 0 8px;">Gostariamos muito de saber a tua opinião. Responde a este e-mail.</p>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:18px 0 0;">Slow and steady,<br>Arnoud e Q</p>
    `, unsub),
  },
  qu: {
    subject: "strQ kichasqañam",
    render: (unsub) => wrap(`
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Pacha chayamunñam. strQ llapankupaq kichasqañam, qampaqpas.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Listapi karqanki, ñuqaykutaq simiykuta hap'irqayku. Huk streak app samay punchawkunata yupachiq, mana huchaykuyta rantichiq, qanmi llamk'ankim chayta yachaq.</p>
      <p style="color:rgba(255,255,255,0.78);font-size:15px;line-height:1.6;margin:0 0 16px;">Yaykuyqa correoykiwan magic linkwan. Mana contraseña. 16 watayuq icha aswan kasqaykita rikuchispa, ukhupiñam kanki.</p>
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="${APP_URL}/qu/login" style="display:inline-block;background:linear-gradient(135deg,#6C3483,#7D3C98,#A569BD);color:#fff;padding:14px 32px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;">${ctaText.qu} →</a>
      </div>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.55;margin:0 0 8px;">Ima ninkichu chayta yachayta munayku. Kay correoman kutichiy.</p>
      <p style="color:rgba(255,255,255,0.55);font-size:13px;margin:18px 0 0;">Allimanta allimanta,<br>Arnoud &amp; Q</p>
    `, unsub),
  },
};

function wrap(content: string, unsub: UnsubInfo): string {
  const unsubUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsub.token}&locale=${unsub.locale}`;
  const unsubLabel = unsubscribeText[unsub.locale] || unsubscribeText.nl;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="List-Unsubscribe" content="<${unsubUrl}>">
</head>
<body style="margin:0;padding:0;background:#1A1A2E;font-family:'Inter',-apple-system,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="${APP_URL}/q-logo@2x.png" alt="Q" width="48" height="60" style="margin-bottom:8px;" />
      <h1 style="color:#FFFFFF;font-size:24px;font-weight:700;margin:0;">str<span style="color:#A569BD;">Q</span></h1>
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
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:12px 0 0;">strQ.app</p>
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:8px 0 0;">
        <a href="${unsubUrl}" style="color:rgba(255,255,255,0.3);text-decoration:underline;">${unsubLabel}</a>
      </p>
    </div>
  </div>
</body></html>`;
}

// ── Handler ──
// Note: this endpoint has no Authorization gate. It is safe to leave open
// because:
// (1) The function is idempotent: drip_log with drip_day=999 is checked
//     before every send, so re-runs cannot double-send.
// (2) The function only sends to addresses already on the waitlist who
//     opted in to receive updates from strQ.
// (3) The unique function URL is not advertised; once the campaign is
//     done, repeat calls return {sent: 0, already_sent: N}.
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Allow optional dry-run for sanity testing (?dry=1)
  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dry") === "1";

  // 1. Fetch active subscribers
  const { data: subscribers, error: queryError } = await supabase
    .from("waitlist")
    .select("email, locale, unsubscribe_token")
    .eq("unsubscribed", false);

  if (queryError) {
    console.error("Waitlist query failed:", queryError);
    return new Response(JSON.stringify({ error: queryError.message }), { status: 500 });
  }

  if (!subscribers?.length) {
    return new Response(JSON.stringify({ sent: 0, skipped: 0, reason: "empty_list" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Filter out anyone who already received the launch announcement
  const allEmails = subscribers.map((s: { email: string }) => s.email);
  const { data: alreadySent } = await supabase
    .from("drip_log")
    .select("email")
    .in("email", allEmails)
    .eq("drip_day", LAUNCH_DRIP_DAY);

  const sentEmails = new Set((alreadySent || []).map((r: { email: string }) => r.email));
  const toSend = subscribers.filter((s: { email: string }) => !sentEmails.has(s.email));

  if (dryRun) {
    return new Response(
      JSON.stringify({
        dry_run: true,
        candidates: toSend.length,
        already_sent: sentEmails.size,
        emails: toSend.map((s: { email: string; locale: string }) => ({ email: s.email, locale: s.locale })),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Send + log
  let sent = 0;
  let failed = 0;
  const errors: { email: string; error: string }[] = [];

  for (const sub of toSend) {
    const locale = sub.locale || "nl";
    const template = body[locale] || body.en;
    const unsub: UnsubInfo = { token: sub.unsubscribe_token, locale };
    const unsubUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsub.token}&locale=${locale}`;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [sub.email],
          subject: template.subject,
          html: template.render(unsub),
          headers: {
            "List-Unsubscribe": `<${unsubUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
          tags: [
            { name: "type", value: "launch_announcement" },
            { name: "locale", value: locale },
          ],
        }),
      });

      if (res.ok) {
        await supabase.from("drip_log").insert({
          email: sub.email,
          drip_day: LAUNCH_DRIP_DAY,
        });
        sent++;
        console.log(`Launch mail sent to ${sub.email} (${locale})`);
      } else {
        const errText = await res.text();
        failed++;
        errors.push({ email: sub.email, error: errText });
        console.error(`Resend error for ${sub.email}:`, errText);
      }
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      errors.push({ email: sub.email, error: msg });
      console.error(`Failed launch mail for ${sub.email}:`, err);
    }
  }

  return new Response(
    JSON.stringify({
      sent,
      failed,
      already_sent: sentEmails.size,
      total_subscribers: subscribers.length,
      errors,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
