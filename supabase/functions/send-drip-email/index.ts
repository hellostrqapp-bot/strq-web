// ============================================================
// strQ — Drip Email Sequence Edge Function
// Draait op cron (dagelijks), stuurt de juiste drip-mail
// aan gebruikers op basis van hun aanmelddatum
// ============================================================
// Drip schema:
//   Dag 3:  "We bouwen" — wat strQ wordt
//   Dag 7:  "Jouw sport" — personalized op basis van sport-keuze
//   Dag 14: "Bijna klaar" — countdown naar launch
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM_EMAIL = "Q <hello@strq.app>";
const UNSUBSCRIBE_BASE_URL = `${SUPABASE_URL}/functions/v1/unsubscribe`;

// ── Drip configuratie ──
const DRIP_DAYS = [3, 7, 14] as const;

type DripDay = (typeof DRIP_DAYS)[number];
type UnsubInfo = { token: string; locale: string };

// ── Templates per dag per taal ──
const drips: Record<DripDay, Record<string, { subject: string; html: (sport?: string, unsub?: UnsubInfo) => string }>> = {
  3: {
    nl: {
      subject: "We bouwen iets voor jou",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Drie dagen geleden meldde je je aan. Goed bezig.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">strQ wordt een app die je niet vertelt wat je moet doen, maar je beloont als je het doet. Een streak-teller die weet dat rustdagen ook tellen. Een schildpad die je aanmoedigt, nooit afstraft.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">We bouwen nu aan de eerste versie. Klein, maar krachtig.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    en: {
      subject: "We're building something for you",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Three days ago, you signed up. Good move.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">strQ is becoming an app that doesn't tell you what to do, but rewards you when you do it. A streak counter that knows rest days count too. A turtle that encourages, never punishes.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">We're building the first version now. Small, but powerful.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    fr: {
      subject: "On construit quelque chose pour toi",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Il y a trois jours, tu t'es inscrit. Bien joue.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">strQ devient une appli qui ne te dit pas quoi faire, mais te recompense quand tu le fais. Un compteur de series qui sait que les jours de repos comptent aussi.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">On construit la premiere version maintenant. Petite, mais puissante.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    de: {
      subject: "Wir bauen etwas fur dich",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Vor drei Tagen hast du dich angemeldet. Guter Schritt.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">strQ wird eine App, die dir nicht sagt, was du tun sollst, sondern dich belohnt, wenn du es tust. Ein Streak-Zahler, der weiss, dass Ruhetage auch zahlen.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Wir bauen gerade die erste Version. Klein, aber kraftvoll.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    es: {
      subject: "Estamos construyendo algo para ti",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hace tres dias te registraste. Buena decision.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">strQ se esta convirtiendo en una app que no te dice que hacer, sino que te premia cuando lo haces. Un contador de rachas que sabe que los dias de descanso tambien cuentan.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Estamos construyendo la primera version ahora. Pequena, pero poderosa.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    pt: {
      subject: "Estamos construindo algo para você",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Três dias atrás você se inscreveu. Boa escolha.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">strQ está se tornando um app que não te diz o que fazer, mas te recompensa quando você faz. Um contador de sequência que sabe que dias de descanso também contam.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Estamos construindo a primeira versão agora. Pequena, mas poderosa.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    qu: {
      subject: "Qampaq imata ruwashankiku",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Kinsa punchaw ñawpaq qillqakurqanki. Allin ruwana karqan.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">strQ huk app kachkan mana nisuqniyki imataq ruwanaykita, aswanqa yupaychasuqniyki ruraptiyki. Samay punchawkunapas yupakunmi.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Kunan ñawpaq versionta ruwashankiku. Huch'uymi, ichaqa kallpayuqmi.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Allimanta allimanta,<br>Team strQ</p>
      `, unsub),
    },
  },
  7: {
    nl: {
      subject: "Jouw sport, jouw streak",
      html: (sport, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Een week geleden meldde je je aan${sport && sport !== "unknown" ? ` als ${sportLabel("nl", sport)}-sporter` : ""}. Cool.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Wist je dat de gemiddelde sportschema-app na 3 weken wordt vergeten? strQ is geen sportschema. Het is een spiegel met confetti. Je doet het al — wij maken het zichtbaar.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Binnenkort meer. Wij bouwen, jij traint.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Keep going,<br>Team strQ</p>
      `, unsub),
    },
    en: {
      subject: "Your sport, your streak",
      html: (sport, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">One week ago you signed up${sport && sport !== "unknown" ? ` as a ${sportLabel("en", sport)} athlete` : ""}. Nice.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Did you know the average training app gets abandoned after 3 weeks? strQ isn't a training plan. It's a mirror with confetti. You're already doing it — we just make it visible.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">More coming soon. We build, you train.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Keep going,<br>Team strQ</p>
      `, unsub),
    },
    fr: {
      subject: "Ton sport, ta serie",
      html: (sport, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Il y a une semaine, tu t'es inscrit${sport && sport !== "unknown" ? ` en tant qu'athlete de ${sportLabel("fr", sport)}` : ""}. Sympa.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Savais-tu que l'appli d'entrainement moyenne est abandonnee apres 3 semaines ? strQ n'est pas un plan d'entrainement. C'est un miroir avec des confettis.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">La suite arrive bientot. On construit, tu t'entraines.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Keep going,<br>Team strQ</p>
      `, unsub),
    },
    de: {
      subject: "Dein Sport, dein Streak",
      html: (sport, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Vor einer Woche hast du dich angemeldet${sport && sport !== "unknown" ? ` als ${sportLabel("de", sport)}-Sportler` : ""}. Cool.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Wusstest du, dass die durchschnittliche Trainings-App nach 3 Wochen vergessen wird? strQ ist kein Trainingsplan. Es ist ein Spiegel mit Konfetti.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Bald kommt mehr. Wir bauen, du trainierst.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Keep going,<br>Team strQ</p>
      `, unsub),
    },
    es: {
      subject: "Tu deporte, tu racha",
      html: (sport, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Hace una semana te registraste${sport && sport !== "unknown" ? ` como atleta de ${sportLabel("es", sport)}` : ""}. Genial.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Sabias que la app de entrenamiento promedio se abandona despues de 3 semanas? strQ no es un plan de entrenamiento. Es un espejo con confeti.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Pronto habra mas. Nosotros construimos, tu entrenas.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Keep going,<br>Team strQ</p>
      `, unsub),
    },
    pt: {
      subject: "Seu esporte, sua sequência",
      html: (sport, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Uma semana atrás você se inscreveu${sport && sport !== "unknown" ? ` como atleta de ${sportLabel("pt", sport)}` : ""}. Legal.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Sabia que o app de treino médio é abandonado após 3 semanas? strQ não é um plano de treino. É um espelho com confete.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Em breve mais. Nós construímos, você treina.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Keep going,<br>Team strQ</p>
      `, unsub),
    },
    qu: {
      subject: "Deporteyki, streak-niyki",
      html: (sport, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Huk semana ñawpaq qillqakurqanki${sport && sport !== "unknown" ? ` ${sportLabel("qu", sport)} deportista hina` : ""}. Allinmi.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Riqsinkichu chay promedio yachachikuy appkuna kinsa semanaman qunqasqa kanku? strQ mana yachachikuy planchu. Huk espejo confetiyuq.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Aswan qhipalla hamunga. Ñuqayku ruwanku, qam yachachikunkichu.</p>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Ñawpaqman,<br>Team strQ</p>
      `, unsub),
    },
  },
  14: {
    nl: {
      subject: "We zijn er bijna",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Twee weken. Jij hebt geduld, wij bouwen door.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">De eerste versie van strQ nadert. Een app die je streak bijhoudt, je beloont voor consistentie, en weet dat rustdagen ook meetellen.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Als een van de eersten op de lijst krijg jij als eerste toegang. We mailen je zodra het zover is.</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;background:#6C3483;color:#fff;padding:12px 28px;border-radius:12px;font-weight:700;font-size:15px;">Jij bent erbij.</span>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    en: {
      subject: "We're almost there",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Two weeks. You've been patient, we've been building.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">The first version of strQ is getting close. An app that tracks your streak, rewards consistency, and knows rest days count too.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">As one of the first on the list, you'll get early access. We'll email you when it's ready.</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;background:#6C3483;color:#fff;padding:12px 28px;border-radius:12px;font-weight:700;font-size:15px;">You're in.</span>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    fr: {
      subject: "On y est presque",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Deux semaines. Tu as ete patient, on a construit.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">La premiere version de strQ approche. Une appli qui suit ta serie, recompense la regularite, et sait que les jours de repos comptent aussi.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">En tant que l'un des premiers sur la liste, tu auras un acces prioritaire.</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;background:#6C3483;color:#fff;padding:12px 28px;border-radius:12px;font-weight:700;font-size:15px;">Tu es dedans.</span>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    de: {
      subject: "Wir sind fast da",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Zwei Wochen. Du warst geduldig, wir haben gebaut.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Die erste Version von strQ ist fast fertig. Eine App, die deinen Streak verfolgt, Bestandigkeit belohnt und weiss, dass Ruhetage auch zahlen.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Als einer der Ersten auf der Liste bekommst du fruhen Zugang.</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;background:#6C3483;color:#fff;padding:12px 28px;border-radius:12px;font-weight:700;font-size:15px;">Du bist dabei.</span>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    es: {
      subject: "Ya casi estamos",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Dos semanas. Tu has sido paciente, nosotros hemos construido.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">La primera version de strQ esta cerca. Una app que sigue tu racha, premia la constancia y sabe que los dias de descanso tambien cuentan.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Como uno de los primeros en la lista, tendras acceso anticipado.</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;background:#6C3483;color:#fff;padding:12px 28px;border-radius:12px;font-weight:700;font-size:15px;">Estas dentro.</span>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    pt: {
      subject: "Estamos quase lá",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Duas semanas. Você foi paciente, nós construímos.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">A primeira versão do strQ está chegando. Um app que acompanha sua sequência, recompensa consistência e sabe que dias de descanso também contam.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Como um dos primeiros na lista, você terá acesso antecipado.</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;background:#6C3483;color:#fff;padding:12px 28px;border-radius:12px;font-weight:700;font-size:15px;">Você está dentro.</span>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Slow and steady,<br>Team strQ</p>
      `, unsub),
    },
    qu: {
      subject: "Qayllapiñam kanchik",
      html: (_s, unsub) => wrapEmail(`
        <p style="color:#FFFFFF;font-size:16px;line-height:1.6;margin:0 0 16px;">Iskay semana. Qam suyarqanki, ñuqayku ruwarqanku.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">strQ ñawpaq versionqa qayllam. Huk app streak-niykita qatiq, ruwayniykita yupaychaq, samay punchawkunapas yupakunmi.</p>
        <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 16px;">Listapi ñawpaqpi kasqaykimanta, ñawpaq yaykuyniyuq kanki.</p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;background:#6C3483;color:#fff;padding:12px 28px;border-radius:12px;font-weight:700;font-size:15px;">Ukhupiña kanki.</span>
        </div>
        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0;">Allimanta allimanta,<br>Team strQ</p>
      `, unsub),
    },
  },
};

