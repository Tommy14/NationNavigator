import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DisplayBadges = ({ onClose }) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage
        const response = await axios.get(
          `/api/users/${user?.username}/badges`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );

        // Fetch flag data for each country using the Rest Countries API
        const badgesWithFlags = await Promise.all(
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

        setBadges(badgesWithFlags);
      } catch (error) {
        console.error('Error fetching badges:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) fetchBadges();
  }, [user]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 text-black">Your Country Badges</h2> {/* Ensure visible text color */}
        {loading ? (
          <p className="text-center">Loading badges...</p>
        ) : badges.length === 0 ? (
          <p className="text-center text-gray-500">No badges earned yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.cca3} className="flex flex-col items-center">
                <img
                  src={badge.flag} // Display flag image from Rest Countries API
                  alt={badge.cca3}
                  className="w-16 h-12 object-contain"
                />
                <span className="mt-1 text-sm font-medium">{badge.cca3}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayBadges;