import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Define custom icons for danger and safe areas
const dangerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const safeIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-green.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch disaster alerts from the GDACS API
  const fetchAlerts = async () => {
    const url = 'https://thingproxy.freeboard.io/fetch/https://www.gdacs.org/xml/rss.xml';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');
      const items = xmlDoc.getElementsByTagName('item');

      const alertsData = Array.from(items).map(item => {
        const title = item.getElementsByTagName('title')[0]?.textContent || 'No Title';
        const description = item.getElementsByTagName('description')[0]?.textContent || 'No Description';
        const link = item.getElementsByTagName('link')[0]?.textContent || '#';
        const lat = parseFloat(item.getElementsByTagName('georss:point')[0]?.textContent.split(' ')[0]);
        const lon = parseFloat(item.getElementsByTagName('georss:point')[0]?.textContent.split(' ')[1]);

        // Determine if the area is "danger" or "safe" based on keywords
        const isDanger = /(alert|warning|disaster|high|emergency|severe)/i.test(title + description);

        return {
          title,
          description,
          link,
          lat,
          lon,
          isDanger,
        };
      });

      setAlerts(alertsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching alerts: ", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) return <div className="text-red-500 text-xl font-semibold">Loading...</div>;
  if (error) return <div className="text-red-500 text-xl font-semibold">Error: {error.message}</div>;

  return (
    <div className="text-white bg-gray-900 p-8 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Real-Time Disaster Alerts</h1>
      
      <div className="mb-4 text-lg text-red-400">
        <h2 className="font-semibold">Active Alerts</h2>
        <ul className="list-none p-0 m-4">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <li key={index} className="my-2 p-2 border-b border-red-500">
                <a href={alert.link} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-white">
                  <span className="font-semibold">{alert.title}</span>
                </a>
                <p>{alert.description}</p>
              </li>
            ))
          ) : (
            <p>No active alerts at the moment.</p>
          )}
        </ul>
      </div>

      <div className="mt-4">
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '500px', width: '100%' }} className="rounded-lg shadow-lg border-2 border-red-500">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {alerts.map((alert, index) => (
            <Marker
              key={index}
              position={[alert.lat, alert.lon]}
              icon={alert.isDanger ? dangerIcon : safeIcon}
            >
              <Popup>
                <strong>{alert.title}</strong><br />
                {alert.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AlertPage;
