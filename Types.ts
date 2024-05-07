type _Chars = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export namespace TypesBoolean {
  export type Not<B extends boolean> = B extends true ? false : true;

  export type And<B1 extends boolean, B2 extends boolean> = B1 extends true
    ? B2 extends true
      ? true
      : false
    : false;

  export type Or<B1 extends boolean, B2 extends boolean> = B1 extends true
    ? true
    : B2 extends true
    ? true
    : false;

  export type Xor<B1 extends boolean, B2 extends boolean> = Not<And<B1, B2>>;
}

export namespace TypesNumber {
  export type ToString<N extends number> = `${N}`;

  export type Sign<N extends number> = N extends 0
    ? 0
    : ToString<N> extends `-${any}`
    ? -1
    : 1;

  export type Invert<N extends number> = N extends 0
    ? 0
    : Sign<N> extends 1
    ? TypesString.ToNumber<`-${N}`>
    : ToString<N> extends `-${infer N}`
    ? TypesString.ToNumber<N>
    : never;

  export type Abs<N extends number> = Sign<N> extends 1 ? N : Invert<N>;
}

export namespace TypesString {
  export type ToNumber<N extends string> = N extends TypesNumber.ToString<
    infer N
  >
    ? N
    : never;

  export type ToTupleChars<N extends string> = N extends `${infer F}${infer L}`
    ? [F, ...ToTupleChars<L>]
    : [];

  type _FromTuple<T extends string[], R extends string> = T extends []
    ? R
    : T extends [infer T, ...infer Ts]
    ? T extends string
      ? Ts extends string[]
        ? _FromTuple<Ts, `${R}${T}`>
        : never
      : never
    : never;

  export type FromTuple<T extends string[]> = _FromTuple<T, "">;
}

export namespace TypesIntegerCompare {
  export type Eq<N1 extends number, N2 extends number> = N1 extends N2
    ? true
    : false;

  type _GtCharsTableFalse =
    | "0 > 1"
    | "0 > 2"
    | "0 > 3"
    | "0 > 4"
    | "0 > 5"
    | "0 > 6"
    | "0 > 7"
    | "0 > 8"
    | "0 > 9"
    | "1 > 2"
    | "1 > 3"
    | "1 > 4"
    | "1 > 5"
    | "1 > 6"
    | "1 > 7"
    | "1 > 8"
    | "1 > 9"
    | "2 > 3"
    | "2 > 4"
    | "2 > 5"
    | "2 > 6"
    | "2 > 7"
    | "2 > 8"
    | "2 > 9"
    | "3 > 4"
    | "3 > 5"
    | "3 > 6"
    | "3 > 7"
    | "3 > 8"
    | "3 > 9"
    | "4 > 5"
    | "4 > 6"
    | "4 > 7"
    | "4 > 8"
    | "4 > 9"
    | "5 > 6"
    | "5 > 7"
    | "5 > 8"
    | "5 > 9"
    | "6 > 7"
    | "6 > 8"
    | "6 > 9"
    | "7 > 8"
    | "7 > 9"
    | "8 > 9";

  type _GtChar<
    C1 extends _Chars,
    C2 extends _Chars
  > = `${C1} > ${C2}` extends _GtCharsTableFalse ? false : true;

  type _GtTuple<T1 extends _Chars[], T2 extends _Chars[]> = [T1, T2] extends [
    [infer _C1, ...infer _T1],
    [infer _C2, ...infer _T2]
  ]
    ? _C1 extends _C2
      ? _T1 extends _Chars[] | []
        ? _T2 extends _Chars[] | []
          ? _GtTuple<_T1, _T2>
          : never
        : never
      : _C1 extends _Chars
      ? _C2 extends _Chars
        ? _GtChar<_C1, _C2>
        : never
      : never
    : never;

