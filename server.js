// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var User = require('./models/user');
var Task = require('./models/task');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://admin:admin@ds015750.mlab.com:15750/mwhitma2-mp4');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

function getParam(param) {
  return eval("("+param+")");
}

//Llama route
var llamasRoute = router.route('/llamas');

llamasRoute.post(function(req, res) {
	var llama = new Llama();
	llama.name = req.body.name;
	llama.height = req.body.height;

	llama.save(function(err){
		if(err)
			res.send(err);
		res.json({message: 'llama added to the datamase!', data: llama});
	});
});

llamasRoute.get(function(req, res) {
	// var sort = eval("("+req.query.sort+")");
	Llama.find()
	.sort(getParam(req.query.sort))
	.exec(function(err, llamas) {
		if(err)
			res.send(err);
		res.json(llamas);
	});
  // res.json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
});

var llamaRoute = router.route('/llamas/:llama-id');

llamaRoute.get(function(req, res) {
	Llama.findById(req.params.llama_id, function(err, llama) {
		if(err) res.send(err);
		res.json(llama);
	});
});

llamaRoute.delete(function(req, res) {
	Llama.findByIdAndRemove(req.params.llama_id, function(err) {
		if(err) res.send(err);
		res.json({message: 'Llama deleted from the database'});
	});
});

//Add more routes here

//Users

var usersRoute = router.route('/users');

usersRoute.get(function(req, res) {
  //Count
  if(req.query.count) {
    User.count(getParam(req.query.where))
    .exec(function(err, count) {
      if(err) {
        res.status(500);
        res.send(err);
      }
      res.json({"message": "OK", "data": count});
    });
  }
  else {
    User.find(getParam(req.query.where))
    .limit(req.query.limit)
    .skip(req.query.skip)
    .sort(getParam(req.query.sort))
    .select(getParam(req.query.select))
    .exec(function(err, users) {
      if(err) {
        res.status(500);
        res.send(err);
      }
      else res.json({"message": "OK", "data": users});
    });
  }
});
usersRoute.post(function(req, res) {
  //Check already in database
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.dateCreated = new Date();
  user.pendingTasks = [];
  user.save(function(err) {
    if(err) {
      //Duplicate email
      res.status(500);
      if(err.code == 11000) {
        res.json({message: 'Email already exists', data: []});
      } else {
        res.send(err);
      }
    } else {
      res.status(201);
      res.json({message: 'User added to database', data: user});
    }
  });
});
usersRoute.options(function(req, res){
      res.writeHead(200);
      res.end();
});

var userRoute = router.route('/users/:id');

userRoute.get(function(req, res) {
  User.findById(req.params.id, function(err, user) {
		if(err) {
      res.status(404);
      res.json({message: 'User not found', data: []});
    } else {
      res.json({message: 'OK', data: user});
    }
  });
});
userRoute.put(function(req, res) {
  User.findOneAndUpdate({_id: req.params.id}, req.body, function(err, user) {
    if(err) {
      if(err.code == 11000) {
        res.status(500);
        res.json({message: 'Email already exists', data: []});
      } else {
        res.status(404);
        res.json({message: 'User not found', data: []});
      }
    } else {
      res.status(200);
      res.json({message: "User updated", data: user});
    }
  });
});
userRoute.delete(function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(!user) { //No user was found
      res.status(404);
      res.json({message: 'User not found', data: []});
    } else {
      res.json({message: 'User deleted', data: []});
    }
  });
});

//Tasks

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
