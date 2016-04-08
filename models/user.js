var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  dateCreated: {type: Date, default: Date.now},
  pendingTasks: [String]
});

module.exports = mongoose.model('User', UserSchema);
