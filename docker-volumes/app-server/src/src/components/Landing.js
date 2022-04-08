import React, { Component } from 'react'
import {LOMap} from './Map'
import SignUp from './Register'
import AppBar from './AppBar'

class Landing extends Component {
  render() {
    const loggedin = (
      <div className="fill">
      <AppBar />
      text
      </div>
    )

    const signup = (
      <SignUp />
    )

    return (
      <div>
          {localStorage.usertoken ? loggedin : signup }
      </div>
    )
  }
}

export default Landing
