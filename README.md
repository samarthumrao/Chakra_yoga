
# 🧘‍♀️ Chakra Yoga - AI Yoga Trainer

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-00B140?style=for-the-badge&logo=google&logoColor=white)

**Chakra Yoga** is an intelligent AI-powered yoga trainer that helps you perfect your poses from the comfort of your home. Using advanced computer vision and machine learning, it provides real-time feedback on your form, tracks your progress, and guides you through curated yoga sessions.

---

## ✨ Key Features

*   **🤸 Real-Time Pose Detection**: Utilizes MediaPipe and OpenCV to accurately detect body landmarks and analyze your posture in real-time.
*   **🤖 AI Classification**: Features a custom-trained Machine Learning model (SVM) to recognize over 80 different yoga poses.
*   **💯 Live Scoring & Feedback**: Get instant feedback with a scoring system (S, A, B, C, D) based on your pose accuracy.
*   **⏱️ Smart Timer**: Automatically starts a hold timer when you achieve the correct pose alignment.
*   **🥗 Curated Tracks**: Choose from specialized tracks like *Immunity Booster*, *Power Yoga*, *Pregnancy Yoga*, and more.
*   **🖥️ Interactive UI**: A clean and responsive web interface built with React and Vite.

---

## 🛠️ Tech Stack

### Backend
*   **Python**: The core programming language.
*   **Flask**: API server handling video processing and frontend communication.
*   **MediaPipe**: For high-fidelity body pose tracking.
*   **OpenCV**: For image processing and video feed management.
*   **Scikit-learn**: For the pose classification model.

### Frontend
*   **React**: UI library for building the user interface.
*   **Vite**: Fast build tool and development server.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Python 3.8 or higher
*   Node.js & npm
*   Webcam

### 1️⃣ Backend Setup

Navigate to the project root directory:

```bash
cd Chakra_yoga
```

(Optional) Create a virtual environment:

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```
*The backend API will run at `http://localhost:5000`.*

### 2️⃣ Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd Chakra_yoga/frontend
```

Install Node dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```
*The application should now be accessible at `http://localhost:5173` (or the port shown in your terminal).*

---

## 🧘 Available Tracks

Chakra Yoga offers various tracks tailored to your needs:

*   **🌱 Beginners Track**: Start your yoga journey here.
*   **🔥 Power Yoga Track**: Build strength and endurance.
*   **🛡️ Immunity Booster Track**: Boost your immune system.
*   **🤰 Yoga in Pregnancy**: Safe poses for expecting mothers.
*   **❤️ Cardiovascular Yoga**: Improve heart health.
*   **💆 Yoga for Migraine**: Relief from migraines.
*   **🌬️ Yoga for Asthma**: Breathing exercises for better lung health.

---

## 📂 Project Structure

```text
Chakra_yoga/
├── app.py                      # Main Flask application & video processing logic
├── pose_classifier.pkl         # Trained ML model for pose classification
├── requirements.txt            # Python dependencies
├── pose_list.txt               # List of supported poses
├── pose_difficulty_list.txt # Difficulty levels for poses
├── frontend/                   # React frontend source code
│   ├── src/                    # Components and pages
│   ├── public/                 # Static assets
│   └── ...
├── example_poses/              # Reference images for poses
└── ...
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is open-source and available under the information [MIT License](LICENSE).

---

<p align="center">Made with ❤️ and ☕</p>
