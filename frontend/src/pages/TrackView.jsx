import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Star } from 'lucide-react';

const TrackView = () => {
    const { id } = useParams();
    const [poses, setPoses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const trackNames = [
        "Beginners Track",
        "Power Yoga Track",
        "Immunity Booster Track",
        "Yoga in Pregnancy Track",
        "Cardiovascular Yoga Track",
        "Yoga for Migraine Track",
        "Yoga for Asthma Track"
    ];

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:5000/api/start_track/${id}`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setPoses(data.poses);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error("Error starting track", err);
                setLoading(false);
            });
    }, [id]);

    const handlePlay = (index) => {
        fetch(`http://localhost:5000/api/set_pose/${index}`, { method: 'POST' })
            .then(() => navigate('/practice'))
            .catch(err => console.error("Error setting pose", err));
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '4px solid #e0e0e0',
                    borderTop: '4px solid #4ade80',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#64748b' }}>Loading poses...</p>
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.6s ease' }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '50px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                padding: '40px',
                borderRadius: '24px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                }}>
                    <Star size={32} fill="#4ade80" color="#4ade80" />
                    <h2 style={{
                        fontSize: '2.8rem',
                        margin: 0,
                        background: 'linear-gradient(135deg, #1e293b 0%, #4ade80 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '700'
                    }}>
                        {trackNames[id] || 'Yoga Track'}
                    </h2>
                    <Star size={32} fill="#4ade80" color="#4ade80" />
                </div>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#64748b',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Select any asana below to begin your practice session
                </p>
            </div>

            <div className="grid">
                {poses.map((pose, index) => (
                    <div
                        key={pose.id}
                        className="card pose-card"
                        style={{
                            animation: `fadeIn 0.6s ease ${index * 0.1}s backwards`
                        }}
                    >
                        <div className="pose-image-container">
                            <img
                                src={pose.image}
                                alt={pose.name}
                                className="pose-image"
                                onError={(e) => {
                                    e.target.src = '/poses/0.jpg';
                                }}
                            />
                        </div>

                        <h3>{pose.name}</h3>

                        <p>
                            {getPoseDescription(pose.name)}
                        </p>

                        <div
                            className="play-btn"
                            onClick={() => handlePlay(index)}
                            style={{ position: 'relative' }}
                        >
                            <Play size={24} fill="white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper function to provide descriptions
const getPoseDescription = (poseName) => {
    const descriptions = {
        default: "A powerful asana that strengthens your body and calms your mind.",
    };

    if (poseName.toLowerCase().includes('tree')) {
        return "Improves balance and strengthens legs while calming the mind.";
    } else if (poseName.toLowerCase().includes('warrior')) {
        return "Builds strength, stamina, and confidence in your practice.";
    } else if (poseName.toLowerCase().includes('downward') || poseName.toLowerCase().includes('dog')) {
        return "Energizes the body while providing a full-body stretch.";
    } else if (poseName.toLowerCase().includes('child')) {
        return "A restful pose that gently stretches the back and hips.";
    } else if (poseName.toLowerCase().includes('cobra')) {
        return "Strengthens the spine and opens the chest and shoulders.";
    } else if (poseName.toLowerCase().includes('mountain')) {
        return "The foundation of all standing poses, improves posture.";
    } else if (poseName.toLowerCase().includes('triangle')) {
        return "Stretches and strengthens the whole body simultaneously.";
    } else {
        return "Master this pose to enhance flexibility and inner peace.";
    }
};

export default TrackView;
