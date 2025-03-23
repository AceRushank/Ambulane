import React from 'react';
import { Hospital, Coordinates } from '../types';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton,
  Avatar,
  Chip,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import DirectionsIcon from '@mui/icons-material/Directions';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EmergencyIcon from '@mui/icons-material/Emergency';
import styled from 'styled-components';
import { getDirectionsUrl } from '../services/hospitalService';

const DetailsContainer = styled(Box)`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const HospitalAvatar = styled(Avatar)`
  background: linear-gradient(45deg, #7F5AF0 30%, #9D7BFF 90%);
  width: 56px;
  height: 56px;
  margin-right: 16px;
  box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);
`;

const InfoItem = styled(Box)`
  margin-top: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ActionButton = styled(Button)`
  flex: 1;
  margin-top: 16px;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const DetailCard = styled(Paper)`
  padding: 16px;
  margin-top: 16px;
  border-radius: 16px;
  background: #242629;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const EmergencyChip = styled(Chip)`
  background: linear-gradient(45deg, #FF5470 30%, #FF7EAD 90%);
  color: white;
  font-weight: 600;
  margin-right: 8px;
`;

const PhoneChip = styled(Chip)`
  background: linear-gradient(45deg, #2CB67D 30%, #72F2BF 90%);
  color: white;
  font-weight: 600;
`;

interface HospitalDetailsProps {
  hospital: Hospital;
  userLocation: Coordinates;
  onClose: () => void;
}

const HospitalDetails: React.FC<HospitalDetailsProps> = ({ 
  hospital, 
  userLocation, 
  onClose 
}) => {
  const handleNavigate = () => {
    const directionsUrl = getDirectionsUrl(
      userLocation,
      { lat: hospital.latitude, lng: hospital.longitude },
      hospital.name
    );
    window.open(directionsUrl, '_blank');
  };

  const handleCall = () => {
    if (hospital.phoneNumber) {
      window.open(`tel:${hospital.phoneNumber.replace(/\s/g, '')}`, '_self');
    }
  };

  return (
    <DetailsContainer>
      <HeaderContainer>
        <IconButton 
          onClick={onClose} 
          sx={{ mr: 2, color: '#FFF', background: 'rgba(255, 255, 255, 0.05)', '&:hover': { background: 'rgba(255, 255, 255, 0.1)' } }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">Hospital Details</Typography>
      </HeaderContainer>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <HospitalAvatar>
          <LocalHospitalIcon fontSize="large" />
        </HospitalAvatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {hospital.name}
          </Typography>
          {hospital.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <StarIcon sx={{ color: '#FFD700', fontSize: 18, mr: 0.5 }} />
              <Typography variant="body2" fontWeight="medium">
                {hospital.rating} rating
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      <DetailCard elevation={0}>
        <Typography variant="subtitle1" fontWeight="600" color="primary">
          Location & Distance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {hospital.address}
        </Typography>
        {hospital.distance && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <AccessTimeIcon sx={{ color: '#72F2BF', mr: 1, fontSize: 20 }} />
            <Typography variant="body2" fontWeight="500" color="#72F2BF">
              {Math.round(hospital.distance * 2)} min drive • {hospital.distance.toFixed(1)} km away
            </Typography>
          </Box>
        )}
      </DetailCard>
      
      <DetailCard elevation={0}>
        <Typography variant="subtitle1" fontWeight="600" color="primary">
          Services & Contact
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {hospital.emergencyServices && (
            <EmergencyChip 
              icon={<EmergencyIcon />} 
              label="Emergency Services" 
            />
          )}
          {hospital.phoneNumber && (
            <PhoneChip 
              icon={<LocalPhoneIcon />} 
              label={hospital.phoneNumber} 
              onClick={handleCall}
              clickable
            />
          )}
        </Box>
      </DetailCard>
      
      <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
        {hospital.phoneNumber && (
          <ActionButton 
            variant="outlined" 
            startIcon={<LocalPhoneIcon />}
            onClick={handleCall}
          >
            Call Hospital
          </ActionButton>
        )}
        <ActionButton 
          variant="contained" 
          color="secondary"
          startIcon={<DirectionsIcon />}
          onClick={handleNavigate}
          fullWidth={!hospital.phoneNumber}
        >
          Navigate
        </ActionButton>
      </Box>
    </DetailsContainer>
  );
};

export default HospitalDetails; 