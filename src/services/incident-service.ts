import { Incident } from "@/types";

const dummyImages = [
    "https://placehold.co/600x400.png?text=Incident+1",
    "https://placehold.co/600x400.png?text=Incident+2",
    "https://placehold.co/600x400.png?text=Incident+3",
    "https://placehold.co/600x400.png?text=Incident+4",
    "https://placehold.co/600x400.png?text=Incident+5",
];

const dummyResponseTemplate: Omit<Incident, 'image_url'>[] = 
    [
        {
          "title": "Google I/O Connect 2025",
          "likes_count": 150,
          "dislikes_count": 5,
          "comments": [
            "Amazing event for developers! Loved the AI workshops.",
            "Great networking opportunity at BIEC!",
            "Hands-on demos were the highlight!"
          ],
          "location_coordinates": {
            "latitude": 13.0684,
            "longitude": 77.4757
          },
          "address": "Bangalore International Exhibition Centre, 10th Mile, Tumkur Road, Bengaluru, Karnataka 562123, India",
          "source": "X post by @BIECentre, 11:06 2025-07-25 IST",
           "url": "https://x.com/post/200"
        },
        {
          "title": "IMTEX Forming 2024 Quiz Contest",
          "likes_count": 90,
          "dislikes_count": 2,
          "comments": [
            "Exciting quiz for engineering students!",
            "Looking forward to networking with industry experts.",
            "Hope to win some cool prizes!"
          ],
          "location_coordinates": {
            "latitude": 13.0694,
            "longitude": 77.4767
          },
          "address": "Bangalore International Exhibition Centre, 10th Mile, Tumkur Road, Bengaluru, Karnataka 562123, India",
          "source": "LinkedIn post by Bangalore International Exhibition Centre",
          "url": "https://linkedin.com/post/101"
        },
        {
          "title": "India Mattresstech & Upholstery Supplies Expo (IME) 2024",
          "likes_count": 120,
          "dislikes_count": 10,
          "comments": [
            "Great platform for mattress industry innovations!",
            "Coir-On Foam Products stole the show.",
            "Perfect venue for business networking."
          ],
          "location_coordinates": {
            "latitude": 13.0674,
            "longitude": 77.4747
          },
          "address": "Bangalore International Exhibition Centre, 10th Mile, Tumkur Road, Bengaluru, Karnataka 562123, India",
          "source": "LinkedIn post by Bangalore International Exhibition Centre",
          "url": "https://linkedin.com/post/102"
        },
        {
            "image_url": "https://placehold.co/600x400.png",
            "address": "Miryalaguda",
            "location_coordinates": {
                "latitude": 16.8722,
                "longitude": 79.5626
            },
            "comments": ["Flooding reported near bus stand.", "Stay safe!"],
            "url": "https://x.com/post/201",
            "title": "Water-logging in Miryalaguda",
            "description": "Heavy rains caused water-logging in Miryalaguda town.",
            "likes_count": 210,
            "dislikes_count": 8,
            "source": "Local News"
        },
        {
            "image_url": "https://placehold.co/600x400.png",
            "address": "Nalgonda",
            "location_coordinates": {
                "latitude": 17.0544,
                "longitude": 79.2671
            },
            "comments": ["Fire accident at market area.", "Fire services on site."],
            "url": "https://x.com/post/202",
            "title": "Fire Accident in Nalgonda",
            "description": "A fire broke out in the Nalgonda market area, no casualties reported.",
            "likes_count": 180,
            "dislikes_count": 3,
            "source": "Local News"
        },
        {
            "image_url": "https://placehold.co/600x400.png",
            "address": "Suryapet",
            "location_coordinates": {
                "latitude": 17.1400,
                "longitude": 79.6200
            },
            "comments": ["Road blocked due to water-logging.", "Traffic diverted."],
            "url": "https://x.com/post/203",
            "title": "Road Blocked in Suryapet",
            "description": "Water-logging has blocked the main road in Suryapet.",
            "likes_count": 95,
            "dislikes_count": 2,
            "source": "Local News"
        }
      ]

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
            resolve(responseWithImages as Incident[]);
        }, 500); // Simulate network delay
    });
};
