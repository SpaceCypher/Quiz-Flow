import React from 'react';

const Question = ({ question, selectedOption, onSelect, userAnswer }) => {

   return (
       <div className="question-container">
           <h3>{question.description}</h3>
           <ul className="options-list">
               {question.options.map((option) => (
                   <li
                       key={option.id}
                       className={`option-item ${
                         selectedOption === option.id ? 'selected' : ''
                        } ${
                           selectedOption &&
                           option.id === selectedOption && userAnswer &&
                           userAnswer === option.id ?
                           (option.is_correct ? 'correct-opacity': 'wrong-opacity') :
                           (selectedOption &&
                           selectedOption !== option.id ? 'disabled' : '')
                         }`}

                      onClick={() => {
                         if (!selectedOption) {
                           onSelect(question.id, option.id);
                           }
                      }}
                   >
                     {option.description}
                   </li>
               ))}
           </ul>
        </div>
   );
};

export default Question;