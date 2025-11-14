import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const accessKey = "at_RW5X8WKIFN5kv9xftNNQuz4zemX3u";

// Optional custom marker icon fix (Leaflet icon issue in React)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function App() {
  const [ip, setIp] = useState("");
  const [ipData, setIpData] = useState(null);
  const [position, setPosition] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function getIP() {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${accessKey}`
        );

        setIpData(res.data);
        setPosition([res.data.location.lat, res.data.location.lng]);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getIP();
  }, []);

  async function handleFetch(e) {
    e.preventDefault();
    if (!ip.trim()) return;

    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${accessKey}&ipAddress=${ip}`
      );

      setIpData(res.data);
      console.log(res.data);
      setPosition([res.data.location.lat, res.data.location.lng]);

      setIp("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert("Invalid IP address");
    }
  }

  return (
    <>
      <Background>
        <BgPattern />
        <BgMap ipData={ipData} position={position} />
      </Background>
      <Main>
        {isLoading && <Loader />}
        {!isLoading && (
          <>
            <IPSearch ip={ip} setIp={setIp} onSubmit={handleFetch} />
            <IPSearchResult ipData={ipData} />
          </>
        )}
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
function BgPattern() {
  return <img className="bg-image" src="./pattern-bg-desktop.png" />;
}

function BgMap({ ipData, position }) {
  return (
    <>
      {ipData && (
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <ChangeView center={position} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <Marker position={position}>
            <Popup>You are viewing {ipData.location.city} 📍</Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
}

function Background({ children }) {
  return <div>{children}</div>;
}

function IPSearch({ ip, setIp, onSubmit }) {
  return (
    <div>
      <h2>IP Address Tracker</h2>

      <form onSubmit={(e) => onSubmit(e)}>
        <input value={ip} onChange={(e) => setIp(e.target.value)} />
        <button>
          <img src="./icon-arrow.svg" alt="arrow-btn" />
        </button>
      </form>
    </div>
  );
}

function IPSearchResult({ ipData }) {
  return (
    <>
      {ipData && (
        <div className="result-sections">
          <section className="border-div">
            <p>Ip Address</p>
            <p>
              <em>{ipData.ip}</em>
            </p>
          </section>
          <section className="border-div">
            <p>Location</p>
            <p>
              <em>
                {ipData.location.city}, {ipData.location.country}{" "}
                {ipData.location.region}
              </em>
            </p>
          </section>
          <section className="border-div">
            <p>Timezone</p>
            <p>
              {/* <em>UTC:-05:00</em> */}
              <em>UTC: {ipData.location.timezone}</em>
            </p>
          </section>
          <section>
            <p>ISP</p>
            <p>
              <em>{ipData.isp}</em>
            </p>
          </section>
        </div>
      )}
    </>
  );
}

function Main({ children }) {
  return <main>{children}</main>;
}
