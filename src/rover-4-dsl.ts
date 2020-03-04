import { Heading, Position } from "./rover-2-functions";
import { go } from "./rover-3-monoids";

//recursive, sum type data structure with our core commands and type
export type DslC =
  | { kind: "position"; a: Position }
  | { kind: "forward"; a: DslC }
  | { kind: "right"; a: DslC };

/*
 * function helpers to create different DslC values
 * 1 for each case
 */
export const pos = (a: Position): DslC => ({
  kind: "position",
  a
});

export const forward = (a: DslC): DslC => ({
  kind: "forward",
  a
});

export const right = (a: DslC): DslC => ({
  kind: "right",
  a
});

/*
 * evaluators
 */
const _right = (x: Heading) => {
  switch (x) {
    case "north":
      return "east";
    case "east":
      return "south";
    case "south":
      return "west";
    case "west":
      return "north";
  }
};

const _forward = (x: Position): Position => {
  switch (x.heading) {
    case "north":
      return { ...x, y: x.y + 1 };
    case "east":
      return { ...x, x: x.x + 1 };
    case "south":
      return { ...x, y: x.y - 1 };
    case "west":
      return { ...x, y: x.x - 1 };
  }
};

//simple recursive evaluation of our recursive data type
export const evaluate = (a: DslC): Position => {
  switch (a.kind) {
    case "position":
      return a.a;
    case "forward":
      const pf = evaluate(a.a);
      return _forward(pf);
    case "right":
      const pr = evaluate(a.a);
      return { ...pr, heading: _right(pr.heading) };
  }
};

// user created programs that can be infinitely nested
const left = go(right, right, right);
const backward = go(right, right, forward, right, right);

const directions = go(right, forward, left, forward, backward);

const raw = directions(pos({ heading: "north", x: 0, y: 0 }));
console.log(JSON.stringify(raw));
//{ kind: 'forward',
//  a: { kind: 'right', a: { kind: 'forward', a: [Object] } } }

// we can now evaluate our program
const result = evaluate(raw);
console.log(result);

//could extend our implementation to any effect
//in this case we could use async communication
//to a remote server via promises
export const evaluateP = async (a: DslC): Promise<Position> => {
  switch (a.kind) {
    case "position":
      return a.a;
    case "forward":
      const pf = await evaluate(a.a);
      return _forward(pf);
    case "right":
      const pr = await evaluate(a.a);
      return { ...pr, heading: _right(pr.heading) };
  }
};

// ==============================================
// Creating a recursive DSL
// ==============================================

// THE GOOD
// ---------
// new behavior can be defined anywhere (including by non owners of this core code)
// immutable data so that there are no concerns about threading
// instructions are issued left to right so they make more sense
// any program written in our DSL is just data.
// the data can be serialized and sent to a server to run
// no longer tied to in memory effects.
// the same program can be interpreted in memory or via async functions
// centralized logging and error handling in the interpreter
// written the same way almost every programming language you've ever used was written

// THE BAD
// ---------
// It takes more code to get here.
// Javascript doesn't support tail call optimization so it's possible to hit a stack overflow
//      if a simple recursive function is used for the interpreter.  See Trampolines
