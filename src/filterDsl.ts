export type Filter<A> =
  | { kind: "Equals"; field: keyof A; val: A[keyof A] }
  | { kind: "Greater"; field: keyof A; val: A[keyof A] }
  | { kind: "Less"; field: keyof A; val: A[keyof A] }
  | { kind: "And"; a: Filter<A>; b: Filter<A> }
  | { kind: "Or"; a: Filter<A>; b: Filter<A> };

//core
export const equals = <A, K extends keyof A>(
  field: K,
  val: A[K]
): Filter<A> => ({
  kind: "Equals",
  field,
  val
});
export const greater = <A, K extends keyof A>(
  field: K,
  val: A[K]
): Filter<A> => ({
  kind: "Greater",
  field,
  val
});
export const less = <A, K extends keyof A>(field: K, val: A[K]): Filter<A> => ({
  kind: "Less",
  field,
  val
});
export const and = <A>(a: Filter<A>, b: Filter<A>): Filter<A> => ({
  kind: "And",
  a,
  b
});
export const or = <A>(a: Filter<A>, b: Filter<A>): Filter<A> => ({
  kind: "Or",
  a,
  b
});

/*
 * Derived operations
 * These combine core language features to extend the language
 */

//greater than or equal
export const gte = <A, K extends keyof A>(field: K, val: A[K]): Filter<A> =>
  or(greater(field, val), equals(field, val));

//less than or equal
export const lte = <A, K extends keyof A>(field: K, val: A[K]): Filter<A> =>
  or(less(field, val), equals(field, val));

//combine 1 to many filters returning true if all are true (and)
export const all = <A>(...dsl: Filter<A>[]): Filter<A> =>
  dsl.reduce((p, c) => and(p, c));

//combine 1 to many filters returning true if any are true (or)
export const any = <A>(...dsl: Filter<A>[]): Filter<A> =>
  dsl.reduce((p, c) => or(p, c));

//essentially sql's in operator.  Given a field and a collection of values
//this returns true if any are true.
export const oneOf = <A, K extends keyof A>(
  field: keyof A,
  ...vals: A[K][]
): Filter<A> => any(...vals.map(x => equals(field, x)));

/*
 * Interpreters
 */

const interpretToSql = <A>(dsl: Filter<A>): string => {
  switch (dsl.kind) {
    case "Equals":
      return `[${dsl.field}] = '${dsl.val}'`;
    case "Greater":
      return `[${dsl.field}] > '${dsl.val}'`;
    case "Less":
      return `[${dsl.field}] < '${dsl.val}'`;
    case "And":
      return `(${interpretToSql(dsl.a)} and ${interpretToSql(dsl.b)})`;
    case "Or":
      return `(${interpretToSql(dsl.a)} or ${interpretToSql(dsl.b)})`;
  }
};

/*
 * Example
 */

// a sample data model
interface JobPosting {
  manager: string;
  salary: number;
}

//a filter of the data model
const query: Filter<JobPosting> = and(
  equals("manager", "Bob Slydell"),
  greater("salary", 50000)
);

//underlying data representation
console.log(query);

//sql created by interpreting the data model
console.log(interpretToSql(query));
