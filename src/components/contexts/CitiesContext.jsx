import { createContext, useState, useEffect, useContext } from "react";

const URL = "http://localhost:8000/";
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  //console.log("CitiesProvider invoked ...");

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${URL}cities`);
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
      const res = await fetch(`${URL}cities/${id}`);
      const data = await res.json();

      setCurrentCity(data);
    } catch {
      alert("Fetch currenty city failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${URL}cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);

      console.log(data);
    } catch {
      alert("Fetch currenty city failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${URL}cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("Fetch currenty city failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
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
