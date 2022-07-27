export const convertAltitudeToFlightLevel = (altitude: string) => {
  let flightLevel = parseInt(altitude, 10);
  flightLevel /= 100;
  return flightLevel.toString().padStart(3, "0");
};
