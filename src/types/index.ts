export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  rating?: number;
  emergencyServices?: boolean;
  distance?: number; // in kilometers
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GoogleMapsResponse {
  results: GoogleMapsResult[];
  status: string;
}

interface GoogleMapsResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  vicinity: string;
  place_id: string;
  rating?: number;
} 