import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Home = () => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/tracks')
            .then(res => res.json())
            .then(data => setTracks(data))
            .catch(err => console.error("Failed to fetch tracks", err));
    }, []);

    return (
        <div className="hero-section">
            <div className="hero-image">
                <img
                    src="/poses/57.jpg"
                    alt="Yoga Illustration"
                    onError={(e) => {
                        e.target.src = '/poses/0.jpg';
                    }}
                />
            </div>

            <div className="track-list">
                <h1>
                    Select What You Need
                    <Sparkles
                        size={40}
                        style={{
                            display: 'inline-block',
                            marginLeft: '12px',
                            color: '#4ade80',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}
                    />
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    color: '#64748b',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                }}>
                    Choose a yoga track tailored to your wellness goals and begin your transformative journey today.
                </p>

                {tracks.map((track, index) => (
                    <Link
                        key={track.id}
                        to={`/track/${track.id}`}
                        className="track-btn"
                        style={{
                            animation: `slideInRight 0.6s ease ${index * 0.1}s backwards`
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                    {track.name}
                                </div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    opacity: '0.9',
                                    marginTop: '4px',
                                    fontWeight: '400'
                                }}>
                                    {track.description}
                                </div>
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                opacity: '0.7'
                            }}>
                                →
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
