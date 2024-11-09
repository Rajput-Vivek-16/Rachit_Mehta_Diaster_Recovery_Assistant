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

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [isInDangerZone, setIsInDangerZone] = useState(false);
  const dangerThreshold = 50; // km
  const redZoneThreshold = 10; // km

  const fetchAlerts = async () => {
    const url = 'https://cors-anywhere.herokuapp.com/https://www.gdacs.org/xml/rss.xml';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');
      const items = xmlDoc.getElementsByTagName('item');

      const alertsData = Array.from(items).slice(0, 5).map(item => ({
        title: item.getElementsByTagName('title')[0]?.textContent || 'No Title',
        description: item.getElementsByTagName('description')[0]?.textContent || 'No Description',
        link: item.getElementsByTagName('link')[0]?.textContent || '#',
        lat: parseFloat(item.getElementsByTagName('georss:point')[0]?.textContent.split(' ')[0]),
        lon: parseFloat(item.getElementsByTagName('georss:point')[0]?.textContent.split(' ')[1]),
      }));

      setAlerts(alertsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching alerts: ", err);
      setError(err);
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const checkDangerZone = () => {
    if (userLocation && alerts.length > 0) {
      let inDanger = false;
      let inRedZone = false;

      alerts.forEach(alert => {
        const distance = calculateDistance(userLocation.lat, userLocation.lon, alert.lat, alert.lon);
        if (distance <= redZoneThreshold) inRedZone = true;
        if (distance <= dangerThreshold) inDanger = true;
      });

      setIsInDangerZone(inRedZone ? 'red' : inDanger ? 'danger' : 'safe');
    }
  };

  useEffect(() => {
    fetchAlerts();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  }, []);

  useEffect(() => {
    checkDangerZone();
  }, [userLocation, alerts]);

  if (loading) return <div className="text-red-500 text-xl font-semibold" role="status" aria-live="polite">Loading...</div>;
  if (error) return <div className="text-red-500 text-xl font-semibold" role="alert" aria-live="assertive">Error: {error.message}</div>;

  return (
    <div className="flex h-screen bg-white text-black overflow-hidden">
      {/* Map Section */}
      <div style={{ width: '35%' }} className="fixed h-full">
        <MapContainer
          center={userLocation || [20, 0]}
          zoom={2}
          style={{ height: '100%' }}
          className="border-r border-gray-300"
          aria-label="Interactive map showing disaster alerts"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {alerts.map((alert, index) => (
            <Marker key={index} position={[alert.lat, alert.lon]} aria-label={`Disaster alert at ${alert.title}`} role="alert">
              <Popup>
                <strong>{alert.title}</strong><br />
                {alert.description}
              </Popup>
            </Marker>
          ))}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lon]} aria-label="Your location">
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>
        {isInDangerZone === 'red' && (
          <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center p-4 font-bold" role="alert" aria-live="assertive">
            Warning: You are in a Red Zone!
          </div>
        )}
      </div>

      {/* Alert Section */}
      <div className="w-2/3 ml-auto h-full flex flex-col justify-between overflow-y-auto p-8">
        <div className="mb-8">
          {isInDangerZone === 'red' ? (
            <div className="text-red-600 text-xl font-semibold mb-4 text-center" role="alert" aria-live="assertive">
              You are in a high-risk zone! Take immediate safety measures.
            </div>
          ) : isInDangerZone === 'danger' ? (
            <div className="text-yellow-600 text-xl font-semibold mb-4 text-center" role="alert" aria-live="assertive">
              Warning: You are near a disaster alert zone.
            </div>
          ) : (
            <div className="text-green-600 text-xl font-semibold mb-4 text-center" role="status">
              You are in a safe area.
            </div>
          )}

          {/* Chatbot Link Alert */}
          <div className="bg-orange-500 text-white text-lg font-semibold p-3 mb-4 rounded-lg" aria-live="polite">
            <a href="/chatbot" className="hover:underline" role="link" tabIndex="0">
              Need assistance? Click here to chat with our disaster response chatbot.
            </a>
          </div>

          <h1 className="text-2xl font-bold mb-4 text-center" tabIndex="0">World Alerts</h1>

          <ul className="list-disc pl-5" role="list">
            {alerts.map((alert, index) => (
              <li key={index} className="my-4">
                <a href={alert.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  <strong>{alert.title}</strong>
                </a>
                <p>{alert.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency Numbers Section (Bottom of the page) */}
        <div className="bg-gray-100 p-4 rounded-lg mt-auto" role="contentinfo">
          <h2 className="text-xl font-bold mb-2">Emergency Numbers</h2>
          <ul className="list-disc pl-5">
            <li>Fire Department: 101</li>
            <li>Police Department: 100</li>
            <li>Ambulance: 102</li>
            <li>Disaster Response: 112</li>
            <li>Local Emergency Services: 123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlertPage;
