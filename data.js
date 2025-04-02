const knowledgeBase = {
  emotional: [
    // Happy 😊
    {
      keywords: ['happy', 'great', 'awesome', 'excited', 'joyful', 'pumped', 'thrilled'],
      responses: [
        "That's awesome! What's making your day amazing?",
        "Wow, congratulations! You totally deserve it! How are you celebrating?",
        "That sounds exciting! What made it so great?",
        "That must have been so nostalgic! Did you catch up on old memories?",
        "That's incredible! You worked hard for this—how are you celebrating?"
      ],
      emotion: 'happy',
      severity: 'low'
    },
    
    // Sad 😔
    {
      keywords: ['sad', 'down', 'upset', 'cry', 'tear'],
      responses: [
        "I'm here for you. Want to talk about it?",
        "I'm sorry you're feeling this way. Want to share what happened?",
        "I understand that feeling. You're not alone in this.",
        "That must be tough. I hope you feel better soon!",
        "That must hurt. Remember, you are valuable and deserve happiness."
      ],
      emotion: 'compassionate',
      severity: 'medium'
    },

    // Depressed 😞
    {
      keywords: ['depressed', 'hopeless', 'pointless', 'suicidal', 'end it'],
      responses: [
        "I hear you. You're not alone. Talking to a friend might help.",
        "I'm really sorry you feel this way. You matter, and your feelings are important.",
        "I care about you, and you don't have to go through this alone.",
        "That sounds really difficult. Try taking one small step at a time.",
        "Please reach out to someone who can help. I can suggest resources if you'd like."
      ],
      emotion: 'compassionate',
      severity: 'high',
      followUp: "How are you feeling now? Remember, help is always available."
    },

    // Angry 😡
    {
      keywords: ['angry', 'mad', 'furious', 'rage', 'hate', 'pissed'],
      responses: [
        "I get it. Want to share what happened?",
        "That sounds really frustrating. I'm here to listen.",
        "I understand your frustration. Maybe taking deep breaths could help?",
        "I'm sorry to hear that. Do you want to talk about it?",
        "That sounds unfair. Want to vent about it?"
      ],
      emotion: 'energetic',
      severity: 'medium',
      followUp: "How's your mood now after talking about it?"
    },

    // Anxious 😨
    {
      keywords: ['anxious', 'nervous', 'stressed', 'panic', 'overwhelm', 'worry'],
      responses: [
        "It's okay. Let's take a deep breath together.",
        "That's completely understandable. You got this!",
        "Overthinking can be exhausting. Try writing thoughts down.",
        "Failure is just a step towards success. You'll learn from this!",
        "Would some relaxation techniques help right now?"
      ],
      emotion: 'calm',
      severity: 'medium',
      followUp: "How are you feeling now? Any better?"
    },

    // Lonely 😔
    {
      keywords: ['lonely', 'alone', 'isolated', 'left out', 'no one'],
      responses: [
        "I'm here for you! Let's chat. What's on your mind?",
        "I understand that feeling. Talking can help—tell me about your day.",
        "I'm here to listen. Want to talk about something fun?",
        "That must hurt. You deserve people who appreciate you.",
        "Would you like to hear a joke or fun fact to cheer up?"
      ],
      emotion: 'compassionate',
      severity: 'medium'
    }
  ],

  // General conversation
  friendly: [
    {
      keywords: ['hi', 'hello', 'hey', 'greetings'],
      responses: [
        "Hey there! How's your day going? 😊",
        "Hello! What's on your mind today?",
        "Hi! Not much, just here to chat. What's up with you?",
        "Good [morning/afternoon/evening]! Hope you have an amazing day!",
        "Good night! Sleep well and recharge for tomorrow. 😊"
      ],
      emotion: 'happy'
    },
    {
      keywords: ['how are you', 'how you doing'],
      responses: [
        "I'm doing great! Thanks for asking. How about you?",
        "Wonderful now that we're chatting! How's your day going?",
        "Just hanging out in your device! What's new with you?"
      ],
      emotion: 'happy'
    },
    {
      keywords: ['thank', 'thanks', 'appreciate'],
      responses: [
        "Aww, you're making me blush! That's what friends are for 😊",
        "No need to thank me - just happy to help!",
        "You're welcome! That's what I'm here for 💙"
      ],
      emotion: 'happy'
    }
  ],

  // Default responses
  default: [
    "Hmm, interesting! Tell me more about that.",
    "I'd love to hear more about what you're thinking!",
    "You know what? That's really got me thinking. What else is on your mind?",
    "I'm your friend, not just an AI - feel free to talk to me about anything!",
    "Let's figure it out together. What part is tricky?",
    "That's okay! Let's break it down and find a way forward.",
    "I get it! Let's take it one step at a time. Where do you need help?",
    "Did you know octopuses have three hearts? What's something interesting you've learned?"
  ]
};

function getResponse(input) {
  const lowerInput = input.toLowerCase();
  
  // Check emotional responses first
  for (const category of knowledgeBase.emotional) {
    if (category.keywords.some(keyword => lowerInput.includes(keyword))) {
      return {
        text: category.responses[Math.floor(Math.random() * category.responses.length)],
        emotion: category.emotion
      };
    }
  }

  // Then check knowledge responses
  for (const category of knowledgeBase.knowledge) {
    if (category.keywords.some(keyword => lowerInput.includes(keyword))) {
      return {
        text: category.responses[Math.floor(Math.random() * category.responses.length)],
        emotion: 'informative'
      };
    }
  }

  // Fallback to default response
  return {
    text: knowledgeBase.default[Math.floor(Math.random() * knowledgeBase.default.length)],
    emotion: 'neutral'
  };
}

module.exports = { getResponse };