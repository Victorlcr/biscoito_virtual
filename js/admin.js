// Administração - Cadastro de Mensagens
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messagePreview = document.getElementById('messagePreview');
    const generatedInfo = document.getElementById('generatedInfo');
    const generatedUrl = document.getElementById('generatedUrl');
    const viewLink = document.getElementById('viewLink');
    
    // Elementos do formulário
    const messageIdInput = document.getElementById('messageId');
    const messageTextInput = document.getElementById('messageText');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const textColorInput = document.getElementById('textColor');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Atualizar pré-visualização em tempo real
    function updatePreview() {
        const message = messageTextInput.value || 'Your message will appear here...';
        const bgColor = backgroundColorInput.value;
        const txtColor = textColorInput.value;
        
        messagePreview.innerHTML = `<p>${message}</p>`;
        messagePreview.style.backgroundColor = bgColor;
        messagePreview.style.color = txtColor;
        
        // Atualizar valores de cor exibidos
        document.querySelector('#backgroundColor + .color-value').textContent = bgColor;
        document.querySelector('#textColor + .color-value').textContent = txtColor;
    }
    
    // Event listeners para atualização da pré-visualização
    messageTextInput.addEventListener('input', updatePreview);
    backgroundColorInput.addEventListener('input', updatePreview);
    textColorInput.addEventListener('input', updatePreview);
    
    // Configurar opções de cor pré-definidas
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const bgColor = this.dataset.bg;
            const textColor = this.dataset.text;
            
            // Atualizar inputs de cor
            backgroundColorInput.value = bgColor;
            textColorInput.value = textColor;
            
            // Atualizar visualização
            updatePreview();
            
            // Marcar opção como ativa
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Validação do ID em tempo real
    messageIdInput.addEventListener('input', function() {
        const id = this.value.toUpperCase();
        this.value = id;
        
        // Verificar se o ID já existe
        if (id.length === 4 && fileGenerator.isIdExists(id)) {
            this.setCustomValidity('This ID is already in use. Choose another.');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Envio do formulário
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(messageForm);
        const messageId = formData.get('messageId').toUpperCase();
        const messageText = formData.get('messageText');
        const backgroundColor = formData.get('backgroundColor');
        const textColor = formData.get('textColor');
        
        // Validar ID
        if (messageId.length !== 4) {
            showNotification('The ID must be exactly 4 characters.', 'error');
            return;
        }
        
        if (!/^[A-Za-z0-9]{4}$/.test(messageId)) {
            showNotification('The ID must contain only letters and numbers.', 'error');
            return;
        }
        
        // Verificar se ID já existe
        if (fileGenerator.isIdExists(messageId)) {
            showNotification('This ID is already in use. Choose another.', 'error');
            return;
        }
        
        // Preparar dados da mensagem
        const messageData = {
            id: messageId,
            message: messageText,
            backgroundColor: backgroundColor,
            textColor: textColor
        };
        
        // Gerar arquivo HTML
        const success = fileGenerator.generateHTMLFile(messageData);
        
        if (success) {
            // Mostrar informações da mensagem gerada
            const baseUrl = window.location.origin;
            const messageUrl = `${baseUrl}/${messageId}.html`;
            
            generatedUrl.value = messageUrl;
            viewLink.href = messageUrl;
            generatedInfo.style.display = 'block';
            
            // Scroll para a seção de informações
            generatedInfo.scrollIntoView({ behavior: 'smooth' });
            
            // Mostrar notificação
            showNotification('Message card created successfully!');
            
            // Limpar formulário
            messageForm.reset();
            updatePreview();
            
            // Limpar seleção de cores
            colorOptions.forEach(opt => opt.classList.remove('active'));
        } else {
            showNotification('Error generating message. Please try again.', 'error');
        }
    });
    
    // Inicializar pré-visualização
    updatePreview();
});

// Copiar URL para a área de transferência
function copyToClipboard() {
    const urlInput = document.getElementById('generatedUrl');
    urlInput.select();
    urlInput.setSelectionRange(0, 99999); // Para mobile
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('URL copied to clipboard!');
        }
    } catch (err) {
        // Fallback para navegadores modernos
        navigator.clipboard.writeText(urlInput.value)
            .then(() => showNotification('URL copied to clipboard!'))
            .catch(() => showNotification('Error copying URL.', 'error'));
    }
}

// Função de notificação
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}