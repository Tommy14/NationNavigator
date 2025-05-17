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

export async function fetchAllCountries() {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/all`);
    if (!response.ok) throw new Error("Error fetching all countries");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch all countries:", error);
    return [];
  }
}

export async function fetchCountryByName(name, fullText = false) {
  try {
    const url = fullText
      ? `https://restcountries.com/v3.1/name/${name}?fullText=true`
      : `https://restcountries.com/v3.1/name/${name}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching ${name}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch country by name:", error);
    return [];
  }
}

export async function fetchCountryByAlphaCode(code) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!response.ok) throw new Error(`Error fetching code: ${code}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch country by alpha code:", error);
    return [];
  }
}

export async function fetchCountriesByRegion(region) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    if (!response.ok) throw new Error(`Error fetching region: ${region}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch countries by region:", error);
    return [];
  }
}

export async function fetchCountryByCapital(capital) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/capital/${capital}`);
    if (!response.ok) throw new Error(`Error fetching capital: ${capital}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch country by capital:", error);
    return [];
  }
}