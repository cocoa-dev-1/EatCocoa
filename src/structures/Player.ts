import { Queue } from "./Queue";

export class Player {
  queue: Queue;
  constructor() {
    this.queue = new Queue();
  }
  async play() {}
}
