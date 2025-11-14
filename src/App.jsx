import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const accessKey = "c4544414-2db3-489a-8de2-e39e4acd3bd9";

// Optional custom marker icon fix (Leaflet icon issue in React)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function App() {
  const [ip, setIp] = useState("67.250.186.196");
  const [result, setResult] = useState({});
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(function () {
    async function getIP() {
      const res = await fetch("https://api.ipify.org?format=json");

      const data = await res.json();
      console.log(data.ip);
      setIp(data.ip);

      const response = await fetch(
        `https://apiip.net/api/check?ip=${data.ip}&accessKey=${accessKey}`
      );

      // Decode JSON response:
      const result = await response.json();
      setResult(result);
      setLat(result.latitude);
      setLng(result.longitude);
      // Output the "code" value inside "currency" object
      console.log(result);
    }

    getIP();
  }, []);

  async function handleFetch(e) {
    e.preventDefault();
    // Set endpoint and your access key

    // Make a request and store the response
    const response = await fetch(
      `https://apiip.net/api/check?ip=${ip}&accessKey=${accessKey}`
    );

    // Decode JSON response:
    const result = await response.json();
    // Output the "code" value inside "currency" object
    setResult(result);
    console.log(result);
  }

  return (
    <>
      <Background>
        <BgPattern />
        <BgMap result={result} lat={lat} lng={lng} />
      </Background>
      <Main>
        <IPSearch ip={ip} setIp={setIp} onSubmit={handleFetch} />
        <IPSearchResult result={result} />
      </Main>
    </>
  );
}

function BgPattern() {
  return <img className="bg-image" src="./pattern-bg-desktop.png" />;
}

function BgMap({ result, lat, lng }) {
  const position = [lat, lng];
  // const position = [6.5244, 3.3792];

  return (
    <>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={position}>
          <Popup>You are viewing {result.city} 📍</Popup>
        </Marker>
      </MapContainer>
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

function IPSearchResult({ result }) {
  return (
    <div className="result-sections">
      <section className="border-div">
        <p>Ip Address</p>
        <p>
          <em>{result.ip}</em>
        </p>
      </section>
      <section className="border-div">
        <p>Location</p>
        <p>
          <em>
            {result.regionName}, {result.regionCode} {result.postalCode}
          </em>
        </p>
      </section>
      <section className="border-div">
        <p>Latitude</p>
        <p>
          {/* <em>UTC:-05:00</em> */}
          <em>{result.latitude}</em>
        </p>
      </section>
      <section>
        <p>Longitude</p>
        <p>
          <em>{result.longitude}</em>
        </p>
      </section>
    </div>
  );
}

function Main({ children }) {
  return <main>{children}</main>;
}
