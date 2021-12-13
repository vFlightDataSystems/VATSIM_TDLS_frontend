# VATSIM TDLS frontend

Preview available [here](http://tdls.oakartcc.org)

## run the development server

- clone the repository `git clone https://github.com/CaptainTux/VATSIM_TDLS_frontend.git`
- install dependencies `npm install`
- start the server `npm run start`

[React documentation](https://reactjs.org/)

## FDIO command reference

`REJECT, INVALID COMMAND`: the command entered is invalid

### flightplan readout

syntax: `FR <callsign>`  
responses:
- `ACCEPT`: the flightplan is printed on the bottom row
- `REJECT, FLIGHTPLAN NOT STORED`: no flightplan was found for the given callsign

# TODO list

- add more functionality to FDIO