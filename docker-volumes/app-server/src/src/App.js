import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import PollInterval from './components/PollInterval'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import {Login,SignInSide} from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import CreateDot from './components/CreateDot'
import {LOMap} from './components/Map'
import AppBar from './components/AppBar'


import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './components/Login'

//import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import './App.css'

// JWT HANDLING

{/*import Cookies from 'js-cookie'
const COOKIE_NAME = 'MYAPP'

const retrieveToken = () => Cookies.get(COOKIE_NAME)
const saveToken = token => Cookies.set(COOKIE_NAME, token)
const clearToken = () => Cookies.remove(COOKIE_NAME)
*/}


// import {useAuthTokenInterceptor} from 'axios-jwt';
// import axios from 'axios';
//
// const apiClient = axios.create();
//
// const requestRefresh = (refresh) => {
//     return new Promise((resolve, reject) => {
//         // notice that this is the global axios instance.  <-- important
//         axios.post('/api/v1/auth/token/refresh/', {
//             refresh
//         })
//             .then(response => {
//                 resolve(response.data.accessToken);
//             }, reject);
//     });
// };
// useAuthTokenInterceptor(apiClient, { requestRefresh });  // Notice that this uses the apiClient instance.  <-- important
//
// // Now just make all requests from the apiClient.
//
// apiClient.get('/api/endpoint/resource/1')
//     .then(response => { // blah blah
//      })
//


{/*class App extends Component {

  render() {
    return (
      <div className="fill">

        <Router>
        <div className="App">
          <Route exact path="/" component={Landing} />
          <div className="container-fluid fill h-100">
            <Route exact path="/signup" component={Register} />
            <Route exact path="/signin" component={SignInSide} />
            <Route exact path="/login2" component={SignInSide} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/user/createDot" component={CreateDot} />
            <Route exact path="/lomap" component={AppBar} />
          </div>
        </div>
      </Router>
      </div>
    )
  }
}

export default App
*/}


(function() {
    if ( typeof Object.id == "undefined" ) {
        var id = 0;

        Object.id = function(o) {
            if ( typeof o.__uniqueid == "undefined" ) {
                Object.defineProperty(o, "__uniqueid", {
                    value: ++id,
                    enumerable: false,
                    // This could go either way, depending on your
                    // interpretation of what an "id" is
                    writable: false
                });
            }

            return o.__uniqueid;
        };
    }
})();


const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default function App(props) {

  return (
    <div className="fill">
    <ThemeProvider theme={darkTheme}>

      <Router>
      <div className="App">
        {/*<Navbar />*/}
        <Route exact path="/" component={Landing} />
        <div className="container-fluid fill h-100">
          <Route exact path="/signup" component={Register} />
          <Route exact path="/signin" component={SignInSide} />
          <Route exact path="/login2" component={SignInSide} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/user/createDot" component={CreateDot} />
          <Route exact path="/lomap" component={AppBar} />
        </div>
      </div>
    </Router>

    </ThemeProvider>
    </div>
  )
}