  type _GtString<
    N1 extends string,
    N2 extends string
  > = TypesTuple.PadStartByPair<
    TypesString.ToTupleChars<N1>,
    TypesString.ToTupleChars<N2>,
    "0"
  > extends { r1: infer R1; r2: infer R2 }
    ? R1 extends _Chars[]
      ? R2 extends _Chars[]
        ? _GtTuple<R1, R2>
        : never
      : never
    : never;

  export type Gt<N1 extends number, N2 extends number> = Eq<N1, N2> extends true
    ? false
    : TypesNumber.Sign<N1> extends TypesNumber.Sign<N2>
    ? TypesNumber.Sign<N1> extends 1
      ? _GtString<`${N1}`, `${N2}`>
      : _GtString<`${TypesNumber.Abs<N2>}`, `${TypesNumber.Abs<N1>}`>
    : TypesNumber.Sign<N1> extends 1
    ? true
    : TypesNumber.Sign<N2> extends -1
    ? true
    : TypesNumber.Sign<N1> extends 0
    ? TypesNumber.Sign<N2> extends 1
      ? false
      : true
    : false;

  export type Lt<N1 extends number, N2 extends number> = N1 extends N2
    ? false
    : TypesBoolean.Not<Gt<N1, N2>>;

  export type Gte<N1 extends number, N2 extends number> = TypesBoolean.Not<
    Lt<N1, N2>
  >;

  export type Lte<N1 extends number, N2 extends number> = TypesBoolean.Not<
    Gt<N1, N2>
  >;

  export type Compare<N1 extends number, N2 extends number> = N1 extends N2
    ? 0
    : Gt<N1, N2> extends true
    ? 1
    : -1;

  type _FindByCompare<
    Ns extends number[],
    _Finded extends number,
    _Selector extends 1 | -1
  > = Ns extends []
    ? _Finded
    : Ns extends [infer N, ...infer R]
    ? N extends number
      ? R extends number[]
        ? _FindByCompare<
            R,
            Compare<N, _Finded> extends _Selector ? N : _Finded,
            _Selector
          >
        : never
      : never
    : never;

  type _FindByCompareEntrypoint<
    Ns extends number[],
    Selector extends 1 | -1
  > = Ns extends []
    ? never
    : Ns extends [infer N, ...infer R]
    ? N extends number
      ? R extends number[]
        ? _FindByCompare<R, N, Selector>
        : never
      : never
    : never;

  export type Max<Ns extends number[]> = _FindByCompareEntrypoint<Ns, 1>;

  export type Min<Ns extends number[]> = _FindByCompareEntrypoint<Ns, -1>;
}

export namespace TypesIntegerArithmetic {
  type _Invert<N> = N extends number
    ? TypesNumber.Invert<N>
    : N extends string
    ? `-${N}`
    : never;

