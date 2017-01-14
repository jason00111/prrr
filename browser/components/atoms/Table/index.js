import React, { Component, PropTypes } from 'react'
import './index.sass'

export default class Table extends Component {
  render(){
    const props = Object.assign({}, this.props)
    props.className = `Table ${this.props.className||''}`
    return <table {...props}>{props.children}</table>
  }
}
