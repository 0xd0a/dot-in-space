import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import {instance} from './UserFunctions'
//import Test from './Test'
import CDD from './CDDialog'
//import LPick from './MapSelector'
import LPick from './LocationPicker'

function CreateDot2(props) {
  return CDD()
}

class CreateDot extends Component {
  constructor(props) {
    super()
    this.state = {
      dot_name: '',
      manifesto: '',
      lat1:0,
      lon1:0,
      lat2:0,
      lon2:0,
      files: null,
      script: '',
      errors: {},
      loading:false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onChangeP1 = this.onChangeP1.bind(this)
    this.onChangeP2 = this.onChangeP2.bind(this)

  }

  componentDidMount() {
    const token = localStorage.usertoken
    console.log("Token is ");
    console.log(token);
    if(!token)
    {
    } else {
      try{
        console.log("check anyway");
        const decoded = jwt_decode(token)
        this.setState({
          name: decoded.identity.name,
          email: decoded.identity.email
        })
      } catch ( e) {
        this.props.history.push(`/`)
        console.log(e);}
    }
  }

  onChangeHandler(event) {
    this.setState({
      files: event.target.files,
      loaded: 0,
    })
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onChangeP1(e) {
    this.setState({lat1:e.lat,lon1:e.lng})
    console.log("P1 changed: "+e)
//    console.log(this.state.lat1)
  }

  onChangeP2(e) {
    this.setState({lat2:e.lat,lon2:e.lng})
    console.log("P2 changed: "+e)
  }


  onSubmit(e) {
    e.preventDefault()
    this.setState({loading:true})
    const data = new FormData()
/*    if (this.state.files === null) {
      console.log("no files selected");
      return;
    }
    for(var x = 0; x<this.state.files.length; x++) {
      data.append('file', this.state.files[x])
    }*/
    for (const i of ['lat1','lon1','lat2','lon2','manifesto','script'])
      data.append(i,this.state[i])

/*    data={lat1:this.state.lat1,
    lon1:this.state.lon1,
    lat2:this.state.lat2,
    lon2:this.state.lon2,
    manifesto:this.state.manifesto}*/
/*    register(newUser).then(res => {
      this.props.history.push(`/login`)
    })*/
//    data.append('data',data)
    // work on data
    instance.post("/api/users/createdot", data, {
       // receive two    parameter endpoint url ,form data
       headers: { 'Authorization': `Bearer ${localStorage.usertoken}` }
     })
    .then(response => {
     //localStorage.setItem('usertoken', response.data)
     //return response.data
      console.log("Response: "+response.data)
    })
    .catch(err => {
     console.log(err)
   })
   this.setState({loading:false})
   this.props.onClose();

  }
  render() {
    return (
      <CDD className="container" title="LAUNCH DOT" buttonName="Launch">
        <div className="mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">CREATE DOT</h1>
          </div>
          <form noValidate onSubmit={this.onSubmit}>
            <h1 className="h3 mb-3 font-weight-normal"></h1>
            <div className="form-group">
              <label htmlFor="dot_name">Dot name</label>
              <input
                type="text"
                className="form-control"
                name="dot_name"
                placeholder="The name on the dot"
                value={this.state.dot_name}
                onChange={this.onChange}
              />
              {/*<label htmlFor="">Lat1</label>
              <input
                type="text"
                className="form-control"
                name="lat1"
                placeholder="Latitude of the first point"
                value={this.state.lat1}
                onChange={this.onChange}
              />
              <label htmlFor="">lon1</label>
              <input
                type="text"
                className="form-control"
                name="lon1"
                placeholder="Longitude of the first point"
                value={this.state.lon1}
                onChange={this.onChange}
              />

              <label htmlFor="">Lat2</label>
              <input
                type="text"
                className="form-control"
                name="lat2"
                placeholder="Latitude of the second point"
                value={this.state.lat2}
                onChange={this.onChange}
              />
              <label htmlFor="">lon2</label>
              <input
                type="text"
                className="form-control"
                name="lon2"
                placeholder="Longitude of the second point"
                value={this.state.lon2}
                onChange={this.onChange}
              />*/}
              <LPick onChangeP1={this.onChangeP1} onChangeP2={this.onChangeP2} />
            </div>
            <div className="form-group">
              <label htmlFor="name">Manifesto</label>
              <textarea
                cols="1000"
                rows="20"
                type="text"
                className="form-control"
                name="manifesto"
                placeholder="Manifesto"
                value={this.state.manifesto}
                onChange={this.onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Processing Script</label>
              <p>Make sure your code starts with x=[0,0,0,0,0,0,0,0,0,0];. <a href="#">More info</a></p>
              <textarea
                cols="1000"
                rows="20"
                type="text"
                className="form-control"
                name="script"
                placeholder="Processing script"
                value={this.state.script}
                onChange={this.onChange}
              />
            </div>

             {/* <input type="file" name="file" multiple onChange={this.onChangeHandler}/> */}

            <button
              type="submit"
              className="btn btn-lg btn-primary btn-block"
            >
            {this.state.loading && (
                              <span className="spinner-border spinner-border-sm">Loading...</span>
                            )}
              Submit
            </button>
          </form>

        </div>
      </CDD>
    )
  }
}

export default CreateDot
