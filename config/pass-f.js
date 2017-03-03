var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var configAuth = require('../config/auth');


module.exports = function (passport) {

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});


passport.use(new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
		profileFields: ['id', 'displayName', 'email', 'birthday', 'picture.type(large)', 'about', 'friends'], 
	    callbackURL: configAuth.facebookAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		User.findOne({'facebook.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user) {
						console.log(user)
						return done(null, user);
					}
	    			
	    			else {
					    console.log(profile);
	    				var newUser = new User();
	    				newUser.facebook.id = profile.id;
	    				newUser.facebook.token = accessToken;
	    				newUser.facebook.name = profile.displayName;
	    				newUser.facebook.email = profile.emails[0].value;
						newUser.facebook.photo = profile.photos[0].value;

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})

	    			}
	    		});
	    	});
	    }

	));
};

