export default class GameObject {

  constructor(context) {
    this.context = context;
    if (!this.context) {
      throw new Error('Context is required during initialization of GameObject.');
    }
    this.initialize();
  }

  initialize() {

  }
}