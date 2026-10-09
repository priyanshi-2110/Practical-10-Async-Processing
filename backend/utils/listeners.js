const taskEvents = require('./events');

// Listener for when a task is created
taskEvents.on('task-created', (task) => {
  // Simulate a slow notification handler with a 2-second delay
  setTimeout(() => {
    console.log(`[Notification] Task "${task.title}" created at ${new Date().toISOString()}`);
  }, 2000);
});

// Listener for when a task is deleted
taskEvents.on('task-deleted', (taskId) => {
  console.log(`[Notification] Task ID "${taskId}" deleted at ${new Date().toISOString()}`);
});

// Listener for errors thrown by events
taskEvents.on('error', (error) => {
  console.error(`[Notification] Event Error Caught:`, error);
});