  type _SubtractMap = {
    "0 + (-0)": ["0", "0"];
    "0 + (-1)": ["-1", "9"];
    "0 + (-2)": ["-1", "8"];
    "0 + (-3)": ["-1", "7"];
    "0 + (-4)": ["-1", "6"];
    "0 + (-5)": ["-1", "5"];
    "0 + (-6)": ["-1", "4"];
    "0 + (-7)": ["-1", "3"];
    "0 + (-8)": ["-1", "2"];
    "0 + (-9)": ["-1", "1"];
    "1 + (-0)": ["0", "1"];
    "1 + (-1)": ["0", "0"];
    "1 + (-2)": ["-1", "9"];
    "1 + (-3)": ["-1", "8"];
    "1 + (-4)": ["-1", "7"];
    "1 + (-5)": ["-1", "6"];
    "1 + (-6)": ["-1", "5"];
    "1 + (-7)": ["-1", "4"];
    "1 + (-8)": ["-1", "3"];
    "1 + (-9)": ["-1", "2"];
    "2 + (-0)": ["0", "2"];
    "2 + (-1)": ["0", "1"];
    "2 + (-2)": ["0", "0"];
    "2 + (-3)": ["-1", "9"];
    "2 + (-4)": ["-1", "8"];
    "2 + (-5)": ["-1", "7"];
    "2 + (-6)": ["-1", "6"];
    "2 + (-7)": ["-1", "5"];
    "2 + (-8)": ["-1", "4"];
    "2 + (-9)": ["-1", "3"];
    "3 + (-0)": ["0", "3"];
    "3 + (-1)": ["0", "2"];
    "3 + (-2)": ["0", "1"];
    "3 + (-3)": ["0", "0"];
    "3 + (-4)": ["-1", "9"];
    "3 + (-5)": ["-1", "8"];
    "3 + (-6)": ["-1", "7"];
    "3 + (-7)": ["-1", "6"];
    "3 + (-8)": ["-1", "5"];
    "3 + (-9)": ["-1", "4"];
    "4 + (-0)": ["0", "4"];
    "4 + (-1)": ["0", "3"];
    "4 + (-2)": ["0", "2"];
    "4 + (-3)": ["0", "1"];
    "4 + (-4)": ["0", "0"];
    "4 + (-5)": ["-1", "9"];
    "4 + (-6)": ["-1", "8"];
    "4 + (-7)": ["-1", "7"];
    "4 + (-8)": ["-1", "6"];
    "4 + (-9)": ["-1", "5"];
    "5 + (-0)": ["0", "5"];
    "5 + (-1)": ["0", "4"];
    "5 + (-2)": ["0", "3"];
    "5 + (-3)": ["0", "2"];
    "5 + (-4)": ["0", "1"];
    "5 + (-5)": ["0", "0"];
    "5 + (-6)": ["-1", "9"];
    "5 + (-7)": ["-1", "8"];
    "5 + (-8)": ["-1", "7"];
    "5 + (-9)": ["-1", "6"];
    "6 + (-0)": ["0", "6"];
    "6 + (-1)": ["0", "5"];
    "6 + (-2)": ["0", "4"];
    "6 + (-3)": ["0", "3"];
    "6 + (-4)": ["0", "2"];
    "6 + (-5)": ["0", "1"];
    "6 + (-6)": ["0", "0"];
    "6 + (-7)": ["-1", "9"];
    "6 + (-8)": ["-1", "8"];
    "6 + (-9)": ["-1", "7"];
    "7 + (-0)": ["0", "7"];
    "7 + (-1)": ["0", "6"];
    "7 + (-2)": ["0", "5"];
    "7 + (-3)": ["0", "4"];
    "7 + (-4)": ["0", "3"];
    "7 + (-5)": ["0", "2"];
    "7 + (-6)": ["0", "1"];
    "7 + (-7)": ["0", "0"];
    "7 + (-8)": ["-1", "9"];
    "7 + (-9)": ["-1", "8"];
    "8 + (-0)": ["0", "8"];
    "8 + (-1)": ["0", "7"];
    "8 + (-2)": ["0", "6"];
    "8 + (-3)": ["0", "5"];
    "8 + (-4)": ["0", "4"];
    "8 + (-5)": ["0", "3"];
    "8 + (-6)": ["0", "2"];
    "8 + (-7)": ["0", "1"];
    "8 + (-8)": ["0", "0"];
    "8 + (-9)": ["-1", "9"];
    "9 + (-0)": ["0", "9"];
    "9 + (-1)": ["0", "8"];
    "9 + (-2)": ["0", "7"];
    "9 + (-3)": ["0", "6"];
    "9 + (-4)": ["0", "5"];
    "9 + (-5)": ["0", "4"];
    "9 + (-6)": ["0", "3"];
    "9 + (-7)": ["0", "2"];
    "9 + (-8)": ["0", "1"];
    "9 + (-9)": ["0", "0"];
  };

