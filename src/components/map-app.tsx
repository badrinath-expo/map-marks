"use client";

import { useState, useEffect, useCallback } from "react";
import {
  APIProvider,
  Map,
  InfoWindow,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { MarkerData, eventTypes } from "@/types";
import { useUserLocation } from "@/hooks/use-user-location";
import { MapMarker } from "./map-marker";
import { AddMarkerForm } from "./add-marker-form";
import { LocationSearch } from "./location-search";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Megaphone, Zap, Droplets, MapPin, X } from "lucide-react";

const EventIcon = ({ type, className }: { type: MarkerData['type'], className?: string }) => {
  switch (type) {
    case 'event': return <Megaphone className={className} />;
    case 'power-outage': return <Zap className={className} />;
    case 'waterlogging': return <Droplets className={className} />;
    default: return <MapPin className={className} />;
  }
}

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }; // New York City

export function MapApp({ apiKey }: { apiKey: string }) {
  const { location: userLocation } = useUserLocation();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(userLocation || DEFAULT_CENTER);
  const [addingMarker, setAddingMarker] = useState<{ position: google.maps.LatLngLiteral } | null>(null);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.detail.latLng) {
      setAddingMarker({ position: e.detail.latLng });
      setSelectedMarkerId(null);
    }
  };

  const handleSaveMarker = (data: Omit<MarkerData, "id">) => {
    const newMarker: MarkerData = {
      ...data,
      id: new Date().getTime().toString(),
    };
    console.log(`Adding marker at: lat: ${newMarker.lat}, lng: ${newMarker.lng}`);
    setMarkers((prev) => [...prev, newMarker]);
    setAddingMarker(null);
  };

  const handleSelectPlace = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location) {
      setMapCenter(place.geometry.location.toJSON());
    }
  };

  const handleCameraChange = (e: MapCameraChangedEvent) => {
    setMapCenter(e.detail.center);
  };
  
  const handleMarkerDragEnd = (markerId: string, newPosition: google.maps.LatLngLiteral) => {
    setMarkers(prevMarkers => 
      prevMarkers.map(marker => 
        marker.id === markerId ? { ...marker, lat: newPosition.lat, lng: newPosition.lng } : marker
      )
    );
  };

  const selectedMarker = markers.find(m => m.id === selectedMarkerId);

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'geocoding']}>
      <div className="h-screen w-full flex flex-col font-sans">
        <header className="h-16 flex items-center px-6 border-b bg-card z-10 shrink-0">
          <h1 className="text-xl font-bold text-primary">MapMarks</h1>
        </header>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[380px_1fr] overflow-hidden">
          <aside className="bg-card border-r flex flex-col">
            <div className="p-4 space-y-4">
              <LocationSearch onPlaceSelect={handleSelectPlace} />
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              {addingMarker ? (
                <AddMarkerForm
                  position={addingMarker.position}
                  onSave={handleSaveMarker}
                  onCancel={() => setAddingMarker(null)}
                />
              ) : (
                <Card className="border-none shadow-none">
                  <CardHeader>
                    <CardTitle>Incidents</CardTitle>
                    <CardDescription>Click on the map to add a new incident or select one from the list.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {markers.length === 0 ? (
                      <div className="text-center text-muted-foreground py-10">
                        <MapPin className="mx-auto h-12 w-12" />
                        <p className="mt-4">No incidents reported yet.</p>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {markers.map(marker => (
                          <li key={marker.id}>
                            <button
                              onClick={() => {
                                setSelectedMarkerId(marker.id)
                                setMapCenter({lat: marker.lat, lng: marker.lng})
                              }}
                              className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-start gap-3"
                            >
                               <EventIcon type={marker.type} className="h-5 w-5 mt-1 text-primary"/>
                               <div className="flex-1">
                                <p className="font-semibold">{eventTypes.find(et => et.value === marker.type)?.label}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2">{marker.description}</p>
                               </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </aside>
          <main className="bg-background relative">
            <Map
              mapId="a2b4f9b32b3a9e3"
              center={mapCenter}
              zoom={18}
              onClick={handleMapClick}
              onCameraChanged={handleCameraChange}
              gestureHandling="greedy"
              disableDefaultUI={true}
              className="w-full h-full border-none"
            >
              {markers.map((marker) => (
                <MapMarker 
                  key={marker.id} 
                  marker={marker} 
                  onClick={() => setSelectedMarkerId(marker.id)}
                  onDragEnd={handleMarkerDragEnd}
                  isSelected={marker.id === selectedMarkerId}
                />
              ))}
              {selectedMarker && (
                <InfoWindow
                  position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                  onCloseClick={() => setSelectedMarkerId(null)}
                >
                  <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-base mb-1">{eventTypes.find(et => et.value === selectedMarker.type)?.label}</h3>
                    <p className="text-sm text-muted-foreground">{selectedMarker.description}</p>
                  </div>
                </InfoWindow>
              )}
            </Map>
             <div className="absolute bottom-4 right-4">
                <Button onClick={() => setAddingMarker({position: mapCenter})} >Add Incident at Map Center</Button>
            </div>
          </main>
        </div>
      </div>
    </APIProvider>
  );
}
