AI Music Mood Recommender
A multimodal, real-time emotion-driven music recommendation system.

🎧 Overview
AI Music Mood Recommender automatically detects a user’s emotional state using facial expressions (OpenCV) and sentiment analysis on text, and then generates personalized music recommendations using the Gemini API.
The goal is simple: create a responsive, intelligent engine that aligns music with emotion to improve the user’s mood and overall emotional well-being.

✨ Key Features
Facial Emotion Detection using OpenCV and a trained deep learning model.
Text Sentiment Analysis to understand the user’s mood from written input.
Real-time Music Recommendations powered by Gemini Web API.
Mood Classification & Mapping to convert emotions into playlist categories.
Fast Response Pipeline with optimized backend logic for smooth user experience.
Clean API Endpoints built with Flask for easy integration with web or mobile frontends.

🧠 How It Works

User inputs text describing their current mood OR
Camera captures face for emotion detection.
The system processes:
Text → sentiment score (positive, neutral, negative)
Face → emotion class (happy, sad, angry, neutral, surprised, etc.)
Mood scores are combined into a unified mood vector.
The backend queries Spotify API to fetch playlists or tracks aligned with that mood.
Suggested music is returned instantly.

🛠 Tech Stack

Backend: Python, Flask
Machine Learning: TensorFlow / Keras, OpenCV
NLP: TextBlob / Vader / Transformers (your choice here)
Music Layer: Spotify Web API
Utilities: NumPy, Pandas, Requests
Front-End (optional): HTML/CSS/JS or React

📂 Project Structure
├── models/
│   └── emotion_model.h5
├── utils/
│   ├── face_detector.py
│   ├── text_sentiment.py
│   └── mood_mapper.py
├── app.py
├── requirements.txt
├── README.md
└── config/
    └── spotify_config.json

🚀 Installation & Setup
1. Clone Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2. Install Dependencies
pip install -r requirements.txt

3. Add Spotify Credentials
Create a file:
config/spotify_config.json
{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "http://localhost:8888/callback"
}

4. Run the App
python app.py

🎯 Model & Dataset
Facial emotion model uses a CNN trained on FER-2013 / custom dataset.
Text sentiment uses traditional NLP or transformer-based scoring.
Mood categories map to Spotify genres (happy → pop, sad → acoustic, relaxed → chill, etc.).

📊 Workflow Diagram
Face/Text Input → Emotion Detection → Mood Vector → Spotify Playlist → Output Music

📌 Use Cases
Personal mood-tracking
Wellness & mental-health apps
AI-based personal music assistants
Emotion-aware smart home systems

🛡 Future Improvements
Add multimodal fusion weighting
Add voice-based emotion detection (optional future feature)
Mobile app integration
Better recommendation personalization using user history

🤝 Contributing
Pull requests are welcome. For major changes, open an issue to discuss your idea.

📜 License
MIT License.