  type _SubtractCharsWithCharge<
    C1 extends _Chars,
    C2 extends _Chars,
    _Charge extends "0" | "-1"
  > = _Charge extends "0"
    ? _SubtractMap[`${C1} + (-${C2})`]
    : _SubtractMap[`${C1} + (-${C2})`] extends [infer MaybeCharge, infer R]
    ? R extends _Chars
      ? MaybeCharge extends "0"
        ? _SubtractMap[`${R} + (-1)`]
        : ["-1", _SubtractMap[`${R} + (-1)`][1]]
      : never
    : never;

  type _SubtractRemoveZeros<
    T1 extends _Chars[],
    _T1 extends _Chars[]
  > = T1 extends []
    ? _T1
    : T1 extends [infer T1e, ...infer T1s]
    ? T1e extends _Chars
      ? T1s extends _Chars[]
        ? T1e extends "0"
          ? _SubtractRemoveZeros<T1s, _T1>
          : [..._T1, ...T1]
        : never
      : never
    : never;

  type _SubtractByTuple<
    T1 extends _Chars[],
    T2 extends _Chars[],
    R extends _Chars[],
    _Charge extends "0" | "-1"
  > = T1 extends []
    ? _Charge extends "0"
      ? _SubtractRemoveZeros<R, []>
      : never
    : T1 extends [...infer T1s, infer T1e]
    ? T2 extends [...infer T2s, infer T2e]
      ? T1e extends _Chars
        ? T2e extends _Chars
          ? T1s extends _Chars[]
            ? T2s extends _Chars[]
              ? _SubtractCharsWithCharge<T1e, T2e, _Charge> extends [
                  infer NextCharge,
                  infer Ending
                ]
                ? NextCharge extends "0" | "-1"
                  ? Ending extends _Chars
                    ? _SubtractByTuple<T1s, T2s, [Ending, ...R], NextCharge>
                    : never
                  : never
                : never
              : never
            : never
          : never
        : never
      : never
    : never;

  type _Subtract<N1 extends number, N2 extends number> = N1 extends N2
    ? 0
    : TypesTuple.PadStartByPair<
        TypesString.ToTupleChars<`${N1}`>,
        TypesString.ToTupleChars<`${N2}`>,
        "0"
      > extends { r1: infer R1; r2: infer R2 }
    ? R1 extends _Chars[]
      ? R2 extends _Chars[]
        ? TypesString.ToNumber<
            TypesString.FromTuple<_SubtractByTuple<R1, R2, [], "0">>
          >
        : never
      : never
    : never;

  type _AddMap = {
    "0 + 0": ["0", "0"];
    "0 + 1": ["0", "1"];
    "0 + 2": ["0", "2"];
    "0 + 3": ["0", "3"];
    "0 + 4": ["0", "4"];
    "0 + 5": ["0", "5"];
    "0 + 6": ["0", "6"];
    "0 + 7": ["0", "7"];
    "0 + 8": ["0", "8"];
    "0 + 9": ["0", "9"];
    "1 + 0": ["0", "1"];
    "1 + 1": ["0", "2"];
    "1 + 2": ["0", "3"];
    "1 + 3": ["0", "4"];
    "1 + 4": ["0", "5"];
    "1 + 5": ["0", "6"];
    "1 + 6": ["0", "7"];
    "1 + 7": ["0", "8"];
    "1 + 8": ["0", "9"];
    "1 + 9": ["1", "0"];
    "2 + 0": ["0", "2"];
    "2 + 1": ["0", "3"];
    "2 + 2": ["0", "4"];
    "2 + 3": ["0", "5"];
    "2 + 4": ["0", "6"];
    "2 + 5": ["0", "7"];
    "2 + 6": ["0", "8"];
    "2 + 7": ["0", "9"];
    "2 + 8": ["1", "0"];
    "2 + 9": ["1", "1"];
    "3 + 0": ["0", "3"];
    "3 + 1": ["0", "4"];
    "3 + 2": ["0", "5"];
    "3 + 3": ["0", "6"];
    "3 + 4": ["0", "7"];
    "3 + 5": ["0", "8"];
    "3 + 6": ["0", "9"];
    "3 + 7": ["1", "0"];
    "3 + 8": ["1", "1"];
    "3 + 9": ["1", "2"];
    "4 + 0": ["0", "4"];
    "4 + 1": ["0", "5"];
    "4 + 2": ["0", "6"];
    "4 + 3": ["0", "7"];
    "4 + 4": ["0", "8"];
    "4 + 5": ["0", "9"];
    "4 + 6": ["1", "0"];
    "4 + 7": ["1", "1"];
    "4 + 8": ["1", "2"];
    "4 + 9": ["1", "3"];
    "5 + 0": ["0", "5"];
    "5 + 1": ["0", "6"];
    "5 + 2": ["0", "7"];
    "5 + 3": ["0", "8"];
    "5 + 4": ["0", "9"];
    "5 + 5": ["1", "0"];
    "5 + 6": ["1", "1"];
    "5 + 7": ["1", "2"];
    "5 + 8": ["1", "3"];
    "5 + 9": ["1", "4"];
    "6 + 0": ["0", "6"];
    "6 + 1": ["0", "7"];
    "6 + 2": ["0", "8"];
    "6 + 3": ["0", "9"];
    "6 + 4": ["1", "0"];
    "6 + 5": ["1", "1"];
    "6 + 6": ["1", "2"];
    "6 + 7": ["1", "3"];
    "6 + 8": ["1", "4"];
    "6 + 9": ["1", "5"];
    "7 + 0": ["0", "7"];
    "7 + 1": ["0", "8"];
    "7 + 2": ["0", "9"];
    "7 + 3": ["1", "0"];
    "7 + 4": ["1", "1"];
    "7 + 5": ["1", "2"];
    "7 + 6": ["1", "3"];
    "7 + 7": ["1", "4"];
    "7 + 8": ["1", "5"];
    "7 + 9": ["1", "6"];
    "8 + 0": ["0", "8"];
    "8 + 1": ["0", "9"];
    "8 + 2": ["1", "0"];
    "8 + 3": ["1", "1"];
    "8 + 4": ["1", "2"];
    "8 + 5": ["1", "3"];
    "8 + 6": ["1", "4"];
    "8 + 7": ["1", "5"];
    "8 + 8": ["1", "6"];
    "8 + 9": ["1", "7"];
    "9 + 0": ["0", "9"];
    "9 + 1": ["1", "0"];
    "9 + 2": ["1", "1"];
    "9 + 3": ["1", "2"];
    "9 + 4": ["1", "3"];
    "9 + 5": ["1", "4"];
    "9 + 6": ["1", "5"];
    "9 + 7": ["1", "6"];
    "9 + 8": ["1", "7"];
    "9 + 9": ["1", "8"];
  };

  type _AddCharsWithCharge<
    C1 extends _Chars,
    C2 extends _Chars,
    _Charge extends "0" | "1"
  > = _Charge extends "0"
    ? _AddMap[`${C1} + ${C2}`]
    : _AddMap[`${C1} + ${C2}`] extends [infer MaybeCharge, infer R]
    ? R extends _Chars
      ? MaybeCharge extends "0"
        ? _AddMap[`${R} + 1`]
        : ["1", _AddMap[`${R} + 1`][1]]
      : never
    : never;

  type _AddByTuple<
    T1 extends _Chars[],
    T2 extends _Chars[],
    R extends _Chars[],
    _Charge extends "0" | "1"
  > = T1 extends []
    ? _Charge extends "0"
      ? R
      : ["1", ...R]
    : T1 extends [...infer T1s, infer T1e]
    ? T2 extends [...infer T2s, infer T2e]
      ? T1e extends _Chars
        ? T2e extends _Chars
          ? T1s extends _Chars[]
            ? T2s extends _Chars[]
              ? _AddCharsWithCharge<T1e, T2e, _Charge> extends [
                  infer NextCharge,
                  infer Ending
                ]
                ? NextCharge extends "0" | "1"
                  ? Ending extends _Chars
                    ? _AddByTuple<T1s, T2s, [Ending, ...R], NextCharge>
                    : never
                  : never
                : never
              : never
            : never
          : never
        : never
      : never
    : never;

