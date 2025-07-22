import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Megaphone, Zap, Droplets } from "lucide-react";
import type { MarkerData } from "@/types";
import { cn } from "@/lib/utils";

const eventConfig = {
  event: {
    Icon: Megaphone,
    color: "hsl(var(--chart-2))",
    shadow: "shadow-[0_0_15px_hsla(var(--chart-2),0.8)]",
    className: "fill-chart-2"
  },
  "power-outage": {
    Icon: Zap,
    color: "hsl(var(--chart-4))",
    shadow: "shadow-[0_0_15px_hsla(var(--chart-4),0.8)]",
    className: "fill-chart-4"
  },
  waterlogging: {
    Icon: Droplets,
    color: "hsl(var(--chart-1))",
    shadow: "shadow-[0_0_15px_hsla(var(--chart-1),0.8)]",
    className: "fill-chart-1"
  },
};

type MapMarkerProps = {
  marker: MarkerData;
  onClick: (markerId: string) => void;
  isSelected: boolean;
};

export const MapMarker = ({ marker, onClick, isSelected }: MapMarkerProps) => {
  const { Icon, shadow, className } = eventConfig[marker.type];
  
  return (
    <AdvancedMarker
      position={{ lat: marker.lat, lng: marker.lng }}
      onClick={() => onClick(marker.id)}
      title={marker.description}
    >
      <div
        className={cn(
          "transition-all duration-300 transform-gpu",
          isSelected
            ? 'p-2 rounded-lg bg-background/80 shadow-2xl backdrop-blur-sm'
            : ""
        )}
      >
        <div
          className={cn(
            "w-12 h-12 transition-transform duration-300",
            isSelected
              ? 'scale-110'
              : 'scale-100 hover:scale-105'
          )}
        >
          <svg
            viewBox="0 0 100 125"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("drop-shadow-md", className)}
          >
            <path d="M50 0C27.9 0 10 17.9 10 40c0 22.1 40 60 40 60s40-37.9 40-60C90 17.9 72.1 0 50 0z" />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]">
               <Icon className={cn("w-6 h-6 text-white", isSelected && "mt-[-8px]")} />
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
};
