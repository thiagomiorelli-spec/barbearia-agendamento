# Agendamento para Barbearia

Sistema de agendamento de horários para barbearia feito com HTML, CSS e JavaScript puro, sem frameworks e sem back-end.

## Funcionalidades

- Formulário com nome, telefone, serviço, data e horário
- Validação dos campos, com borda vermelha e mensagem de erro embaixo de cada campo:
  - nome com mais de 2 caracteres e sem números
  - telefone com 10 ou 11 dígitos (DDD + número)
  - data que não seja anterior a hoje
  - serviço e horário selecionados
- Horários já ocupados ficam desativados na data escolhida, evitando agendamentos repetidos
- Lista de agendamentos na lateral, com nome, telefone, serviço, data e horário
- Botão para cancelar um agendamento (o horário volta a ficar livre)
- Layout responsivo: formulário e lista lado a lado no computador e um embaixo do outro no celular

## Tecnologias

- HTML5
- CSS3 (Flexbox e media queries)
- JavaScript (manipulação do DOM, eventos e `localStorage`)

## Como usar

1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   ```
2. Abra o arquivo `index.html` no navegador.

Não precisa instalar nada.

## Estrutura do projeto


├── index.html   # estrutura da página e do formulário
├── styles.css   # estilos e layout
└── script.js    # validações, agendamentos e cancelamento


## Observação

Os agendamentos ficam salvos no `localStorage` do navegador. Isso significa que:

- os dados ficam só no aparelho e no navegador em que foram criados
- limpar os dados do navegador apaga os agendamentos

Por isso o projeto funciona como uma demonstração. Para um sistema real, o próximo passo seria usar um back-end com banco de dados.

## Autor
Thiago Luiz Miorelli