  type _Add<N1 extends number, N2 extends number> = TypesTuple.PadStartByPair<
    TypesString.ToTupleChars<`${N1}`>,
    TypesString.ToTupleChars<`${N2}`>,
    "0"
  > extends { r1: infer R1; r2: infer R2 }
    ? R1 extends _Chars[]
      ? R2 extends _Chars[]
        ? TypesString.ToNumber<
            TypesString.FromTuple<_AddByTuple<R1, R2, [], "0">>
          >
        : never
      : never
    : never;

  type _AbsSorter<
    N1 extends number,
    N2 extends number
  > = TypesNumber.Abs<N1> extends infer AN1
    ? TypesNumber.Abs<N2> extends infer AN2
      ? AN1 extends number
        ? AN2 extends number
          ? TypesIntegerCompare.Gt<AN1, AN2> extends true
            ? [
                Max: AN1,
                Min: AN2,
                Invert: TypesNumber.Sign<N1> extends -1 ? true : false
              ]
            : [
                Max: AN2,
                Min: AN1,
                Invert: TypesNumber.Sign<N2> extends -1 ? true : false
              ]
          : never
        : never
      : never
    : never;

  type _AddSwitcher<
    N1 extends number,
    N2 extends number
  > = TypesNumber.Sign<N1> extends TypesNumber.Sign<N2>
    ? N1 extends 0
      ? 0
      : TypesNumber.Sign<N1> extends 1
      ? _Add<N1, N2>
      : _Invert<_Add<TypesNumber.Abs<N1>, TypesNumber.Abs<N2>>>
    : TypesIntegerCompare.Min<
        [TypesNumber.Sign<N1>, TypesNumber.Sign<N2>]
      > extends -1
    ? _AbsSorter<N1, N2> extends [infer Max, infer Min, infer NeedInvert]
      ? Min extends number
        ? Max extends number
          ? NeedInvert extends false
            ? _Subtract<Max, Min>
            : _Invert<_Subtract<Max, Min>>
          : never
        : never
      : never
    : _Add<N1, N2>;

  export type Add<N1 extends number, N2 extends number> = _AddSwitcher<N1, N2>;

  export type Subtract<N1 extends number, N2 extends number> = Add<
    N1,
    TypesNumber.Invert<N2>
  >;
}

export namespace TypesTuple {
  export type Reverse<T extends any[]> = T extends [infer F, ...infer R]
    ? [...Reverse<R>, F]
    : T;

  type _PadStartByPair<
    T1 extends any[],
    T2 extends any[],
    Empty = void,
    _R1 extends any[] = [],
    _R2 extends any[] = []
  > = T1 extends []
    ? T2 extends []
      ? { r1: _R1; r2: _R2 }
      : T2 extends [infer F2, ...infer R2]
      ? _PadStartByPair<T1, R2, Empty, [Empty, ..._R1], [..._R2, F2]>
      : never
    : T1 extends [infer F1, ...infer R1]
    ? T2 extends []
      ? _PadStartByPair<R1, T2, Empty, [..._R1, F1], [Empty, ..._R2]>
      : T2 extends [infer F2, ...infer R2]
      ? _PadStartByPair<R1, R2, Empty, [..._R1, F1], [..._R2, F2]>
      : never
    : never;

  export type PadStartByPair<
    T1 extends any[],
    T2 extends any[],
    Empty = void
  > = _PadStartByPair<T1, T2, Empty>;
}
