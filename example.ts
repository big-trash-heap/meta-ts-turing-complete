import * as Meta from "./Types";

function sum_int<N1 extends number, N2 extends number>(
  n1: N1,
  n2: N2
): Meta.TypesIntegerArithmetic.Add<N1, N2> {
  if (!Number.isInteger(n1) || !Number.isInteger(n2)) {
    throw new Error("Arguments must be integers");
  }
  return (n1 + n2) as any;
}

const x = sum_int(115, 2462);
const y = sum_int(-6543, 1234);
const z = sum_int(x, y);

// print: { x: 2577, y: -5309, z: -2732 }
console.log({ x, y, z });
