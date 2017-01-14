import React, { Component, PropTypes } from 'react'
import moment from 'moment'

const formats = {
  long: "dddd, MMMM Do YYYY, h:mm:ss a",
  short: "YYYY-MM-DD h:mm:ss a",
  date: "YYYY-MM-DD",
}

export default class Date extends Component {

  static propTypes = {
    format: PropTypes.oneOf(Object.keys(formats)).isRequired,
    date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.date,
    ]).isRequired,
    fromNow: PropTypes.bool.isRequired
  };

  static defaultProps = {
    format: 'long',
    fromNow: false,
  };

  render(){
    const date = moment(this.props.date)
    const title = date.format(formats[this.props.format]);
    const value = this.props.fromNow
      ? date.fromNow()
      : title
    return <span title={title}>{value}</span>
  }
}

