import React, { Component } from 'react'
import Link from '../atoms/Link'
import Button from '../atoms/Button'
import Layout from '../molecules/Layout'
import InspectObject from '../utils/InspectObject'
import claimPrrr from '../../actions/claimPrrr'
import completePrrr from '../../actions/completePrrr'
import unclaimPrrr from '../../actions/unclaimPrrr'
import GithubUsername from '../atoms/GithubUsername'
import Date from '../atoms/Date'

export default class LoggedInHomePage extends Component {
  render(){
    const { session, prrrs=[] } = this.props

    const unclaimedPrrrs = prrrs.filter(prrr => !prrr.claimed_by)

    const claimedPrrr = prrrs.find(prrr =>
      prrr.claimed_by === session.user.github_username
    )

    const infoBox = claimedPrrr
      ? <ClaimedPrrr prrr={claimedPrrr} />
      : <ClaimAPrrr prrrs={prrrs} session={session}/>


    return <Layout className="HomePage" session={session}>
      <h1>There are {unclaimedPrrrs.length} Pull Requests ready for Review:</h1>
      {infoBox}
    </Layout>
  }
}


class ClaimedPrrr extends Component {
  render(){
    const { prrr } = this.props
    const href = `https://github.com/${prrr.owner}/${prrr.repo}/pull/${prrr.number}`
    return <div className="LoggedInHomePage-ClaimedPrrr">
      <span>Reviewing </span>
      <Link href={href} target="_blank">
        {prrr.owner}/{prrr.repo}
      </Link>

      <Button
        onClick={_ => unclaimPrrr(prrr.id)}
      >
        Unclaim
      </Button>
      <Button
        onClick={_=> completePrrr(prrr.id)}
      >
        Complete
      </Button>
    </div>
  }
}

class ClaimAPrrr extends Component {
  render(){
    const { prrrs, session } = this.props
    const unclaimedPrrrs = prrrs.filter(prrr => !prrr.claimed_by)
    const noPrrrsForYou = unclaimedPrrrs.filter(prrr => prrr.requested_by !== session.user.github_username)


    const claimButton = (noPrrrsForYou.length === 0)
      ? <div>
          <span>There are currently no Pending Pull Request Review Requests from other Learners at this time. Check back later.</span>
        </div>
      : <div>
          <Button
            onClick={claimPrrr}
          >Click here</Button> to claim the next prr
        </div>

    return <div className="">
      {claimButton}
    </div>
  }
}



function confirmArchivePrrr(href, prrr){
  const message = `Are you sure you want to archive your\n\nPull Request Review Request for\n\n${href}`
  if (confirm(message)) archivePrrr(prrr.id)
}
