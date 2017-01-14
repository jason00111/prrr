import React, { Component } from 'react'
import Date from '../atoms/Date'
import Link from '../atoms/Link'
import Button from '../atoms/Button'
import Layout from '../molecules/Layout'
import MainAction from '../molecules/MainAction'
import YourRequestsForReview from '../molecules/YourRequestsForReview'
import YourReviews from '../molecules/YourReviews'
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

      <h1>Your Requests For Review</h1>
      <YourRequestsForReview currentUser={session.user} prrrs={prrrs} />

      <h1>Your Reviews</h1>
      <YourReviews currentUser={session.user} prrrs={prrrs} />
    </Layout>
  }
}
