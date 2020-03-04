import { left, right, forward, backward } from "./rover-2-functions";

//type for an isomorphic function
//any function from some type to the same type
//left, right, forward, and backward are all functions from Position to Position
type Iso<A> = (a: A) => A;

// once we realize all isomorphic functions are monoids we can write
// this go function which combines 0 to infinite instructions into a single
// instruction.
// The spread operator allows us to omit the brackets in calling code.
export const go = <A>(...isos: Iso<A>[]): Iso<A> =>
  isos.reduce(
    (a: Iso<A>, b: Iso<A>): Iso<A> => x => b(a(x)), //append
    x => x //empty
  );

const directions = go(right, forward, left, forward, backward);

console.log(directions({ x: 0, y: 0, heading: "north" }));

// ==============================================
// Monoidally combining function instructions
// ==============================================

// THE GOOD
// ---------
// all of the good from the function based approach
// instructions are now issued left to right so they make more sense

// THE BAD
// ---------
// it can be a mindshift to think of functions as arguments to the go function
// we are explicitly tied to in memory mutation with this approach
