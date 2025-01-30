import React from 'react';

const Results = ({ score, totalQuestions, userName, onRestart, questions, userAnswers, questionTimers, timeRemaining }) => {
   const formatTime = (timeInSeconds) => {
       if (timeInSeconds === undefined || isNaN(timeInSeconds)) return "00:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

  const formatText = (text) => {
       if (!text) return null;
       return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };


    const totalTimeTaken = typeof timeRemaining === 'number' ? (20*60) - timeRemaining : 0;


    return (
        <div className="results-container">
            <h2>Quiz Completed!</h2>
            <h2>Summary of Quiz:</h2>

            <h2>{userName}, You scored {score} out of {totalQuestions * 4}</h2>
            <h3>Total Time taken: {formatTime(totalTimeTaken)}</h3>
            <ul className="questions-list">
                {questions.map((question, index) => {
                    const correctAnswer = question.options.find((option)=> option.is_correct === true);
                    const userAnswerOption = userAnswers && question && userAnswers[question.id] ? question.options.find((option) => option.id === userAnswers[question.id]) : null;
                    const solutionText = question.detailed_solution
                        ? formatText(question.detailed_solution.replace(/^(\*\*Explanation:\*\*\s*)/, ''))
                        : null;
                    return (
                        <li key={question.id} className="results-item">
                            <h3>Question {index + 1}: {question.description}</h3>
                            {userAnswerOption && (
                                <p>
                                    Your answer: <span className={correctAnswer?.id === userAnswerOption?.id ? "correct-text" : "wrong-text" }>{userAnswerOption.description}</span>
                                </p>
                            )}
                            <p>Correct Answer:  <span className="correct-answer-box">{correctAnswer?.description}</span></p>
                            <p>Time taken for question: {formatTime(questionTimers?.[question.id])}</p>
                             {solutionText && (
                                 <div className="results-solution-container">
                                     <h2>Solution:</h2>
                                      <p dangerouslySetInnerHTML={{ __html: solutionText }} />
                                 </div>
                           )}
                       </li>
                    )
                })}
            </ul>
              <button onClick={onRestart}>Restart Quiz</button>
        </div>
    );
};

export default Results;