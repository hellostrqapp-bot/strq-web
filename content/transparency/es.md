# Transparencia algorítmica

> Cómo strQ calcula tu XP, racha y bonus. Sin caja negra. Sin palancas ocultas que dirijan tu comportamiento.

*Última actualización: 27 de abril de 2026*

## Por qué esta página

La Digital Services Act (DSA) y el Reglamento General de Protección de Datos (RGPD) nos obligan a explicar las decisiones automatizadas que dan forma a tu experiencia. Nos parece buena idea de todos modos. Una app de rachas que dirige tu comportamiento sin explicar cómo no es una compañera. Aquí lees exactamente cómo funciona.

## Qué decisiones automatizadas toma strQ

Tomamos un puñado de decisiones automatizadas. Todas dirigidas a mantener tu racha y mostrarte tu progreso. Sin recomendaciones de contenido, sin publicidad, sin ranking entre usuarios, sin elaboración de perfiles.

## XP por entrenamiento

Cuando pulsas el botón "He entrenado", concedemos puntos según una fórmula fija:

- **XP base.** Una cantidad fija por entrenamiento registrado (al momento de redactar: 25 XP).
- **Multiplicador de racha.** A partir del día 3 multiplicamos tus XP de entrenamiento. Cuanto más larga la racha, mayor el multiplicador, con tope. La escala actual está siendo recalibrada. Al momento de redactar la media ronda los 2x, con la intención de pasar a una escala escalonada de 1,0x (días 1 a 2), 1,5x (días 3 a 6), 2,0x (días 7 a 13) y 2,25x (a partir del día 14). El cambio se anunciará por adelantado.
- **Bonus sorpresa.** Aproximadamente 1 de cada 5 confirmaciones de entrenamiento genera un bonus extra de 10 a 50 XP. La probabilidad y el rango están fijados en el código e idénticos para todos. No enviamos un bonus para atraerte de vuelta tras inactividad.
- **Bonus fuzzy tras un evento.** Cuando completas una carrera, recibes un bonus único basado en tu tiempo respecto al objetivo. Cuatro niveles: "gold" (objetivo conseguido), "silver" (dentro del 5%), "bronze" (dentro del 10%), "warm" (más allá). El nivel warm también da XP, porque presentarse cuenta.

Todas las transacciones de XP aparecen en tu perfil bajo "Historial XP", con motivo y cantidad. No escondemos nada.

## Cálculo de la racha

Tu racha es el número de días consecutivos en que registraste algo. Algunas reglas:

- Un entrenamiento cuenta como actividad, un día de descanso planificado también. Ninguno rompe tu racha.
- Un día perdido (sin pulsar el botón) lleva tu racha a 0.
- Un día de descanso reservado en el futuro preserva tu racha sin que tengas que hacer nada ese día.
- Earned rest day y taper rest cuentan como días de descanso, no como huecos.

Escribimos tu racha actual en `streak_state` cada día, junto con tu racha más larga. Puedes consultarlas vía tu perfil o descargarlas vía "Mis datos" en JSON.

## Daily Reveal

Un entrenamiento registrado solo se procesa y se muestra en tu próxima apertura de la app. Es una elección deliberada: convierte abrir la app en un micro-momento de progreso en lugar de una tarea rutinaria. El retraso es de 24 horas como máximo, o menor si vuelves antes.

El bonus sorpresa se sortea en ese momento, no al registrar el entrenamiento. El mecanismo es un sorteo aleatorio simple con probabilidad fija. Sin probabilidad variable según tu última inactividad, sin intentos de dirigir tu comportamiento.

## Earned rest day

Tras 2, 3 o 4+ días consecutivos de entrenamiento, puedes usar un "día de descanso ganado". Da 25, 40 o 60 XP respectivamente. No puedes acumularlos indefinidamente, y la carga se reinicia en cuanto usas uno o reservas un día de descanso normal. El valor está fijado en el código e idéntico para todos.

## Recordatorios de racha

Si no has registrado nada en un día mientras tu racha sigue activa, enviamos como máximo un recordatorio por correo al día. La hora exacta se elige aleatoriamente dentro de una franja, para que el correo no sea predecible y no te acostumbres. Nunca enviamos un segundo recordatorio el mismo día, aunque no respondas. No enviamos notificaciones culpabilizadoras.

Puedes desactivar estos recordatorios vía el enlace de baja al final de cada correo.

## Lo que explícitamente NO hacemos

Algunas mecánicas habituales de gamificación las descartamos a propósito:

- **Sin tablas de clasificación ni ligas.** Tu racha es tu racha. Sin comparación, sin presión.
- **Sin grafo social.** No sabemos quiénes son tus amigos, no recibes notificaciones sobre lo que hacen otros.
- **Sin recomendaciones de contenido.** No hay feed, no hay "para ti", no hay contenido ordenado algorítmicamente. Todo lo que ves, lo iniciaste tú.
- **Sin publicidad.** Ni nuestra, ni de anunciantes, ni como contenido patrocinado.
- **Sin recompensas variables por demora.** No enviamos bonus extra porque te saltaste un día.
- **Sin dark patterns.** Sin casillas pre-marcadas, sin confirm-shaming, sin presión del tipo "¿seguro? perderás tu racha".

## Elaboración de perfiles y decisiones automatizadas

No realizamos elaboración de perfiles en el sentido del art. 22 del RGPD. No te puntuamos según quién eres, no recibes recomendación de entrenar o descansar basada en características inferidas. El algoritmo solo sabe: ¿pulsaste el botón hoy o no?

## Oposición, influencia y desactivación

Si no estás de acuerdo con cómo funciona un mecanismo, o crees que se ha tomado una decisión injusta:

- Escribe a hello@strq.app con tu pregunta u oposición. Respondemos en 30 días, normalmente antes.
- La eliminación de cuenta está disponible en cualquier momento desde los ajustes de perfil. Todos los datos, incluidos tu racha e historial XP, se eliminan permanentemente. Sin soft-delete.

## Cambios en estos algoritmos

No modificamos algoritmos sin avisar:

- **Cambio sustancial** (fórmula XP, reglas de racha, probabilidad sorpresa): anunciado al menos 14 días antes vía correo e in-app, con valores antiguos y nuevos.
- **Calibrado menor** (pequeños ajustes al alza o a la baja dentro de la misma estructura): documentado en el changelog abajo.

## Changelog

- **27 de abril de 2026.** Publicación inicial. Recalibrado del multiplicador anunciado. Sin cambios desde entonces.

## Contacto

Para cualquier pregunta sobre cómo funciona el algoritmo, o para presentar una oposición: hello@strq.app.

---

*Esta página ha sido preparada bajo la Digital Services Act (Reglamento (UE) 2022/2065) y el Reglamento General de Protección de Datos (RGPD). Vigente desde el 11 de mayo de 2026.*
