import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Quiz from './Quiz';
import { FiX } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const CountryDetails = ({ country, onClose }) => {
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);
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

    useEffect(() => {
      const checkFavourite = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token || !country) return;

        try {
          const response = await axios.get(
            `https://nationnavigator.onrender.com/api/users/favourites/${country.cca2}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data?.isFavourite) {
            setIsFavourite(true);
          }
        } catch (error) {
          console.error('Error checking favourite:', error);
        }
      };

      checkFavourite();
    }, [country]);

    const handleToggleFavourite = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setShowLoginMessage(true);
        return;
      }

      try {
        if (isFavourite) {
          await axios.delete(`https://nationnavigator.onrender.com/api/users/favourites/${country.cca2}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsFavourite(false);
        } else {
          await axios.post(
            'https://nationnavigator.onrender.com/api/users/favourites',
            {
              countryName: name.common,
              countryCode: country.cca2,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsFavourite(true);
        }
      } catch (error) {
        console.error('Error toggling favourite:', error);
      }
    };

    if (isQuizOpen) {
        return <Quiz country={country} onClose={() => setIsQuizOpen(false)} />;
    }

    return (
        <div className="relative bg-white/30 backdrop-blur-md border border-white/10 shadow-md rounded-xl p-6 text-white w-full max-w-md mx-auto">
            {/* Close icon */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 text-white hover:text-gray-300"
              aria-label="Close details"
            >
              <FiX size={20} />
            </button>
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
            <div className="mt-4 flex justify-between items-center">
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
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Start Quiz
              </button>
              <button
                onClick={handleToggleFavourite}
                className="px-4 py-2 flex items-center gap-2 rounded bg-yellow-500 hover:bg-yellow-600"
              >
                {isFavourite ? 'Unfavourite' : 'Favourite'}
                <FaHeart className={isFavourite ? 'text-red-500 fill-current' : 'text-white'} />
              </button>
            </div>
            {showLoginMessage && (
                <p className="mt-2 text-sm text-red-200">Please login to start the quiz.</p>
            )}
            <div className="mt-4 flex justify-center">
              <a
                href={`https://en.wikipedia.org/wiki/${name.common.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                More
              </a>
            </div>
        </div>
    );
};

export default CountryDetails;