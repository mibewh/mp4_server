var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
  email: {type: String},
  dateCreated: Date,
  pendingTasks: [String]
});

module.exports = mongoose.model('User', UserSchema);
