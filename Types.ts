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

  export type ToCharTuple<N extends string> = N extends `${infer F}${infer L}`
    ? [F, ...ToCharTuple<L>]
    : [];
}

export namespace TypesIntegerCompare {
  export type Eq<N1 extends number, N2 extends number> = N1 extends N2
    ? true
    : false;

  type _Chars = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

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
    TypesString.ToCharTuple<N1>,
    TypesString.ToCharTuple<N2>,
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
