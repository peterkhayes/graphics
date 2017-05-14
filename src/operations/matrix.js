export const multiplyMatrix = ([[a1, a2, a3], [b1, b2, b3], [c1, c2, c3]]) => ([x, y, z]) => [
  a1 * x + a2 * y + a3 * z,
  b1 * x + b2 * y + b3 * z,
  c1 * x + c2 * y + c3 * z,
];
