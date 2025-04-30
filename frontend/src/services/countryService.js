import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1/name';

export const getCountryByName = async (name) => {
  try {
    const res = await axios.get(`${BASE_URL}/${name}?fullText=true`);
    return res.data[0]; // first match
  } catch (err) {
    console.error("Country not found:", name);
    return null;
  }
};