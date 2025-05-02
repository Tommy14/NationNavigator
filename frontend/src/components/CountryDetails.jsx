import React, { useState } from 'react';
import Quiz from './Quiz';

const CountryDetails = ({ country }) => {
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    if (!country) return null;

    const {
    flags,
    name,
    population,
    region,
    capital,
    subregion,
    languages,
    currencies,
    } = country;

    const languageList = languages ? Object.values(languages).join(', ') : 'N/A';
    const currencyList = currencies
    ? Object.values(currencies)
        .map(c => `${c.name} (${c.symbol})`)
        .join(', ')
    : 'N/A';

    if (isQuizOpen) {
        return <Quiz country={country} onClose={() => setIsQuizOpen(false)} />;
    }

    return (
        <div className="bg-white/30 backdrop-blur-md border border-white/10 shadow-md rounded-xl p-6 text-white w-full max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-4">
                <img src={flags.svg} alt={`${name.common} flag`} className="w-16 h-12 rounded shadow" />
                <div>
                    <h2 className="text-xl font-bold">{name.common}</h2>
                    <p className="text-sm text-indigo-200">{name.official}</p>
                </div>
            </div>

            <ul className="text-sm space-y-2">
                <li><strong>Region:</strong> {region}</li>
                <li><strong>Subregion:</strong> {subregion || 'N/A'}</li>
                <li><strong>Capital:</strong> {capital?.[0] || 'N/A'}</li>
                <li><strong>Population:</strong> {population.toLocaleString()}</li>
                <li><strong>Languages:</strong> {languageList}</li>
                <li><strong>Currencies:</strong> {currencyList}</li>
            </ul>
            <button
                onClick={() => {
                  const isLoggedIn = localStorage.getItem('accessToken');
                  if (isLoggedIn) {
                    setShowLoginMessage(false);
                    setIsQuizOpen(true);
                  } else {
                    setShowLoginMessage(true);
                  }
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                Start Quiz
            </button>
            {showLoginMessage && (
                <p className="mt-2 text-sm text-red-200">Please login to start the quiz.</p>
            )}
        </div>
    );
};

export default CountryDetails;