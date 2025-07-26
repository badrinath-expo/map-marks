"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapClickEvent,
} from "@vis.gl/react-google-maps";
import { MarkerData, Incident } from "@/types";
import { useUserLocation } from "@/hooks/use-user-location";
import { MapMarker } from "./map-marker";
import { UserLocationMarker } from "./user-location-marker";
import { LocationSearch } from "./location-search";
import { Button } from "./ui/button";
import { Target, Plus, MessageSquare, MapPin, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { IncidentDetail } from "./incident-detail";
import { fetchIncidents } from "@/services/incident-service";
import { AddMarkerForm } from "./add-marker-form";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { NewMarker } from "./new-marker";
import { cn } from "@/lib/utils";
import { ChatView } from "./chat-view";

const DEFAULT_CENTER = { lat: 17.0544, lng: 79.2671 }; // Nalgonda

export function MapApp({ apiKey }: { apiKey: string }) {
  const { location: userLocation } = useUserLocation();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(userLocation || DEFAULT_CENTER);
  const [zoom, setZoom] = useState(18);
  const { toast } = useToast();
  const lastFetchCenter = useRef<google.maps.LatLngLiteral | null>(null);
  const [newMarkerPosition, setNewMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const haversineDistance = (
    coords1: google.maps.LatLngLiteral,
    coords2: google.maps.LatLngLiteral
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleFetchIncidents = useCallback(async (center: google.maps.LatLngLiteral) => {
    console.log("Fetching incidents for center:", center);
    try {
      const fetchedIncidents = await fetchIncidents(center);
      setIncidents(fetchedIncidents);
      lastFetchCenter.current = center;
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
      toast({
        title: "Error",
        description: "Could not fetch incidents.",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      handleFetchIncidents(userLocation);
    } else {
       handleFetchIncidents(DEFAULT_CENTER);
    }
  }, [userLocation, handleFetchIncidents]);

  const handleSelectPlace = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location) {
      const newCenter = place.geometry.location.toJSON();
      setMapCenter(newCenter);
      setZoom(18);
      handleFetchIncidents(newCenter);
    }
  };

  const handleCameraChange = (e: MapCameraChangedEvent) => {
    const newCenter = e.detail.center;
    setMapCenter(newCenter);
    setZoom(e.detail.zoom);
    
    if (lastFetchCenter.current) {
        const distanceInKm = haversineDistance(lastFetchCenter.current, newCenter);
        if(distanceInKm > 16) { // 10 miles
            handleFetchIncidents(newCenter);
        }
    }
  };

  const handleFocusUserLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(18);
      handleFetchIncidents(userLocation);
      toast({
        title: "Location Centered",
        description: "Map focused on your current location.",
      });
    } else {
      toast({
        title: "Location Unavailable",
        description: "Your current location could not be determined.",
        variant: "destructive",
      });
    }
  };

  const handleMarkerClick = (incidentId: string) => {
    const incident = incidents.find(inc => inc.url === incidentId);
    setSelectedIncident(incident || null);
  }

  const handleMapClick = (e: MapClickEvent) => {
    if (e.detail.latLng) {
      setNewMarkerPosition(e.detail.latLng);
    }
  };

  const handleSaveMarker = (data: Omit<MarkerData, 'id'>) => {
    console.log("Saving new marker:", data);
    const newIncident: Incident = {
      ...data,
      address: "New Custom Incident",
      location_coordinates: {
        latitude: data.lat,
        longitude: data.lng,
      },
      comments: [],
      url: `custom-${Date.now()}`,
      title: data.description.substring(0, 30),
      likes_count: 0,
      dislikes_count: 0,
      image_url: "https://placehold.co/600x400.png",
      source: "User generated"
    };

    setIncidents(prev => [...prev, newIncident]);
    setNewMarkerPosition(null);
    toast({
      title: "Marker Saved",
      description: "Your new incident has been added to the map."
    });
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'geocoding']}>
      <div className="h-screen w-full flex flex-col font-sans">
        <main className="bg-background relative flex-1">
          <div className="absolute top-4 left-4 right-4 z-10">
            <LocationSearch onPlaceSelect={handleSelectPlace} />
          </div>
          <Map
            mapId="a2b4f9b32b3a9e3"
            center={mapCenter}
            zoom={zoom}
            onCameraChanged={handleCameraChange}
            onClick={handleMapClick}
            gestureHandling="greedy"
            disableDefaultUI={true}
            className="w-full h-full border-none"
          >
            {userLocation && <UserLocationMarker position={userLocation} />}
            {incidents.map((incident) => (
              <MapMarker 
                key={incident.url} 
                marker={{
                    id: incident.url!,
                    lat: incident.location_coordinates.latitude,
                    lng: incident.location_coordinates.longitude,
                    type: 'event', // Or derive from incident data
                    description: incident.title,
                }} 
                onClick={() => handleMarkerClick(incident.url!)}
                isSelected={selectedIncident?.url === incident.url}
              />
            ))}
            {newMarkerPosition && <NewMarker position={newMarkerPosition} />}
          </Map>
          <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
                <Button
                    onClick={() => {
                        toast({ title: 'Feature coming soon', description: 'Help will be available soon.' });
                        setIsFabOpen(false);
                    }}
                    size="icon"
                    variant="secondary"
                    className={cn(
                        "rounded-full shadow-lg transition-all duration-300 ease-in-out",
                        isFabOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    )}
                    aria-label="Help"
                    >
                    <HelpCircle className="h-5 w-5" />
                </Button>
                <Button
                    onClick={() => {
                        toast({ title: 'Add Marker', description: 'Click anywhere on the map to add a marker.' });
                        setIsFabOpen(false);
                    }}
                    size="icon"
                    variant="secondary"
                    className={cn(
                        "rounded-full shadow-lg transition-all duration-200 ease-in-out",
                        isFabOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    )}
                    aria-label="Add a marker"
                    >
                    <MapPin className="h-5 w-5" />
                </Button>
                <Button
                    onClick={() => {
                        setIsChatOpen(true);
                        setIsFabOpen(false);
                    }}
                    size="icon"
                    variant="secondary"
                    className={cn(
                        "rounded-full shadow-lg transition-all duration-100 ease-in-out",
                        isFabOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    )}
                    aria-label="Chat"
                    >
                    <MessageSquare className="h-5 w-5" />
                </Button>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
                 <Button onClick={() => setIsFabOpen(!isFabOpen)} size="icon" className="rounded-full shadow-lg" aria-label="More options">
                    <Plus className={cn("h-6 w-6 transition-transform", isFabOpen && "rotate-45")} />
                </Button>
                <Button onClick={handleFocusUserLocation} size="icon" variant="secondary" className="rounded-full shadow-lg" aria-label="Focus on my location">
                    <Target className="h-5 w-5" />
                </Button>
            </div>
          </div>
          <Sheet open={!!selectedIncident} onOpenChange={(open) => !open && setSelectedIncident(null)}>
              <SheetContent side="bottom" className="p-0 border-t-0 h-[75vh]">
                {selectedIncident && <IncidentDetail incident={selectedIncident} onBack={() => setSelectedIncident(null)} />}
              </SheetContent>
          </Sheet>
          <Dialog open={!!newMarkerPosition} onOpenChange={(open) => !open && setNewMarkerPosition(null)}>
            <DialogContent>
                {newMarkerPosition && (
                    <AddMarkerForm 
                        position={newMarkerPosition}
                        onSave={handleSaveMarker}
                        onCancel={() => setNewMarkerPosition(null)}
                    />
                )}
            </DialogContent>
          </Dialog>
          <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            <SheetContent side="bottom" className="h-[85vh] flex flex-col">
              <SheetHeader>
                <SheetTitle>Chat with MapMarks AI</SheetTitle>
              </SheetHeader>
              <ChatView />
            </SheetContent>
          </Sheet>
        </main>
      </div>
    </APIProvider>
  );
}