// ── Sport labels per taal ──
function sportLabel(locale: string, sport: string): string {
  const labels: Record<string, Record<string, string>> = {
    nl: { hyrox: "Hyrox", running: "hardloop", triathlon: "triatlon", cycling: "wielren", other: "sport" },
    en: { hyrox: "Hyrox", running: "running", triathlon: "triathlon", cycling: "cycling", other: "sports" },
    fr: { hyrox: "Hyrox", running: "course", triathlon: "triathlon", cycling: "cyclisme", other: "sport" },
    de: { hyrox: "Hyrox", running: "Lauf", triathlon: "Triathlon", cycling: "Radsport", other: "Sport" },
    es: { hyrox: "Hyrox", running: "running", triathlon: "triatlon", cycling: "ciclismo", other: "deporte" },
    pt: { hyrox: "Hyrox", running: "corrida", triathlon: "triatlo", cycling: "ciclismo", other: "esporte" },
    qu: { hyrox: "Hyrox", running: "phaway", triathlon: "triatlón", cycling: "bicicleta", other: "deporte" },
  };
  return labels[locale]?.[sport] || sport;
}

// ── Unsubscribe link text per taal ──
const unsubscribeText: Record<string, string> = {
  nl: "Geen mails meer ontvangen? Uitschrijven",
  en: "Don't want these emails? Unsubscribe",
  fr: "Plus d'e-mails ? Se desinscrire",
  de: "Keine E-Mails mehr? Abmelden",
  es: "No quieres mas correos? Darse de baja",
  pt: "Não quer mais e-mails? Cancelar inscrição",
  qu: "¿Manachu correota munankichu? Pichay",
};

