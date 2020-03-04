export type Heading = "north" | "south" | "east" | "west";

export class Rover {
  constructor(
    private x: number = 0,
    private y: number = 0,
    private heading: Heading = "north"
  ) {}

  forward() {
    switch (this.heading) {
      case "north":
        this.y += 1;
        break;
      case "south":
        this.y += -1;
        break;
      case "east":
        this.x += 1;
        break;
      case "west":
        this.x += -1;
        break;
    }
  }

  right() {
    switch (this.heading) {
      case "north":
        this.heading = "east";
        break;
      case "east":
        this.heading = "south";
        break;
      case "south":
        this.heading = "west";
        break;
      case "west":
        this.heading = "north";
        break;
    }
  }

  left() {
    // Zoolander implementation
    this.right();
    this.right();
    this.right();
  }

  backward() {
    this.right();
    this.right();
    this.forward();
    this.right();
    this.right();
  }

  data() {
    return { x: this.x, y: this.y, heading: this.heading };
  }
}

let rover = new Rover();
rover.right();
rover.forward();
rover.left();
rover.forward();
rover.backward();

console.log(rover.data());
//{ x: 1, y: 0, heading: 'north' }

// =========================================================================
// Object Oriented design with mutable state
// =========================================================================

// THE GOOD
// ---------
// very little code, 1 class and 1 enum

// THE BAD
// ---------
// instructions to the rover must be passed individually as a list of statements no composition possible
// instructions must be defined within the class (extension methods, modifying prototype is possible but can be dangerous)
// our data is coupled with behavior
// data is mutable making multithreaded code an issue
// we have to write an explicit data() method because the class combines state and behavior
// we are explicitly tied to in memory mutation with this approach
