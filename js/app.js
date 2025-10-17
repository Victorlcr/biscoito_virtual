// Armazenamento de mensagens (simulando um banco de dados)
const MessageStorage = {
    getMessages: function() {
        const messages = localStorage.getItem('elegantMessages');
        return messages ? JSON.parse(messages) : {};
    },
    
    saveMessage: function(id, messageData) {
        const messages = this.getMessages();
        messages[id] = messageData;
        localStorage.setItem('elegantMessages', JSON.stringify(messages));
        return true;
    },
    
    getMessage: function(id) {
        const messages = this.getMessages();
        return messages[id] || null;
    },
    
    deleteMessage: function(id) {
        const messages = this.getMessages();
        if (messages[id]) {
            delete messages[id];
            localStorage.setItem('elegantMessages', JSON.stringify(messages));
            return true;
        }
        return false;
    }
};

// Função para exibir uma mensagem
function displayMessage(id) {
    const messageData = MessageStorage.getMessage(id);
    const messageContainer = document.getElementById('messageContainer');
    const messageContent = document.getElementById('messageContent');
    const messageText = document.getElementById('messageText');
    
    if (messageData) {
        // Aplicar estilos
        messageContainer.style.backgroundColor = messageData.backgroundColor;
        messageContent.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        messageText.style.color = messageData.textColor;
        messageText.textContent = messageData.message;
    } else {
        // Mensagem não encontrada
        messageContainer.style.backgroundColor = '#e74c3c';
        messageText.textContent = 'Mensagem não encontrada. Verifique o ID.';
        messageText.style.color = '#ffffff';
    }
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página principal
    if (window.location.pathname === '/') {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id && id.length === 4) {
            displayMessage(id);
        }
    }
});

// Função para verificar se uma mensagem existe
function checkMessageExists(code) {
    // Em uma implementação real, você verificaria em um banco de dados
    // Por enquanto, vamos verificar no localStorage
    const messages = JSON.parse(localStorage.getItem('messageCards') || '{}');
    return !!messages[code];
}

// Modificação da função viewMessage para redirecionar para a página de erro se não encontrar
function viewMessage() {
    const codeInput = document.getElementById('messageCode');
    const code = codeInput.value.trim().toUpperCase();
    
    // Validate code
    if (code.length !== 4) {
        showNotification('Please enter a 4-character code.', 'error');
        codeInput.focus();
        return;
    }
    
    if (!/^[A-Z0-9]{4}$/.test(code)) {
        showNotification('Code must contain only letters and numbers.', 'error');
        codeInput.focus();
        return;
    }
    
    // Verificar se a mensagem existe
    if (checkMessageExists(code)) {
        // Redirect to message
        window.location.href = `/${code}.html`;
    } else {
        // Redirect to error page with the code as parameter
        window.location.href = `/404.html?code=${code}`;
    }
}