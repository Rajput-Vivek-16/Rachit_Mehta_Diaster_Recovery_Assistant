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

const HospitalFinder = () => {
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert to radians
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const fetchNearbyHospitals = async (latitude, longitude) => {
    const radius = 5000; // 5 km radius
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:${radius}, ${latitude}, ${longitude});
        way["amenity"="hospital"](around:${radius}, ${latitude}, ${longitude});
        relation["amenity"="hospital"](around:${radius}, ${latitude}, ${longitude});
      );
      out body;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const hospitalsList = data.elements
        .filter(hospital => hospital.lat && hospital.lon) // Filter out invalid locations
        .map(hospital => ({
          name: hospital.tags?.name || 'Unnamed Hospital',
          latitude: hospital.lat,
          longitude: hospital.lon
        }));
      
      // Calculate distance from user location to each hospital
      const hospitalsWithDistance = hospitalsList.map(hospital => ({
        ...hospital,
        distance: haversineDistance(latitude, longitude, hospital.latitude, hospital.longitude)
      }));

      // Sort hospitals by distance
      hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

      // Get the top 3 nearest hospitals
      setHospitals(hospitalsWithDistance);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchNearbyHospitals(latitude, longitude);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
  }, []);

  // Define the custom user location icon
  const userIcon = L.divIcon({
    className: 'user-location-icon',
    html: '<div style="background-color: red; border-radius: 50%; width: 24px; height: 24px;"></div>', // Red circle
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });

  if (loading) return <div className="flex items-center justify-center h-screen w-screen text-red-500 text-xl font-semibold">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen w-screen text-red-500 text-xl font-semibold">Error: {error.message}</div>;

  return (
    <div className="text-white bg-gray-900 p-8 text-center">
      <h1 className="text-2xl font-bold text-red-500">Nearby Hospitals</h1>
      <ul className="list-none p-0 m-4 text-red-400 text-lg">
        {hospitals.slice(0, 3).map((hospital, index) => (
          <li key={index} className="my-2">
            {hospital.name} - {hospital.distance.toFixed(2)} km
          </li>
        ))}
      </ul>
      {userLocation && (
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={12}
          style={{ height: '500px', width: '100%' }}
          className="rounded-lg shadow-lg border-2 border-red-500"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Add user location marker with custom red icon */}
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
          {/* Add hospital markers */}
          {hospitals.map((hospital, index) => (
            <Marker key={index} position={[hospital.latitude, hospital.longitude]}>
              <Popup>{hospital.name} - {hospital.distance.toFixed(2)} km</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default HospitalFinder;
