# Privacidad en strQ

> Lo que recogemos, por qué, durante cuánto tiempo y qué puedes hacer con ello. Escrito en lenguaje claro porque la privacidad es demasiado importante para la jerga.

*Última actualización: 26 de abril de 2026*

## Breve y claro

strQ es una app de constancia gamificada para deportistas. Solo recogemos lo necesario para llevar el seguimiento de tu streak y mostrar tu progreso. Sin GPS, sin frecuencia cardíaca, sin datos de ruta, sin publicidad, sin venta de tus datos. Punto.

El fundador de strQ es persona de confianza (vertrouwenspersoon) de profesión. La privacidad para nosotros no es una casilla de cumplimiento, es un punto de partida.

## Quiénes somos

strQ.app es publicada por Kok Confidential BV, una sociedad limitada neerlandesa.

- **Email:** hello@strq.app
- **Responsable del tratamiento:** Arnoud Kok
- **Preguntas sobre privacidad:** envía un correo a hello@strq.app

No hemos designado un Delegado de Protección de Datos externo porque somos demasiado pequeños para ello. Cuando crezcamos por encima de los 10.000 usuarios activos lo revisaremos.

## Qué recogemos y por qué

### Al registrarte

- **Dirección de correo electrónico.** Para crear tu cuenta y enviarte magic-links. No hace falta contraseña.
- **Idioma preferido.** Para mostrar la app en tu idioma.
- **Tipo de deporte (opcional).** Hyrox, running, triatlón, ciclismo, otros. Nos ayuda a mostrarte eventos relevantes.

### Durante el uso

- **Registro de actividad.** Por día, si entrenaste o descansaste. Opcionalmente, si fue moderado o intenso. Sin horarios, sin rutas, sin frecuencia cardíaca.
- **Eventos.** Nombre, fecha, tiempo objetivo y tiempo final de las competiciones que añades.
- **Satisfacción.** Después de un evento te preguntamos cómo te sentiste. Cuatro botones, sin texto libre.
- **Registro de XP.** Cuántos puntos ganas y por qué. Totalmente transparente.

### Técnico

- **Reportes de error.** Si la app falla, enviamos un stack trace anónimo a Sentry para poder corregirlo. Sin email, sin datos de perfil en estos reportes.
- **Analytics anónimos.** A través de Umami, una alternativa respetuosa con la privacidad a Google Analytics. Sin cookies, sin almacenamiento de IP, sin device fingerprinting.

### Lo que explícitamente NO recogemos

- **Sin GPS, sin rutas, sin kilómetros.** No necesitamos saber dónde entrenaste.
- **Sin frecuencia cardíaca, sin biometría.** Para nosotros, un entrenamiento es una pregunta de sí o no.
- **Sin fotos, sin texto libre.** Sin campos de reflexión.
- **Sin grafo social.** No sabemos quiénes son tus amigos.
- **Sin device fingerprinting.** No queremos reconocerte a escondidas.

## Por qué podemos tratar estos datos (base jurídica)

Trabajamos con dos bases jurídicas:

1. **Consentimiento (RGPD art. 6.1.a y art. 9.2.a).** Al registrarte das tu consentimiento explícito para el tratamiento de tus datos relacionados con la salud (entrenamiento/descanso, intensidad, tiempos finales). Puedes retirar este consentimiento en cualquier momento eliminando tu cuenta.
2. **Interés legítimo (RGPD art. 6.1.f).** Para la monitorización de errores (Sentry) y los analytics agregados (Umami) tenemos un interés legítimo en mantener la app estable y utilizable. Aquí no se utilizan datos personales con fines comerciales.

## Con quién compartimos tus datos

Solo compartimos tus datos con los proveedores técnicos necesarios para hacer funcionar strQ. Todos establecidos en la UE, todos con un contrato de encargado del tratamiento.

| Servicio | Finalidad | Ubicación |
|---|---|---|
| Supabase | Base de datos, login, funciones de servidor | UE (Irlanda) |
| Resend | Envío de correos electrónicos | UE |
| Vercel | Hosting de la app | Ubicaciones edge UE |
| Sentry | Monitorización de errores | UE (Alemania) |
| Umami Cloud | Analytics respetuosos con la privacidad | UE |
| ImprovMX | Reenvío de correos de hello@strq.app | UE |

No enviamos datos a países fuera del EEE. No vendemos datos. No los compartimos con anunciantes. No hay publicidad.

## Cuánto tiempo lo guardamos

| Tipo de datos | Plazo de conservación |
|---|---|
| Datos de cuenta | Hasta que elimines tu cuenta, o 24 meses de inactividad |
| Registro de actividad e historial de streak | Hasta que elimines tu cuenta |
| Eventos y trofeos | Hasta que elimines tu cuenta |
| Daily reveals | 12 meses, luego eliminados automáticamente |
| Registro de email (correo de bienvenida, drip) | 90 días |
| Registros de magic-links | 30 días |
| Reportes de error (Sentry) | 90 días |
| Analytics agregados (Umami) | 12 meses, sin datos personales |

