"use client";

import { useState, useRef, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LocationSearch({ onPlaceSelect }: { onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void }) {
  const map = useMap();
  const places = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!places || !map) return;
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());
  }, [places, map]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (!places || !sessionToken || value.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    const service = new places.AutocompleteService();
    service.getPlacePredictions({ input: value, sessionToken, componentRestrictions: { country: 'in'} }, (predictions) => {
      setSuggestions(predictions || []);
    });
  };

  const handleSuggestionClick = (placeId: string) => {
    if (!placesService) return;
    
    placesService.getDetails({ placeId, fields: ['geometry', 'name', 'formatted_address'], sessionToken }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        onPlaceSelect(place);
        setInputValue(place.name || '');
        setSuggestions([]);
      }
    });
    setSessionToken(new places.AutocompleteSessionToken());
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full items-center">
        <div className="relative flex-grow">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
                fill="#4285F4"
              />
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.87-3.13-7-7-7z"
                fill="url(#paint0_linear_1_2)"
              />
              <path d="M12 11.5a2.5 2.5 0 000-5 2.5 2.5 0 000 5z" fill="#EA4335" />
              <path
                d="M12 2c-1.93 0-3.7.77-5.02 2.02l12.04 12.04C19.82 14.9 21 12.1 21 9c0-3.87-3.13-7-7-7z"
                fill="#FBBC05"
              />
              <path
                d="M12 22s7-8.75 7-13c0-1.5-.47-2.89-1.26-4.02L5.22 17.5C6.88 19.95 12 22 12 22z"
                fill="#34A853"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1_2"
                  x1="12"
                  y1="2"
                  x2="12"
                  y2="22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.4" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search for a location..."
            className="pl-9"
          />
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg">
          {suggestions.map(({ place_id, description }) => (
            <button
              key={place_id}
              onClick={() => handleSuggestionClick(place_id)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent"
            >
              {description}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
