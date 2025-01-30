import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Quiz from './components/Quiz';
import Home from './components/Home';
import './styles.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/results" element={<Quiz quizFinished={true} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;