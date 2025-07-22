import { Incident } from "@/types";

const dummyImages = [
    "https://placehold.co/600x400.png",
    "https://placehold.co/600x400.png",
    "https://placehold.co/600x400.png",
    "https://placehold.co/600x400.png",
    "https://placehold.co/600x400.png",
];

const dummyResponseTemplate: Omit<Incident, 'image_url'>[] = [
    {
        "location_name": "Miryalaguda",
        "latitude": 16.8722,
        "longitude": 79.5626,
        "comments": ["Flooding reported near bus stand.", "Stay safe!"],
        "url": "https://x.com/post/201",
        "title": "Water-logging in Miryalaguda",
        "description": "Heavy rains caused water-logging in Miryalaguda town.",
        "likes_count": 210,
        "dislikes_count": 8,
    },
    {
        "location_name": "Nalgonda",
        "latitude": 17.0544,
        "longitude": 79.2671,
        "comments": ["Fire accident at market area.", "Fire services on site."],
        "url": "https://x.com/post/202",
        "title": "Fire Accident in Nalgonda",
        "description": "A fire broke out in the Nalgonda market area, no casualties reported.",
        "likes_count": 180,
        "dislikes_count": 3,
    },
    {
        "location_name": "Suryapet",
        "latitude": 17.1400,
        "longitude": 79.6200,
        "comments": ["Road blocked due to water-logging.", "Traffic diverted."],
        "url": "https://x.com/post/203",
        "title": "Road Blocked in Suryapet",
        "description": "Water-logging has blocked the main road in Suryapet.",
        "likes_count": 95,
        "dislikes_count": 2,
    }
];

export const fetchIncidents = async (center: google.maps.LatLngLiteral): Promise<Incident[]> => {
    console.log("Fetching incidents near:", center);
    
    // This is a dummy implementation.
    // In a real app, you would make an API call to your backend,
    // passing the center coordinates.
    // e.g., const response = await fetch(`/api/incidents?lat=${center.lat}&lng=${center.lng}`);
    
    return new Promise(resolve => {
        setTimeout(() => {
            const responseWithImages = dummyResponseTemplate.map(incident => ({
                ...incident,
                image_url: dummyImages[Math.floor(Math.random() * dummyImages.length)]
            }));
            resolve(responseWithImages);
        }, 500); // Simulate network delay
    });
};
