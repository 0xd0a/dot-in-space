import React, {useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';


const les = makeStyles((theme) => ({
  map: {
    height: '600px'
  }
})
)

export default (props) => {

  const classes = les();

  var pointVals = [
    [10,10],
    [11,11]
  ];
  const [P1,setP1]=useState([10,10])
  const [P2,setP2]=useState([20,20])
  const [map1,setMap1]=useState()
  const [mid,setMid]=useState(0)
  console.log(props.onChangeP1)

  // use below if you want to specify the path for leaflet's images
  //L.Icon.Default.imagePath = '@Url.Content("~/Content/img/leaflet")';
  useEffect(()=>{
    const onChangeP = [props.onChangeP1, props.onChangeP2]
    var curLocation = [0, 0];
    var tgt={};
    var mmm=0;
    // use below if you have a model
    // var curLocation = [@Model.Location.Latitude, @Model.Location.Longitude];

    if (curLocation[0] == 0 && curLocation[1] == 0) {
      curLocation = [5.9714, 116.0953];
    }
    if(true){
      console.log("creating map");
      var mp = window.L.map('MapLocation')
      console.log("Map location");
      setMap1(mp);

      mp.setView(pointVals[0], 2)

      var tl= window.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      })

      mp.addLayer(tl)
      //addTo(map);

      mp.attributionControl.setPrefix(false);
    }

    mp.on('click',(e) => {
      console.log(mmm);
      if(mmm<2) {
        //var ll=e.getLatLng();
        const fontAwesomeIcon = window.L.divIcon({
          html: '<i class="fa fa-map-marker fa-4x" style="color: red;"></i>',
          iconSize: [20, 20],
          className: 'myDivIcon'
        });
        var marker = new window.L.marker(/*[ll.lat,ll.lng]*/e.latlng, {
          draggable: 'true',
          //icon: fontAwesomeIcon
        });
        tgt[Object.id(marker)]=mmm; // CRAZY HACK, see https://stackoverflow.com/questions/1997661/unique-object-identifier-in-javascript, the function itself is in App.js
        //console.log(tgt);
        if (onChangeP[mmm])
          onChangeP[mmm](e.latlng)


        marker.on('dragend', function(event) {
          var id=mmm;
          var position = marker.getLatLng();
          /*marker.setLatLng(position, {
            draggable: 'true'
          }).bindPopup(position).update();*/
          setP1([position.lat,position.lng])
          //console.log("The mmm is "+mmm+" "+onChangeP[mmm]+" "+props.onChangeP1)
          //console.log("Id "+tgt[Object.id(event.target)])
          var j=tgt[Object.id(event.target)]
          if (onChangeP[j])
            onChangeP[j](position)

          // $("#Latitude").val(position.lat);
          // $("#Longitude").val(position.lng).keyup();
        });

        // $("#Latitude, #Longitude").change(function() {
        //   var position = [parseInt($("#Latitude").val()), parseInt($("#Longitude").val())];
        //   marker.setLatLng(position, {
        //     draggable: 'true'
        //   }).bindPopup(position).update();
        //   map.panTo(position);
        // });
        setMid(marker);
        mp.addLayer(marker);
        mmm++;
      }
    });
//    mp.addLayer(marker2);
},[])

  return (<div>
    <div id="MapLocation" className={classes.map}></div>
    </div>
  )
}
