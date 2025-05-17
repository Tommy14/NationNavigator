import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DisplayFavourites = ({ onClose }) => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`https://nationnavigator.onrender.com/api/users/favourites`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const favouritesWithFlags = await Promise.all(
          response.data.map(async (cca3) => {
            const flagResponse = await axios.get(
              `https://restcountries.com/v3.1/alpha/${cca3}`
            );
            return {
              cca3,
              flag: flagResponse.data[0]?.flags?.png,
            };
          })
        );

        setFavourites(favouritesWithFlags);
      } catch (error) {
        console.error('Error fetching favourites:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) fetchFavourites();
  }, [user]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/30 backdrop-blur-md border border-white/10 shadow-md p-6 rounded-xl w-full max-w-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 text-white">Your Favourite Countries</h2>
        {loading ? (
          <p className="text-center">Loading favourites...</p>
        ) : favourites.length === 0 ? (
          <p className="text-center text-white">No favourite countries yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {favourites.map((fav) => (
              <div key={fav.cca3} className="flex flex-col items-center">
                <img
                  src={fav.flag}
                  alt={fav.cca3}
                  className="w-16 h-12 object-contain"
                />
                <span className="mt-1 text-sm font-medium">{fav.cca3}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayFavourites;