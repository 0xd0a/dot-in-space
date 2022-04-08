import React from "react";
import LocationPicker from "react-leaflet-location-picker";

const MyComponent = () => {
  const pointVals = [
    [50, 2],
    [45, -10]
  ];
  const pointMode = {
    banner: true,
    control: {
      values: pointVals,
      onClick: point =>
        console.log("I've just been clicked on the map!", point),
      onRemove: point =>
        console.log("I've just been clicked for removal :(", point)
    }
  };
  const circleMode = {
    banner: false
  };
  return <LocationPicker pointMode={pointMode}  />;
};

export default MyComponent;
