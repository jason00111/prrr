import React, { Component, PropTypes } from 'react'

import claimPrrr from '../../../actions/claimPrrr'
import completePrrr from '../../../actions/completePrrr'
import unclaimPrrr from '../../../actions/unclaimPrrr'

import Button from '../../atoms/Button'
import Link from '../../atoms/Link'
import Avatar from '../../atoms/Avatar'
import './index.sass'

export default ({currentUser, prrrs}) => {
  const unclaimedPrrrs = prrrs.filter(prrr => !prrr.claimed_by)

  const claimedPrrr = prrrs.find(prrr =>
    prrr.claimed_by === currentUser.github_username
  )

  const action = claimedPrrr
    ? <ClaimedPrrr prrr={claimedPrrr} />
    : <ClaimAPrrr
        currentUser={currentUser}
        unclaimedPrrrs={unclaimedPrrrs}
      />

  return <div className="MainAction">
    {action}
  </div>
}

class ClaimedPrrr extends Component {
  render(){
    const { prrr } = this.props
    const href = `https://github.com/${prrr.owner}/${prrr.repo}/pull/${prrr.number}`
    return <div className="MainAction-ClaimedPrrr">
      <div>
        <h2>
          <span>Reviewing: </span>
          <Link href={href} target="_blank">{prrr.owner}/{prrr.repo}/pull/{prrr.number}</Link>
        </h2>
        <h3>
          <span>For: </span>
          <span>{prrr.requested_by}</span>
        </h3>
      </div>
      <div>
        <Button onClick={_ => unclaimPrrr(prrr.id)}>
          Unclaim
        </Button>
        <Button onClick={_=> completePrrr(prrr.id)}>
          Complete
        </Button>
      </div>
    </div>
  }
}

class ClaimAPrrr extends Component {
  render(){
    const { unclaimedPrrrs, currentUser } = this.props
    const noPrrrsForYou = unclaimedPrrrs
      .filter(prrr =>
        prrr.requested_by !== currentUser.github_username
      )

    return noPrrrsForYou.length === 0
      ? <div className="MainAction-ClaimAPrrr">
          <h4>
            There are currently no Pending Pull Request Review Requests
            from other Learners at this time. Check back later.
          </h4>
        </div>
      : <div className="MainAction-ClaimAPrrr">
          <h1>Pending Reviews: {unclaimedPrrrs.length}</h1>
          <div>
            <Button
              className="ReviewAPRButton"
              onClick={claimPrrr}
            >Review<br/> A PR!</Button>
          </div>
        </div>
  }
}
