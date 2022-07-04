export class Queue extends Array {
  current: string;
  constructor() {
    super();
    this.current = null;
  }
}
