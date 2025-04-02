// Bot configuration
const BOT_NAME = 'Jarvis';
const YOUTUBE_API_KEY = 'AIzaSyDzRxmimKRwEGDPO2kC6NOtl2yPUnokeag';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

// Theme configuration
let isDarkMode = false;

// Music player state
let currentPlaylist = [];
let currentSongIndex = 0;
let isPlaying = false;
let player;

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const moodButtons = document.querySelectorAll('.mood-btn');
const preferenceButtons = document.querySelectorAll('.preference-btn');
const clearChatButton = document.getElementById('clear-chat');
const toggleThemeButton = document.getElementById('toggle-theme');
const voiceInputButton = document.getElementById('voice-input');
const moodScanButton = document.getElementById('mood-scan');
const nowPlaying = document.getElementById('now-playing');
const closeNowPlaying = document.getElementById('close-now-playing');
const currentAlbumArt = document.getElementById('current-album-art');
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');
const prevSongButton = document.getElementById('prev-song');
const playPauseButton = document.getElementById('play-pause');
const nextSongButton = document.getElementById('next-song');
const songProgress = document.getElementById('song-progress');

// Enhanced mood detection with more natural expressions
const moodKeywords = {
    happy: [
        'happy', 'joy', 'excited', 'good', 'great', 'wonderful', 'amazing', 'fantastic', 
        'delighted', 'cheerful', 'awesome', 'perfect', 'best day', 'feeling good', 
        'in a good mood', 'loving life', 'on top of the world', 'feeling great',
        'smiling', 'laughing', 'enjoying', 'having fun', 'feeling awesome'
    ],
    sad: [
        'sad', 'depressed', 'down', 'unhappy', 'miserable', 'heartbroken', 'cry', 
        'tears', 'gloomy', 'blue', 'not feeling well', 'feeling low', 'feeling down', 
        'feeling bad', 'not good', 'not okay', 'not well', 'feeling terrible', 
        'feeling awful', 'feeling horrible', 'feeling sick', 'feeling unwell',
        'broken heart', 'feeling lonely', 'missing someone', 'feeling empty'
    ],
    angry: [
        'angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'rage', 
        'upset', 'pissed', 'agitated', 'fuming', 'livid', 'enraged', 'irate', 
        'fed up', 'had enough', 'can\'t take it', 'so angry', 'really mad',
        'annoyed', 'bothered', 'irritated', 'frustrated', 'angry at'
    ],
    relaxed: [
        'relaxed', 'calm', 'peaceful', 'chill', 'serene', 'tranquil', 'laid back', 
        'easy', 'comfortable', 'rested', 'at peace', 'at ease', 'feeling calm', 
        'feeling peaceful', 'feeling relaxed', 'taking it easy', 'unwinding',
        'chilling', 'taking a break', 'resting', 'meditating', 'zen'
    ],
    romantic: [
        'romantic', 'love', 'loving', 'passionate', 'affectionate', 'sweet', 
        'tender', 'intimate', 'caring', 'devoted', 'in love', 'feeling love', 
        'missing someone', 'thinking of someone', 'heart full', 'feeling romantic',
        'crush', 'falling in love', 'heartbeat', 'butterflies', 'special someone'
    ],
    energetic: [
        'energetic', 'active', 'pumped', 'excited', 'lively', 'dynamic', 'vibrant', 
        'enthusiastic', 'peppy', 'upbeat', 'full of energy', 'ready to go', 
        'feeling energetic', 'feeling active', 'ready to move', 'feeling pumped',
        'hyper', 'full of life', 'ready to party', 'dancing', 'working out'
    ],
    anxious: [
        'anxious', 'nervous', 'worried', 'stressed', 'tense', 'uneasy', 
        'apprehensive', 'concerned', 'fearful', 'panicked', 'stressed out', 
        'feeling anxious', 'feeling nervous', 'feeling worried', 'feeling stressed', 
        'can\'t relax', 'mind racing', 'overwhelmed', 'under pressure',
        'panic', 'worried about', 'stressed about', 'anxious about'
    ],
    nostalgic: [
        'nostalgic', 'memories', 'remember', 'reminisce', 'past', 'old times', 
        'throwback', 'reminiscent', 'sentimental', 'yearning', 'missing old days', 
        'thinking of the past', 'remembering', 'feeling nostalgic', 'old memories',
        'childhood', 'good old days', 'back in the day', 'remember when'
    ],
    focused: [
        'focused', 'concentrated', 'attentive', 'determined', 'mindful', 'alert', 
        'aware', 'engaged', 'absorbed', 'intent', 'in the zone', 'concentrating', 
        'working hard', 'studying', 'learning', 'feeling focused', 'need to focus',
        'working', 'studying', 'reading', 'writing', 'coding'
    ],
    sleepy: [
        'sleepy', 'tired', 'drowsy', 'exhausted', 'fatigued', 'weary', 'sleep', 
        'rest', 'nap', 'doze', 'feeling sleepy', 'need sleep', 'want to sleep', 
        'can\'t stay awake', 'feeling tired', 'need rest', 'exhausted',
        'yawning', 'drowsy', 'need to sleep', 'bedtime', 'night'
    ]
};

