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
    "likes": "Not specified",
    "dislikes": "Not specified",
    "reactions": "Not specified",
    "comments": [
      "Amazing event for developers! Loved the AI workshops.",
      "Great networking opportunity at BIEC!",
      "Hands-on demos were the highlight!"
    ],
    "location_coordinates": {
      "latitude": 13.0684,
      "longitude": 77.4757
    },
    "address": "Bangalore International Exhibition Centre, 10th Mile, Tumkur Main Road, Madavara Post, Dasanapura, Hobli, Bengaluru, Karnataka 562123, India",
    "source": "X post by @BIECentre, 11:06 2025-07-25 IST"
  },
  {
    "title": "IMTEX Forming 2026",
    "likes": "Not specified",
    "dislikes": "Not specified",
    "reactions": "Not specified",
    "comments": [
      "Exciting to see the latest in metal forming tech!",
      "BIEC is the perfect venue for this massive expo.",
      "Looking forward to connecting with industry leaders."
    ],
    "location_coordinates": {
      "latitude": 13.0684,
      "longitude": 77.4757
    },
    "address": "Bangalore International Exhibition Centre, 10th Mile, Tumkur Main Road, Madavara Post, Dasanapura, Hobli, Bengaluru, Karnataka 562123, India",
    "source": "https://www.imtex.in/"
  },
  {
    "title": "Excon 2025",
    "likes": "Not specified",
    "dislikes": "Not specified",
    "reactions": "Not specified",
    "comments": [
      "Huge showcase of construction equipment!",
      "Great place to explore new tech in the industry.",
      "Well-organized event, but parking needs improvement."
    ],
    "location_coordinates": {
      "latitude": 13.0684,
      "longitude": 77.4757
    },
    "address": "Bangalore International Exhibition Centre, 10th Mile, Tumkur Main Road, Madavara Post, Dasanapura, Hobli, Bengaluru, Karnataka 562123, India",
    "source": "https://www.tradeindia.com/tradeshows/venue/bangalore-international-exhibition-centre/1079/"
  },
  {
    "title": "GrainTech India 2025",
    "likes": "Not specified",
    "dislikes": "Not specified",
    "reactions": "Not specified",
    "comments": [
      "Fantastic platform for grain industry innovations!",
      "Loved the focus on reducing food wastage.",
      `BIECs facilities made the event seamless.`
    ],
    "location_coordinates": {
      "latitude": 13.0684,
      "longitude": 77.4757
    },
    "address": "Bangalore International Exhibition Centre, 10th Mile, Tumkur Main Road, Madavara Post, Dasanapura, Hobli, Bengaluru, Karnataka 562123, India",
    "source": "https://www.tradeindia.com/tradeshows/venue/bangalore-international-exhibition-centre/1079/"
  },
  {
    "title": "DairyTech India 2025",
    "likes": "Not specified",
    "dislikes": "Not specified",
    "reactions": "Not specified",
    "comments": [
      "Incredible display of dairy tech advancements!",
      "Networking with industry experts was invaluable.",
      "Venue was spacious and well-equipped."
    ],
    "location_coordinates": {
      "latitude": 13.0684,
      "longitude": 77.4757
    },
    "address": "Bangalore International Exhibition Centre, 10th Mile, Tumkur Main Road, Madavara Post, Dasanapura, Hobli, Bengaluru, Karnataka 562123, India",
    "source": "https://www.tradeindia.com/tradeshows/venue/bangalore-international-exhibition-centre/1079/"
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
