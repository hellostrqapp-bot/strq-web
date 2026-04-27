# Algorithmic transparency

> How strQ calculates your XP, streak and bonuses. No black box. No hidden levers steering your behaviour.

*Last updated: 27 April 2026*

## Why this page

The Digital Services Act (DSA) and the General Data Protection Regulation (GDPR) require us to explain the automated decisions that shape your experience. We think that's a good idea anyway. A streak app that nudges your behaviour without explaining how is not a partner. Below is exactly how it works.

## Which automated decisions does strQ make

We make a handful of automated decisions. All aimed at maintaining your streak and showing your progress. No content recommendations, no advertising, no ranking between users, no profiling.

## XP per training

When you press the "I trained today" button, we award points using a fixed formula:

- **Base XP.** A fixed amount per registered training (at the time of writing: 25 XP).
- **Streak multiplier.** From day 3 onwards we multiply your training XP. The longer your streak, the higher the multiplier, with a cap. The current schedule is being recalibrated. At the time of writing the average is around 2x, with the intention to move to a stepped schedule of 1.0x (days 1 to 2), 1.5x (days 3 to 6), 2.0x (days 7 to 13) and 2.25x (day 14 onwards). The change will be announced beforehand.
- **Surprise bonus.** Roughly 1 in 5 training confirmations earns an extra bonus of 10 to 50 XP. The chance and range are fixed in code and identical for everyone. We do not push a bonus to lure you back after inactivity.
- **Fuzzy bonus after an event.** When you complete a race, you receive a one-time bonus based on your time relative to your target. Four tiers: "gold" (within target), "silver" (within 5%), "bronze" (within 10%), "warm" (anything beyond). The warm tier still earns XP, because showing up counts.

Every XP transaction appears in your profile under "XP history", with reason and amount. We hide nothing.

## Streak calculation

Your streak is the number of consecutive days on which you registered something. A few rules:

- A training counts as activity, a planned rest day counts too. Neither breaks your streak.
- A missed day (no button pressed) breaks your streak to 0.
- A rest day booked into the future preserves your streak without you needing to do anything that day.
- Earned rest day and taper rest count as rest days, not as gaps.

We write your current streak to `streak_state` daily, alongside your longest streak ever. You can view both via your profile, or download them via "My data" as JSON.

## Daily Reveal

A training you register is only processed and shown when you next open the app. That's a deliberate choice: it makes opening the app a micro-moment of progress rather than a routine task. The delay is at most 24 hours, or shorter if you return sooner.

The surprise bonus is drawn at that moment, not at the time of training registration. The mechanism is a simple random draw with a fixed chance. No variable chance based on when you were last inactive, no attempts to steer your behaviour.

## Earned rest day

After 2, 3 or 4+ consecutive training days you can use an "earned rest day". It awards 25, 40 or 60 XP respectively. You can't stockpile them indefinitely, and the charge resets the moment you use one or book a regular rest day. The value is fixed in code and identical for everyone.

## Streak reminders

If you registered nothing for a day while your streak is still active, we send at most one email reminder per day. The exact time is randomised within a window so the mail is not predictable and you don't habituate. We never send a second reminder on the same day, even if you don't respond. We do not send guilt-tripping notifications.

You can disable these reminders via the unsubscribe link at the bottom of every mail.

## What we explicitly do NOT do

Some common gamification mechanics we deliberately did not build:

- **No leaderboards or leagues.** Your streak is your streak. No comparison, no pressure.
- **No social graph.** We don't know who your friends are, you receive no notifications about what others do.
- **No content recommendations.** There's no feed, no "for you", no algorithmically ordered content. Everything you see, you started yourself.
- **No advertising.** Not from us, not from advertisers, not as sponsored content.
- **No variable rewards based on delay.** We do not send extra bonuses because you skipped a day.
- **No dark patterns.** No pre-checked boxes, no confirm-shaming, no "are you sure, you'll lose your streak" pressure.

## Profiling and automated decisions

We do not perform profiling within the meaning of GDPR art. 22. You are not scored based on who you are, you receive no recommendation to train or rest based on inferred characteristics. The algorithm only knows: did you press the button today or not.

## Objection, influence and opt-out

If you disagree with how a mechanism works, or you feel a decision was made unjustly:

- Email hello@strq.app with your question or objection. We respond within 30 days, usually sooner.
- Account deletion is available at any time via your profile settings. All data, including your streak and XP history, is permanently deleted. No soft delete.

## Changes to these algorithms

We do not change algorithms without notice:

- **Material change** (XP formula, streak rules, surprise chance): announced at least 14 days in advance via email and in-app, including old and new values.
- **Minor calibration** (small upward or downward adjustments within the same structure): documented in the changelog below.

## Changelog

- **27 April 2026.** Initial publication. Multiplier recalibration announced. No changes since.

## Contact

For any question about how the algorithm works, or to file an objection: hello@strq.app.

---

*This page was prepared under the Digital Services Act (Regulation (EU) 2022/2065) and the General Data Protection Regulation (GDPR). Effective from 11 May 2026.*
