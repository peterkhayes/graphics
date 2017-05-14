import React from "react";

export default function Point ({x, y, dist}) {
  const style = {
    position: "absolute",
    left: 2 * x,
    bottom: 2 * y,
    backgroundColor: `hsl(0, 0%, ${(dist + 128) * 100 / 256}%)`,
    width: 2,
    height: 2,
    borderRadius: "50%",
  }
  return <div style={style} />;
}