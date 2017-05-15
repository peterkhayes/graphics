import {compose} from "lodash/fp";
import {multiplyMatrix} from "./matrix";

export const dotProduct = ([x1, y1, z1]) => ([x2, y2, z2]) => x1 * x2 + y1 * y2 + z1 * z2;

export const vectorLength = ([x, y, z]) => Math.sqrt(x * x + y * y + z * z);

export const angleBetween = (u, v) => Math.arccos(dotProduct(u)(v) / (vectorLength(u) * vectorLength(v)));

export const translateVector = ([x1, y1, z1]) => ([x2, y2, z2]) => [x1 + x2, y1 + y2, z1 + z2];

export const rotateVectorXY = (rad) => multiplyMatrix([
  [Math.cos(rad), -1 * Math.sin(rad), 0],
  [Math.sin(rad), Math.cos(rad), 0],
  [0, 0, 1],
]);

export const rotateVectorXZ = (rad) => multiplyMatrix([
  [Math.cos(rad), 0, Math.sin(rad)],
  [0, 1, 0],
  [-1 * Math.sin(rad), 0, Math.cos(rad)],
]);

export const rotateVectorYZ = (rad) => multiplyMatrix([
  [1, 0, 0],
  [0, Math.cos(rad), -1 * Math.sin(rad)],
  [0, Math.sin(rad), Math.cos(rad)],
]);

export const rotateVector = ([yz, xz, xy]) => compose(
  rotateVectorXY(xy),
  rotateVectorXZ(xz),
  rotateVectorYZ(yz),
);

export const scaleVector = (amt) => ([x, y, z]) => [amt * x, amt * y, amt * z];
export const reverseVector = scaleVector(-1);