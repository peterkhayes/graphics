export const randInt = () => Math.floor(Math.random() * 256) - 128;

export const randPoint = () => [randInt(), randInt(), randInt()];