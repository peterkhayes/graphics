import React from "react";
import Point from "./Point";
import KeyHandler, {KEYDOWN} from "react-key-handler";

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

export default class App extends React.Component {

  constructor () {
    super();
    this.state = {
      points: times(randPoint, 1500),
      cameraPosition: [0, 0, 0],
      cameraAngle: 0,
    }
  }

  render () {
    return (
      <div style={containerStyle}>
        <div style={gridStyle}>
          {this._renderPoints()}
        </div>
        <KeyHandler keyEventName={KEYDOWN} keyValue="w" onKeyHandle={this._goForward} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="s" onKeyHandle={this._goBackwards} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="a" onKeyHandle={this._rotateLeft} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="d" onKeyHandle={this._rotateRight} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="q" onKeyHandle={this._strafeLeft} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="e" onKeyHandle={this._strafeRight} />
      </div>
    );

  }

  _renderPoints () {
    /*
      rotate XZ to make camera angle 0
      anything with Z < FOCAL_LENGTH is not in frame.
      projected X = FOCAL_LENGTH * pz / px
      projected Y = FOCAL_LENGTH * pz / py
      anything with projected X or Y not in WINDOW_SIZE is not in frame
      display projected X and projected Y
    */
    const {points, cameraAngle, cameraPosition} = this.state;

    return points
      .map(inverseTranslateVector(cameraPosition))
      .map(rotateVectorXZ(cameraAngle))
      .map((point, i) => {
        const [px, py, pz] = point;
        if (pz < CAMERA_DIST) return null;

        const x = px / pz;
        const y = py / pz;

        if (Math.abs(x) > CAMERA_WIDTH || Math.abs(y) > CAMERA_WIDTH) return null;

        return <Point key={i} x={x} y={y} distance={length([px, py, pz])} />;
      })
      .filter(Boolean);
  }

  _rotateLeft = () => {
    this._rotate(0.05);
  };

  _rotateRight = () => {
    this._rotate(-0.05);
  };

  _goForward = () => {
    this._move([0, 0, 3]);
  };

  _goBackwards = () => {
    this._move([0, 0, -3]);
  };

  _strafeLeft = () => {
    this._move([-2, 0, 0]);
  };

  _strafeRight = () => {
    this._move([2, 0, 0]);
  };

  _rotate = (angle) => {
    this.setState(({cameraAngle}) => ({cameraAngle: cameraAngle + angle}));
  };

  _move = (vector) => {
    this.setState(({cameraAngle, cameraPosition}) => {
      const direction = rotateVectorXZ(-1 * cameraAngle)(vector)
      const newPosition = inverseTranslateVector(cameraPosition)(direction);
      return {cameraPosition: newPosition};
    })
  };

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
  margin: "20px auto",
  position: "relative",
  backgroundColor: "black",
};
