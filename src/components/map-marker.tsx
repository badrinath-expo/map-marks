import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Megaphone, Zap, Droplets } from "lucide-react";
import type { MarkerData } from "@/types";
import { cn } from "@/lib/utils";

const eventConfig = {
  event: {
    Icon: Megaphone,
    color: "bg-blue-500",
    shadow: "shadow-[0_0_15px_rgba(59,130,246,0.8)]",
  },
  "power-outage": {
    Icon: Zap,
    color: "bg-yellow-500",
    shadow: "shadow-[0_0_15px_rgba(234,179,8,0.8)]",
  },
  waterlogging: {
    Icon: Droplets,
    color: "bg-sky-500",
    shadow: "shadow-[0_0_15px_rgba(14,165,233,0.8)]",
  },
};

type MapMarkerProps = {
  marker: MarkerData;
  onClick: (markerId: string) => void;
  isSelected: boolean;
};

export const MapMarker = ({ marker, onClick, isSelected }: MapMarkerProps) => {
  const { Icon, color, shadow } = eventConfig[marker.type];
  
  return (
    <AdvancedMarker
      position={{ lat: marker.lat, lng: marker.lng }}
      onClick={() => onClick(marker.id)}
      title={marker.description}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform-gpu",
          color,
          isSelected
            ? `scale-125 ${shadow} z-10`
            : "scale-100 hover:scale-110"
        )}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
    </AdvancedMarker>
  );
};
