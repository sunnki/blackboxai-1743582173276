const { memory, analyzeSentiment } = require('./emotionalAI');

// Enhanced message display with typing simulation
async function displayMessage(text, isUser = false, emotion = 'neutral') {
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) return;

    if (!isUser) {
        // Simulate typing for AI responses
        let displayedText = '';
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex justify-start';
        typingDiv.id = 'typing-message';
        
        for (let i = 0; i < text.length; i++) {
            displayedText += text[i];
            typingDiv.innerHTML = `
                <div class="max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 bg-gray-700 text-white">
                    <div class="flex items-center mb-1">
                        <img src="assets/ai-${emotion}.png" class="w-6 h-6 rounded-full mr-2">
                        <span class="font-bold">AI Companion</span>
                    </div>
                    <p>${displayedText}</p>
                </div>
            `;
            
            if (!document.getElementById('typing-message')) {
                messagesContainer.appendChild(typingDiv);
            }
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
        }
        typingDiv.remove();
    }

    // Add final message
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
    messageDiv.innerHTML = `
        <div class="max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-white'}">
            ${!isUser ? `
                <div class="flex items-center mb-1">
                    <img src="assets/ai-${emotion}.png" class="w-6 h-6 rounded-full mr-2">
                    <span class="font-bold">AI Companion</span>
                </div>
            ` : ''}
            <p>${text}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enhanced response handling
async function sendMessage() {
    console.log('sendMessage() called');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const message = messageInput.value.trim();
    console.log('Message:', message);
    
    if (!message) return;
    
    // Disable input during processing
    messageInput.disabled = true;
    sendButton.disabled = true;
    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
        await displayMessage(message, true);
        messageInput.value = '';
        
        // Process AI response
        const sentiment = analyzeSentiment(message);
        const response = getEnhancedResponse(message, sentiment);
        await displayMessage(response.text, false, response.emotion);
        
        if (response.followUp) {
            setTimeout(async () => {
                await displayMessage(response.followUp, false, 'compassionate');
            }, 5000);
        }
    } catch (err) {
        console.error('Error sending message:', err);
        await displayMessage("Oops! Let me try that again.", false, 'sad');
    } finally {
        // Re-enable input
        messageInput.disabled = false;
        sendButton.disabled = false;
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        messageInput.focus();
    }
}

// Enhanced response generator
function getEnhancedResponse(input, sentiment) {
    memory.messageCount++;
    const lowerInput = input.toLowerCase();
    
    if (memory.needsFollowUp) {
        memory.needsFollowUp = false;
        return {
            text: memory.lastFollowUp,
            emotion: 'compassionate'
        };
    }

    const baseResponse = getBaseResponse(input);
    
    if (sentiment.isNegative && baseResponse.emotion !== 'compassionate') {
        baseResponse.text = "I sense you're feeling down. " + baseResponse.text;
        baseResponse.emotion = 'compassionate';
        baseResponse.followUp = "How are you feeling now about this?";
    }
    
    memory.lastEmotion = baseResponse.emotion;
    memory.lastTopic = input.split(' ').slice(0, 2).join(' ');
    memory.needsFollowUp = !!baseResponse.followUp;
    memory.lastFollowUp = baseResponse.followUp || "";
    
    return baseResponse;
}

// Voice recognition setup
let recognition;
try {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('messageInput').value = transcript;
        sendMessage();
    };

    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        displayMessage("Sorry, I didn't catch that. Please try again.", false, 'sad');
    };
} catch (err) {
    console.error('Voice recognition not supported:', err);
}

// Initialize chat interface
function initChat() {
    console.log('Initializing chat...');
    const sendButton = document.getElementById('sendButton');
    const voiceButton = document.getElementById('voiceButton');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    
    console.log('Elements found:', {
        sendButton: !!sendButton,
        voiceButton: !!voiceButton,
        messageInput: !!messageInput,
        messagesContainer: !!messagesContainer
    });
    
    if (sendButton && voiceButton && messageInput && messagesContainer) {
        // Handle send button click
        sendButton.addEventListener('click', sendMessage);
        
        // Handle voice button click
        voiceButton.addEventListener('click', () => {
            if (recognition) {
                voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                voiceButton.classList.replace('bg-green-600', 'bg-red-600');
                try {
                    recognition.start();
                } catch (err) {
                    console.error('Voice recognition error:', err);
                    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                    voiceButton.classList.replace('bg-red-600', 'bg-green-600');
                    displayMessage("Voice input failed. Please try again.", false, 'sad');
                }
            } else {
                displayMessage("Voice recognition not supported in your browser", false, 'sad');
            }
        });

        if (recognition) {
            recognition.onend = () => {
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceButton.classList.replace('bg-red-600', 'bg-green-600');
            };
        }
        
        // Handle enter key press
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent form submission/new line
                sendMessage();
            }
        });

        // Initial greeting
        setTimeout(() => {
            displayMessage("Hello! I'm your emotional AI companion. How are you today?", false, 'happy')
                .catch(err => console.error('Greeting failed:', err));
        }, 1000);
    } else {
        console.error('Missing required chat elements');
        alert('Chat initialization failed - please refresh the page');
    }
}

// Start chat when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
} else {
    initChat();
}
