import React from "react";
import Point from "./Point";

import {
  times,
  compose,
} from "lodash/fp";

import {
  randPoint,
} from "../operations/random";

import {
  translateVector,
  length,
  angleBetween,
  inverseTranslateVector,
  rotateVectorXY,
  rotateVectorXZ,
  rotateVectorYZ,
  scaleVector,
} from "../operations/vector";

const CAMERA_DIST = 1;
const CAMERA_WIDTH = 1;

// const transform = compose(
//   // rotateVectorXY(.02),
//   // rotateVectorYZ(.03),
//   scaleVector(0.999),
//   translateVector([0.1, 0.1, 0.1]),
// );

export default class App extends React.Component {

  constructor () {
    super();
    this.state = {
      points: times(randPoint, 20),
      cameraRotation: 0,
    }
  }

  componentDidMount () {
    this.tick = setInterval(this.rotate, 16);
  }

  componentWillUnmount () {
    clearInterval(this.tick);
  }

  render () {
    const {points, cameraRotation} = this.state;

    const renderedPoints = points
      .map(rotateVectorXZ(cameraRotation))
      .map((point, i) => {
        const dist = length(point);
        if (dist < CAMERA_DIST) return null;
        
        const [px, py, pz] = point;

        const x = px / pz;
        const y = py / pz;

        if (Math.abs(x) > CAMERA_WIDTH || Math.abs(y) > CAMERA_WIDTH) return null;

        return <Point key={i} x={x} y={y} dist={dist} />;
      })
      .filter(Boolean);
     
    return (
      <div style={containerStyle}>
        <div style={gridStyle}>
          {renderedPoints}
        </div>
      </div>
    );

    /*
      rotate XZ to make X of camera vector 0.
        - ?? this angle is the angle between <cx, 0, cz> and <0, 0, 1>
      rotate YZ to make Y of camera vector 0.
        - ?? this angle is the angle between <0, cy, cz> and <0, 0, 1>
      anything with Z < FOCAL_LENGTH is not in frame.
      projected X = FOCAL_LENGTH * pz / px
      projected Y = FOCAL_LENGTH * pz / py
      anything with projected X or Y not in WINDOW_SIZE is not in frame
      display projected X and projected Y
    */
  }

  rotate = () => {
    // this.setState({cameraAngle: this.state.cameraAngle + 0.01});
  }

}

const SIZE = 512;

const gridStyle = {
  position: "absolute",
  left: SIZE / 2,
  top: SIZE / 2,
};

const containerStyle = {
  width: SIZE,
  height: SIZE,
  border: "1px solid black",
  margin: "auto",
  position: "relative",
};
