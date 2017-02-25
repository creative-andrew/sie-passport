var express = require('express');
var engine = require('ejs-locals');

bodyparser=require('body-parser'),
mongoose=require('mongoose'),
app=express();

app.engine('ejs', engine);
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect('mongodb://sanisidroemprendedor:wJBT4cwe7Yii6IVj749rEkrWhW5YZ39EI3I2SlRlE13IiupDUGnQCLvkMD4EYe3J7N4YV2DoZaC8fmpywr2kAQ==@sanisidroemprendedor.documents.azure.com:10250/?ssl=true');//nombre de BD


var emprendimientoSchema= new mongoose.Schema({
	nombre:String,
	slogan:String,
	logo:String,
	categorias_asociadas: []
		/*
	categorias: {
			type:String,
			default:'compra y venta'
	}
	*/
	});

var Emprendimiento = mongoose.model('Emprendimiento', emprendimientoSchema)

/*
Emprendimiento.create({
	nombre:'ASEP',
	slogan:'De la idea del negocio.',
	logo:'https://asep.pe/wp-content/uploads/2016/08/logo_asep_nw.png',
	categorias_asociadas:[
		{nombre_categoria:'compra y venta'}
	]

});
*/


app.get('/',function(req,res){
/*
	var compraventa=[];
	var invierte=[];
	var asociate=[];
*/
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

	

/*
	Emprendimiento.find({categorias_asociadas:{$all:["CompraVenta"]}}, function (err, emprendimientos) {
		if (err) {
			console.log(err)
		}
		else {	
			asociate=emprendimientos;		
		}
	});

	console.log(asociate);
*/


});

app.get('/index',function(req,res){
	var emprendimientos=[
		{
			categoria:"compra y venta",
			empresas:[
				{nombre:"a"},
				{nombre:"b"},
				{nombre:"c"},
				{nombre:"d"},
				{nombre:"e"}
			]		
		},
		{
			categoria:"invierte",
			empresas:[
				{nombre:"f"},
				{nombre:"g"},
				{nombre:"h"},
				{nombre:"i"},
				{nombre:"j"}
			]
		}
	]			

	res.render("index",{emprendimientos:emprendimientos})
})

app.post('/',function(req,res){
	
	var categoria = req.body.categoria;
	var nombre=req.body.nombre;
	var logo=req.body.logo;
	var emprendimiento={nombre:nombre,logo:logo, categorias_asociadas: categoria };


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
	
	//res.send('PUT request to homepage');
	
});

app.get('/new',function(req,res){

	res.render('new');
	
});

app.get('/categorias',function(req,res){

    res.render('categorias');

});


app.post

app.listen(3000,function(){
	console.log('Server corriendo.');
});

