"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";

type UserLocationMarkerProps = {
  position: google.maps.LatLngLiteral;
};

export const UserLocationMarker = ({ position }: UserLocationMarkerProps) => {
  return (
    <AdvancedMarker position={position} title="Your Location">
      <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md animate-pulse-blue" />
    </AdvancedMarker>
  );
};
