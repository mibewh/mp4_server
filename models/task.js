var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  dateCreated: Date,
  deadline: Date,
  assignedUser: String,
  assignedUserName: String,
  completed: Boolean
});

module.exports = mongoose.model('Task', TaskSchema);
