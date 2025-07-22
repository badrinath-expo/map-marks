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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.355-11.297-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C44.438,36.338,48,30.668,48,24C48,22.659,47.862,21.35,47.611,20.083z"></path>
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
