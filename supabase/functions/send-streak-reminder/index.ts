// ============================================================
// strQ — Streak Reminder Edge Function
// Stuurt een warme herinnering als de gebruiker vandaag nog
// niet heeft gelogd. Draait via pg_cron elke 15 minuten
// tussen 07:45-19:49 UTC (= 09:45-21:49 CEST).
//
// Per gebruiker wordt een deterministisch "random" tijdstip
// berekend (hash van user_id + datum). Alleen als het huidige
// 15-min window dat tijdstip bevat, wordt de mail verstuurd.
//
// HARDE REGEL: geen schuldgevoel. Q moedigt aan, straft niet.
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM_EMAIL = "Q <hello@strq.app>";

// ── Reminder window: 09:45 – 21:49 CEST (UTC+2) ──
// In UTC: 07:45 – 19:49
const WINDOW_START_MINUTES = 7 * 60 + 45; // 07:45 UTC
const WINDOW_END_MINUTES = 19 * 60 + 49; // 19:49 UTC
const WINDOW_SIZE = WINDOW_END_MINUTES - WINDOW_START_MINUTES; // 724 minuten

// ── Deterministic "random" minute for a user on a given day ──
// Simple hash: sum of char codes × day-of-year, mod window size
function reminderMinuteUTC(userId: string, dateStr: string): number {
  let hash = 0;
  const seed = userId + dateStr;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  // Ensure positive, map to window
  const minute = WINDOW_START_MINUTES + (Math.abs(hash) % WINDOW_SIZE);
  return minute;
}

// ── Warm reminder templates (per locale) ──
// Toon: aanmoedigend, licht, nooit verwijtend.
// Q wuift, Q wacht, Q is er. Nooit: "je verliest je streak!"
const templates: Record<string, { subject: string; body: (streak: number, name: string) => string }> = {
  nl: {
    subject: "Q wuift even",
    body: (streak, name) => `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hey${name ? ` ${name}` : ""},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Q zat net op een bankje te wachten en dacht aan je.${streak > 0 ? ` Je streak staat op <strong style="color:#7BC88C;">${streak}</strong> — niet gek.` : ""}</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Getraind vandaag? Rustdag genomen? Allebei prima. Even vastleggen en je dag is compleet.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://strq.app/nl/app" style="display:inline-block;background:#6C3483;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">Open strQ</a>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Q</p>
    `,
  },
  en: {
    subject: "Q waves hello",
    body: (streak, name) => `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hey${name ? ` ${name}` : ""},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Q was sitting on a bench just now, thinking about you.${streak > 0 ? ` Your streak is at <strong style="color:#7BC88C;">${streak}</strong> — not bad at all.` : ""}</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Trained today? Took a rest day? Both are great. Just log it and your day is done.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://strq.app/en/app" style="display:inline-block;background:#6C3483;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">Open strQ</a>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Q</p>
    `,
  },
  fr: {
    subject: "Q te fait signe",
    body: (streak, name) => `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Salut${name ? ` ${name}` : ""},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Q pensait a toi.${streak > 0 ? ` Ta serie est a <strong style="color:#7BC88C;">${streak}</strong> — pas mal du tout.` : ""}</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Entraine aujourd'hui ? Jour de repos ? Les deux comptent. Note-le et ta journee est complete.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://strq.app/fr/app" style="display:inline-block;background:#6C3483;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">Ouvrir strQ</a>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Q</p>
    `,
  },
  de: {
    subject: "Q winkt dir zu",
    body: (streak, name) => `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hey${name ? ` ${name}` : ""},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Q sass gerade auf einer Bank und hat an dich gedacht.${streak > 0 ? ` Dein Streak steht bei <strong style="color:#7BC88C;">${streak}</strong> — gar nicht schlecht.` : ""}</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Heute trainiert? Ruhetag genommen? Beides ist super. Einfach eintragen und der Tag ist komplett.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://strq.app/de/app" style="display:inline-block;background:#6C3483;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">strQ offnen</a>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Q</p>
    `,
  },
  es: {
    subject: "Q te saluda",
    body: (streak, name) => `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hola${name ? ` ${name}` : ""},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Q estaba sentado en un banco y penso en ti.${streak > 0 ? ` Tu racha esta en <strong style="color:#7BC88C;">${streak}</strong> — nada mal.` : ""}</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Entrenaste hoy? Dia de descanso? Ambos cuentan. Solo registralo y tu dia esta completo.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://strq.app/es/app" style="display:inline-block;background:#6C3483;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">Abrir strQ</a>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Q</p>
    `,
  },
  pt: {
    subject: "Q acena para ti",
    body: (streak, name) => `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Oi${name ? ` ${name}` : ""},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Q estava sentado num banco e pensou em voce.${streak > 0 ? ` Sua sequencia esta em <strong style="color:#7BC88C;">${streak}</strong> — nada mal.` : ""}</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Treinou hoje? Dia de descanso? Os dois contam. So registra e seu dia esta completo.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://strq.app/pt/app" style="display:inline-block;background:#6C3483;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">Abrir strQ</a>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Q</p>
    `,
  },
  qu: {
    subject: "Q makinwan waqyasunki",
    body: (streak, name) => `
      <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Napaykullayki${name ? ` ${name}` : ""},</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Q huk tiyanapi tiyaspa qammanta yuyarqan.${streak > 0 ? ` Streak-niyki <strong style="color:#7BC88C;">${streak}</strong>-pim — allinmi.` : ""}</p>
      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Kunan yachachikurqankichu? Samarqankichu? Iskaynin allinmi. Qillqay hinaspallan punchawniyki hunt'asqam.</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://strq.app/qu/app" style="display:inline-block;background:#6C3483;color:#fff;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;text-decoration:none;">strQ kichay</a>
      </div>
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Allimanta allimanta,<br>Q</p>
    `,
  },
};

