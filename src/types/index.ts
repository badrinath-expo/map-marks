export type EventType = 'event' | 'power-outage' | 'waterlogging';

export type MarkerData = {
  id: string;
  lat: number;
  lng: number;
  type: EventType;
  description: string;
};

export const eventTypes: { value: EventType, label: string }[] = [
  { value: 'event', label: 'Event' },
  { value: 'power-outage', label: 'Power Outage' },
  { value: 'waterlogging', label: 'Waterlogging' },
];

export type Incident = {
  image_url: string;
  location_coordinates: {
    latitude: number;
    longitude: number;
  };
  comments: string[];
  title: string;
  address: string;
  source: string;
  url?: string;
  description?: string;
  likes_count?: number;
  dislikes_count?: number;
};
