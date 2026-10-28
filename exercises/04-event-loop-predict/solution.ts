// A: síncrono (A, D) → microtarea (C) → macrotarea (B)
export const predictionA = ["A", "D", "C", "B"];

// B: las then encadenadas son microtareas y van antes de cualquier timeout.
// Después de cada macrotarea se vacían las microtareas: "promise inside timeout"
// sale antes de "timeout 3".
export const predictionB = [
  "then 1",
  "then 2",
  "timeout 1",
  "timeout 2",
  "promise inside timeout",
  "timeout 3",
];

// C: el executor de una promesa y el código de una función async hasta el primer
// await son síncronos. Las continuaciones se encolan en orden.
export const predictionC = [
  "script start",
  "load start",
  "promise executor",
  "script end",
  "load end",
  "promise then",
];
