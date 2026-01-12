
# 🦜 Kili Jothidam – Tamil AI Fortune Teller (Frontend)

Kili Jothidam is a large-screen–friendly React application that recreates the traditional Tamil parrot astrology experience using modern web technology.

Users enter their name and age.  
The parrot thinks, speaks in Tamil, and delivers a prediction with synced animation and audio.

This repository contains the **frontend only**.

---

## ✨ Features

- Accepts **Tamil and English names**
- Validates age input (1–80)
- Calls backend AI for predictions
- Tamil **Text-to-Speech playback**
- **Lottie parrot animation** synced with speech
- Background song with smart controls:
  - Single click → play / pause
  - Double click → restart song
- Automatically pauses song while the parrot speaks
- Optimized for **large displays** (TV, kiosk, stage screens)

---

## 🧠 Tech Stack

- React (functional components + hooks)
- lottie-react
- Fetch API
- gTTS-based backend (external)
- Inline styles (no CSS framework)

---

## 📂 Project Structure



public/
├─ parrot.json      # Lottie animation
├─ song.mp3         # Background audio
└─ index.html

src/
├─ KiliJothidam.jsx # Main UI + logic
└─ main.jsx / index.jsx



---

## 🔌 Backend API Requirements


`

You can change it here:

js
const TTS_SERVER_URL = "https://your-backend-url";
`

### Required Endpoints

#### 1. Ask Kili (AI Prediction)


POST /ask-kili
Content-Type: application/json

{
  "name": "அபிநந்தன்",
  "age": "21"
}


Response:


{
  "reply": "கிலி கூறுவது..."
}


---

#### 2. Tamil Text-to-Speech


POST /speak
Content-Type: application/json

{
  "text": "கிலி கூறுவது..."
}


Response:

* Audio stream (MP3 or WAV)

---

## ▶️ Running Locally

### 1. Install dependencies

bash
npm install


### 2. Start development server

bash
npm run dev


or (CRA):

bash
npm start


### 3. Open in browser


http://localhost:5173


(or the port shown in terminal)

---

## 🧪 Input Validation Rules

* **Name**

  * Tamil + English letters only
  * Spaces allowed
* **Age**

  * Digits only
  * Maximum: 80
* Submit button disables automatically if input is invalid or loading

---

## 🦜 Interaction Behavior

* Clicking **“kiliyae kiliyae 💚”**

  * Toggles background song
  * Double click restarts song
* When parrot speaks:

  * Song pauses automatically
  * Lottie animation starts
* When speech ends:

  * Animation stops

---

## 🖥️ UI & Display Notes

* Designed for **large screens**
* Side-by-side layout (text + parrot)
* Scales gracefully for tablets and mobiles
* Large Tamil typography for readability
* Scrollbars hidden for clean presentation

---

## 🚫 Not Included in This Repo

* Backend source code
* AI / Groq prompt logic
* Authentication
* Database

Frontend only by design.

---

## 📜 License

Free for educational, demo, and experimental use.
You may modify and extend this project as needed.

---





