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
      cameraVector: [0, 0, 1],
    }
  }

  componentDidMount () {
    this.tick = setInterval(this.rotate, 16);
  }

  componentWillUnmount () {
    clearInterval(this.tick);
  }

  render () {
    const {points, cameraVector: [cx, cy, cz]} = this.state;

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


    // - get rotation to make camera vector <0, 0, 1>
    // this is angle between

    // camera vector = <a, b, c>
    // camera point = <a, b, c>
    // plane = ax + by + cz - (a - b - c) = 0
    // a(x - 1) + b(y - 1) + c(z - 1) = 0
    // or ax + by + cz = a + b + c

    // point <d, e, f>
    // line from origin is x = dt, y = et, z = ft
    // intersection is adt + bet + cft = a + b + c
    // t = (a + b + c) / (ad + be + cf)
    // intX = d(a + b + c) / (ad + be + cf) etc

    // angle between camera vector and
    return (
      <div style={containerStyle}>
        <div style={gridStyle}>
        {
          points
            .map(([px, py, pz]) => {
              const t = (cx + cy + cz) / (cx * px + cy * py + cz * pz);
              if (t < CAMERA_DIST) return null;

              const ix = px * t;
              const iy = py * t;
              const iz = pz * t;

            })
            // .filter(([px, py, pz]) => {
            //   return pz > 0 &&
            //     pz > px &&
            //     pz > py;
            // })
            // .map(([px, py, pz], i) => {
            //   const dist = length([px, py, pz]) / 2;
            //   const x = 10 * px / dist;
            //   const y = 10 * py / dist;
            //   return <Point key={i} x={x} y={y} dist={dist} />
            // })
        }
        </div>
      </div>
    );
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