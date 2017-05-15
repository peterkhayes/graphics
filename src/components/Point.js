import React from "react";

export default function Point ({x, y, distance}) {
  const style = {
    position: "absolute",
    left: 256 * x,
    bottom: 256 * y,
    backgroundColor: `hsl(240, 0%, ${100 - Math.min(distance / 2, 100)}%)`,
    width: 2,
    height: 2,
    borderRadius: "50%",
  }

  return <div style={style} />;
}