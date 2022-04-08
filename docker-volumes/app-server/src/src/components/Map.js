import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
//import GoogleMapReact from 'google-map-react'

//import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { getUniverseState } from './UserFunctions'
import isDev from './helper/env' 

class LOMap extends Component {
  currentSecond;
  constructor() {
    super()
    this.currentSecond;
    this.logSize=5; // seconds
    this.state = {
       lat: 50.3,
       lon: 50.3,

       zoomArea: [[60.507222, 30.1275], [68.8567, 25.3508]]
    }
  }

  async timer() {
    getUniverseState().then((r)=>{
        const sleep = m => new Promise(r => setTimeout(r, m))
        //sleep(5000);;
          try{
            for(const objId of r.data) {
              var position;
              for(const frame of objId.latlng) {
                const dur=r.meta.nextCall/r.data[0].latlng.length;
                const latlng=[frame.lat,frame.lon];
                if (objId.object_id in this.markers) {
                  this.markers[objId.object_id].addLatLng(latlng,dur);
                } else {
                  // create marker
                  if(position!==undefined) {
                    console.log("Creating marker"+ objId.object_id);
                    this.markers[objId.object_id]=window.L.CircleMarker.movingMarker([position,latlng],dur).addTo(this.map);
                    //window.test=this.markers[objId.object_id];
                    //console.log(this.markers[objId.object_id]);
                    this.markers[objId.object_id].bindPopup("MOFO");
                    this.markers[objId.object_id].on('click',
                      function(t) {
                        t.target.bindPopup("<div>"+objId.object_id+"<iframe frameborder=0 height=400 width=400 src=\""+(isDev()?"http://127.0.0.1:5000/api/view_dot/":"https://dot-in.space/api/view_dot/")+objId.object_id+"/1\" title=\"DOT "+objId.object_id+"\"></iframe></div>"
                        //, {'maxWidth': '500'}
                      );
                      }

                    );

                    this.markers[objId.object_id].start();
                  } else {
                    position=latlng;
                  }
                }
              }
              if(!this.markers[objId.object_id].isRunning()) this.markers[objId.object_id].start();
            }
          }catch (e) {
            console.log("JSON Decode didn't work properly, request error? "+e);
            console.log(r);
          }
        }
    )
  }

  componentDidMount() {
    this.timer();
    this.intervalId = setInterval(this.timer.bind(this), this.logSize*1000);

    // initialize the map on the "map" div with a given center and zoom
    var map = new window.L.Map('map', {
      zoom: 6,
      minZoom: 3,
    });

    // create a new tile layer
    var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    layer = new window.L.TileLayer(tileUrl,
    {
        attribution: 'Maps © <a href=\"www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
        maxZoom: 18
    });

    // add the layer to the map
    map.addLayer(layer);
    //map.fitBounds(this.state.zoomArea);
    map.fitWorld();
    //this.state.marker1 =
    console.log("Starting movement");
    this.markers=[];
    this.map=map;
    console.log("End movement");
  }

  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  render() {
    const position = [61.3, 50.3]
      return (
          <div id='map' className="dark">
          </div>
      )
  }

}


export {LOMap }
