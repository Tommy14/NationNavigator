import React, { useEffect, useState } from 'react';
import { getCountryByName } from '../services/countryService';
import { Button, Form, Alert, Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';

const QuizModal = ({ show, onClose, countryName }) => {
  const [country, setCountry] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    if (countryName) {
      getCountryByName(countryName).then(setCountry);
      setAnswers({});
      setSubmitted(false);
      setCorrect(false);
      setStep(0);
    }
  }, [countryName]);

  const handleOptionChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };
  
  const handleRetry = () => {
    setStep(0);
    setAnswers({});
    setSubmitted(false);
    setCorrect(false);
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const checks = [
      answers.capital === country.capital?.[0],
      answers.region === country.region,
      answers.subregion === country.subregion,
      answers.currency === Object.values(country.currencies || {})[0]?.name,
      answers.language === Object.values(country.languages || {})[0],
    ];

    
    
if (checks.every(Boolean)) {
    setCorrect(true);
  
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
  
    try {
      await axios.post(
        `http://localhost:5001/api/users/${user.userId}/badges`,
        { badge: country.cca3 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to save badge:', err);
    }
  }
  };

  const getShuffledOptions = (correct, others = []) => {
    const filtered = others.filter(o => o && o !== correct);
    const uniqueOptions = [...new Set([correct, ...filtered])];
    return uniqueOptions.sort(() => Math.random() - 0.5);
  };

  if (!country) {
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading quiz...</p>
        </Modal.Body>
      </Modal>
    );
  }

  const capitalOptions = getShuffledOptions(country.capital?.[0], ['Colombo', 'Tokyo', 'Ottawa']);
  const regionOptions = getShuffledOptions(country.region, ['Asia', 'Africa', 'Europe', 'Oceania']);
  const subregionOptions = getShuffledOptions(country.subregion, ['Southern Asia', 'Western Europe', 'Caribbean']);
  const currencyOptions = getShuffledOptions(Object.values(country.currencies || {})[0]?.name, ['Dollar', 'Euro', 'Yen']);
  const languageOptions = getShuffledOptions(Object.values(country.languages || {})[0], ['English', 'French', 'Hindi']);

  const questions = [
    {
      key: 'capital',
      label: `🏛️ What is the capital of ${country.name.common}?`,
      options: capitalOptions
    },
    {
      key: 'region',
      label: `🌐 What region is ${country.name.common} in?`,
      options: regionOptions
    },
    {
      key: 'subregion',
      label: `🗺️ What subregion is ${country.name.common} in?`,
      options: subregionOptions
    },
    {
      key: 'currency',
      label: `💰 What is the main currency of ${country.name.common}?`,
      options: currencyOptions
    },
    {
      key: 'language',
      label: `🗣️ What is one major language spoken in ${country.name.common}?`,
      options: languageOptions
    },
  ];

  const currentQuestion = questions[step];

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          <span role="img" aria-label="quiz">🧠</span> Quiz on {country.name.common}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitted && correct && (
          <Alert variant="success">
            🎉 Congratulations! You earned the badge for {country.name.common}!
          </Alert>
        )}
        {submitted && !correct && (
        <>
            <Alert variant="danger">
            ❌ Some answers were incorrect. Try again!
            </Alert>
            <div className="text-center">
            <Button variant="warning" onClick={handleRetry}>
                🔁 Retry Quiz
            </Button>
            </div>
        </>
        )}

        {!submitted && (
          <Form onSubmit={handleSubmit}>
            <Form.Label className="fw-bold">{currentQuestion.label}</Form.Label>
            {currentQuestion.options.map((option) => (
              <Form.Check
                key={option}
                type="radio"
                name={currentQuestion.key}
                value={option}
                label={option}
                checked={answers[currentQuestion.key] === option}
                onChange={handleOptionChange}
                className="mb-2"
              />
            ))}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-light justify-content-between">
        <Button variant="secondary" onClick={onClose}>
          <span role="img" aria-label="close">✖</span> Close
        </Button>

        {!submitted && (
          step < questions.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!answers[currentQuestion.key]}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={!answers[currentQuestion.key]}
            >
              Submit
            </Button>
          )
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default QuizModal;
