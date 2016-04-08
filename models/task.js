var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, default: ''},
  dateCreated: {type: Date, default: Date.now},
  deadline: {type: Date, required: true},
  assignedUser: {type: String, default: ''},
  assignedUserName: {type: String, default: "unassigned"},
  completed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Task', TaskSchema);
