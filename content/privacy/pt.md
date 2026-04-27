# Privacidade na strQ

> O que recolhemos, porquê, durante quanto tempo e o que podes fazer com isso. Escrito em linguagem simples porque a privacidade é demasiado importante para jargão.

*Última atualização: 26 de abril de 2026*

## Curto e claro

A strQ é uma aplicação de consistência gamificada para desportistas. Só recolhemos o necessário para acompanhar a tua streak e mostrar a tua evolução. Sem GPS, sem frequência cardíaca, sem dados de percurso, sem publicidade, sem venda dos teus dados. Ponto.

O fundador da strQ é, por profissão, pessoa de confiança (vertrouwenspersoon). Para nós, a privacidade não é uma caixa de conformidade, é um ponto de partida.

## Quem somos

A strQ.app é editada pela Kok Confidential BV, uma sociedade por quotas neerlandesa.

- **E-mail:** hello@strq.app
- **Responsável pelo tratamento:** Arnoud Kok
- **Questões de privacidade:** envia um e-mail para hello@strq.app

Não nomeámos um Encarregado de Proteção de Dados externo porque somos demasiado pequenos para isso. Quando crescermos acima dos 10.000 utilizadores ativos, voltamos a avaliar.

## O que recolhemos e porquê

### No registo

- **Endereço de e-mail.** Para criar a tua conta e enviar magic-links. Sem necessidade de palavra-passe.
- **Idioma preferido.** Para mostrar a aplicação na tua língua.
- **Tipo de desporto (opcional).** Hyrox, corrida, triatlo, ciclismo, outros. Ajuda-nos a mostrar-te eventos relevantes.

### Durante a utilização

- **Registo de atividade.** Por dia, se treinaste ou descansaste. Opcionalmente, se foi moderado ou intenso. Sem horários, sem percursos, sem frequência cardíaca.
- **Eventos.** Nome, data, tempo objetivo e tempo final das provas que adicionas.
- **Satisfação.** Após um evento perguntamos como te sentiste. Quatro botões, sem texto livre.
- **Registo de XP.** Quantos pontos ganhas e porquê. Totalmente transparente.

### Técnico

- **Relatórios de erro.** Se a aplicação falhar, enviamos um stack trace anónimo para a Sentry para podermos corrigir. Sem e-mail, sem dados de perfil nestes relatórios.
- **Analytics anónimos.** Através do Umami, uma alternativa amiga da privacidade ao Google Analytics. Sem cookies, sem armazenamento de IP, sem device fingerprinting.

### O que explicitamente NÃO recolhemos

- **Sem GPS, sem percursos, sem quilómetros.** Não precisamos de saber onde treinaste.
- **Sem frequência cardíaca, sem biometria.** Para nós, um treino é uma pergunta de sim ou não.
- **Sem fotos, sem texto livre.** Sem campos de reflexão.
- **Sem grafo social.** Não sabemos quem são os teus amigos.
- **Sem device fingerprinting.** Não te queremos reconhecer às escondidas.

## Porque podemos tratar estes dados (base jurídica)

Trabalhamos com duas bases jurídicas:

1. **Consentimento (RGPD art. 6.º n.º 1 alínea a) e art. 9.º n.º 2 alínea a)).** No registo dás o teu consentimento explícito para o tratamento dos teus dados relacionados com a saúde (treino/descanso, intensidade, tempos finais). Podes retirar este consentimento a qualquer momento eliminando a tua conta.
2. **Interesse legítimo (RGPD art. 6.º n.º 1 alínea f)).** Para a monitorização de erros (Sentry) e analytics agregados (Umami) temos um interesse legítimo em manter a aplicação estável e utilizável. Aqui não são usados dados pessoais para fins comerciais.

## Com quem partilhamos os teus dados

Só partilhamos os teus dados com prestadores técnicos necessários para que a strQ funcione. Todos sediados na UE, todos vinculados por um contrato de subcontratação.

| Serviço | Finalidade | Localização |
|---|---|---|
| Supabase | Base de dados, login, funções de servidor | UE (Irlanda) |
| Resend | Envio de e-mails | UE |
| Vercel | Alojamento da aplicação | Localizações edge UE |
| Sentry | Monitorização de erros | UE (Alemanha) |
| Umami Cloud | Analytics amigos da privacidade | UE |
| ImprovMX | Reencaminhamento de e-mail de hello@strq.app | UE |

Não enviamos dados para países fora do EEE. Não vendemos dados. Não partilhamos com anunciantes. Não temos publicidade.

## Durante quanto tempo guardamos

| Tipo de dados | Prazo de conservação |
|---|---|
| Dados de conta | Até apagares a conta, ou 24 meses de inatividade |
| Registo de atividade e histórico de streak | Até apagares a conta |
| Eventos e troféus | Até apagares a conta |
| Daily reveals | 12 meses, depois apagados automaticamente |
| Registo de e-mail (boas-vindas, drip) | 90 dias |
| Registos de magic-links | 30 dias |
| Relatórios de erro (Sentry) | 90 dias |
| Analytics agregados (Umami) | 12 meses, sem dados pessoais |

