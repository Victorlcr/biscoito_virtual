// Gerador de arquivos HTML
class FileGenerator {
    constructor() {
        this.savedMessages = this.getSavedMessages();
    }
    
    // Template para os arquivos HTML gerados (estilo limpo)
    messageTemplate(messageData) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biscoito - ${messageData.id}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍪</text></svg>">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background-color: ${messageData.backgroundColor};
            transition: background-color 0.5s ease;
            position: relative;
            overflow: hidden;
        }
        
        .emoji-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.6;
            pointer-events: none;
            z-index: 0;
        }
        
        .emoji-bg span {
            position: absolute;
            font-size: 24px;
        }
        
        .emoji-bg span:nth-child(1) { top: 10%; left: 5%; }
        .emoji-bg span:nth-child(2) { top: 20%; left: 90%; }
        .emoji-bg span:nth-child(3) { top: 40%; left: 8%; }
        .emoji-bg span:nth-child(4) { top: 60%; left: 85%; }
        .emoji-bg span:nth-child(5) { top: 80%; left: 10%; }
        
        .message-container {
            background-color: rgba(255, 255, 255, 0.95);
            padding: 50px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            max-width: 700px;
            width: 100%;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            position: relative;
            z-index: 1;
        }
        
        .message-content {
            color: ${messageData.textColor};
            font-size: 1.8rem;
            line-height: 1.6;
            margin: 0;
            font-weight: 500;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            font-size: 0.9rem;
            color: rgba(0, 0, 0, 0.6);
        }
        
        .back-link {
            display: inline-block;
            margin-top: 20px;
            color: rgba(0, 0, 0, 0.6);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s;
            padding: 8px 16px;
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 6px;
        }
        
        .back-link:hover {
            color: #000;
            border-color: rgba(0, 0, 0, 0.4);
            background: rgba(0, 0, 0, 0.05);
        }
        
        @media (max-width: 768px) {
            .message-container {
                padding: 30px;
            }
            
            .message-content {
                font-size: 1.4rem;
            }
        }
        
        @media (max-width: 480px) {
            .message-container {
                padding: 20px;
            }
            
            .message-content {
                font-size: 1.2rem;
            }
            
            .emoji-bg span {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="emoji-bg">
        <span>💌</span>
        <span>✨</span>
        <span>🎨</span>
        <span>🔖</span>
        <span>📝</span>
    </div>
    <div class="message-container">
        <div class="message-content">
            <p>${messageData.message}</p>
        </div>
        <div class="footer">
            <p>biscoito_virtual • ${new Date().toLocaleDateString('pt-BR')}</p>
            <a href="/" class="back-link">← abra outra mensagem</a>
        </div>
    </div>
</body>
</html>`;
    }
    
    // Obter mensagens salvas do localStorage
    getSavedMessages() {
        const messages = localStorage.getItem('messageCards');
        return messages ? JSON.parse(messages) : {};
    }
    
    // Salvar mensagem no localStorage
    saveMessageToStorage(id, messageData) {
        this.savedMessages[id] = {
            ...messageData,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('messageCards', JSON.stringify(this.savedMessages));
    }
    
    // Gerar arquivo HTML para download
    generateHTMLFile(messageData) {
        const htmlContent = this.messageTemplate(messageData);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${messageData.id}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Salvar no localStorage também
        this.saveMessageToStorage(messageData.id, messageData);
        
        return true;
    }
    
    // Verificar se ID já existe
    isIdExists(id) {
        return !!this.savedMessages[id];
    }
    
    // Obter mensagem pelo ID
    getMessage(id) {
        return this.savedMessages[id] || null;
    }
    
    // Listar todas as mensagens
    getAllMessages() {
        return this.savedMessages;
    }
    
    // Excluir mensagem
    deleteMessage(id) {
        if (this.savedMessages[id]) {
            delete this.savedMessages[id];
            localStorage.setItem('messageCards', JSON.stringify(this.savedMessages));
            return true;
        }
        return false;
    }
}

// Inicializar gerador de arquivos
const fileGenerator = new FileGenerator();