// Enhanced bot responses with more empathetic and natural language
const botResponses = {
    happy: "I'm so glad you're feeling happy! Let's keep those good vibes going with some uplifting tunes! 🎵 What kind of happy music would you like? Upbeat, dance, or something more mellow?",
    sad: "I'm sorry to hear you're not feeling well. Music can be a great companion during tough times. Would you like some comforting songs to help you feel better? 🎵",
    angry: "I understand you're feeling angry. Sometimes music can help release that energy. Would you like some powerful tracks to help you process those feelings? 🎵",
    relaxed: "It's great that you're feeling relaxed! Let's enhance that peaceful state with some calming melodies. 🎵 Would you prefer instrumental, nature sounds, or soft vocals?",
    romantic: "Ah, love is in the air! Let me find some beautiful songs to match your romantic mood. 🎵 Would you like classic love songs, modern ballads, or something more upbeat?",
    energetic: "Feeling full of energy? Perfect! Let's keep that momentum going with some high-energy tracks! 🎵 Would you like workout music, dance tracks, or something else?",
    anxious: "I hear you're feeling anxious. Take a deep breath, and let's try some calming music to help ease your mind. 🎵 Would you like meditation music, nature sounds, or soft instrumentals?",
    nostalgic: "Missing the good old days? Let's take a trip down memory lane with these classic tunes. 🎵 What era or type of music brings back good memories for you?",
    focused: "Time to get in the zone! Let me find some tracks to help you stay focused and productive. 🎵 Would you like classical music, ambient sounds, or something else?",
    sleepy: "Feeling sleepy? Let's wind down with some soothing melodies to help you relax and rest. 🎵 Would you like soft piano, nature sounds, or gentle vocals?"
};

// Conversation responses
const conversationResponses = {
    greetings: ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo', 'namaste', 'hola', 'bonjour', 'hey there', 'hi there'],
    howAreYou: ['how are you', 'how r u', 'how are u', 'how do you do', 'whats up', 'wassup', 'how you doing', 'how\'s it going', 'how are things'],
    thanks: ['thanks', 'thank you', 'thx', 'thankyou', 'ty', 'appreciate it', 'much appreciated'],
    bye: ['bye', 'goodbye', 'see you', 'see ya', 'take care', 'farewell', 'catch you later', 'until next time'],
    name: ['what is your name', 'who are you', 'your name', 'name', 'what should I call you', 'who am I talking to'],
    help: ['help', 'what can you do', 'what do you do', 'tell me about yourself', 'how can you help', 'what are you for']
};

// Bot conversation responses
const botConversationResponses = {
    greeting: `Welcome back! I'm ${BOT_NAME}, your AI music companion. How are you feeling today? You can tell me your mood or select one from the sidebar!`,
    howAreYou: "I'm doing great, thanks for asking! How about you? Tell me how you're feeling, and I'll find the perfect music for your mood!",
    thanks: "You're very welcome! Let me know if you'd like more music recommendations or if there's anything else I can do for you!",
    bye: "Goodbye! Take care and come back anytime you need music to match your mood!",
    name: `I'm ${BOT_NAME}, your personal AI music recommendation assistant. I'm here to understand how you're feeling and suggest the perfect songs for your mood!`,
    help: `I'm ${BOT_NAME}, and I'm here to help you find the perfect music for any mood! You can:
    - Tell me how you're feeling (happy, sad, angry, etc.)
    - Click on mood buttons in the sidebar
    - Use voice input to tell me your mood
    - Scan your mood using your camera
    - Get recommendations for different moods
    I'll try to understand your feelings and suggest music that matches your mood perfectly!`
};

// Additional request keywords
const additionalRequestKeywords = ['more', 'another', 'other', 'different', 'new', 'next', 'another one', 'more songs', 'different songs'];

