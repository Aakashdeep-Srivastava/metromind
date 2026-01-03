const BENGALURU_CENTER = {
  lat: 12.9716,
  lng: 77.5946,
}

// Google Maps options type (using any since @types/google.maps is a global namespace)
type GoogleMapsOptions = any

export const mapOptions: GoogleMapsOptions = {
  center: BENGALURU_CENTER,
  zoom: 12,
  mapTypeId: "roadmap",
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
}

export const mobileMapOptions: GoogleMapsOptions = {
  ...mapOptions,
  gestureHandling: "greedy",
  zoomControl: false,
  disableDefaultUI: true,
}
