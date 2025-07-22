"use client";

import { useState, useRef, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import mapIcon from './map-icon.png';
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
            <Image src={mapIcon} alt="Map icon" width={20} height={20} />
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
