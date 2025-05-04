import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const generateQuestions = async (country) => {
  const questions = [];
  const { data: allCountries } = await axios.get('https://restcountries.com/v3.1/all');
  const others = allCountries.filter(c => c.name.common !== country.name.common);

  if (country.capital?.[0]) {
    const capitals = others.map(c => c.capital?.[0]).filter(Boolean);
    const wrongCaps = shuffle(capitals).slice(0, 3);
    questions.push({
      question: `What is the capital of ${country.name.common}?`,
      options: shuffle([country.capital[0], ...wrongCaps]),
      correct: country.capital[0],
    });
  }

  if (country.region) {
    const regions = Array.from(new Set(others.map(c => c.region).filter(Boolean)));
    const wrongRegs = shuffle(regions.filter(r => r !== country.region)).slice(0, 3);
    questions.push({
      question: `Which region does ${country.name.common} belong to?`,
      options: shuffle([country.region, ...wrongRegs]),
      correct: country.region,
    });
  }

  if (country.population) {
    const pops = shuffle(others.map(c => c.population).filter(Boolean))
      .slice(0, 3)
      .map(p => formatPopulation(p));
    questions.push({
      question: `What is the approximate population of ${country.name.common}?`,
      options: shuffle([formatPopulation(country.population), ...pops]),
      correct: formatPopulation(country.population),
    });
  }

  if (country.currencies) {
    const currNames = Array.from(new Set(
      others.flatMap(c =>
        c.currencies ? Object.values(c.currencies).map(cur => cur.name) : []
      )
    ));
    const wrongCurr = shuffle(currNames.filter(name => name !== Object.values(country.currencies)[0].name)).slice(0, 3);
    const correctCurr = Object.values(country.currencies)[0].name;
    questions.push({
      question: `What is the currency of ${country.name.common}?`,
      options: shuffle([correctCurr, ...wrongCurr]),
      correct: correctCurr,
    });
  }

  if (country.flags?.svg) {
    const otherFlags = shuffle(
      others.filter(c => c.flags?.svg)
        .map(c => ({ label: c.name.common, image: c.flags.svg }))
    ).slice(0, 3);
    const options = shuffle([
      { label: country.name.common, image: country.flags.svg },
      ...otherFlags
    ]);
    questions.push({
      question: `Which of the following is the flag of ${country.name.common}?`,
      imageOptions: options,
      correct: country.name.common,
    });
  }

  return questions;
};

const shuffle = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const formatPopulation = (num) => {
  return new Intl.NumberFormat().format(Math.round(num / 1000000) * 1000000);
};

const Quiz = ({ country, onFinish, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const handleEarnBadge = async () => {
    try {
        console.log("User:", user);
      if (!user?.username || !country.cca3) return;
      await axios.post(`http://localhost:9000/api/users/${user.username}/badges`,
        { badge: country.cca3 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log("Badge submitted:", country.cca3);
    } catch (err) {
      console.error("Error awarding badge:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      const q = await generateQuestions(country);
      setQuestions(q);
      setLoading(false);
    };
    if (country) loadQuestions();
  }, [country]);

  const current = questions[currentIndex];

  const handleOptionSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowFeedback(true);

    const updated = [...questions];
    updated[currentIndex] = { ...updated[currentIndex], selected: option };
    setQuestions(updated);

    if (option === current.correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setShowResult(true);
        if (score + 1 === questions.length) {
          handleEarnBadge();
        }
      }
    }, 1500);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setShowFeedback(false);
  };

  if (loading || !country || questions.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="p-6 bg-white/30 backdrop-blur-md border border-white/10 shadow-md text-black dark:text-white shadow-lg rounded-xl max-w-xl w-full relative flex">
        <div className="flex-1 flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-black text-sm"
          >
            ✖
          </button>

          {showResult ? (
            <div className="text-center p-6 rounded-xl">
              {score === questions.length ? (
                <div className="text-center">
                  <img src={country.flags.svg} alt="Badge" className="w-24 h-16 mx-auto mb-2" />
                  <h2 className="text-3xl font-extrabold text-white drop-shadow-lg mb-2">You earned the country flag as a badge!</h2>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                  <p className="text-lg mb-4">Your Score: {score} / {questions.length}</p>
                </>
              )}
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {current.imageOptions && (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-center">{current.question}</h3>
                  <ul className="grid grid-cols-2 gap-4 mb-4">
                    {current.imageOptions.map((opt, idx) => {
                      const isCorrect = opt.label === current.correct;
                      const isWrong = selectedOption?.label === opt.label && !isCorrect;
                      return (
                        <li
                          key={idx}
                          onClick={() => handleOptionSelect(opt.label)}
                          className={`cursor-pointer border rounded p-2 flex items-center justify-center ${
                            selectedOption
                              ? isCorrect
                                ? 'bg-green-100 border-green-500'
                                : isWrong
                                ? 'bg-red-100 border-red-500'
                                : 'opacity-70'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <img src={opt.image} alt={opt.label} className="w-24 h-16 object-cover rounded" />
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
              {current.image && (
                <div className="mb-4 flex justify-center">
                  <img src={current.image} alt="Flag" className="w-32 h-20 object-cover border rounded shadow" />
                </div>
              )}
              {!current.imageOptions && current.options && (
                <>
                  <h3 className="text-lg font-semibold mb-4">{current.question}</h3>
                  <ul className="space-y-3">
                    {current.options.map((option, idx) => {
                      const isCorrect = option === current.correct;
                      const isWrong = selectedOption && option === selectedOption && option !== current.correct;
                      return (
                        <li
                          key={idx}
                          onClick={() => handleOptionSelect(option)}
                          className={`cursor-pointer px-4 py-2 rounded border ${
                            selectedOption
                              ? isCorrect
                                ? 'bg-green-100 border-green-500 text-green-800'
                                : isWrong
                                ? 'bg-red-100 border-red-500 text-red-800'
                                : 'opacity-70'
                              : 'hover:bg-black'
                          }`}
                        >
                          {option}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
        <div className="w-6 flex flex-col items-center justify-center ml-4 space-y-1">
          {questions.map((q, idx) => {
            const isAnswered = typeof q.selected !== 'undefined';
            const isCorrect = isAnswered && q.selected === q.correct;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full ${
                  isAnswered ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300'
                }`}
              ></div>
            );
          })}
          <div className="h-4"></div>
          <div className="text-xs text-gray-700 text-center">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;