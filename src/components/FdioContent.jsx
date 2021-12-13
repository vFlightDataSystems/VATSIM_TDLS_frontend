import React from 'react';

import classNames from 'classnames/bind';
import styles from '../css/fdio-strip-styles.css';
const cx = classNames.bind(styles);

export default class FdioContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.setState({content: this.props.content})
    }
  }

  render() {
    const {content} = this.state;

    return (<div className={cx("fdio-strip")}>
      <div className={cx("fdio-strip-row")}>
        <div className={cx("fdio-strip-col-1")}>
          {content?.[0]}
        </div>
        <div className={cx("fdio-strip-col-2")}>
          {content?.[1]}
        </div>
        <div className={cx("fdio-strip-col-3")}>
          {content?.[2]}
        </div>
        <div className={cx("fdio-strip-col-4")}>
          {content?.[3]}
        </div>
      </div>
      <div className={cx("fdio-strip-row")}>
        <div className={cx("fdio-strip-col-1")}>
          {content?.[4]}
        </div>
        <div className={cx("fdio-strip-col-2")}>
          {content?.[5]}
        </div>
        <div className={cx("fdio-strip-col-3")}>
          {content?.[6]}
        </div>
        <div className={cx("fdio-strip-col-4")}>
          {content?.[7]}
        </div>
      </div>
      <div className={cx("fdio-strip-row")}>
        <div className={cx("fdio-strip-col-1")}>
          {content?.[8]}
        </div>
        <div className={cx("fdio-strip-col-2")}>
          {content?.[9]}
        </div>
        <div className={cx("fdio-strip-col-3")}>
          {content?.[10]}
        </div>
        <div className={cx("fdio-strip-col-4")}>
          {content?.[11]}
        </div>
      </div>
    </div>);
  }
}