# Transparência algorítmica

> Como a strQ calcula os teus XP, racha e bónus. Sem caixa preta. Sem alavancas escondidas a orientar o teu comportamento.

*Última atualização: 27 de abril de 2026*

## Porquê esta página

A Digital Services Act (DSA) e o Regulamento Geral sobre a Proteção de Dados (RGPD) obrigam-nos a explicar as decisões automatizadas que moldam a tua experiência. De qualquer forma achamos boa ideia. Uma app de rachas que orienta o teu comportamento sem explicar como não é uma parceira. Aqui lês exatamente como funciona.

## Que decisões automatizadas toma a strQ

Tomamos um punhado de decisões automatizadas. Todas com o objetivo de manter a tua racha e mostrar o teu progresso. Sem recomendações de conteúdo, sem publicidade, sem ranking entre utilizadores, sem definição de perfis.

## XP por treino

Quando carregas no botão "Treinei", atribuímos pontos segundo uma fórmula fixa:

- **XP base.** Uma quantidade fixa por treino registado (no momento da redação: 25 XP).
- **Multiplicador de racha.** A partir do dia 3 multiplicamos os teus XP de treino. Quanto mais longa a racha, maior o multiplicador, com um teto. A escala atual está em recalibragem. No momento da redação a média ronda os 2x, com a intenção de passar para uma escala faseada de 1,0x (dias 1 a 2), 1,5x (dias 3 a 6), 2,0x (dias 7 a 13) e 2,25x (a partir do dia 14). A alteração será anunciada com antecedência.
- **Bónus surpresa.** Cerca de 1 em 5 confirmações de treino dá direito a um bónus extra de 10 a 50 XP. A probabilidade e o intervalo estão fixados no código e são iguais para toda a gente. Não enviamos bónus para te trazer de volta após inatividade.
- **Bónus fuzzy após um evento.** Quando completas uma corrida, recebes um bónus único baseado no teu tempo em relação ao objetivo. Quatro níveis: "gold" (objetivo cumprido), "silver" (dentro de 5%), "bronze" (dentro de 10%), "warm" (acima disso). O nível warm também dá XP, porque aparecer conta.

Todas as transações de XP aparecem no teu perfil em "Histórico XP", com motivo e quantia. Não escondemos nada.

## Cálculo da racha

A tua racha é o número de dias consecutivos em que registaste algo. Algumas regras:

- Um treino conta como atividade, um dia de descanso planeado também. Nenhum quebra a tua racha.
- Um dia perdido (nenhum botão carregado) leva a tua racha a 0.
- Um dia de descanso marcado para o futuro preserva a tua racha sem que precises de fazer nada nesse dia.
- Earned rest day e taper rest contam como dia de descanso, não como falha.

Escrevemos a tua racha atual em `streak_state` todos os dias, juntamente com a tua racha mais longa. Podes consultar ambas no teu perfil ou transferir via "Os meus dados" em JSON.

## Daily Reveal

Um treino registado só é processado e mostrado quando voltares a abrir a app. É uma escolha deliberada: torna abrir a app num micro-momento de progresso em vez de uma tarefa rotineira. O atraso é no máximo 24 horas, ou menos se voltares mais cedo.

O bónus surpresa é sorteado nesse momento, não no momento de registo do treino. O mecanismo é um sorteio aleatório simples com probabilidade fixa. Sem probabilidade variável conforme a tua última inatividade, sem tentativas de orientar o teu comportamento.

## Earned rest day

Após 2, 3 ou 4+ dias consecutivos de treino, podes usar um "dia de descanso conquistado". Dá 25, 40 ou 60 XP respetivamente. Não podes acumulá-los indefinidamente, e a carga reinicia assim que usas um ou marcas um dia de descanso normal. O valor está fixado no código e é igual para todos.

## Lembretes de racha

Se não registaste nada num dia enquanto a tua racha continua ativa, enviamos no máximo um lembrete por e-mail por dia. A hora exata é sorteada dentro de uma janela, para que o e-mail não seja previsível e não te habitues. Nunca enviamos um segundo lembrete no mesmo dia, mesmo que não respondas. Não enviamos notificações culpabilizadoras.

Podes desativar estes lembretes pela ligação de cancelamento no fundo de cada e-mail.

## O que explicitamente NÃO fazemos

Algumas mecânicas comuns de gamificação foram deliberadamente deixadas de fora:

- **Sem rankings nem ligas.** A tua racha é tua. Sem comparação, sem pressão.
- **Sem grafo social.** Não sabemos quem são os teus amigos, não recebes notificações sobre o que outros fazem.
- **Sem recomendações de conteúdo.** Não há feed, não há "para ti", não há conteúdo ordenado algoritmicamente. Tudo o que vês foste tu que iniciaste.
- **Sem publicidade.** Nem nossa, nem de anunciantes, nem como conteúdo patrocinado.
- **Sem recompensas variáveis baseadas em atraso.** Não enviamos bónus extra porque saltaste um dia.
- **Sem dark patterns.** Sem caixas pré-selecionadas, sem confirm-shaming, sem pressão do tipo "tens a certeza? vais perder a tua racha".

## Definição de perfis e decisões automatizadas

Não realizamos definição de perfis na aceção do art. 22 do RGPD. Não és pontuado com base em quem és, não recebes recomendação para treinar ou descansar baseada em características inferidas. O algoritmo só sabe: hoje carregaste no botão, sim ou não.

## Oposição, influência e desativação

Se não concordas com como um mecanismo funciona, ou achas que uma decisão foi tomada injustamente:

- Escreve para hello@strq.app com a tua pergunta ou oposição. Respondemos em 30 dias, normalmente mais cedo.
- A eliminação de conta está disponível a qualquer momento nas definições de perfil. Todos os dados, incluindo a tua racha e histórico XP, são permanentemente eliminados. Sem soft-delete.

## Alterações a estes algoritmos

Não alteramos algoritmos sem aviso:

- **Alteração substancial** (fórmula XP, regras de racha, probabilidade surpresa): anunciada com pelo menos 14 dias de antecedência por e-mail e in-app, com valores antigos e novos.
- **Calibragem menor** (pequenos ajustes para cima ou para baixo dentro da mesma estrutura): documentada no changelog abaixo.

## Changelog

- **27 de abril de 2026.** Publicação inicial. Recalibragem do multiplicador anunciada. Sem alterações desde então.

## Contacto

Para qualquer pergunta sobre como o algoritmo funciona, ou para apresentar uma oposição: hello@strq.app.

---

*Esta página foi preparada ao abrigo da Digital Services Act (Regulamento (UE) 2022/2065) e do Regulamento Geral sobre a Proteção de Dados (RGPD). Em vigor a partir de 11 de maio de 2026.*
