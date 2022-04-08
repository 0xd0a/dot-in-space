import React, { Component } from 'react';
import { getUniverseState } from './UserFunctions'

class PollInterval extends Component {
  constructor(props){
    super(props);
    this.state = {state: 'None'}
  }
  timer() {
//    getUniverseState().then((r)=>{
//        this.setState({
//          state: 'New State: '+r
//        })
//    })
/*    if(this.state.currentCount < 1) {
      clearInterval(this.intervalId);
    }*/
  }
  componentDidMount() {
//    this.intervalId = setInterval(this.timer.bind(this), 1000);
  }
  componentWillUnmount(){
//    clearInterval(this.intervalId);
  }
  render() {
    return(
      <div>{this.state.state}</div>
    );
  }
}

export default PollInterval;
