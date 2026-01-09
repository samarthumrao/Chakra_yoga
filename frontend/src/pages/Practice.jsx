import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Timer, Target } from 'lucide-react';

const Practice = () => {
    const navigate = useNavigate();

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <button
                onClick={() => navigate(-1)}
                className="back-btn"
            >
                <ArrowLeft size={20} /> Back to Track
            </button>

            <div style={{
                textAlign: 'center',
                marginBottom: '30px'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #1e293b 0%, #4ade80 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px',
                    fontWeight: '700'
                }}>
                    Live Practice Session
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Follow the reference pose and hold it when the timer starts
                </p>
            </div>

            <div className="video-container">
                <img
                    src="http://localhost:5000/video_feed"
                    alt="Yoga AI Feed"
                    className="video-feed"
                />
            </div>

            <div className="instructions">
                <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    <Activity size={28} color="#4ade80" />
                    How It Works
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px',
                    marginTop: '30px',
                    textAlign: 'left'
                }}>
                    <div style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                        borderRadius: '16px',
                        border: '2px solid #bae6fd'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <Target size={24} color="white" />
                        </div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#1e293b' }}>
                            1. Align Your Pose
                        </h4>
                        <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                            Match your body position with the reference image shown on the screen
                        </p>
                    </div>

                    <div style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        borderRadius: '16px',
                        border: '2px solid #fcd34d'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #fb923c, #f97316)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <Timer size={24} color="white" />
                        </div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#1e293b' }}>
                            2. Hold the Position
                        </h4>
                        <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                            Once aligned correctly, the timer will start. Hold the pose for the duration
                        </p>
                    </div>

                    <div style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
                        borderRadius: '16px',
                        border: '2px solid #f9a8d4'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <Activity size={24} color="white" />
                        </div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#1e293b' }}>
                            3. Track Your Score
                        </h4>
                        <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                            Watch your accuracy score in real-time and improve your form
                        </p>
                    </div>
                </div>

                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    borderRadius: '12px',
                    border: '2px solid #86efac'
                }}>
                    <p style={{
                        fontSize: '1rem',
                        color: '#166534',
                        margin: 0,
                        fontWeight: '500'
                    }}>
                        💡 <strong>Pro Tip:</strong> Make sure you're in a well-lit area and your full body is visible in the camera frame for best results!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Practice;
