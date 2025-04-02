// Debug version of chat script
console.log('Loading debug-enhancedScript.js');

const { memory, analyzeSentiment } = require('./emotionalAI');

// Enhanced debug logging
async function displayMessage(text, isUser = false, emotion = 'neutral') {
    console.log(`[DEBUG] Displaying message: "${text}" (user:${isUser}, emotion:${emotion})`);
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) {
        console.error('[ERROR] Messages container not found');
        return false;
    }
    console.log('[DEBUG] Messages container found');
    return true;
}

// Debug version of sendMessage
async function sendMessage() {
    console.log('[DEBUG] sendMessage() called');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    if (!messageInput || !sendButton) {
        console.error('[ERROR] Required elements not found');
        return;
    }

    const message = messageInput.value.trim();
    console.log(`[DEBUG] Processing message: "${message}"`);
    
    if (!message) {
        console.log('[DEBUG] Empty message ignored');
        return;
    }

    // Display user message
    const userMsgSuccess = await displayMessage(message, true);
    if (!userMsgSuccess) return;
    
    messageInput.value = '';
    
    try {
        // Get AI response
        const sentiment = analyzeSentiment(message);
        console.log(`[DEBUG] Sentiment analysis:`, sentiment);
        
        const response = getEnhancedResponse(message, sentiment);
        console.log(`[DEBUG] AI response:`, response);
        
        // Display AI response
        const aiMsgSuccess = await displayMessage(response.text, false, response.emotion);
        if (!aiMsgSuccess) return;
        
    } catch (err) {
        console.error('[ERROR] Message processing failed:', err);
        await displayMessage("Oops! Something went wrong.", false, 'sad');
    }
}

// Initialize chat with debug logging
function initChat() {
    console.log('[DEBUG] Initializing chat...');
    
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    
    console.log('[DEBUG] Elements found:', {
        sendButton: !!sendButton,
        messageInput: !!messageInput,
        messagesContainer: !!messagesContainer
    });

    if (sendButton && messageInput && messagesContainer) {
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                console.log('[DEBUG] Enter key pressed');
                sendMessage();
            }
        });
        
        console.log('[DEBUG] Chat initialized successfully');
    } else {
        console.error('[ERROR] Failed to initialize chat - missing elements');
    }
}

// Start chat when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
} else {
    initChat();
}