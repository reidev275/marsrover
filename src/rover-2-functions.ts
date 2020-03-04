export type Heading = "north" | "south" | "east" | "west";
export type Position = {
  heading: Heading;
  x: number;
  y: number;
};

export const forward = (pos: Position): Position => {
  switch (pos.heading) {
    case "north":
      return { ...pos, y: pos.y + 1 };
    case "south":
      return { ...pos, y: pos.y - 1 };
    case "east":
      return { ...pos, x: pos.x + 1 };
    case "west":
      return { ...pos, x: pos.x - 1 };
  }
};

export const right = (pos: Position): Position => {
  switch (pos.heading) {
    case "north":
      return { ...pos, heading: "east" };
    case "south":
      return { ...pos, heading: "west" };
    case "east":
      return { ...pos, heading: "south" };
    case "west":
      return { ...pos, heading: "north" };
  }
};

export const left = (pos: Position): Position => right(right(right(pos)));

export const backward = (pos: Position): Position =>
  right(right(forward(right(right(pos)))));

console.log(
  backward(forward(left(forward(right({ x: 0, y: 0, heading: "north" })))))
);

// ==============================================
// separating behavior from data with functions
// ==============================================

// THE GOOD
// ---------
// very little code
// new behavior can be defined anywhere (including by non owners of this core code)
// immutable data so that there are no concerns about threading
// all behavior functions are Position -> Position so they compose indefinitely

// THE BAD
// ---------
// the instructions read right to left
// we can't "dot" into available methods like the OO approach
// we are explicitly tied to in memory mutation with this approach
