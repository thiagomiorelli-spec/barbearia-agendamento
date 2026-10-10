//CAPTURA DOS ELEMENTOS
const formAgendamento = document.getElementById("form-agendamento");
const inputNome = document.getElementById("nome");
const inputTelefone = document.getElementById("telefone");
const selectServico = document.getElementById("servico");
const inputData = document.getElementById("data");
const selectHora = document.getElementById("hora");
const listaAgendamentos = document.getElementById("lista-agendamentos");
const erroNome = document.getElementById("erro-nome");
const erroTelefone = document.getElementById("erro-telefone");
const erroServico = document.getElementById("erro-servico");
const erroData = document.getElementById("erro-data");
const erroHora = document.getElementById("erro-hora");

//FUNÇÕES

// Lê a lista de agendamentos salvos no localStorage
function pegarAgendamentos() {
    let lista = JSON.parse(localStorage.getItem("agendamentos")) || [];
    return lista;
}

// Devolve a data de hoje no formato AAAA-MM-DD (usando o horário do computador)
function pegarDataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return ano + "-" + mes + "-" + dia;
}

// Mostra os agendamentos na página, cada um com um botão de cancelar
function mostrarAgendamentos() {
    let lista = pegarAgendamentos();
    listaAgendamentos.innerHTML = "";

    for (let i = 0; i < lista.length; i++) {
        const item = document.createElement("li");

        const dados = document.createElement("div");
        dados.textContent =
            lista[i].servico + "\n" +
            "Nome: " + lista[i].nome + "\n" +
            "Telefone: " + lista[i].telefone + "\n" +
            "Data: " + lista[i].data + "\n" +
            "Horário: " + lista[i].hora;
        item.appendChild(dados);

        const botaoCancelar = document.createElement("button");
        botaoCancelar.textContent = "Cancelar";
        botaoCancelar.addEventListener("click", function () {
            cancelarAgendamento(i);
        });

        item.appendChild(botaoCancelar);
        listaAgendamentos.appendChild(item);
    }
}

// Remove um agendamento da lista (pela posição) e atualiza a tela
function cancelarAgendamento(posicao) {
    if (!confirm("Deseja cancelar este agendamento?")) {
        return;
    }
    let lista = pegarAgendamentos();
    lista.splice(posicao, 1);
    localStorage.setItem("agendamentos", JSON.stringify(lista));
    mostrarAgendamentos();
    atualizarHorarios();
}

// Bloqueia os horários já ocupados na data escolhida
function atualizarHorarios() {
    let lista = pegarAgendamentos();
    selectHora.value = "";

    // 1. libera todos os horários
    for (let i = 0; i < selectHora.options.length; i++) {
        selectHora.options[i].disabled = false;
    }

    // 2. bloqueia os que já estão ocupados na data escolhida
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].data === inputData.value) {
            for (let j = 0; j < selectHora.options.length; j++) {
                if (selectHora.options[j].value === lista[i].hora) {
                    selectHora.options[j].disabled = true;
                }
            }
        }
    }
}

//VALIDAÇÕES

// Função para destacar campo com borda vermelha ao ocorrer erro
function marcarErro(input) {
    input.classList.add("erro");
}

// Mostra a mensagem embaixo do campo e marca a borda (sem mensagem, tira a borda vermelha)
function mostrarErro(input, span, mensagem) {
    span.textContent = mensagem;
    if (mensagem === "") {
        input.classList.remove("erro");
    } else {
        marcarErro(input);
    }
}

// Devolve a mensagem de erro do nome (ou "" se estiver tudo certo)
function validarNome(nome) {
    if (nome.length === 0) {
        return "O campo 'Nome completo' está vazio!";
    }
    if (nome.length <= 2) {
        return "O nome deve ter mais de 2 caracteres.";
    }
    for (let i = 0; i < nome.length; i++) {
        if ("0123456789".includes(nome[i])) {
            return "O nome não pode conter números.";
        }
    }
    return "";
}

// Devolve a mensagem de erro do telefone (ou "" se estiver tudo certo)
function validarTelefone(telefone) {
    const apenasDigitos = telefone.replace(/\D/g, "");
    if (apenasDigitos.length < 10 || apenasDigitos.length > 11) {
        return "Telefone inválido. Digite o DDD e o número.";
    }
    return "";
}

// Devolve a mensagem de erro do serviço (ou "" se estiver tudo certo)
function validarServico(valor) {
    if (valor === "") {
        return "Selecione um serviço.";
    }
    return "";
}

// Devolve a mensagem de erro da data (ou "" se estiver tudo certo)
function validarData(valor) {
    if (valor === "") {
        return "Selecione uma data.";
    }
    if (valor < pegarDataHoje()) {
        return "Não é possível agendar em uma data que já passou.";
    }
    return "";
}

// Devolve a mensagem de erro do horário (ou "" se estiver tudo certo)
function validarHora(valor) {
    if (valor === "") {
        return "Selecione um horário.";
    }
    return "";
}

//EVENTOS

// Lista dos campos validados: o campo, o texto de erro dele e a função que valida
const campos = [
    { campo: inputNome, erro: erroNome, validar: function () { return validarNome(inputNome.value.trim()); } },
    { campo: inputTelefone, erro: erroTelefone, validar: function () { return validarTelefone(inputTelefone.value); } },
    { campo: selectServico, erro: erroServico, validar: function () { return validarServico(selectServico.value); } },
    { campo: inputData, erro: erroData, validar: function () { return validarData(inputData.value); } },
    { campo: selectHora, erro: erroHora, validar: function () { return validarHora(selectHora.value); } }
];

// Em cada campo: ao sair valida e pinta de vermelho se tiver erro, ao voltar limpa o erro
campos.forEach(function (item) {
    item.campo.addEventListener("blur", function () {
        mostrarErro(item.campo, item.erro, item.validar());
    });
    item.campo.addEventListener("focus", function () {
        mostrarErro(item.campo, item.erro, "");
    });
});

// Ao escolher a data, atualiza os horários disponíveis
inputData.addEventListener("change", atualizarHorarios);

// Ao enviar o formulário, valida e salva o agendamento
formAgendamento.addEventListener("submit", function (evento) {
    evento.preventDefault();

    // Valida todos os campos de uma vez (todos com erro ficam vermelhos)
    let temErro = false;
    campos.forEach(function (item) {
        const mensagem = item.validar();
        mostrarErro(item.campo, item.erro, mensagem);
        if (mensagem !== "") {
            temErro = true;
        }
    });
    if (temErro) {
        return;
    }

    const cliente = {
        nome: inputNome.value.trim(),
        telefone: inputTelefone.value.replace(/\D/g, ""),
        servico: selectServico.value,
        data: inputData.value,
        hora: selectHora.value
    };

    let lista = pegarAgendamentos();
    lista.push(cliente);
    localStorage.setItem("agendamentos", JSON.stringify(lista));
    mostrarAgendamentos();
    atualizarHorarios();
});

//INICIALIZAÇÃO

// Bloqueia as datas passadas no calendário
inputData.min = pegarDataHoje();

mostrarAgendamentos();
