import React from 'react';
import api from '../api';
import ReactTooltip from "react-tooltip";

import classNames from 'classnames/bind';
import styles from '../css/dcl-styles.css';
const cx = classNames.bind(styles);

const DEFAULT_PDC_STRING = ` - PRE-DEPARTURE CLEARANCE START - `
  + `<callsign> DEPART <dep> AT <dep-time> - `
  + `FL<cruise-level> - <aircraft>    TRANSPONDER <beacon-code> - `
  + `ROUTE <amendment> <dep> <route> <dest> - `
  + `CLEARED <sid> DEPARTURE <transition> TRSN - `
  + `<climbout> <climbvia> - `
  + `EXPECT FL<cruise-level> <expect-str> - `
  + `DPFRQ <dep-freq> `
  + `- PRE-DEPARTURE CLEARANCE END - `;


export default class DclEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      flightplan: this.props.flightplan,
      cafChecked: false,
      selected_departure: '----',
      selected_transition: '----',
      selected_expect: '----',
      selected_climbout: '',
      selected_climbvia: '----',
      selected_initial_alt: '----',
      selected_local_info: '----',
      selected_contact_info: '----',
      selected_dep_freq: '----',
      amendment: ''
    };

    this.controller = new AbortController();
  }

  componentDidMount() {
    const flightplan = this.props.flightplan;
    if (flightplan) {
      this.getBestRoute(flightplan.callsign);
      if (!flightplan.beacon) {
        this.setBeacon(flightplan.callsign);
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const flightplan = this.props.flightplan;

    if (prevProps.flightplan !== this.props.flightplan
      || prevProps.active_runways !== this.props.active_runways
      || prevProps.pdc_profile !== this.props.pdc_profile
    ) {
      this.controller.abort();
      this.controller = new AbortController();

      this.setState({
        flightplan: flightplan,
        cafChecked: flightplan.caf,
        amendment: flightplan.amendment ? flightplan.amendment : ''
      });
      if (this.props.flightplan.route !== prevProps.flightplan.route
        || prevProps.active_runways !== this.props.active_runways) {
        this.getBestRoute(flightplan.callsign);
      }
      if (!flightplan.beacon) {
        this.setBeacon(flightplan.callsign);
      }
    }
  }

  setBeacon = (callsign) => {
    api.getBeacon(callsign)
      .then(response => response.json())
      .then(data => {
        if (data) {
          this.props.setBeacon(callsign, data.beacon);
        }
      });
  }

  getBestRoute = (callsign) => {
    fetch(`${api.baseurl}/flightplan/amendments/callsign/${callsign}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({active_runways: this.props.active_runways}),
      signal: this.controller.signal
    })
      .then(response => response.json())
      .then(amended_flightplan => {
        if (callsign === this.state.flightplan.callsign) {
          this.setState({
            amendment: amended_flightplan.amendment
          });
        }
      })
      .catch(_ => {
      });
  }

  buildPdcString = () => {
    const {
      flightplan: fp,
      selected_departure,
      selected_transition,
      selected_expect,
      selected_climbout,
      selected_climbvia,
      selected_initial_alt,
      // selected_local_info,
      // selected_contact_info,
      selected_dep_freq,
      amendment
    } = this.state;
    const pdc_string = this.props.pdc_profile.pdc_string ? this.props.pdc_profile.pdc_string : DEFAULT_PDC_STRING;

    return pdc_string
      .replaceAll('<callsign>', fp.callsign)
      .replaceAll('<dep>', fp.departure)
      .replaceAll('<dep-time>', '----')
      .replaceAll('<cruise-level>', fp.altitude / 100)
      .replaceAll('<aircraft>', fp.aircraft_faa)
      .replaceAll('<amendment>', amendment ? '+' + amendment + '+' : '')
      .replaceAll('<route>', fp.route)
      .replaceAll('<dest>', fp.arrival)
      .replaceAll('<beacon-code>', fp.beacon)
      .replaceAll('<sid>', selected_departure)
      .replaceAll('<transition>', selected_transition)
      .replaceAll('<climbout>', selected_climbout)
      .replaceAll('<climbvia>', selected_climbvia ? selected_climbvia :
        selected_initial_alt ? 'MAINTAIN ' + selected_initial_alt : '')
      .replaceAll('<cruise-alt>', fp.altitude)
      .replaceAll('<expect-str>', selected_expect)
      .replaceAll('<dep-freq>', selected_dep_freq);
  }

  copyToClipboard = (text) => {
    let input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    let result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }

  didClear = () => {
    let {flightplan, cafChecked, amendment} = this.state;
    flightplan.caf = cafChecked;
    flightplan.amendment = amendment;
    this.props.clearedFlightplan(flightplan);
  }

  render() {
    const {departure_procedures, pdc_profile} = this.props;
    const {cafChecked, amendment, selected_departure, flightplan: fp} = this.state;

    const amended_route_string = amendment ? `+${amendment}+ ${fp.route}` : fp.route;
    const skyvector_url = fp ? `https://skyvector.com/?fpl=${fp.departure} ${fp.route} ${fp.arrival}` : '';
    const pdc_string = this.buildPdcString();

    return (<div className={cx("dcl-edit")}>
      <div className={cx("dcl-edit-row")}>
        <div className={cx("dcl-edit-col-1")}>
          {fp.callsign}
          <div style={{float: "right"}}>
            {fp.beacon ? fp.beacon : fp.assigned_transponder.toString(8).padStart(4, "0")}
          </div>
        </div>
        <div className={cx("dcl-edit-col-2")}>{fp.departure} {amended_route_string} {fp.arrival}</div>
        <div className={cx("dcl-edit-col-3")}/>
        <div className={cx("dcl-caf")}>
          CAF
          <input type="checkbox" checked={cafChecked} onChange={() => this.setState({cafChecked: !cafChecked})}/>
        </div>
      </div>
      <div className={cx("dcl-edit-row")}/>
      <div className={cx("dcl-edit-row")}>
        <div className={cx("dcl-edit-col-1")}>
          {fp.aircraft_faa}
          <div style={{float: "right"}}>
            P{fp.deptime}
          </div>
        </div>
        <div className={cx("dcl-edit-col-4")}>
          RMK: {fp.remarks.split('RMK').at(-1)}
        </div>
      </div>
      <div className={cx("dcl-edit-row")}>
        <div className={cx("dcl-edit-col-1")}>
          N/A
          <div style={{float: "right"}}>
            {fp.altitude / 100 || "N/A"}
          </div>
        </div>
        <div className={cx("dcl-edit-col-2")}>
          <select className={`${cx("dcl-select")} ${cx('select-expt-crz')}`}
                  onChange={event => this.setState({selected_expect: event.target.value})}
          >
            <option value="----" key="-1">
              - - - -
            </option>
            {pdc_profile.expect_cruise_options && pdc_profile.expect_cruise_options.map(opt =>
              <option value={opt} key={opt}>
                {opt}
              </option>
            )}
          </select>
        </div>
      </div>
      <div className={cx("dcl-edit-row")}>
        <div className={cx("dcl-edit-col-1")}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <select className={`${cx("dcl-select")} ${cx('select-dep')}`}
                    onChange={event => this.setState({selected_departure: event.target.value})}
            >
              <option value="----" key="-1">
                - - - -
              </option>
              {Object.keys(departure_procedures).map(p => <option
                value={p}
                key={p}
              >
                {p}
              </option>)}
            </select>
            <select className={`${cx("dcl-select")} ${cx('select-transition')}`}
                    onChange={event => this.setState({selected_transition: event.target.value})}
            >
              <option value="----" key="-1">
                - - - -
              </option>
              {departure_procedures[selected_departure] &&
              departure_procedures[selected_departure].transitions.map(fix => <option
                value={fix}
                key={fix}
              >
                {fix}
              </option>)}
            </select>
          </div>
        </div>
        <div className={cx("dcl-edit-col-5")}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <select className={`${cx("dcl-select")} ${cx('select-climbout')}`}
                    onChange={event => this.setState({selected_climbout: event.target.value})}
            >
              <option value="----" key="-1">
                - - - -
              </option>
              {pdc_profile.climbout_options && pdc_profile.climbout_options.map(opt =>
                <option value={opt} key={opt}>
                  {opt}
                </option>
              )}
            </select>
            <select className={`${cx("dcl-select")} ${cx('select-climbvia')}`}
                    onChange={event => this.setState({selected_climbvia: event.target.value})}
            >
              <option value="----" key="-1">
                - - - -
              </option>
              {pdc_profile.climbvia_options && pdc_profile.climbvia_options.map(opt =>
                <option value={opt} key={opt}>
                  {opt}
                </option>
              )}
            </select>
            <select className={`${cx("dcl-select")} ${cx('select-initialalt')}`}
                    onChange={event => this.setState({selected_initial_alt: event.target.value})}
            >
              <option value="----" key="-1">
                - - - -
              </option>
              {pdc_profile.initial_altitude_options && pdc_profile.initial_altitude_options.map(opt =>
                <option value={opt} key={opt}>
                  {opt}
                </option>
              )}
            </select>
          </div>
        </div>
      </div>
      <div className={cx("dcl-edit-row")}>
        <select className={`${cx("dcl-select")} ${cx("select-info")}`}>
          <option value="----" key="-1">
            - - - -
          </option>
        </select>
        <div style={{float: "right"}}>DEP FREQ
          <select className={`${cx("dcl-select")} ${cx("select-dep-freq")}`}
                  onChange={event => this.setState({selected_dep_freq: event.target.value})}
          >
            <option value="----" key="-1">
              - - - -
            </option>
            {pdc_profile.dep_freq_options && pdc_profile.dep_freq_options.map(opt =>
              <option value={opt} key={opt}>
                {opt}
              </option>
            )}
          </select>
        </div>
      </div>
      <div className={cx("dcl-edit-row")}>
        <select className={`${cx("dcl-select")} ${cx("select-info")}`}>
          <option value="----" key="-1">
            - - - -
          </option>
        </select>
      </div>
      <div className={cx("dcl-edit-footer")}>
        <button data-for="pdc-preview"
                data-tip={pdc_string.replaceAll(' - ', '<br/>')}
                style={{float: "left"}} onClick={() => this.copyToClipboard(pdc_string)}
        >
          copy PDC string
        </button>
        <ReactTooltip
          id="pdc-preview"
          place="top"
          type="dark"
          effect="float"
          multiline={true}
          style={{width: '300px'}}
          overridePosition={({left, top},
                             currentEvent, currentTarget, node) => {
            const d = document.documentElement;
            left = Math.min(d.clientWidth - node.clientWidth, left);
            top = Math.min(d.clientHeight - node.clientHeight, top);
            left = Math.max(0, left);
            top = Math.max(0, top);
            return {top, left}
          }}/>
        <button onClick={this.didClear}>
          cleared
        </button>
        <button onClick={() => window.open(skyvector_url, '_blank').focus()}>
          Skyvector
        </button>
        <button onClick={() => this.copyToClipboard(amended_route_string)}>
          copy route
        </button>
        {/*<div className={cx("Toastify")}/>*/}
      </div>
    </div>);
  }
}
