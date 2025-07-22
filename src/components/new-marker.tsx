"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";

type NewMarkerProps = {
  position: google.maps.LatLngLiteral;
};

export const NewMarker = ({ position }: NewMarkerProps) => {
  return (
    <AdvancedMarker position={position} title="New Marker">
      <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-md animate-pulse" />
    </AdvancedMarker>
  );
};