Tras 24 meses sin login recibirás un aviso por correo. Si no respondes en 30 días, eliminamos tu cuenta.

## Tus derechos

El RGPD te da una serie de derechos. Te los hacemos lo más sencillos posible:

- **Acceso.** Descarga todos tus datos en JSON desde la configuración de tu perfil.
- **Rectificación.** Modifica tu perfil directamente en la app.
- **Supresión.** Pulsa "Eliminar cuenta" en tu perfil. Todo se elimina de forma permanente. Sin soft-delete, sin copia de seguridad que se quede.
- **Limitación y oposición.** Envía un correo a hello@strq.app.
- **Portabilidad.** Tu exportación de acceso está en formato JSON estándar, importable en otros sitios.
- **Retirar consentimiento.** Elimina tu cuenta y todo el consentimiento desaparece.
- **Reclamación.** ¿No estás satisfecho con cómo tratamos tus datos? Puedes presentar una reclamación ante la autoridad neerlandesa de protección de datos en [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl). Si vives en otro país de la UE, puedes encontrar tu autoridad local a través del Comité Europeo de Protección de Datos en [edpb.europa.eu/about-edpb/about-edpb/members_en](https://edpb.europa.eu/about-edpb/about-edpb/members_en). En España es la AEPD.

Respondemos a las solicitudes en un plazo de 30 días. Normalmente en pocos días.

## Cómo se calcula la XP (transparencia algorítmica)

No queremos que la app sea una caja negra. Así funciona tu economía de XP:

- **XP base por entrenamiento.** Cantidad fija por entrenamiento registrado.
- **Multiplicador de streak.** Tras 3 días, tu XP de entrenamiento recibe un multiplicador. Cuanto más larga sea tu streak, más alto el multiplicador (con un tope, sin crecimiento infinito).
- **Días de descanso.** Sin XP, sin penalización. Cuentan para tu streak.
- **Bonus sorpresa.** A veces recibes un extra al abrir la app. Probabilidad aleatoria, lógica transparente.
- **Bonus de evento.** Al completar un evento recibes un impulso de XP único según tu tier (gold, silver, bronze, warm).

Todas las transacciones de XP están en tu perfil bajo "Historial de XP", con motivo e importe. No ocultamos nada.

No tenemos rankings, no hay competiciones entre usuarios, no hay presión social. Es tu streak, tu ritmo, tu aventura.

## Menores de edad

strQ es para deportistas de 16 años o más. Al registrarte te pedimos que confirmes tu edad. Si eres menor de 16, todavía no puedes crear una cuenta. Estamos estudiando cómo ofrecer strQ de forma segura y adecuada a deportistas más jóvenes, respetando las normas sobre gamificación y bienestar juvenil.

## Seguridad

Cómo protegemos tus datos:

- **TLS 1.3** para todas las conexiones.
- **Encryption at rest** (AES-256) en Supabase.
- **Row Level Security** para que los usuarios solo vean sus propios datos.
- **Auth por magic-link.** Sin contraseñas, así que sin riesgo de filtración de contraseñas. Los magic-links son válidos 60 minutos y de un solo uso.
- **Rate limiting** en todos los endpoints para evitar abusos.
- **Copias de seguridad diarias** en formato cifrado.

Ningún sistema es 100% seguro, pero hacemos lo que podemos.

## Brecha de datos

Si por desgracia algo sale mal, seguimos nuestro procedimiento de brecha de datos:

1. Evaluar de inmediato si se trata de una brecha con datos personales.
2. Contener la brecha (bloquear acceso, invalidar sesiones).
3. Notificar a la autoridad neerlandesa de protección de datos en un plazo de 72 horas si existe algún riesgo.
4. Enviar un correo directamente a los usuarios afectados en caso de alto riesgo.

No ocultamos nada ni minimizamos nada. Te lo cuentas tal y como es.

## Cambios en esta política

Si introducimos cambios sustanciales en esta política de privacidad, te enviaremos un correo con antelación y te pediremos de nuevo tu consentimiento para el tratamiento modificado. Sin atajos del tipo "aceptas las nuevas condiciones por seguir usando la app".

Los cambios menores (ajustes lingüísticos, encargados añadidos con la misma base jurídica) los publicamos aquí y los anotamos en un changelog.

## Contacto

Para todas las preguntas sobre privacidad: hello@strq.app

Por norma respondemos en 48 horas. Preséntate en el correo para que podamos ayudarte más rápido.

---

*Esta política de privacidad se ha redactado conforme al derecho neerlandés y al Reglamento General de Protección de Datos (RGPD/GDPR). Vigente desde el 11 de mayo de 2026.*