// Fallback music recommendations
const fallbackMusic = {
    happy: [
        { title: "Happy - Pharrell Williams", videoId: "y6Sxv-sUYtM", thumbnail: "https://i.ytimg.com/vi/y6Sxv-sUYtM/default.jpg" },
        { title: "Don't Stop Me Now - Queen", videoId: "HgzGwKwwkmg", thumbnail: "https://i.ytimg.com/vi/HgzGwKwwkmg/default.jpg" },
        { title: "Walking on Sunshine - Katrina & The Waves", videoId: "iPUmE-tne5U", thumbnail: "https://i.ytimg.com/vi/iPUmE-tne5U/default.jpg" }
    ],
    sad: [
        { title: "Someone Like You - Adele", videoId: "hLQl3WQQoQ0", thumbnail: "https://i.ytimg.com/vi/hLQl3WQQoQ0/default.jpg" },
        { title: "Fix You - Coldplay", videoId: "k4V3Mo61fJM", thumbnail: "https://i.ytimg.com/vi/k4V3Mo61fJM/default.jpg" },
        { title: "Hurt - Johnny Cash", videoId: "vt1Pwfnh5pc", thumbnail: "https://i.ytimg.com/vi/vt1Pwfnh5pc/default.jpg" }
    ],
    romantic: [
        { title: "All of Me - John Legend", videoId: "450p7goxZqg", thumbnail: "https://i.ytimg.com/vi/450p7goxZqg/default.jpg" },
        { title: "Perfect - Ed Sheeran", videoId: "2Vv-BfVoq4g", thumbnail: "https://i.ytimg.com/vi/2Vv-BfVoq4g/default.jpg" },
        { title: "Thinking Out Loud - Ed Sheeran", videoId: "lp-EO5I60KA", thumbnail: "https://i.ytimg.com/vi/lp-EO5I60KA/default.jpg" }
    ]
};

// Mood search terms for YouTube
const moodSearchTerms = {
    happy: [
        'happy music', 'upbeat songs', 'feel good music', 'positive vibes', 'cheerful music',
        'dance music', 'party songs', 'summer hits', 'pop music', 'feel good playlist'
    ],
    sad: [
        'sad songs', 'emotional music', 'heartbreak songs', 'melancholic music', 'depressing songs',
        'sad piano music', 'emotional ballads', 'breakup songs', 'sad acoustic', 'tearjerker songs'
    ],
    angry: [
        'angry music', 'metal music', 'rock music', 'heavy metal', 'screamo',
        'hard rock', 'punk rock', 'aggressive music', 'intense music', 'powerful songs'
    ],
    relaxed: [
        'relaxing music', 'calm music', 'peaceful music', 'meditation music', 'ambient music',
        'chill music', 'lofi music', 'spa music', 'yoga music', 'nature sounds'
    ],
    romantic: [
        'romantic songs', 'love songs', 'romantic music', 'slow songs', 'romantic ballads',
        'love ballads', 'romantic piano', 'romantic acoustic', 'romantic playlist', 'couple songs'
    ],
    energetic: [
        'energetic music', 'workout music', 'gym music', 'running music', 'high energy music',
        'dance music', 'party music', 'upbeat music', 'motivational music', 'pump up songs'
    ],
    anxious: [
        'calming music', 'meditation music', 'peaceful music', 'relaxing music', 'stress relief music',
        'anxiety relief music', 'soothing music', 'calm piano', 'nature sounds', 'mindfulness music'
    ],
    nostalgic: [
        'nostalgic music', 'old songs', 'classic hits', 'retro music', 'throwback songs',
        'old school music', 'vintage music', 'classic rock', 'oldies but goodies', 'nostalgic playlist'
    ],
    focused: [
        'focus music', 'study music', 'concentration music', 'background music', 'instrumental music',
        'classical music', 'ambient music', 'white noise', 'binaural beats', 'work music'
    ],
    sleepy: [
        'sleep music', 'relaxing music', 'calm music', 'lullaby', 'sleep sounds',
        'bedtime music', 'soothing music', 'peaceful music', 'meditation music', 'nature sounds'
    ]
};

