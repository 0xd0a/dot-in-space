import axios from 'axios'

import createAuthRefreshInterceptor from 'axios-auth-refresh';

import isDev from './helper/env'

export const instance = axios.create({
  baseURL: isDev()?'http://localhost:3001':'https://dot-in.space',
  headers: {
    "content-type": "application/json",
    "custom-query": "___123___"
  },
  responseType: "json",
});

// Function that will be called to refresh authorization
const refreshAuthLogic = failedRequest =>
  axios.post('/api/auth/token/refresh',{},
      {headers: { 'Authorization': `Bearer ${localStorage.refresh_token}` }})
  .then(tokenRefreshResponse => {
      localStorage.setItem('usertoken', tokenRefreshResponse.data.token);
      failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
      return Promise.resolve();
  })
  .catch(error => {
      console.log("refresh fail");
      localStorage.setItem("usertoken", null);
      localStorage.setItem("refresh_token", null);
      //pushToLogin();
      return Promise.reject(error);
    });

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(instance, refreshAuthLogic);

// Make a call. If it returns a 401 error, the refreshAuthLogic will be run,
// and the request retried with the new token
/*instance.get('state')
     .then(response => {
       //localStorage.setItem('usertoken', response.data.access_token)
       console.log(response.data)
       return response.data
     })
     .catch();
*/
console.log('123____');

export const register = newUser => {
  return instance
    .post('/api/users/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password
    })
    .then(response => {
      console.log('Registered')
    })
}

export const login = user => {
  return instance
    .post('/api/users/login', {
      email: user.email,
      password: user.password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      console.log(response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getProfile = user => {
  return instance
    .get('/api/users/profile', {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then(response => {
      console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const getUniverseState = user => {
  return instance
    .get('/api/state', {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then(response => {
  //    console.log(response)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const launchDot = u => {}
