export type Heading = "north" | "south" | "east" | "west";

export class Rover {
  constructor(
    private readonly x: number = 0,
    private readonly y: number = 0,
    private readonly heading: Heading = "north"
  ) {}

  forward(): Rover {
    switch (this.heading) {
      case "north":
        return new Rover(this.x, this.y + 1, this.heading);
      case "south":
        return new Rover(this.x, this.y - 1, this.heading);
      case "east":
        return new Rover(this.x + 1, this.y, this.heading);
      case "west":
        return new Rover(this.x - 1, this.y, this.heading);
    }
  }

  right(): Rover {
    switch (this.heading) {
      case "north":
        return new Rover(this.x, this.y, "east");
      case "east":
        return new Rover(this.x, this.y, "south");
      case "south":
        return new Rover(this.x, this.y, "west");
      case "west":
        return new Rover(this.x, this.y, "north");
    }
  }

  left(): Rover {
    // Zoolander implementation
    return this.right()
      .right()
      .right();
  }

  backward(): Rover {
    return this.right()
      .right()
      .forward()
      .right()
      .right();
  }

  data() {
    // kills the fluent stuff
    return { x: this.x, y: this.y, heading: this.heading };
  }
}

// now have a singular expression chain
console.log(
  new Rover()
    .right()
    .forward()
    .left()
    .forward()
    .backward()
    .data()
);
//{ x: 1, y: 0, heading: 'north' }

// =========================================================================
// Object Oriented design with immutable data and a fluent interface.
// =========================================================================

// THE GOOD
// ---------
// very little code, 1 class and 1 enum
// Instructions can be chained together in a readable format.
// data is immutable removing multithreading issues

// THE BAD
// ---------
// instructions must be defined within the class
// the fluent style only works until a call to data() is found
// we have to write an explicit data() method because the class combines state and behavior
// we are explicitly tied to in memory operations with this approach
// more GC pressure
