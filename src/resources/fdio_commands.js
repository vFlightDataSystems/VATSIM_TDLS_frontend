// noinspection SpellCheckingInspection
// commands dict: {commands_str: regex for command syntax}
import api from "../api";

export const commands = {
  AM: /AM\s+\S+\s+\d{1,2}\s+.*/, // amendment
  AS: '', // altimeter setting
  DM: /DM\s+\S+\*?(\s+[X\d]{2}\d\d(\s+\d{3})?)?/, // departure, activate flightplan
  FP: '', // enter flightplan
  FR: /FR\s+\S+/, // request flightplan readout
  GI: /GI .*/, // request general info
  HM: /HM\s+\S+(\s+\S+(\/\d{4})?)?/ , // hold message - init/modify/cancel
  PR: /PR\s+\S+\s+\S+(\/\d{4})?/, // progress report - update status of active flightplan
  RB: /RB\s+\S+/, // restore ARTS database
  RF: /RF\s+\S+\s+\S+/, // request flightplan transfer - transmit flightplan data regardless of status
  RS: /RS\s+\S+/, // remove strip - remove flightplan from computer storage
  RX: /RS\s+\S+/, // ARTS cancellation
  SP: '', // stereo flightplan - enter abbreviated flightplan
  SR: '', // strip request
  TD: '', // test service
  WR: '', // weather request
  WX: ''  // enter weather observation
}

export const fields = [
  'msg_type', // 1 a command
  'aid', // 2 aircraft identification - callsign or discrete beacon code or cid
  'typ', // 3 aircraft type with equipment suffix and weight category (if heavy or super
  'beacon', // 4 beacon code
  'spd', // 5 speed, formats: true airspeed ddd, mach speed Mddd, classified speed SC
  'fix', // 6 departure fix: either 3 char fix, 5 char fix/intersection, lat/lon
  'remarks', // 7 remarks...
  'tim', // 8 utc time associated with field 6: type of time (E/P/D), time (dddd/XXdd)
  'alt', // 9 assigned altitude: (d)dd, OTP, OTP/(d)dd, VFR, VFR/(d)dd, ABV/(d)dd, (d)ddB(d)dd, (d)dd/fix/(d)dd
  'ral', // 10 requested altitude: (d)dd, OTP, OTP/(d)dd, VFR, VFR/(d)dd, ABV/(d)dd, (d)ddB(d)dd, (d)dd/fix/(d)dd
  'rte', // 11 route: fixes or route elements, max 48 char, dp must be second element, star next to last
  'rmk', // 12 remarks
  'field_ref', // 13 field reference: (d)d, LLL
  'loc_id', // 14 location identifier: aa(a)(a)(a)(/)(a)(a)(a)(a)(a)(a)
  'msg_cancel', // 15 message cancellation: CXX
  'output_rte', // 16 output routing: sector id: dd OR adjacent artcc: LLL OR terminal fdio: aaaL(aaa) OR KVDT pos id: Ld
  'amend_correct_data', // 17 amendment/correction data: if field 4 amended, field 17 must contain data meeting field 4 requirements
  'prog_rep_data', // 18 progress report data: fix: aa(a)(a)(a)(/)(a)(a)(a)(a)(a)(a), time: (/dddd)
  'hold_data', // 21 hold data: optional when entering HM: fix / time: dddd / action to cancel: C
  'altimeter_data', // 34 altimeter data: identifies altimeter setting: ddd OR missing indicator: M
  'data_entrance_time', // 35 data entrance time: dddd
  'weather_data'  // 45 weather data: O followed by plain text
]

async function getFlightplan(callsign, active_runways={}) {
  let fp = null;
  await fetch(`${api.baseurl}/flightplan/amendments/callsign/${callsign}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({active_runways: active_runways})
  })
    .then(response => response.json())
    .then(flightplan => {
      fp = flightplan;
    })
    .catch(_ => {});
  return fp;
}

export async function execCommand(input, active_runways={}) {
  const command = input.split(' ');
  let response;
  if (Object.keys(commands).includes(command[0])) {
    switch (command[0]) {
      case 'FR':
        response = await fr(command, active_runways);
        break;
      default:
        this.setState({response: 'REJECT\nNOT IMPLEMENTED'});
    }
  } else {
    response = {response: 'REJECT\nINVALID COMMAND'};
  }
  return response;
}

export async function fr(command, active_runways = {}) {
  const callsign = command[1];
  const fp = await getFlightplan(callsign, active_runways);
  return fp ? {
    content: [
      callsign,
      fp.assigned_transponder,
      fp.departure,
      fp.amendment ? `+${fp.amendment}+` : fp.route,
      fp.aircraft_faa,
      'PXXXX',
      '',
      fp.amendment ? fp.route : '',
      'N/A',
      fp.altitude / 100,
      '',
      ''
    ],
    response: `ACCEPT\n${command.join(' ')}`
  } : {
    response: `REJECT\nFLIGHTPLAN NOT STORED`
  };
}

export function dm(command) {

}

export function hm(command) {

}