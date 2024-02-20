import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
//import Sidebar from "./Sidebar";
function Map() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(searchParams);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigate("form");
      }}
    >
      <h1>Map</h1>
      <h1>
        Position: {lat}, {lng}
      </h1>
      <button onClick={() => setSearchParams({ lat: 23, lng: 50 })}></button>
    </div>
  );
}

export default Map;
