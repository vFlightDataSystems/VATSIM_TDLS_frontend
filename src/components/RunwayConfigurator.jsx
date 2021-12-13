import React from 'react';

import classNames from 'classnames/bind';
import styles from '../css/styles.css';
const cx = classNames.bind(styles);

export default class RunwayConfigurator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      departing: this.props.active_runways.departing,
      landing: this.props.active_runways.landing,
      runways: this.props.available_runways
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps !== this.props) {
      this.setState({
        departing: this.props.active_runways.departing,
        landing: this.props.active_runways.landing,
        runways: this.props.available_runways
      });
    }
  }

  updateDepRunway = runway => {
    let departing = this.state.departing;
    let index = departing.indexOf(runway);
    if (index !== -1) departing.splice(index, 1);
    else departing.push(runway);
    this.setState({departing: departing});
    this.props.updateActiveRunways(this.state)
  }

  updateArrRunway = runway => {
    let landing = this.state.landing;
    let index = landing.indexOf(runway);
    if (index !== -1) landing.splice(index, 1);
    else landing.push(runway);
    this.setState({landing: landing});
    this.props.updateActiveRunways(this.state);
  }

  render() {
    const {departing, runways} = this.state;
    return (<div className={cx("checkboxes")}>
      <label style={{display: "inline"}}>Departing Runways: </label>
      {runways && runways.map(runway => <div style={{display: "inline"}} key={runway}>
        <label style={{display: "inline"}}>
          <span>{runway}</span>
          <input
            type="checkbox"
            checked={departing.includes(runway)}
            onChange={() => this.updateDepRunway(runway)}/>
        </label>
      </div>)}
    </div>);
  }
}