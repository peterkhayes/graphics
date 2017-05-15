import React from "react";
import Point from "./Point";
import KeyHandler, {KEYDOWN} from "react-key-handler";

import {
  times,
} from "lodash/fp";

import {
  randPoint,
} from "../operations/random";

import {
  translateVector,
  rotateVector,
  reverseVector,
  vectorLength,
} from "../operations/vector";

const CAMERA_DIST = 1;
const CAMERA_WIDTH = 1;
const MAX_DRAW_DISTANCE = 200;

export default class App extends React.Component {

  constructor () {
    super();
    this.state = {
      points: times(randPoint, 2000),
      cameraPosition: [0, 0, 0],
      cameraAngles: [0, 0, 0],
    }
  }

  render () {
    return (
      <div style={containerStyle}>
        {this._renderIndicator("Camera Position:", this.state.cameraPosition)}
        {this._renderIndicator("Camera Angles:", this.state.cameraAngles.map((x) => x * 180 / Math.PI))}
        <div style={worldStyle}>
          <div style={originStyle}>
            {this._renderPoints()}
          </div>
        </div>
        <KeyHandler keyEventName={KEYDOWN} keyValue="w" onKeyHandle={this._goForward} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="s" onKeyHandle={this._goBackwards} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="a" onKeyHandle={this._strafeLeft} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="d" onKeyHandle={this._strafeRight} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowLeft" onKeyHandle={this._rotateLeft} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowRight" onKeyHandle={this._rotateRight} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowUp" onKeyHandle={this._lookUp} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowDown" onKeyHandle={this._lookDown} />
      </div>
    );

  }

  _renderIndicator (label, vector) {
    const vectorStr = ` <${vector.map((x) => x.toFixed(2)).join(", ")}>`;
    return (
      <div><strong>{label}</strong>{vectorStr}</div>
    );
  }

  _renderPoints () {
    const {points, cameraAngles, cameraPosition} = this.state;

    return points
      .map(translateVector(reverseVector(cameraPosition)))
      .map(rotateVector(cameraAngles))
      .map((point, i) => {
        const [px, py, pz] = point;
        if (pz < CAMERA_DIST) return null;

        const x = px / pz;
        const y = py / pz;

        if (Math.abs(x) > CAMERA_WIDTH || Math.abs(y) > CAMERA_WIDTH) return null;

        const distance = vectorLength([px, py, pz]);
        if (distance > MAX_DRAW_DISTANCE) return null;

        return <Point key={i} x={x} y={y} distance={distance} />;
      })
      .filter(Boolean);
  }

  _rotate = (angle) => {
    this.setState(({cameraAngles}) => {
      const newAngles = translateVector(angle)(cameraAngles);
      return {cameraAngles: newAngles};
    });
  };

  _move = (direction) => {
    this.setState(({cameraAngles, cameraPosition}) => {
      const actualDirection = rotateVector(cameraAngles)(direction);
      const newPosition = translateVector(actualDirection)(cameraPosition);
      return {cameraPosition: newPosition};
    });
  };

  // _rotate = (vector) => {
  //   this.setState(({cameraAngles}) => ({cameraAngles: translateVector(cameraAngles)(vector)}));
  // };

  // _move = (vector) => {
  //   this.setState(({cameraAngles, cameraPosition}) => {
  //     const reversed = scaleVector(-1)(vector);
  //     const rotation = compose(
  //       rotateVectorYZ(cameraAngles[0])(reversed),
  //       rotateVectorXZ(cameraAngles[1])(reversed),
  //       rotateVectorXY(cameraAngles[2])(reversed),
  //     );
  //     const direction = rotation(vector);
  //     const newPosition = inverseTranslateVector(cameraPosition)(direction);
  //     return {cameraPosition: newPosition};
  //   })
  // };

  _rotateLeft = () => {
    this._rotate([0, 0.05, 0]);
  };

  _rotateRight = () => {
    this._rotate([0, -0.05, 0]);
  };

  _lookUp = () => {
    this._rotate([0.05, 0, 0]);
  };

  _lookDown = () => {
    this._rotate([-0.05, 0, 0]);
  };

  _goForward = () => {
    this._move([0, 0, 2]);
  };

  _goBackwards = () => {
    this._move([0, 0, -2]);
  };

  _strafeLeft = () => {
    this._move([-2, 0, 0]);
  };

  _strafeRight = () => {
    this._move([2, 0, 0]);
  };

}

const SIZE = 512;

const containerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: "10px",
  textAlign: "center",
};

const originStyle = {
  position: "absolute",
  left: SIZE / 2,
  top: SIZE / 2,
};

const worldStyle = {
  width: SIZE,
  height: SIZE,
  top: "50%",
  left: "50%",
  marginLeft: -1 * SIZE / 2,
  marginTop: -1 * SIZE / 2,
  position: "absolute",
  border: "1px solid black",
  backgroundColor: "black",
};