// ── Email wrapper ──
function wrapEmail(content: string, unsub?: UnsubInfo): string {
  const unsubBlock = unsub
    ? `<p style="color:rgba(255,255,255,0.2);font-size:11px;margin:8px 0 0;">
        <a href="${UNSUBSCRIBE_BASE_URL}?token=${unsub.token}&locale=${unsub.locale}"
           style="color:rgba(255,255,255,0.3);text-decoration:underline;">${unsubscribeText[unsub.locale] || unsubscribeText["nl"]}</a>
      </p>`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="List-Unsubscribe" content="<${UNSUBSCRIBE_BASE_URL}?token=${unsub?.token || ""}&locale=${unsub?.locale || "nl"}>">
</head>
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
      ${unsubBlock}
    </div>
  </div>
</body></html>`;
}

// ── Handler ──
Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  let totalSent = 0;

  for (const dripDay of DRIP_DAYS) {
    // Zoek gebruikers die X dagen geleden zijn aangemeld,
    // nog niet unsubscribed, en deze drip nog niet hebben ontvangen
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dripDay);
    const dateStr = targetDate.toISOString().split("T")[0];

    const { data: candidates, error: queryError } = await supabase
      .from("waitlist")
      .select("email, locale, sport, unsubscribe_token")
      .eq("unsubscribed", false)
      .gte("created_at", `${dateStr}T00:00:00Z`)
      .lt("created_at", `${dateStr}T23:59:59Z`);

    if (queryError || !candidates?.length) continue;

    // Filter wie deze drip al heeft gehad
    const emails = candidates.map((c: { email: string }) => c.email);
    const { data: alreadySent } = await supabase
      .from("drip_log")
      .select("email")
      .in("email", emails)
      .eq("drip_day", dripDay);

    const sentEmails = new Set((alreadySent || []).map((r: { email: string }) => r.email));
    const toSend = candidates.filter((c: { email: string }) => !sentEmails.has(c.email));

    for (const user of toSend) {
      const locale = user.locale || "nl";
      const template = drips[dripDay]?.[locale] || drips[dripDay]?.["nl"];
      if (!template) continue;

      const unsub: UnsubInfo = { token: user.unsubscribe_token, locale };

      try {
        const unsubUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsub.token}&locale=${locale}`;

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [user.email],
            subject: template.subject,
            html: template.html(user.sport, unsub),
            headers: {
              "List-Unsubscribe": `<${unsubUrl}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
            tags: [
              { name: "type", value: `drip-${dripDay}` },
              { name: "locale", value: locale },
            ],
          }),
        });

        if (res.ok) {
          // Log in drip_log
          await supabase.from("drip_log").insert({
            email: user.email,
            drip_day: dripDay,
          });
          totalSent++;
          console.log(`Drip ${dripDay} sent to ${user.email}`);
        } else {
          const errText = await res.text();
          console.error(`Resend error for ${user.email}:`, errText);
        }
      } catch (err) {
        console.error(`Failed drip ${dripDay} for ${user.email}:`, err);
      }
    }
  }

  return new Response(JSON.stringify({ sent: totalSent }), {
    headers: { "Content-Type": "application/json" },
  });
});
