const EventEmitter = require('events');
class TaskEvents extends EventEmitter {}

// We export a single instance so all parts of the app use the same event emitter
module.exports = new TaskEvents();
