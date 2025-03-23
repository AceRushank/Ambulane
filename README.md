# Ambulance Hospital Finder

A React application designed for ambulance drivers to quickly find and navigate to nearby hospitals. The application is initially focused on the Sion, Mumbai area but can be used anywhere.

## Features

- Search for hospitals near your current location or a specified location
- View hospitals on an interactive map with real-time location data
- See detailed information about each hospital including distance and ratings
- Get driving directions to the selected hospital via Google Maps
- Adjust search radius to find more or fewer hospitals
- Mobile-friendly responsive design

## Technology Stack

- React with TypeScript
- Material-UI for the user interface
- Google Maps API for mapping and directions
- Styled-components for custom styling
- Axios for API requests

## Setup Instructions

1. Clone the repository:
```
git clone <repository-url>
cd hospital-finder
```

2. Install the dependencies:
```
npm install
```

3. Create a Google Maps API key:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Directions API
     - Geocoding API
   - Create an API key with appropriate restrictions

4. Update the API key:
   - In `src/App.tsx`, replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key
   - In `src/services/hospitalService.ts`, replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key
   - In `public/index.html`, replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key

5. Start the development server:
```
npm start
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Usage

1. The application will start with Sion, Mumbai as the default location
2. You can use the search box to enter a different location
3. Click the "Current" button to use your current location
4. Adjust the search radius using the slider if needed
5. Click "Find Hospitals" to fetch hospitals in the area
6. The hospitals will be displayed both on the map and in a list
7. Click on a hospital marker or "Select" button to view detailed information
8. Use the "Directions" or "Start Navigation" button to get directions to the selected hospital

## Production Build

To create a production build:

```
npm run build
```

The build files will be in the `build` directory and can be deployed to any static hosting service.

## CORS Issues with Google Places API

Note that the Google Places API does not support CORS for direct client-side requests. In a production environment, you would need to:

1. Create a backend proxy server to handle requests to the Google Places API
2. Update the `fetchNearbyHospitals` function in `hospitalService.ts` to use your proxy endpoint
3. Secure your API keys on the server side 