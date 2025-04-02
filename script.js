const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesContainer = document.getElementById('messages');
const clearButton = document.getElementById('clearButton');
const statusIndicator = document.getElementById('status');

// Add message to chat
function addMessage(text, isUser = false, emotion = 'neutral', timestamp = new Date()) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-white'}">
            ${!isUser ? `
                <div class="flex items-center mb-1">
                    <img src="https://images.pexels.com/photos/3303448/pexels-photo-3303448.jpeg" 
                         class="w-6 h-6 rounded-full mr-2">
                    <span class="font-bold">AI Companion</span>
                </div>
            ` : ''}
            <p>${text}</p>
            <div class="text-xs mt-1 opacity-70 flex justify-between items-center">
                <span>${timeString}</span>
                ${emotion !== 'neutral' ? `
                    <span class="ml-2">
                        ${emotion === 'happy' ? '😊' : ''}
                        ${emotion === 'compassionate' ? '🤗' : ''}
                        ${emotion === 'informative' ? '🧠' : ''}
                    </span>
                ` : ''}
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex justify-start';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="bg-gray-700 text-white rounded-lg px-4 py-2">
            <div class="flex items-center">
                <img src="https://images.pexels.com/photos/3303448/pexels-photo-3303448.jpeg" 
                     class="w-6 h-6 rounded-full mr-2">
                <span class="typing-indicator"></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Process message locally
async function sendMessage() {
    const message = messageInput.value.trim();
    if (message.length < 1) return;

    addMessage(message, true);
    messageInput.value = '';
    statusIndicator.textContent = 'AI is thinking...';
    showTyping();

    try {
        // Simulate more natural typing delay based on message length
        const delay = Math.min(3000, Math.max(1000, message.length * 50));
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const response = getResponse(message);
        
        // Simulate typing out response character by character
        let replyText = '';
        hideTyping();
        statusIndicator.textContent = 'AI is responding...';
        
        for (let i = 0; i < response.text.length; i++) {
            replyText += response.text[i];
            const tempDiv = document.createElement('div');
            tempDiv.className = `flex justify-start`;
            tempDiv.innerHTML = `
                <div class="max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 bg-gray-700 text-white">
                    <div class="flex items-center mb-1">
                        <img src="${document.querySelector('#avatar').src}" 
                             class="w-6 h-6 rounded-full mr-2">
                        <span class="font-bold">AI Companion</span>
                    </div>
                    <p>${replyText}</p>
                </div>
            `;
            
            // Update or create message element
            const existingMsg = document.getElementById('temp-ai-message');
            if (existingMsg) {
                existingMsg.innerHTML = tempDiv.innerHTML;
            } else {
                tempDiv.id = 'temp-ai-message';
                messagesContainer.appendChild(tempDiv);
            }
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
        }
        
        // Replace temporary message with final formatted message
        document.getElementById('temp-ai-message')?.remove();
        addMessage(response.text, false, response.emotion);
        updateEmotionUI(response.emotion);
        statusIndicator.textContent = '';
        
    } catch (error) {
        hideTyping();
        addMessage("Let me try that again...", false, 'sad');
        setTimeout(() => {
            addMessage("I'm having trouble formulating a response. Could you rephrase?", false, 'neutral');
        }, 1500);
        statusIndicator.textContent = '';
        console.error('Error:', error);
    }
}

function updateEmotionUI(emotion) {
    const avatar = document.querySelector('#avatar');
    // Update avatar image based on emotion
    avatar.src = `assets/ai-${emotion}.png`;
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

clearButton.addEventListener('click', () => {
    messagesContainer.innerHTML = '';
    statusIndicator.textContent = 'Chat cleared';
    setTimeout(() => statusIndicator.textContent = '', 2000);
});

// Initial greeting
setTimeout(() => {
    addMessage("Hello! I'm your AI companion. How can I help you today?", false, 'happy');
}, 1000);