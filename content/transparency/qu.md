# Algoritmika sut'inchakuy

> Imaynataq strQ XP-niykita, racha-niykita hinaspa bonus-kunata yupan. Mana yana caja. Mana pakasqa palanca-kuna ruwayniykita pusasqa.

*Qhipa kaqlla allichasqa: 27 abril 2026 watapi*

## Imaraykutaq kay paqina

Digital Services Act (DSA) hinaspa Datos Amachaq Kamachiy (RGPD) automaticosqa decisionkunata sut'inchanaykuta kamachiwanku, chay decisionkunaqa experienciaykita ruwanku. Allinmi nispa nikuyku. Huk racha-app rurayniykita pusayspaqa, mana imaynachá chayta sut'inchaspa, mana compañerachu. Kaypi imayna ruwakusqantam ñawiriyta atinki.

## Ima automaticosqa decisionkunatataq strQ ruwan

Pisi automaticosqa decisionkunatallam ruwayku. Tukuy ñawpaqman riyniykita qhawanaykupaq hinaspa rachaykita waqaychanaykupaq. Mana contenido recomendaciones, mana publicidad, mana usuariokuna ranking, mana profilning.

## XP yachachikuypaq

"Yachachikurqani" botonta ñit'iyta atispaqa, huk fija formulapi puntokunata qoyku:

- **Base-XP.** Sapa qillqasqa yachachikuypaq fija cantidad (kunan qillqaspa: 25 XP).
- **Racha-multiplicador.** Kimsa p'unchawmanta pacha yachachikuy XP-niykita aswanchayku. Aswan unayta racha-yki kaqtin, aswan altoqa multiplicador, huk topewan. Kunan escalaqa watiq calibracionpim. Kunan qillqaspa promediopi 2x-niraq, kayta tikrayta munanchik 1.0x (1-2 p'unchaw), 1.5x (3-6 p'unchaw), 2.0x (7-13 p'unchaw) hinaspa 2.25x (14 p'unchawmanta). Tikraqtinkuqa ñawpaqmantam willasqayku.
- **Sorpresa-bonus.** 5 yachachikuy confirmacionkunamanta huklla 10-50 XP yapay bonusta qon. Probabilidad y rangoqa codigopi fija kanku, llapankupaqpas kikinmi. Mana ruwayniykita kachariyman puj bonusta kachaykuchu.
- **Fuzzy-bonus eventopa qhipanpi.** Huk carrera tukuchaspaqa, target-tiempopaq tiempo-yki tikrayta huk huk-kuti bonusta hap'inki. Tawa nivelkuna: "gold" (target hap'isqa), "silver" (5%-pi), "bronze" (10%-pi), "warm" (chay aswan). Warm-pas XP qon, rishanqa contam.

Tukuy XP-transaccionkuna profil-niykipi "XP Historia"-pi rikukunqaku, ima motivopaq hayk'a chaywan kuska. Mana imatapas pakaykuchu.

## Racha yupay

Racha-yki kanmi imata qillqasqayki consecutivo p'unchawkunapi. Pisi reglakuna:

- Huk yachachikuy actividad nisqachus, planeasqa samay p'unchawpas. Manam chayqa rachaykita p'akinchu.
- Chinkasqa p'unchaw (mana botonta ñit'iqtiyki) rachaykita 0-man chayachin.
- Hamuq p'unchawpaq reservaska samay p'unchaw, mana chay p'unchawpi imatapas ruwayta munaspa, rachaykita waqaychan.
- Earned rest day hinaspa taper rest samay p'unchawjina yupakunqaku, mana hueco hina.

Sapa p'unchaw kunan rachaykita `streak_state`-pi qillqayku, aswan suni rachaykiwan kuska. Iskayninkuta perfil-niykipi qhawayta atinki, "Datoyniy"-piwantaq JSON-pi uraykachiyta atinki.

## Daily Reveal

Qillqasqa yachachikuy hawkalla qhipan kuti app-ta kichaspaykim procesakunqa hinaspa rikukunqa. Kayqa accha munaywanmi: app-ta kichana ruwana huk micro-momento ñawpaqman riyniykitanm tukurqa, mana rutina ruwayman. Suyana kanqa 24 horas chiqallapi, utaq pisillan qatiqmanta kutimuptiyki.

