import React, { Component, PropTypes } from 'react'
import Link from '../Link'

export default class PRLink extends Component {

  static propTypes = {
    prrr: PropTypes.object.isRequired,
    value: PropTypes.any,
    target: PropTypes.string,
  }

  static defaultProps = {
    target: '_blank',
  }

  render(){
    const { prrr } = this.props
    const props = Object.assign({}, this.props)
    delete props.prrr
    delete props.value
    props.href = `https://github.com/${prrr.owner}/${prrr.repo}/pull/${prrr.number}`
    props.title = `${prrr.owner}/${prrr.repo}/pull/${prrr.number}`
    props.className = `Link ${this.props.className||''}`
    return <Link {...props}>{this.props.value || props.title}</Link>
  }
}
