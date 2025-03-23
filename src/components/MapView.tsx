import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { Hospital, Coordinates } from '../types';
import { CircularProgress, Paper, Typography, Box } from '@mui/material';
import styled from 'styled-components';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0',
  overflow: 'hidden'
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 400px;
`;

const StyledPaper = styled(Paper)`
  height: 100%;
  box-shadow: none;
  overflow: hidden;
`;

const InfoWindowContent = styled.div`
  padding: 8px;
  max-width: 220px;
  font-family: 'Inter', sans-serif;
`;

const InfoTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: 4px;
`;

const InfoAddress = styled(Typography)`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const InfoDistance = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  color: #5E38F7;
`;

// Custom map style - more modern and Gen Z friendly
const mapStyles = [
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#444444"}]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{"color": "#f2f2f2"}]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{"saturation": -100}, {"lightness": 45}]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [{"visibility": "simplified"}]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{"color": "#dbf0fd"}, {"visibility": "on"}]
  }
];

interface MapViewProps {
  hospitals: Hospital[];
  userLocation: Coordinates;
  selectedHospital: Hospital | null;
  onSelectHospital: (hospital: Hospital) => void;
}

const MapView: React.FC<MapViewProps> = ({
  hospitals,
  userLocation,
  selectedHospital,
  onSelectHospital
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCAlDpz877t32wuJLlhyeUWbz5djytheOA'
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Hospital | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates>(userLocation);

  // Update map center when user location changes significantly
  useEffect(() => {
    const distanceThreshold = 0.01; // Approximately 1km
    const latDiff = Math.abs(mapCenter.lat - userLocation.lat);
    const lngDiff = Math.abs(mapCenter.lng - userLocation.lng);
    
    if (latDiff > distanceThreshold || lngDiff > distanceThreshold) {
      setMapCenter(userLocation);
    }
  }, [userLocation, mapCenter]);

  // Set selected marker when a hospital is selected
  useEffect(() => {
    if (selectedHospital) {
      setSelectedMarker(selectedHospital);
      if (map) {
        map.panTo({ lat: selectedHospital.latitude, lng: selectedHospital.longitude });
        map.setZoom(15);
      }
    }
  }, [selectedHospital, map]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  React.useEffect(() => {
    if (isLoaded && !directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }
  }, [isLoaded]);

  React.useEffect(() => {
    if (selectedHospital && directionsServiceRef.current && map) {
      directionsServiceRef.current.route(
        {
          origin: { lat: userLocation.lat, lng: userLocation.lng },
          destination: { lat: selectedHospital.latitude, lng: selectedHospital.longitude },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed: ${status}`);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [selectedHospital, userLocation, map]);

  if (!isLoaded) {
    return (
      <StyledPaper>
        <LoadingContainer>
          <CircularProgress color="primary" />
        </LoadingContainer>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy',
          styles: mapStyles
        }}
      >
        {/* User location marker */}
        <Marker
          position={{ lat: userLocation.lat, lng: userLocation.lng }}
          icon={{
            path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z',
            fillColor: '#5E38F7',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 24),
          }}
          title="Your Location"
        />

        {/* Hospital markers */}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={{ lat: hospital.latitude, lng: hospital.longitude }}
            icon={{
              url: selectedHospital?.id === hospital.id 
                ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
                : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
            onClick={() => {
              setSelectedMarker(hospital);
              onSelectHospital(hospital);
            }}
          />
        ))}

        {/* Info window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <InfoWindowContent>
              <InfoTitle variant="subtitle2">
                {selectedMarker.name}
              </InfoTitle>
              <InfoAddress variant="body2">
                {selectedMarker.address}
              </InfoAddress>
              {selectedMarker.distance && (
                <InfoDistance variant="body2">
                  {selectedMarker.distance.toFixed(1)} km • {Math.round(selectedMarker.distance * 2)} min drive
                </InfoDistance>
              )}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 1, 
                py: 0.5, 
                px: 1, 
                borderRadius: '4px',
                backgroundColor: 'rgba(20, 211, 154, 0.1)', 
                color: '#14D39A'
              }}>
                <Typography variant="caption" fontWeight="bold">
                  ✓ Google Maps Navigation
                </Typography>
              </Box>
            </InfoWindowContent>
          </InfoWindow>
        )}

        {/* Directions renderer */}
        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              polylineOptions: {
                strokeColor: '#5E38F7',
                strokeWeight: 5,
                strokeOpacity: 0.7
              }
            }}
          />
        )}
      </GoogleMap>
    </StyledPaper>
  );
};

export default MapView; 