// ── Email wrapper (consistent met andere strQ mails) ──
function wrapEmail(content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
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
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:12px 0 0;">strQ.app</p>
    </div>
  </div>
</body></html>`;
}

// ── Handler ──
Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const nowMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();

  // Only run inside the reminder window
  if (nowMinutesUTC < WINDOW_START_MINUTES || nowMinutesUTC > WINDOW_END_MINUTES) {
    return new Response(JSON.stringify({ sent: 0, reason: "outside_window" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1. Get all users with a profile (= active app users, not waitlist)
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, display_name, locale");

  if (profErr || !profiles?.length) {
    return new Response(JSON.stringify({ sent: 0, error: profErr?.message }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Get today's activities to filter out users who already logged
  const userIds = profiles.map((p: { id: string }) => p.id);
  const { data: todayActivities } = await supabase
    .from("activities")
    .select("user_id")
    .eq("activity_date", todayStr)
    .in("user_id", userIds);

  const loggedToday = new Set(
    (todayActivities || []).map((a: { user_id: string }) => a.user_id)
  );

  // 3. Check which reminders were already sent today
  const { data: alreadySent } = await supabase
    .from("streak_reminders")
    .select("user_id")
    .eq("reminder_date", todayStr)
    .in("user_id", userIds);

  const sentToday = new Set(
    (alreadySent || []).map((r: { user_id: string }) => r.user_id)
  );

  // 4. Get streak state for personalized messages
  const { data: streakStates } = await supabase
    .from("streak_state")
    .select("user_id, current_streak")
    .in("user_id", userIds);

  const streakMap = new Map(
    (streakStates || []).map((s: { user_id: string; current_streak: number }) => [
      s.user_id,
      s.current_streak,
    ])
  );

  let totalSent = 0;

  for (const profile of profiles) {
    // Skip if already logged today or already reminded
    if (loggedToday.has(profile.id) || sentToday.has(profile.id)) continue;

    // Check if now is this user's reminder time (within 15-min window)
    const userMinute = reminderMinuteUTC(profile.id, todayStr);
    if (Math.abs(nowMinutesUTC - userMinute) > 7) continue; // ±7 min tolerance = 15 min window

    const locale = profile.locale || "nl";
    const template = templates[locale] || templates["nl"];
    const streak = streakMap.get(profile.id) || 0;

    // Get user email from auth
    const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
    if (!authUser?.user?.email) continue;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [authUser.user.email],
          subject: template.subject,
          html: wrapEmail(template.body(streak, profile.display_name || "")),
          tags: [
            { name: "type", value: "streak-reminder" },
            { name: "locale", value: locale },
          ],
        }),
      });

      if (res.ok) {
        // Log reminder to prevent duplicates
        await supabase.from("streak_reminders").insert({
          user_id: profile.id,
          reminder_date: todayStr,
          sent_at: now.toISOString(),
        });
        totalSent++;
        console.log(`Reminder sent to ${authUser.user.email} (streak: ${streak})`);
      } else {
        const errText = await res.text();
        console.error(`Resend error for ${authUser.user.email}:`, errText);
      }
    } catch (err) {
      console.error(`Failed reminder for ${profile.id}:`, err);
    }
  }

  return new Response(JSON.stringify({ sent: totalSent, checked: profiles.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