Após 24 meses sem login recebes um aviso por e-mail. Se não responderes dentro de 30 dias, apagamos a tua conta.

## Os teus direitos

Ao abrigo do RGPD tens uma série de direitos. Tornamo-los o mais simples possível:

- **Acesso.** Descarrega todos os teus dados em JSON nas definições do perfil.
- **Retificação.** Atualiza o teu perfil diretamente na aplicação.
- **Apagamento.** Carrega em "Apagar conta" no perfil. Tudo é removido permanentemente. Sem soft-delete, sem cópia de segurança que fique para trás.
- **Limitação e oposição.** Envia um e-mail para hello@strq.app.
- **Portabilidade.** A tua exportação de acesso está em formato JSON padrão, importável noutros locais.
- **Retirar o consentimento.** Apaga a tua conta e todo o consentimento desaparece.
- **Reclamação.** Não estás satisfeito com o tratamento dos teus dados? Podes apresentar uma reclamação à autoridade neerlandesa de proteção de dados em [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl). Se vives noutro país da UE, podes encontrar a tua autoridade local através do Comité Europeu para a Proteção de Dados em [edpb.europa.eu/about-edpb/about-edpb/members_en](https://edpb.europa.eu/about-edpb/about-edpb/members_en). Em Portugal é a CNPD.

Respondemos aos pedidos no prazo de 30 dias. Normalmente em poucos dias.

## Como o XP é calculado (transparência algorítmica)

Não queremos que a aplicação seja uma caixa preta. É assim que funciona a tua economia de XP:

- **XP base por treino.** Quantidade fixa por treino registado.
- **Multiplicador de streak.** Após 3 dias, o teu XP de treino recebe um multiplicador. Quanto mais longa for a tua streak, mais alto o multiplicador (com um teto, sem crescimento infinito).
- **Dias de descanso.** Sem XP, sem penalização. Contam para a tua streak.
- **Bónus surpresa.** Por vezes recebes um bónus extra ao abrir a aplicação. Probabilidade aleatória, lógica transparente.
- **Bónus de evento.** Ao concluir um evento recebes um boost de XP único, com base no teu tier (gold, silver, bronze, warm).

Todas as transações de XP estão no teu perfil em "Histórico de XP", com motivo e valor. Não escondemos nada.

Não temos rankings, sem competições entre utilizadores, sem pressão social. É a tua streak, o teu ritmo, a tua aventura.

## Menores

A strQ destina-se a desportistas com 16 anos ou mais. No registo pedimos que confirmes a tua idade. Se tiveres menos de 16 anos, ainda não podes criar conta. Estamos a estudar como oferecer a strQ de forma segura e adequada a desportistas mais jovens, respeitando as regras em torno da gamificação e do bem-estar juvenil.

## Segurança

Como protegemos os teus dados:

- **TLS 1.3** em todas as ligações.
- **Encryption at rest** (AES-256) na Supabase.
- **Row Level Security** para que os utilizadores só vejam os próprios dados.
- **Auth por magic-link.** Sem palavras-passe, logo sem risco de fuga de palavras-passe. Os magic-links são válidos durante 60 minutos e de uso único.
- **Rate limiting** em todos os endpoints para prevenir abusos.
- **Backups diários** em formato cifrado.

Nenhum sistema é 100% seguro, mas fazemos o que podemos.

## Violação de dados

Se, apesar de tudo, algo correr mal, seguimos o nosso procedimento de violação de dados:

1. Avaliar de imediato se há uma violação envolvendo dados pessoais.
2. Conter a violação (bloquear acessos, invalidar sessões).
3. Notificar a autoridade neerlandesa de proteção de dados no prazo de 72 horas se existir algum risco.
4. Enviar e-mail diretamente aos utilizadores afetados em caso de risco elevado.

Não escondemos nem minimizamos nada. Sabes da situação tal como ela é.

## Alterações a esta política

Se fizermos alterações materiais a esta política de privacidade, enviamos-te um e-mail com antecedência e pedimos-te de novo o consentimento para o tratamento alterado. Sem atalhos do tipo "ao continuar concordas com os novos termos".

Pequenas alterações (afinações linguísticas, subcontratantes adicionados na mesma base jurídica) publicamos aqui e registamos num changelog.

## Contacto

Para todas as questões de privacidade: hello@strq.app

Em regra respondemos no prazo de 48 horas. Apresenta-te no e-mail para te podermos ajudar mais rapidamente.

---

*Esta política de privacidade foi elaborada ao abrigo do direito neerlandês e do Regulamento Geral sobre a Proteção de Dados (RGPD/GDPR). Em vigor a partir de 11 de maio de 2026.*