// Add message to chat with typing animation
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    if (!isUser) {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-text typing">${message}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate typing animation
        setTimeout(() => {
            const messageText = messageDiv.querySelector('.message-text');
            messageText.classList.remove('typing');
            messageText.innerHTML = message;
        }, 1000);
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Fetch YouTube videos
async function fetchYouTubeVideos(mood, isAdditionalRequest = false) {
    try {
        const searchTerms = moodSearchTerms[mood];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        
        const response = await fetch(`${YOUTUBE_API_URL}?part=snippet&q=${encodeURIComponent(randomTerm)}&type=video&videoCategoryId=10&maxResults=5&key=${YOUTUBE_API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            return data.items.map(item => ({
                title: item.snippet.title,
                videoId: item.id.videoId,
                thumbnail: item.snippet.thumbnails.default.url
            }));
        }
        return fallbackMusic[mood] || [];
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return fallbackMusic[mood] || [];
    }
}

// Detect mood from text
function detectMoodFromText(text) {
    text = text.toLowerCase();
    let detectedMoods = [];
    
    // First check for negative feelings
    if (text.includes('not feeling well') || 
        text.includes('don\'t feel well') || 
        text.includes('feeling unwell') || 
        text.includes('not good') || 
        text.includes('not okay') || 
        text.includes('not well')) {
        return 'sad';
    }
    
    // Then check for other mood expressions
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            detectedMoods.push(mood);
        }
    }
    
    // If multiple moods detected, prioritize based on context
    if (detectedMoods.length > 1) {
        // Prioritize stronger emotions
        if (detectedMoods.includes('angry')) return 'angry';
        if (detectedMoods.includes('sad')) return 'sad';
        if (detectedMoods.includes('anxious')) return 'anxious';
        return detectedMoods[0];
    }
    
    return detectedMoods.length > 0 ? detectedMoods[0] : null;
}

// Check if it's a request for more songs
function isAdditionalRequest(text) {
    text = text.toLowerCase();
    return additionalRequestKeywords.some(keyword => text.includes(keyword));
}

// Handle mood selection
async function handleMoodSelection(mood, isAdditionalRequest = false) {
    if (!isAdditionalRequest) {
        addMessage(`I'm feeling ${mood}`, true);
    }
    
    setTimeout(() => {
        if (!isAdditionalRequest) {
            addMessage(botResponses[mood]);
        }
        
        addMessage("Searching for the perfect songs... 🎵");
        
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            chatMessages.removeChild(chatMessages.lastChild);
            addMessage("Using our curated playlist for you...");
            showRecommendations(fallbackMusic[mood] || []);
        }, 5000);
        
        fetchYouTubeVideos(mood, isAdditionalRequest).then(recommendations => {
            clearTimeout(timeout);
            chatMessages.removeChild(chatMessages.lastChild);
            showRecommendations(recommendations);
        });
    }, 1000);
}

// YouTube Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: '',
        playerVars: {
            'autoplay': 1,
            'controls': 1
        }
    });
}

// Function to load and play a new video
function playVideo(videoId) {
    if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
        player.unMute(); // Ensure sound plays
    } else {
        console.error("YouTube Player is not initialized properly.");
    }
}

// Show recommendations
function showRecommendations(recommendations) {
    let recommendationsHTML = '<div class="recommendations">';
    recommendations.forEach(song => {
        recommendationsHTML += `
            <div class="song-recommendation">
                <div class="song-thumbnail">
                    <img src="${song.thumbnail}" alt="${song.title}">
                </div>
                <div class="song-info">
                    <span class="song-title">${song.title}</span>
                    <a href="https://www.youtube.com/watch?v=${song.videoId}" target="_blank" class="play-button">
                        <i class="fas fa-play"></i>
                    </a>
                </div>
            </div>
        `;
    });
    recommendationsHTML += '</div>';
    
    addMessage(recommendationsHTML);
}

// Check for conversation
function handleConversation(message) {
    message = message.toLowerCase();
    
    if (conversationResponses.greetings.some(greeting => message.includes(greeting))) {
        setTimeout(() => {
            addMessage(botConversationResponses.greeting);
        }, 1000);
        return true;
    }
    
    if (conversationResponses.howAreYou.some(phrase => message.includes(phrase))) {
        setTimeout(() => {
            addMessage(botConversationResponses.howAreYou);
        }, 1000);
        return true;
    }
    
    if (conversationResponses.thanks.some(phrase => message.includes(phrase))) {
        setTimeout(() => {
            addMessage(botConversationResponses.thanks);
        }, 1000);
        return true;
    }
    
    if (conversationResponses.bye.some(phrase => message.includes(phrase))) {
        setTimeout(() => {
            addMessage(botConversationResponses.bye);
        }, 1000);
        return true;
    }
    
    if (conversationResponses.name.some(phrase => message.includes(phrase))) {
        setTimeout(() => {
            addMessage(botConversationResponses.name);
        }, 1000);
        return true;
    }
    
    if (conversationResponses.help.some(phrase => message.includes(phrase))) {
        setTimeout(() => {
            addMessage(botConversationResponses.help);
        }, 1000);
        return true;
    }
    
    return false;
}

