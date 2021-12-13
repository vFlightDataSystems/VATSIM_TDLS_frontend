import React from 'react';
import TdlsHeader from "./components/TdlsHeader";
import Dcl from "./components/Dcl";
import api from './api';
import {DATIS_AIRPORTS} from './resources/airports';
import Datis from "./components/Datis";
import Fdio from "./components/Fdio";
import RunwayConfigurator from "./components/RunwayConfigurator";
import Clock from "./components/Clock";

import classNames from 'classnames/bind';
import styles from './css/tdls-styles.css';
const cx = classNames.bind(styles);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fp_update_interval_id: null,
      airports: [], // departure airports to display
      completed_callsigns: [],
      config: {}, // for setting runway config etc. eventually
      flightplans: {}, // key is callsign, value is flightplan
      selected_airport: '',
      available_runways: {},
      active_runways: {},
      selected_window: 'fdio',
      pdc_profiles: [],
      selected_pdc_profile: {},
      metar_list: [],
      datis_data: []
    };
  }

  async componentDidMount() {
    await this.refreshFlightplans();
    const fp_update_interval_id = setInterval(this.refreshFlightplans, 15000)
    this.setState({
      fp_update_interval_id: fp_update_interval_id
    });
    // this.setActiveAirport('KBOS');
  }

  componentWillUnmount() {
    const {fp_update_interval_id} = this.state;
    if (fp_update_interval_id) {
      clearInterval(fp_update_interval_id);
    }
  }

  refreshFlightplans = async () => {
    let current_flightplans = this.state.flightplans;
    await api.getFlightplans()
      .then(response => response.json())
      .then(flightplans => {
        flightplans = Object.fromEntries(Object.entries(flightplans).map(([callsign, fp]) => [callsign, {
          ...fp,
          offline: false,
          callsign: callsign
        }]));

        for (let [callsign, fp] of Object.entries(current_flightplans)) {
          if (Object.keys(flightplans).includes(callsign)) {
            flightplans[callsign] = Object.assign(fp, flightplans[callsign]);
          } else {
            fp.offline = true;
            flightplans[callsign] = fp;
          }
        }
        this.setState({flightplans: flightplans});
      })
  }

  setWindow = window_name => this.setState({selected_window: window_name})

  setActiveAirport = async airport => {
    let {active_runways, available_runways} = this.state;
    if (!active_runways[airport]) {
      active_runways[airport] = {landing: [], departing: []};
    }

    api.getAirportInfo(airport)
      .then(response => response.json())
      .then(data => {
        if (data) {
          available_runways[airport] = data.runways;
          this.setState({
            selected_airport: airport,
            active_runways: active_runways,
            available_runways: available_runways
          });
        }
      });
    try {
      api.getPdcProfiles(airport)
        .then(response => response.json())
        .then(data => {
          const profiles = Object.fromEntries(data.map(p => [p.profile_name, p]));
          this.setState({pdc_profiles: profiles, selected_pdc_profile: {}});
        });
    } catch (_) {
      this.setState({pdc_profiles: [], selected_pdc_profile: {}});
    }
    this.setState({selected_airport: airport});
  }

  // addAirport = airport => {
  //   let {airports, active_runways, available_runways} = this.state;
  //   airports.push(airport);
  //   airports = [...new Set(airports)]
  //   active_runways[airport] = {landing: [], departing: []};
  //
  //   api.getAirportInfo(airport)
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data) {
  //         available_runways[airport] = data.runways;
  //         this.setState({
  //           airports: airports,
  //           selected_airport: airport,
  //           active_runways: active_runways,
  //           available_runways: available_runways
  //         });
  //       }
  //     });
  // }

  // removeAirport = airport => {
  //   let {airports, selected_airport} = this.state;
  //
  //   const index = airports.indexOf(airport);
  //   if (index > -1) {
  //     airports.splice(index, 1);
  //   }
  //
  //   if (airport === selected_airport) {
  //     if (airports.length > 0) {
  //       selected_airport = airports[airports.length - 1] // new selected airport will be the last added
  //     } else {
  //       selected_airport = null;
  //     }
  //   }
  //
  //   this.setState({airports: airports, selected_airport: selected_airport});
  // }

  updateActiveRunways = (airport, runways) => {
    let active_runways = this.state.active_runways;
    active_runways[airport] = runways;
    this.setState({active_runways: active_runways});
  }

  updateFlightplan = (fp) => {
    let flightplans = this.state.flightplans;
    flightplans[fp.callsign] = Object.assign(fp, flightplans[fp.callsign]);
    this.setState({flightplans: flightplans});
  }

  getMetar = async (airport) => {
    await api.getMetar(airport)
      .then(response => response.json())
      .then(data => this.setState({metar_list: data}));
  }

  getAtis = async (airport) => {
    await api.getAtis(airport)
      .then(response => response.json())
      .then(data => this.setState({datis_data: data}));
  }

  removeFlightplan = (callsign) => {
    let flightplans = this.state.flightplans;
    delete flightplans[callsign];
    this.setState({flightplans: flightplans});
  }

  render() {
    const {
      pdc_profiles,
      selected_pdc_profile,
      selected_window,
      selected_airport,
      active_runways,
      flightplans,
      available_runways,
      datis_data,
      metar_list
    } = this.state;

    return (
      <div className={cx("tdls")}>
        <TdlsHeader
          selected_window={selected_window}
          pdc_profile_names={Object.keys(pdc_profiles)}
          airports={DATIS_AIRPORTS}
          selected_airport={selected_airport}
          setAirport={this.setActiveAirport}
          setPdcProfile={(profile_name) => this.setState({selected_pdc_profile: pdc_profiles[profile_name]})}
          setWindow={this.setWindow}
        />
        {selected_window === 'fdio' &&
        <Fdio flightplans={flightplans}
          active_runways={active_runways}
        />}
        {selected_window === 'dcl' &&
        <Dcl
          pdc_profile={selected_pdc_profile}
          airport={selected_airport}
          flightplans={flightplans}
          available_runways={available_runways}
          active_runways={active_runways}
          updateFlightplan={this.updateFlightplan}
          removeFlightplan={this.removeFlightplan}
        />}
        {selected_window === 'datis' &&
        <Datis
          airport={selected_airport}
          updateWeather={async (airport) => {
            if (airport) {
              await this.getMetar(airport);
              await this.getAtis(airport);
            }
          }}
          metar_list={metar_list}
          datis_data={datis_data}
        />}
        <div className={cx("tdls-footer")}>
          <div className={cx("options")}>
            {selected_airport && (<RunwayConfigurator
              key={selected_airport}
              available_runways={available_runways[selected_airport]}
              active_runways={active_runways[selected_airport]}
              updateActiveRunways={runways => this.updateActiveRunways(selected_airport, runways)}
            />)}
          </div>
          <div className={cx("time")}>
            <Clock/>
          </div>
        </div>
      </div>
    );
  }
}
