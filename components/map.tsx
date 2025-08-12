"use client"

import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"

export default function MapSection() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
  const center = { lat: 19.076, lng: 72.8777 }

  return (
    <div className="rounded-lg border">
      <div className="p-4">
        <h2 className="text-base font-semibold">{"Map"}</h2>
        <p className="text-xs text-muted-foreground">{"Explore providers around you."}</p>
      </div>
      <div className="h-64 w-full">
        {!apiKey ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {"Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to display the map."}
          </div>
        ) : !mapId ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground px-4">
            {"Set NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID to enable Advanced Markers (required by Google Maps)."}
          </div>
        ) : (
          <Map
            mapId={mapId}
            defaultCenter={center}
            defaultZoom={12}
            gestureHandling="greedy"
            disableDefaultUI
            style={{ width: "100%", height: "100%" }}
          >
            <AdvancedMarker position={center}>
              <Pin background="#16a34a" borderColor="#065f46" glyphColor="#ffffff" />
            </AdvancedMarker>
          </Map>
        )}
      </div>
    </div>
  )
}
