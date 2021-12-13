import React from 'react';

import classNames from 'classnames/bind';
import datis_styles from '../css/datis-styles.css';
const cx = classNames.bind(datis_styles);

export default class Datis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      airport: this.props.airport
    };
  }

  componentDidMount() {
    const weather_update_interval_id = setInterval(() => this.props.updateWeather(this.state.airport), 300000);
    this.setState({
      weather_update_interval_id: weather_update_interval_id
    });
    this.props.updateWeather(this.props.airport);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.airport !== prevProps.airport) {
      this.setState({airport: this.props.airport});
      this.props.updateWeather(this.props.airport);
    }
  }

  componentWillUnmount() {
    const {weather_update_interval_id} = this.state;
    if (weather_update_interval_id) {
      clearInterval(weather_update_interval_id);
    }
  }

  render() {
    const {metar_list, datis_data} = this.props;

    return (<div className={cx("datis")}>
      <div className={cx("datis-header")}>
        <div className={cx("tdls-arrow-left")}/>
        D-ATIS
        <div className={cx("tdls-arrow-right")}/>
      </div>
      <div className={cx("datis-latest-weather")}>
        Latest Weather
        {metar_list && metar_list.map(metar => (
          <div className={cx("datis-metar")}
               key={metar}
          >
            {metar}
          </div>))}
      </div>
      <div className={cx("datis-transmitted-atis")}>
        {datis_data && datis_data.map(e => {
          const next_letter = e.letter === 'Z' ? 'A' : String.fromCharCode(e.letter.charCodeAt(0) + 1);
          return (<div className={cx("datis-transmitted-atis-container")}
                      key={e.type}
          >
            <div className={cx("datis-transmitted-atis-header")}>
              {((e.type === 'arr' && 'Arrival ') || (e.type === 'dep' && 'Departure ') || '') + `ATIS: ${e.letter} ${e.time}`}
              <br/>
              {`Pending ${(e.type === 'arr' && 'Arrival ') || (e.type === 'dep' && 'Departure ') || ''} Voice: ${next_letter}`}
            </div>
            <div className={cx("datis-transmitted-atis-body")}>
              {e.atis_string.split('. ').map(s => <p>{s}.</p>)}
            </div>
          </div>);})}
      </div>
    </div>);
  }
}