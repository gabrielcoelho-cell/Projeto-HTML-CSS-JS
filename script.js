// Constantes para os elementos do DOM
const inputTarefa = document.getElementById('inputTarefa');
const btnAdicionar = document.getElementById('btnAdicionar');
const listaDeTarefas = document.getElementById('listaDeTarefas');
const feedback = document.getElementById('mensagemFeedback');

// Variável para armazenar o URL do PNG (Tópico 6)
// Usando um ícone simples para demonstração
const PNG_URL_EXEMPLO = 'https://i.imgur.com/v8tT11Q.png'; 

// --- Função de Feedback (Tópico 2) ---
function mostrarFeedback(mensagem, tipo) {
    feedback.textContent = mensagem;
    feedback.className = ''; // Limpa classes anteriores
    feedback.classList.add(`feedback-${tipo}`); // Adiciona a classe de sucesso ou erro
    feedback.style.display = 'block';
    // Esconde o feedback após 3 segundos
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// --- Função de Validação e Adição (Tópicos 1, 2) ---
function adicionarTarefa() {
    const textoTarefa = inputTarefa.value.trim();
    const MIN_CARACTERES = 5; // Tópico 1: Mínimo de caracteres

    // 1. Validação de Caracteres (Tópico 1)
    if (textoTarefa.length < MIN_CARACTERES) {
        mostrarFeedback(`Erro: A tarefa deve ter no mínimo ${MIN_CARACTERES} caracteres!`, 'erro');
        return;
    }

    // 2. Criação do Item da Lista
    const li = document.createElement('li');
    li.classList.add('tarefa-item');
    li.setAttribute('draggable', 'true'); // Permite arrastar (Tópico 5)

    // Adiciona o PNG/Ícone (Tópico 6)
    const imgPng = document.createElement('img');
    imgPng.src = PNG_URL_EXEMPLO;
    imgPng.alt = 'Ícone de tarefa';
    imgPng.classList.add('tarefa-png');
    li.appendChild(imgPng);

    const spanTexto = document.createElement('span');
    spanTexto.classList.add('tarefa-texto');
    spanTexto.textContent = textoTarefa;
    li.appendChild(spanTexto);

    const divBotoes = document.createElement('div');
    divBotoes.classList.add('tarefa-botoes');

    // Botão de Editar (Tópico 4)
    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.classList.add('btn-editar');
    btnEditar.onclick = () => editarTarefa(spanTexto, btnEditar); // Evento para edição
    divBotoes.appendChild(btnEditar);

    // Botão de Excluir (Tópico 3)
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.classList.add('btn-excluir');
    btnExcluir.onclick = () => excluirTarefa(li); // Evento para exclusão
    divBotoes.appendChild(btnExcluir);

    li.appendChild(divBotoes);
    listaDeTarefas.appendChild(li);

    // Limpa o input e mostra sucesso (Tópico 2)
    inputTarefa.value = '';
    mostrarFeedback('Sucesso: Tarefa adicionada!', 'sucesso');
}

btnAdicionar.addEventListener('click', adicionarTarefa);
inputTarefa.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});

// --- Excluir Item (Tópico 3) ---
function excluirTarefa(itemLi) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        listaDeTarefas.removeChild(itemLi);
        mostrarFeedback('Tarefa excluída com sucesso!', 'sucesso');
    }
}

// --- Editar e Salvar (Tópico 4) ---
function editarTarefa(spanTexto, btnEditar) {
    // Modo de Edição
    if (btnEditar.textContent === 'Editar') {
        // 1. Torna o texto editável
        spanTexto.setAttribute('contenteditable', 'true');
        spanTexto.focus();
        
        // 2. Muda o botão para "Salvar"
        btnEditar.textContent = 'Salvar';
        btnEditar.classList.remove('btn-editar');
        btnEditar.classList.add('btn-salvar');
        mostrarFeedback('Modo de Edição Ativado', 'sucesso');
        
    } 
    // Modo de Salvar
    else {
        const novoTexto = spanTexto.textContent.trim();
        const MIN_CARACTERES = 5; 
        
        // Validação no salvamento
        if (novoTexto.length < MIN_CARACTERES) {
            mostrarFeedback(`Erro ao Salvar: O texto deve ter no mínimo ${MIN_CARACTERES} caracteres!`, 'erro');
            // Mantém no modo de edição para correção
            spanTexto.focus(); 
            return;
        }

        // 1. Torna o texto não editável
        spanTexto.setAttribute('contenteditable', 'false');

        // 2. Muda o botão de volta para "Editar"
        btnEditar.textContent = 'Editar';
        btnEditar.classList.remove('btn-salvar');
        btnEditar.classList.add('btn-editar');
        mostrarFeedback('Tarefa atualizada com sucesso!', 'sucesso');
    }
}

// --- Lógica de Reordenação (Drag and Drop - Tópico 5) ---
let arrastandoItem = null;

listaDeTarefas.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('tarefa-item')) {
        arrastandoItem = e.target;
        // Adiciona a classe 'dragging' para estilização (opacidade)
        setTimeout(() => e.target.classList.add('dragging'), 0); 
    }
});

listaDeTarefas.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    arrastandoItem = null;
});

listaDeTarefas.addEventListener('dragover', (e) => {
    e.preventDefault(); // Permite o drop
    const afterElement = getDragAfterElement(listaDeTarefas, e.clientY);
    const currentItem = document.querySelector('.dragging');

    if (afterElement == null) {
        listaDeTarefas.appendChild(currentItem);
    } else {
        listaDeTarefas.insertBefore(currentItem, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.tarefa-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        // Calcula o centro do elemento
        const offset = y - box.top - box.height / 2; 

        // Encontra o elemento mais próximo que está *abaixo* do mouse
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: -Infinity }).element;
}
// Fim da lógica de Drag and Drop (Tópico 5)