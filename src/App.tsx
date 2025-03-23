import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import HospitalList from './components/HospitalList';
import HospitalDetails from './components/HospitalDetails';
import { Hospital, Coordinates } from './types';
import { fetchNearbyHospitals, SION_MUMBAI_COORDINATES } from './services/hospitalService';
import { Box, Typography, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalHospital, DirectionsTransit } from '@mui/icons-material';
import theme from './theme';
import styled from 'styled-components';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: linear-gradient(45deg, #7F5AF0 30%, #9D7BFF 90%);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const SidebarContainer = styled.div`
  width: 360px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 100%;
`;

const MapContainer = styled.div`
  flex: 1;
  height: 100%;
`;

function App() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation] = useState<Coordinates>(SION_MUMBAI_COORDINATES);
  const [searchRadius, setSearchRadius] = useState(5000);

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        setLoading(true);
        const data = await fetchNearbyHospitals(userLocation, searchRadius);
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHospitals();
  }, [userLocation, searchRadius]);

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleCloseDetails = () => {
    setSelectedHospital(null);
  };

  const handleRadiusChange = (radius: number) => {
    setSearchRadius(radius);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContainer>
        <Header>
          <Logo>
            <DirectionsTransit style={{ color: '#FFF', fontSize: 28 }} />
            <Typography variant="h6" color="#FFF" fontWeight="bold">
              Ambulance Hospital Finder
            </Typography>
          </Logo>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospital style={{ color: '#FFF', fontSize: 20 }} />
            <Typography variant="subtitle2" color="#FFF">
              Sion, Mumbai
            </Typography>
          </Box>
        </Header>
        
        <ContentContainer>
          <SidebarContainer>
            {selectedHospital ? (
              <HospitalDetails 
                hospital={selectedHospital} 
                userLocation={userLocation}
                onClose={handleCloseDetails}
              />
            ) : (
              <>
                <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                  <Typography variant="subtitle1" color="primary">
                    Hospitals in Sion, Mumbai
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Navigation powered by Google Maps search
                  </Typography>
                </Box>
                <HospitalList 
                  hospitals={hospitals} 
                  userLocation={userLocation}
                  loading={loading}
                  onSelectHospital={handleSelectHospital}
                  onRadiusChange={handleRadiusChange}
                />
              </>
            )}
          </SidebarContainer>
          <MapContainer>
            <MapView 
              userLocation={userLocation}
              hospitals={hospitals}
              selectedHospital={selectedHospital}
              onSelectHospital={handleSelectHospital}
            />
          </MapContainer>
        </ContentContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App; 