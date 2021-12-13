import React from 'react';

import {execCommand} from '../resources/fdio_commands';

import classNames from 'classnames/bind';
import styles from '../css/fdio-styles.css';
import FdioContent from "./FdioContent";

const cx = classNames.bind(styles);

export default class Fdio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      airport: this.props.airport,
      flightplans: this.props.flightplans,
      input: '',
      response: '',
      top_content: {content: null},
      bottom_content: {content: null},
      active_runways: this.props.active_runways,
    }
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.setState({
        airport: this.props.airport,
        flightplans: this.props.flightplans
      });
    }
  }

  async parseCommand(input) {
    const {bottom_content} = this.state;
    const response = await execCommand(input);
    if (response.content) {
      this.setState({
        bottom_content: response.content,
        top_content: bottom_content,
        response: response.response
      });
    } else {
      this.setState({
        response: response.response
      });
    }
  }

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      const input = this.state.input;
      this.parseCommand(input);
      this.setState({input: ''});
    }
    if (event.key === 'Escape') {
      this.setState({input: ''});
    }
  }

  render() {
    const {input, response, top_content, bottom_content} = this.state;

    return (<div className={cx("fdio")} onClick={this.focusTextInput}>
      <div className={cx("fdio-header")}>
        <div className={cx("tdls-arrow-left")}/>
        FDIO
        <div className={cx("tdls-arrow-right")}/>
      </div>
      <div className={cx("fdio-bay-container")}>
        <div className={cx("fdio-content")}>
          <div className={`${cx("fdio-bay-row")} ${cx("border")}`}/>
          <div className={cx("fdio-bay-row")}>
            <FdioContent content={top_content}/>
          </div>
        </div>
        <div className={cx("fdio-content")}>
          <div className={`${cx("fdio-bay-row")} ${cx("border")}`}/>
          <div className={cx("fdio-bay-row")}>
            <FdioContent content={bottom_content}/>
          </div>
        </div>
      </div>
      <div className={cx("fdio-console-container")}>
        <div className={cx("fdio-content")}>
          <div className={cx("fdio-command-input")}>
            <input
              type="text"
              ref={this.textInput}
              value={input}
              onChange={(event) => this.setState(
                {input: event.target.value.toUpperCase()}
              )}
              onKeyDown={this.handleKeyDown}
            />
          </div>
          <div className={cx("fdio-response")}>
            {response?.split('\n').map(s => <p>{s}</p>)}
          </div>
        </div>
      </div>
    </div>);
  }
}