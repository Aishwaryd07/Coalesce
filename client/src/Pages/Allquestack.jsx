import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom';

const backendURL = 'https://coalesce-backend-5uxc.onrender.com';

const Allquestack = () => {
  const { date, roomCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${backendURL}/getAllQuestions/${roomCode}/?date=${date}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestions(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [date, roomCode]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Questions Added By All on {date}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {questions.slice().reverse().map((questionData, index) => (
            <div key={index} className="my-4 border border-gray-200 rounded-md p-4">
              <p className="text-lg font-semibold mb-4">{questionData.question}</p>
              <ul className="space-y-2">
                {questionData.options.filter(option => option.trim() != "").map((option, idx) => (
                  <li key={idx} className="flex items-center">
                    <input type="radio" id={`option_${index}_${idx}`} name={`options_${index}`} className="mr-2" />
                    <label htmlFor={`option_${index}_${idx}`}>{option}</label>
                  </li>
                ))}
              </ul>
              {(!questionData.imageSolution) ? <></> :
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => {
                    const fileInfo = questionData.imageSolution;
                    const pdfBuffer = fileInfo.buffer.data;
                    const blob = new Blob([Uint8Array.from(pdfBuffer)], { type: fileInfo.mimetype });
                    const url = window.URL.createObjectURL(blob);
                    const newWindow = window.open(url, '_blank');
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  View Solution PDF
                </button>
              </div>
              }
            </div>
          ))}
        </div>
      )}

      {/*chat */}
      <ChatRoom />
    </div>
  );
};

export default Allquestack;
