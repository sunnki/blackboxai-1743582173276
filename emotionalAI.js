// Emotional AI Core Functions
const memory = {
    lastEmotion: null,
    lastTopic: null,
    messageCount: 0,
    needsFollowUp: false,
    lastFollowUp: ""
};

function analyzeSentiment(text) {
    const positiveWords = ['happy', 'joy', 'love', 'great', 'awesome'];
    const negativeWords = ['sad', 'angry', 'hate', 'depressed', 'anxious'];
    
    let score = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
        if (positiveWords.includes(word)) score++;
        if (negativeWords.includes(word)) score--;
    });
    
    return {
        score: score,
        isPositive: score > 0,
        isNegative: score < 0
    };
}

module.exports = { memory, analyzeSentiment };