import { createContext, useState, useEffect, useContext } from "react";

const URL = "http://localhost:8000/cities";
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  console.log("CitiesProvider invoked ...");

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${URL}`);
        const data = await res.json();

        setCities(data);
      } catch {
        alert("Fetch cities data failed");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${URL}/${id}`);
      const data = await res.json();

      setCurrentCity(data);
    } catch {
      alert("Fetch currenty city failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("CitiesContext was used outside of CitiesContext provider");

  return context;
}

export { CitiesProvider, useCities };
