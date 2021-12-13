import React from 'react';
import DclEditor from "./DclEditor";
import api from "../api";

import classNames from 'classnames/bind';
import styles from '../css/dcl-styles.css';
const cx = classNames.bind(styles);

export default class Dcl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flightplans: {},
      selected_flightplan: null,
      departure_procedures: [],
      arrival_procedures: []
    };
  }

  componentDidMount() {
    const {airport, flightplans} = this.props;
    if (airport) {
      this.getProcedures(airport);
      if (flightplans) {
        const _flightplans = Object.fromEntries(Object.entries(flightplans)
          .filter(([_, fp]) => fp.departure === airport && fp.flight_rules === 'I'));

        this.setState({
          flightplans: _flightplans,
          selected_flightplan: null
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {airport, flightplans} = this.props;

    if (prevProps !== this.props) {
      const _flightplans = Object.fromEntries(Object.entries(flightplans)
        .filter(([_, fp]) => fp.departure === airport && fp.flight_rules === 'I'));
      const selected_flightplan = prevProps.airport === airport ? this.state.selected_flightplan : null;

      this.setState({
        flightplans: _flightplans,
        selected_flightplan: selected_flightplan
      });

      if (prevProps.airport !== airport) {
        this.getProcedures(airport)
      }
    }
  }

  getProcedures = (airport) => {
    api.getProcedures(airport)
      .then(response => response.json())
      .then(procedures => {
        const departure_procedures = procedures ?
          Object.assign({}, ...procedures.filter(p => p.type === 'DP').map((p) => ({[p.procedure]: p})))
          : {};
        const arrivalProcedures = procedures ?
          Object.assign({}, ...procedures.filter(p => p.type === 'STAR').map((p) => ({[p.procedure]: p})))
          : {};
        this.setState({
          departure_procedures: departure_procedures,
          arrivalProcedures: arrivalProcedures
        })
      });
  }

  clearedFlightplan = (fp) => {
    fp.cleared = true;
    this.setState({selected_flightplan: null});
    this.props.updateFlightplan(fp);
  }

  setBeacon = (callsign, beacon) => {
    let fp = this.props.flightplans[callsign];
    if (fp) {
      fp.beacon = beacon;
      this.props.updateFlightplan(fp);
    }
  }

  render() {
    const {airport, pdc_profile} = this.props;
    const {flightplans, selected_flightplan, departure_procedures} = this.state;

    return (<div className={cx("dcl")}>
      <div className={cx("dcl-header")}>
        <div className={cx("tdls-arrow-left")}/>
        DCL
        <div className={cx("tdls-arrow-right")}/>
      </div>
      <div className={cx("dcl-callsign-list")}>
        {airport && Object.entries(flightplans).map(([callsign, fp]) => !fp.cleared && (
          <div key={"dcl-flight-list-" + callsign} className={cx("dcl-callsign-container")}>
            {selected_flightplan && (selected_flightplan.callsign === callsign) ?
              <div className={cx("dcl-callsign-status-active")}> > </div> :
              <div className={cx("dcl-callsign-status")}/>}
            <div className={`${cx("dcl-callsign-container")} ${cx("tdls-dcl-flight")}`}
                 onClick={() => this.setState({selected_flightplan: fp})}
            >
              <div className={cx("dcl-callsign")} style={{color: fp.offline && 'red'}}
                   onMouseDown={(event) => event.button === 1
                     && this.props.removeFlightplan(callsign)}
              >
                {callsign}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={cx("cpdlc-header")}>
        <div className={cx("tdls-arrow-left")}/>
        CPDLC
        <div className={cx("tdls-arrow-right")}/>
      </div>
      <div className={cx("cpdlc-callsign-list")}>
        {Object.entries(flightplans).map(([callsign, fp]) => fp.cleared && (<div className={cx("dcl-callsign-container")}>
            {selected_flightplan && selected_flightplan.callsign === callsign ?
              <div className={cx("dcl-callsign-status-active")}> > </div> :
              <div className={cx("dcl-callsign-status")}/>}
            <div className={`${cx("dcl-callsign-container")} ${cx("tdls-dcl-flight")}`}
                 onClick={() => this.setState({selected_flightplan: fp})}
            >
              <div className={cx("dcl-callsign")}>
                {callsign}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selected_flightplan &&
      <DclEditor
        pdc_profile={pdc_profile}
        active_runways={this.props.active_runways[airport]}
        flightplan={selected_flightplan}
        updateFlightplan={this.updateFlightplan}
        departure_procedures={departure_procedures}
        clearedFlightplan={this.clearedFlightplan}
        setBeacon={this.setBeacon}
      />}
    </div>);
  }
}
