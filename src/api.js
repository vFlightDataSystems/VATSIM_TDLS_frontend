

// const baseurl = 'http://localhost:5000/backend'; // for testing
const baseurl = 'http://tdls.oakartcc.org/backend';

async function getFlightplans() {
  return await fetch(`${baseurl}/flightplan/all`);
}

async function getBeacon(callsign) {
  return await fetch(`${baseurl}/flightplan/beacon/${callsign}`);
}

async function getProcedures(airport) {
  return await fetch(`${baseurl}/navdata/airport/${airport}/procedures`);
}

// async function getAmendments(callsign) {
//   return await fetch(`${baseurl}/flightplan/amendments/callsign/${callsign}`);
// }

async function getAirportInfo(airport) {
  return await fetch(`${baseurl}/navdata/airport/${airport}`);
}

async function getPdcProfiles(facility) {
  return await fetch(`${baseurl}/adaptation/profile/get/${facility}`)
}

async function getAtis(airport) {
  return await fetch(`${baseurl}/weather/atis/vatsim/airport/${airport}`);
}

async function getMetar(airport) {
  return await fetch(`${baseurl}/weather/metar/airport/${airport}`);
}


export default {
  baseurl,
  getFlightplans,
  getBeacon,
  getProcedures,
  getAirportInfo,
  getAtis,
  getMetar,
  getPdcProfiles
};