// Handle user input
function handleUserInput() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        // First check for conversation
        if (handleConversation(message)) {
            return;
        }
        
        // Check if it's a request for more songs
        if (isAdditionalRequest(message)) {
            // Get the last mood from the chat history
            const lastMoodMessage = Array.from(chatMessages.children)
                .reverse()
                .find(msg => msg.classList.contains('user') && 
                    Object.keys(moodKeywords).some(mood => msg.textContent.toLowerCase().includes(mood)));
            
            if (lastMoodMessage) {
                const mood = Object.keys(moodKeywords).find(mood => 
                    lastMoodMessage.textContent.toLowerCase().includes(mood));
                if (mood) {
                    handleMoodSelection(mood, true);
                    return;
                }
            }
            
            setTimeout(() => {
                addMessage("I'm not sure what mood you're looking for. Please select a mood or tell me how you're feeling! 😊");
            }, 1000);
            return;
        }
        
        // Detect mood from text
        const detectedMood = detectMoodFromText(message);
        
        if (detectedMood) {
            setTimeout(() => {
                handleMoodSelection(detectedMood);
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("I understand you're not feeling your best. Would you like some calming music to help you feel better? You can also select a mood from the sidebar! 😊");
            }, 1000);
        }
    }
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    toggleThemeButton.innerHTML = `<i class="fas fa-${isDarkMode ? 'sun' : 'moon'}"></i> ${isDarkMode ? 'Light' : 'Dark'} Mode`;
}

// Clear chat
function clearChat() {
    chatMessages.innerHTML = `
        <div class="message bot">
            <div class="message-content">
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-text">
                    <p>Hello! I'm your AI music companion. I can help you find the perfect music for your mood. How are you feeling today?</p>
                    <p>You can either:</p>
                    <ul>
                        <li>Select a mood from the sidebar</li>
                        <li>Type how you're feeling</li>
                        <li>Tell me what kind of music you're in the mood for</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Handle player state changes
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        playNextSong();
    } else if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Handle player error
function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    playNextSong();
}

// Play song
function playSong(song) {
    if (!player) {
        console.error('YouTube player not initialized');
        return;
    }
    
    try {
        console.log('Playing song:', song);
        currentAlbumArt.src = song.thumbnail;
        currentSongTitle.textContent = song.title;
        currentSongArtist.textContent = 'YouTube';
        nowPlaying.classList.add('show');
        
        // First stop any currently playing video
        player.stopVideo();
        
        // Then load and play the new video
        player.loadVideoById(song.videoId);
        player.playVideo();
        
        isPlaying = true;
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    } catch (error) {
        console.error('Error playing song:', error);
    }
}

function pauseSong() {
    if (!player) return;
    player.pauseVideo();
    isPlaying = false;
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
}

function resumeSong() {
    if (!player) return;
    player.playVideo();
    isPlaying = true;
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
}

function playNextSong() {
    if (currentSongIndex < currentPlaylist.length - 1) {
        currentSongIndex++;
        playSong(currentPlaylist[currentSongIndex]);
    }
}

function playPreviousSong() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        playSong(currentPlaylist[currentSongIndex]);
    }
}

// Event Listeners
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mood = button.dataset.mood;
        handleMoodSelection(mood);
    });
});

preferenceButtons.forEach(button => {
    button.addEventListener('click', () => {
        preferenceButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

clearChatButton.addEventListener('click', clearChat);
toggleThemeButton.addEventListener('click', toggleDarkMode);

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Music player event listeners
closeNowPlaying.addEventListener('click', () => {
    nowPlaying.classList.remove('show');
    pauseSong();
});

playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        resumeSong();
    }
});

prevSongButton.addEventListener('click', playPreviousSong);
nextSongButton.addEventListener('click', playNextSong);

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    songProgress.style.width = `${progress}%`;
});

// Initialize voice recognition
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceInputButton.addEventListener('click', () => {
        recognition.start();
        voiceInputButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    });
    
    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        userInput.value = text;
        handleUserInput();
        voiceInputButton.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    recognition.onerror = () => {
        voiceInputButton.innerHTML = '<i class="fas fa-microphone"></i>';
    };
} else {
    voiceInputButton.style.display = 'none';
}

// Initialize mood scanning
moodScanButton.addEventListener('click', () => {
    addMessage("Mood scanning feature coming soon! For now, you can tell me how you're feeling or select a mood from the sidebar. 😊");
});

