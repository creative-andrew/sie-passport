var express = require('express');
var engine = require('ejs-locals');
var multer = require('multer');
var MulterAzureStorage = require('multer-azure-storage')
bodyparser=require('body-parser'),
mongoose=require('mongoose');

app=express();
app.engine('ejs', engine);
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect('mongodb://sanisidroemprendedor:wJBT4cwe7Yii6IVj749rEkrWhW5YZ39EI3I2SlRlE13IiupDUGnQCLvkMD4EYe3J7N4YV2DoZaC8fmpywr2kAQ==@sanisidroemprendedor.documents.azure.com:10250/?ssl=true');//nombre de BD

/// CONFIG PASSPORT ////////////////////////

var User = require('./models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var session = require('express-session');
var require = require('./config/pass-f')(passport);
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
////////////////////////////////////////////


/// config multer azure ////


var upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: 'https://sanisidroemprende.blob.core.windows.net/',
    azureStorageAccessKey: 'J2a00Ztmmevbp/3J2wpQUGiv/I0pLSXmI7xWB1kVxaX7OPcAYtmdm+Hy9sjFY5VhiUYvcBURxPoLmr+21tYG5g==',
    azureStorageAccount: 'sanisidroemprende',
    containerName: 'siecontenedor',
    containerSecurity: 'blob'
  })
})


app.get('/imagenes', function(req, res) {
	res.render('imagenes');
});


var emprendimientoSchema= new mongoose.Schema({
	nombre:String,
	slogan:String,
	logo:String,
	categorias_asociadas: []
	});

var Emprendimiento = mongoose.model('Emprendimiento', emprendimientoSchema)



app.get('/',function(req,res){

	Emprendimiento.find({categorias_asociadas:{$all:["CompraVenta"]}}, function (err, compraventa) {
		if (err) {
			console.log(err)
		}
		else {
			Emprendimiento.find({categorias_asociadas:{$all:["Invierte"]}}, function (err, invierte) {
				if (err) {
					console.log(err)
				}
				else {

					Emprendimiento.find({categorias_asociadas:{$all:["Asociate"]}}, function (err, asociate) {

						if(err){
							console.log(err)
						}else{
							res.render('landing', {compraventa: compraventa,invierte:invierte,asociate:asociate});
						}
					})

				}
			});


		}

	});


});



app.post('/',upload.single('imagenes'),function(req,res, next){


	var categoria = req.body.categoria;
	var nombre=req.body.nombre;
	var logo=req.file.url;
	var emprendimiento={nombre:nombre,logo:logo, categorias_asociadas: categoria };


	console.log(req.file);
	console.log(req.body);




	console.log(req.body.categoria);
	Emprendimiento.create(emprendimiento, function (err, emprendimientos) {
		if (err) {
			console.log(err)
		}
		else {
			console.log(emprendimientos);
		}
	})

	res.redirect('/');


});

app.get('/new',function(req,res){

	res.render('new');

});

app.get('/categorias',function(req,res){

    res.render('categorias');

});

app.get('/about-us',isLoggedIn,function(req,res){

    res.render('about-us');

});

app.get('/detalle',function(req,res){

    res.render('detalle');

});

app.get('/perfil', function(req, res){
	var Usuario = req.user; 
	
 res.render('perfil',{Usuario: Usuario});
});


app.get('/index',function(req,res){


	Emprendimiento.find({}, function (err, emprendimientos) {

		if (err) {
			console.log(err)
		}
		else {
    res.render('index', {emprendimientos: emprendimientos});
				}

});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/');
}

	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'public_profile', 'user_friends']}));

	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/perfil',
	                                      failureRedirect: '/' }));


app.listen(3000,function(){
	console.log('Server corriendo.');
});
