import React from 'react';

import classNames from 'classnames/bind';
import styles from '../css/tdls-styles.css';
const cx = classNames.bind(styles);

export default class TdlsHeader extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     new_airport_name: ''
  //   }
  // }

  // handleChange = event => {
  //   event.preventDefault();
  //   this.setState({new_airport_name: event.target.value.toUpperCase()});
  // }
  //
  // handleKeyDown = event => {
  //   if (event.key === 'Enter') {
  //     const new_airport_name = this.state.new_airport_name;
  //     this.props.addAirport(new_airport_name);
  //     this.setState({new_airport_name: ''});
  //   }
  // }

  render() {
    const {selected_airport, airports, pdc_profile_names, selected_window} = this.props;
    // const {new_airport_name} = this.state;
    // const datis_url = `https://datis.clowd.io/${selected_airport}`;

    return <div className={cx("tdls-header")}>
      <div className={cx("tdls-header-left")}>
        {/*{airports.map(airport =>*/}
        {/*  <button*/}
        {/*    onClick={() => this.setCurrentAirport(airport)}*/}
        {/*    className={selected_airport === airport && "active"}*/}
        {/*    onMouseDown={(event) => event.button === 1 && this.props.removeAirport(airport)}*/}
        {/*  >*/}
        {/*    {airport.replace(/^K?/g, '')}*/}
        {/*  </button>*/}
        {/*)}*/}
        <select value={selected_airport}
                onChange={e => this.props.setAirport(e.target.value)}
        >
          <option disabled selected hidden value="" key="-1"> ---</option>
          {airports.map(airport =>
            <option
              key={airport}
              value={airport}
              // onClick={() => this.setCurrentAirport(airport)}
              // onMouseDown={(event) => event.button === 1 && this.props.removeAirport(airport)}
            >
              {/*{airport}*/}
              {airport.replace(/^K?/g, '').toLowerCase()}
            </option>
          )}
        </select>
        <select onChange={e => this.props.setPdcProfile(e.target.value)}>
          <option disabled selected hidden value="" key="-1"> profile</option>
          {pdc_profile_names && pdc_profile_names.map(name =>
            <option
              key={name}
              value={name}
              // onClick={() => this.setCurrentAirport(airport)}
              // onMouseDown={(event) => event.button === 1 && this.props.removeAirport(airport)}
            >
              {/*{airport}*/}
              {name}
            </option>
          )}
        </select>
      </div>
      <div className={cx("tdls-header-right")}>
        {/*<input*/}
        {/*  type="text"*/}
        {/*  placeholder='KBOS'*/}
        {/*  value={new_airport_name}*/}
        {/*  onKeyDown={this.handleKeyDown}*/}
        {/*  onChange={this.handleChange}*/}
        {/*/>*/}
        <button className={cx("tdls-header-fdio-button")}
                onClick={() => this.props.setWindow('fdio')}
        >
          <div className={cx("tdls-header-button-label")}>FDIO</div>
          <div className={`${cx("tdls-header-button-indicator")} ${selected_window === 'fdio' ? cx('active') : ''}`}/>
        </button>
        <button className={cx("tdls-header-dcl-button")}
                onClick={() => this.props.setWindow('dcl')}
        >
          <div className={cx("tdls-header-button-label")}>DCL</div>
          <div className={`${cx("tdls-header-button-indicator")} ${selected_window === 'dcl' ? cx('active') : ''}`}/>
        </button>
        <button className={cx("tdls-header-datis-button")}
                onClick={() => this.props.setWindow('datis')}
        >
          <div className={cx("tdls-header-button-label")}>D-ATIS</div>
          <div className={`${cx("tdls-header-button-indicator")} ${selected_window === 'datis' ? cx('active') : ''}`}/>
        </button>
      </div>
    </div>;
  }
}