Sorpresa-bonusqa chay momentopim sortakun, mana yachachikuy qillqasqa momentopichu. Mecanismoqa huk simple aleatorio sorteollam, fija probabilidadwan. Mana qatiq inactividadniyki hina cambianan probabilidadqa, mana ruwayniykita pusay puriy.

## Earned rest day

2, 3 utaq 4+ consecutivo yachachikuy p'unchawkunamanta huk "ganasqa samay p'unchaw"-ta usaqayta atinki. 25, 40 utaq 60 XP qon respectivamente. Mana wiñay wiñaykama huñuyta atinkichu, hinaspa cargaqa kutirinqa hukta usaspaykiq utaq normal samay p'unchawta reservaspaykiq. Valorqa codigopi fija, llapankupaqpas kikinmi.

## Racha-yuyaykuna

Huk p'unchaw mana imatapas qillqasqaykiqa rachay siguestin kachkaqtinpas, sapa p'unchawpaq huk yuyay-correo-llam kachayku. Exacto pacha aleatoriotam huk ventana ukhupi acllakun, correo manam predeciblechu kananpaq y mana yachakunaykipaq. Manapuni iskay yuyayta kacharimuykuchu kikin p'unchawpi, mana respondesqaykipas. Mana culpa-yuyaykunata kachaykuchu.

Kay yuyaykunataqa sapa correopa urin "abandonar" ligaponta apagayta atinki.

## Imatataq sut'illa MANA RUWAYKUCHU

Wakin gamification mecanicasqa accha mana ruwarqaykuchu:

- **Mana ranking utaq ligakunachu.** Racha-yki racha-yki kaqlla. Mana tikrachiy, mana presion.
- **Mana social grafochu.** Mana yachaykuchu pikunachus amigokunayki, mana huk runakunap ruwanankunamanta yuyaykunata hap'inkichu.
- **Mana contenido recomendacioneschu.** Mana feed kanchu, mana "qampaq", mana algorithmically ordenasqa contenido. Tukuy ima qhawasqayki, qantqa qallarirqanki.
- **Mana publicidadchu.** Mana ñoqaykumanta, mana anunciantemanta, mana sponsorisasqa contenido.
- **Mana variable bonus suyanapaq.** Manam yapaykuchu bonus huk p'unchaw chinkachisqaykiraykuqa.
- **Mana dark patternschu.** Mana ñawpaqmanta marcasqa cajakunachu, mana confirm-shaming, mana "rachayki chinkanqa" presion.

## Profilning hinaspa automaticosqa decisionkuna

Mana profilning ruwaykuchu RGPD art. 22 nisqa hina. Mana puntuasqachu kanki pichus kasqaykimanta, mana yachachikuy utaq samay recomendacionta hap'inkichu inferida característicamantaqa. Algoritmoqa kayllata yachan: kunan p'unchaw botonta ñit'irqankichu manachu.

## Mana munay, influencia hinaspa wañuchiy

Huk mecanismo ruwayninwan mana acuerdopi kaspa, utaq mana justa decisionkunata ruwasqaykuta yuyaspaqa:

- hello@strq.app-man huk correota qillqamuy tapunaykiwan utaq mana munaywan. 30 p'unchawpi kutichipusayku, kasqantapas pisi.
- Cuenta wañuchiy mayk'aqpas perfil-ajustes-niykimanta atikun. Tukuy datokuna, racha-niki XP-niki historia-ñiqkuna, wiñaypaq wañuchikunkuqu. Mana soft-delete.

## Kay algoritmospi tikrasqakuna

Mana algoritmokunata tikrayku willaykuy mana ñawpaqmantachu:

- **Sustancial tikray** (XP-formula, racha-reglas, sorpresa-probabilidad): chunka tawayoq p'unchaw ñawpaqmanta correoporta hinaspa app-ñiqta willasqa, mawk'a y mosoq valoreswan.
- **Pisi calibracion** (pisi seqaykuy utaq urayachiy kikin estructurapi): uray changelog-pi qillqasqa.

## Changelog

- **27 abril 2026.** Qallariy publicacion. Multiplicador kalibrasqa willasqa. Chaymanta pacha mana tikraychu.

## Tinkukuy

Algoritmopa imayna ruwasqanmanta huk tapuypaq, utaq mana munayta presentanaykipaq: hello@strq.app.

---

*Kay paqina Digital Services Act (Reglamento (UE) 2022/2065) hinaspa Datos Amachaq Kamachiy (RGPD) urapi qillqakurqa. 11 mayo 2026 watamanta valedor.*
