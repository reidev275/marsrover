export type Heading = "north" | "south" | "east" | "west";
export type Position = {
  heading: Heading;
  x: number;
  y: number;
};

interface IRoverMovementStrategy {
  move(x: Position): Position;
}

class Forward implements IRoverMovementStrategy {
  move(x: Position): Position {
    switch (x.heading) {
      case "north":
        return { ...x, y: x.y + 1 };
      case "south":
        return { ...x, y: x.y - 1 };
      case "east":
        return { ...x, x: x.x + 1 };
      case "west":
        return { ...x, x: x.x - 1 };
    }
  }
}

class Right implements IRoverMovementStrategy {
  move(x: Position): Position {
    switch (x.heading) {
      case "north":
        return { ...x, heading: "east" };
      case "south":
        return { ...x, heading: "west" };
      case "east":
        return { ...x, heading: "south" };
      case "west":
        return { ...x, heading: "north" };
    }
  }
}

// composing strategies
class Left implements IRoverMovementStrategy {
  move(x: Position) {
    const right = new Right().move;
    return right(right(right(x)));
  }
}

class Backward implements IRoverMovementStrategy {
  move(x: Position) {
    const [forward, right] = [new Forward().move, new Right().move];
    return right(right(forward(right(right(x)))));
  }
}

class Program implements IRoverMovementStrategy {
  move(x: Position) {
    const [forward, right, left, backward] = [
      new Forward().move,
      new Right().move,
      new Left().move,
      new Backward().move
    ];
    return backward(forward(left(forward(right(x)))));
  }
}

console.log(
  new Program().move({
    x: 0,
    y: 0,
    heading: "north"
  })
);

// =========================================================================
// Object Oriented strategy pattern implementation
// =========================================================================

// THE GOOD
// ---------
// can now create custom instructions as new classes
// data is immutable removing multithreading issues
// we can reuse existing strategies to build new strategies

// THE BAD
// ---------
// instructions written right to left
// we are explicitly tied to in memory operations with this approach
