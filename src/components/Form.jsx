// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "./contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  //console.log("Form: ", mapLat, mapLng);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [travelDate, setTravelDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState(null);
  const { createCity } = useCities();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  const navigate = useNavigate();

  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityData() {
        try {
          setGeocodingError("");
          setIsLoadingGeocoding(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log("Fetch city information: ", data);
          if (!data.countryCode) {
            throw new Error("Invalid location. Please try again");
          }
          setCityName(data.city || data.locality);
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
          console.log(
            "Country code: ",
            data.countryCode,
            "Emoji: ",
            convertToEmoji(data.countryCode)
          );
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !travelDate) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date: travelDate,
      notes,
      position: { lat, lng },
    };
    console.log(newCity);
    createCity(newCity);
  }

  if (isLoadingGeocoding) return <Spinner />;
  else if (geocodingError) return <Message message={geocodingError} />;
  else if (!lat && !lng)
    return <Message message="Click on the map to select a city" />;
  else
    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="cityName">City name</label>
          <input
            id="cityName"
            onChange={(e) => setCityName(e.target.value)}
            value={cityName}
          />
          <span className={styles.flag}>{emoji}</span>
        </div>

        <div className={styles.row}>
          <label htmlFor="travelDate">When did you go to {cityName}?</label>
          {/* <input
            id="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          /> */}
          <DatePicker
            id="travelDate"
            onChange={(travelDate) => setTravelDate(travelDate)}
            selected={travelDate}
            dateFormat="MMM dd yyyy"
          ></DatePicker>
        </div>

        <div className={styles.row}>
          <label htmlFor="notes">Notes about your trip to {cityName}</label>
          <textarea
            id="notes"
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
          />
        </div>

        <div className={styles.buttons}>
          <Button type="primary">Add</Button>
          <BackButton />
        </div>
      </form>
    );
}

export default Form;
