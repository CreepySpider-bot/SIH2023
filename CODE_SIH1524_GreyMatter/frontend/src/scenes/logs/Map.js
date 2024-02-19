import React, { useRef, useEffect } from 'react';

const Map = ({ lat, lon }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: parseFloat(lat), lng: parseFloat(lon) },
        zoom: 8,
      });

      // Add a marker
      new window.google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lon) },
        map: map,
      });
    }
  }, [lat, lon]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default Map;
