// src/services/countryService.js

export async function fetchCountryDetails(countryName) {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
      if (!response.ok) {
        throw new Error(`Error fetching ${countryName}: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data[0]; // Assuming you want the first matching result
    } catch (error) {
      console.error("Failed to fetch country data:", error);
      return null;
    }
  }