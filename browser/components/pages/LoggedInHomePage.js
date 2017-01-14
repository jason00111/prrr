import React, { Component } from 'react'
import Date from '../atoms/Date'
import Link from '../atoms/Link'
import Button from '../atoms/Button'
import Layout from '../molecules/Layout'
import MainAction from '../molecules/MainAction'
import InspectObject from '../utils/InspectObject'

export default class LoggedInHomePage extends Component {
  render(){
    const { session, prrrs=[] } = this.props
    const currentUser = session.user

    return <Layout className="HomePage" session={session}>
      <MainAction
        currentUser={currentUser}
        prrrs={prrrs}
      />
    </Layout>
  }
}
