import React from 'react';
import { Hospital, Coordinates } from '../types';
import {
  List,
  ListItem,
  Avatar,
  Typography,
  Button,
  Paper,
  Divider,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsIcon from '@mui/icons-material/Directions';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmergencyIcon from '@mui/icons-material/Emergency';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import styled from 'styled-components';
import { getDirectionsUrl } from '../services/hospitalService';

const StyledList = styled(List)`
  padding: 8px;
  width: 100%;
`;

const StyledListItem = styled(ListItem)`
  background: rgba(36, 38, 41, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease-in-out;
  margin-bottom: 12px;
  padding: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    border-color: rgba(127, 90, 240, 0.3);
    background: rgba(36, 38, 41, 0.95);
  }
`;

const HospitalAvatar = styled(Avatar)`
  background: linear-gradient(45deg, #7F5AF0 30%, #9D7BFF 90%);
  margin-right: 16px;
  box-shadow: 0 4px 8px rgba(127, 90, 240, 0.3);
  width: 56px;
  height: 56px;
`;

const HospitalInfoContainer = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;
`;

const HospitalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const HospitalNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const HospitalName = styled(Typography)`
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HospitalDistance = styled(Box)`
  color: #72F2BF;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 8px;
`;

const TimeChip = styled(Chip)`
  background: linear-gradient(45deg, #2CB67D 30%, #72F2BF 90%);
  color: white;
  font-weight: 600;
  margin-bottom: 4px;
  height: 28px;
`;

const DistanceChip = styled(Chip)`
  background: rgba(255, 255, 255, 0.1);
  color: #94A1B2;
  font-size: 12px;
  height: 24px;
`;

const HospitalAddress = styled(Typography)`
  color: #94A1B2;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  width: 100%;
`;

const StyledRating = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  gap: 4px;
`;

const EmergencyChip = styled(Chip)`
  background: linear-gradient(45deg, #FF5470 30%, #FF7EAD 90%);
  color: white;
  font-weight: 600;
  margin-top: 4px;
`;

const VerifiedBadge = styled(VerifiedIcon)`
  color: #14D39A;
  font-size: 18px;
`;

// Change the component name to reflect its new purpose
const GoogleMapsBadge = VerifiedBadge;

interface HospitalListProps {
  hospitals: Hospital[];
  userLocation: Coordinates;
  loading: boolean;
  onSelectHospital: (hospital: Hospital) => void;
  onRadiusChange: (radius: number) => void;
}

// Function to calculate approximate travel time based on distance and traffic conditions
const calculateTravelTime = (distanceKm: number): { minutes: number, trafficCondition: 'light' | 'moderate' | 'heavy' } => {
  // Base calculation - average urban traffic speed 25-30 km/h
  let baseMinutes = Math.round(distanceKm * 2.5); // 2.5 minutes per km (24 km/h)
  
  // Factor in time of day (simplified - would use real-time data in production)
  const hourOfDay = new Date().getHours();
  
  // Rush hour periods
  const isMorningRush = hourOfDay >= 8 && hourOfDay <= 10;
  const isEveningRush = hourOfDay >= 17 && hourOfDay <= 19;
  
  let trafficMultiplier = 1;
  let trafficCondition: 'light' | 'moderate' | 'heavy' = 'moderate';

  if (isMorningRush || isEveningRush) {
    // Heavy traffic during rush hours
    trafficMultiplier = 1.5;
    trafficCondition = 'heavy';
  } else if ((hourOfDay > 10 && hourOfDay < 17) || (hourOfDay > 19 && hourOfDay < 22)) {
    // Moderate traffic during daytime and evening
    trafficMultiplier = 1.2;
    trafficCondition = 'moderate';
  } else {
    // Light traffic during night
    trafficMultiplier = 0.9;
    trafficCondition = 'light';
  }
  
  const minutes = Math.round(baseMinutes * trafficMultiplier);
  
  return { minutes, trafficCondition };
};

const HospitalList: React.FC<HospitalListProps> = ({
  hospitals,
  userLocation,
  loading,
  onSelectHospital,
  onRadiusChange
}) => {
  const handleDirectionsClick = (hospital: Hospital) => {
    const directionsUrl = getDirectionsUrl(
      userLocation, 
      { lat: hospital.latitude, lng: hospital.longitude },
      hospital.name
    );
    window.open(directionsUrl, '_blank');
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : hospitals.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="subtitle1" color="text.secondary">
            No hospitals found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        <StyledList>
          {hospitals.map((hospital) => {
            const travelInfo = hospital.distance 
              ? calculateTravelTime(hospital.distance) 
              : { minutes: 0, trafficCondition: 'moderate' as const };
            
            return (
              <StyledListItem key={hospital.id} onClick={() => onSelectHospital(hospital)}>
                <HospitalAvatar>
                  <LocalHospitalIcon sx={{ fontSize: 32 }} />
                </HospitalAvatar>
                
                <HospitalInfoContainer>
                  <HospitalHeader>
                    <HospitalNameContainer>
                      <HospitalName variant="subtitle1">
                        {hospital.name}
                      </HospitalName>
                      <GoogleMapsBadge titleAccess="Google Maps Navigation" />
                    </HospitalNameContainer>
                    
                    <HospitalDistance>
                      {hospital.distance && (
                        <>
                          <TimeChip
                            icon={<AccessTimeIcon fontSize="small" />}
                            label={`${travelInfo.minutes} min`}
                            size="small"
                          />
                          <DistanceChip
                            icon={<DirectionsCarIcon fontSize="small" />}
                            label={`${hospital.distance.toFixed(1)} km`}
                            size="small"
                          />
                        </>
                      )}
                    </HospitalDistance>
                  </HospitalHeader>
                  
                  <HospitalAddress variant="body2">
                    {hospital.address}
                  </HospitalAddress>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {hospital.rating && (
                      <StyledRating>
                        <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />
                        <Typography variant="body2" fontWeight="500">{hospital.rating}</Typography>
                      </StyledRating>
                    )}
                    
                    {hospital.emergencyServices && (
                      <EmergencyChip 
                        icon={<EmergencyIcon fontSize="small" />} 
                        size="small" 
                        label="Emergency" 
                      />
                    )}
                  </Box>
                  
                  <ButtonsContainer>
                    <Button 
                      variant="outlined" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHospital(hospital);
                      }}
                      sx={{ flex: 1, mr: 1 }}
                      size="small"
                    >
                      Details
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectionsClick(hospital);
                      }}
                      color="secondary"
                      sx={{ flex: 1 }}
                      startIcon={<DirectionsIcon />}
                      size="small"
                    >
                      Navigate
                    </Button>
                  </ButtonsContainer>
                </HospitalInfoContainer>
              </StyledListItem>
            );
          })}
        </StyledList>
      )}
    </>
  );
};

export default HospitalList; 