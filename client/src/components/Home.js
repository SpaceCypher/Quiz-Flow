import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (userName.trim() === '') {
            alert('Please enter a valid user name.');
            return;
        }
        navigate('/quiz', { state: { userName } });
    };

    return (
        <div className="landing-container">
            <h1>QUIZ</h1>
            <div className="rules-card">
                <h2>Quiz Rules</h2>
                <ul>
                    <li>You will have 20 minutes to complete the quiz.</li>
                    <li>Each correct answer is worth 4 points.</li>
                    <li>There are no negative scores.</li>
                    <li>You must select an option to move to the next question.</li>
                </ul>
                <form onSubmit={handleNameSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Your Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button type="submit">Start Quiz</button>
                </form>
            </div>
        </div>
    );
};

export default Home;