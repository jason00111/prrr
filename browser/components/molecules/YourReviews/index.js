import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import InspectObject from '../../utils/InspectObject'
import Link from '../../atoms/Link'
import Table from '../../atoms/Table'
import Date from '../../atoms/Date'
import PRLink from '../../atoms/PRLink'
import GithubUsername from '../../atoms/GithubUsername'
import Button from '../../atoms/Button'
import PrrrsTable from '../PrrrsTable'
import ErrorMessage from '../../atoms/ErrorMessage'
import claimPrrr from '../../../actions/claimPrrr'

export default class YourReviews extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    prrrs: PropTypes.array.isRequired,
  }

  render(){
    const { prrrs, currentUser } = this.props
    const reviewedPrrrs = prrrs
      .filter(prrr => prrr.claimed_by === currentUser.github_username)
      .sort((a, b) =>
        moment(a.created_at).valueOf() -
        moment(b.created_at).valueOf()
      )

    const reviews = reviewedPrrrs.map(prrr =>
      <tr key={prrr.id}>
        <td>
          <PRLink prrr={prrr} />
        </td>
        <td>
          <GithubUsername username={prrr.requested_by} />
        </td>
        <td>
          <Date fromNow date={prrr.created_at} />
        </td>
        <td>
          {prrr.completed_at
            ? <Date fromNow date={prrr.completed_at} />
            : null
          }
        </td>
      </tr>
    )

    return <Table className="YourReviews">
      <thead>
        <tr>
          <th>Pull Request</th>
          <th>Requested By</th>
          <th>Requested At</th>
          <th>Completed At</th>
        </tr>
      </thead>
      <tbody>
        {reviews}
      </tbody>
    </Table>
  }
}
