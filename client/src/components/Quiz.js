import React, { useState, useEffect, useRef } from 'react';
import Question from './Question';
import Results from './Results';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Quiz = ({ quizFinished: quizFinishedProp }) => {
  // State variables for managing the quiz
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(quizFinishedProp || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(20 * 60);
  const [questionTimers, setQuestionTimers] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState({});
  
  const timerRef = useRef(null); // useRef hook for the timers
  const navigate = useNavigate(); // useNavigate hook for navigation
  const location = useLocation(); // useLocation hook for location

    useEffect(() => {
       // useEffect to check if username is in the location.state, this allows the application to persist this value
      if(userName === undefined){
        navigate('/');
       }
  }, [navigate, userName]);

      useEffect(() => {
         if(location.state){
             setUserName(location.state.userName);
              setNameSubmitted(true);
          }
      },[location.state])

      // useEffect hook to fetch quiz data from API
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/quiz?includeSolutions=true`);
                setQuizData(response.data);
            } catch (err) {
                setError('Failed to load quiz data');
                console.error('Error fetching quiz data:', err);
                if (axios.isAxiosError(err)) {
                    console.error('Axios Error Details:', err.message, err.response?.data);
                } else {
                   console.error("Unexpected error:", err);
                }
           } finally {
                setLoading(false);
            }
        };
       fetchQuizData();
    }, []);

   useEffect(() => {
     // useEffect hook to handle time out
        if (timeRemaining <= 0 && nameSubmitted && !quizFinished) {
           handleSubmitQuiz();
       }
    }, [timeRemaining, nameSubmitted, quizFinished]);


   useEffect(() => {
          // useEffect hook to set the timer for the full quiz

        if (nameSubmitted && !quizFinished) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        }
      return () => clearInterval(timerRef.current);
    }, [nameSubmitted, quizFinished]);


    useEffect(() => {
            // useEffect hook to set the timer for every question

        const interval = setInterval(() => {
           if (nameSubmitted && !quizFinished) {
                setQuestionTimers((prevTimers) => {
                  if (quizData && quizData.questions && quizData.questions[currentQuestionIndex]) {
                     const currentQuestionId = quizData.questions[currentQuestionIndex].id;
                       return {
                          ...prevTimers,
                           [currentQuestionId]: (prevTimers[currentQuestionId] || 0) + 1,
                        };
                     }
                     return prevTimers;
                });
             }
         }, 1000);
       return () => clearInterval(interval);
     },[nameSubmitted, quizFinished, currentQuestionIndex, quizData]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleNameSubmit = (e) => {
             // Function to handle name submission on the landing page

        e.preventDefault();
        if (userName.trim() === '') {
            alert('Please enter a valid user name.');
            return;
        }
        setNameSubmitted(true);
      navigate('/quiz', { state: { userName } });
    };

     // Function to handle options click

    const handleOptionSelect = (questionId, optionId) => {
        if (!questionTimers[questionId]) {
            setQuestionTimers((prevTimers) => ({
                ...prevTimers,
                [questionId]: 0,
            }));
        }
        setSelectedOptions({
            ...selectedOptions,
            [questionId]: optionId,
        });
    };
     // Function to handle the next question logic

   const handleNextQuestion = () => {
      const currentQuestion = quizData?.questions?.[currentQuestionIndex];
      if(currentQuestion && selectedOptions[currentQuestion.id] === undefined){
            alert("Please select an option before proceeding")
            return;
      }
       setUserAnswers({
           ...userAnswers,
           [currentQuestion?.id]: selectedOptions[currentQuestion?.id]
      });
      setCompletedQuestions((prevCompleted) => ({
          ...prevCompleted,
            [currentQuestion.id]: true,
      }));
      setCurrentQuestionIndex(currentQuestionIndex + 1);
   };
    // function to handle submit logic

    const handleSubmitQuiz = () => {
      const currentQuestion = quizData?.questions?.[currentQuestionIndex];
     if(currentQuestion && selectedOptions[currentQuestion.id] !== undefined){
        setUserAnswers({
          ...userAnswers,
            [currentQuestion?.id]: selectedOptions[currentQuestion?.id]
       });
        setCompletedQuestions((prevCompleted) => ({
            ...prevCompleted,
            [currentQuestion.id]: true,
      }));
     }
     let finalScore = 0;
      quizData?.questions?.forEach((question)=>{
            const selectedOption = selectedOptions[question.id];
          const correctAnswer = question.options.find((option)=> option.is_correct === true)
            if(selectedOption && correctAnswer && selectedOption === correctAnswer.id ){
                finalScore += Number(quizData.correct_answer_marks)
         }
     })
       setScore(finalScore);
        setQuizFinished(true)
       navigate('/results', {state : { userName, score, totalQuestions: quizData.questions.length, questions:quizData.questions, userAnswers, questionTimers, timeRemaining }});
    };

       // Function to restart the quiz

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
       setSelectedOptions({});
       setScore(0);
       setQuizFinished(false);
       setUserAnswers({});
       setTimeRemaining(20 * 60);
        setQuestionTimers({});
      setCompletedQuestions({});
       navigate('/quiz', { state: { userName } });
    };


    const isLastQuestion = quizData?.questions && currentQuestionIndex === quizData.questions.length - 1;
    const currentQuestion = quizData?.questions?.[currentQuestionIndex];


    return (
        <>
            <div className="quiz-container">
                {!nameSubmitted ? (
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
                                 <form className="nameForm"onSubmit={handleNameSubmit}>
                                      <input className='nameInput'
                                          type="text"
                                          placeholder="Enter Your Name"
                                        value={userName}
                                          onChange={(e) => setUserName(e.target.value)}
                                      />
                                      <div><button className='subButton' type="submit">Start Quiz</button></div>
                                  </form>
                              </div>
                         </div>
                     ) : !quizFinished ? (
                       <div className="questions-layout">
                            <div className="question-content">
                                 <h2 className="question-number">Question {currentQuestionIndex + 1}</h2>
                                   {currentQuestion && (
                                        <Question
                                          question={currentQuestion}
                                            selectedOption={selectedOptions[currentQuestion.id]}
                                            onSelect={handleOptionSelect}
                                           userAnswer={userAnswers[currentQuestion.id]}
                                        />
                                    )}
                                    {currentQuestion && (
                                        <div className="question-timer">
                                             Time spent on current Question: {questionTimers[currentQuestion.id] ? formatTime(questionTimers[currentQuestion.id]) : "00:00" }
                                        </div>
                                    )}
                                    {!isLastQuestion ? (
                                       <button onClick={handleNextQuestion}>Next Question</button>
                                    ) : (
                                      <button onClick={handleSubmitQuiz}>Submit Quiz</button>
                                    )}
                            </div>

                     </div>
                    ) : (
                      <Results
                          score={score}
                         totalQuestions={quizData.questions.length}
                          userName={userName}
                         onRestart={handleRestartQuiz}
                           questions = {quizData.questions}
                           userAnswers = {userAnswers}
                           questionTimers = {questionTimers}
                           timeRemaining = {timeRemaining}
                       />
                  )}
           </div>
           {nameSubmitted && !quizFinished &&(
               <div className="bottom-container">
                                             <div className="timer-container">
                                 Time Remaining: {formatTime(timeRemaining)}
                          </div>
                    <div className="question-boxes-container">
                       <div className="question-boxes">
                             {quizData?.questions?.map((question, index) => (
                                <div key={question.id} className={`question-box ${completedQuestions[question.id] ? 'completed' : ''}`}>
                                    {index + 1}
                                </div>
                            ))}
                       </div>
                  </div>
                </div>
            )}
       </>
  );
};

export default Quiz;