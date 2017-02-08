var express = require('express'),
bodyparser=require('body-parser'),
mongoose=require('mongoose'),
app=express();

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

app.set('view engine','ejs');

app.get('/',function(req,res){

	Emprendimiento.find({}, function (err, emprendimientos) {
		if (err) {
			console.log(err)
		}
		else {			
		res.render('landing', {emprendimientos: emprendimientos})
		}
	})
});

app.post('/',function(req,res){
	
	console.log('Desde post');
	var nombre=req.body.nombre;
	var logo=req.body.logo;
	var emprendimiento={nombre:nombre,logo:logo};
	console.log(emprendimiento);
	Emprendimiento.create(emprendimiento, function (err, emprendimientos) {
		if (err) {
			console.log(err)
		}
		else {	
			console.log('desde creado');				
		}
	})

	res.redirect('/');
	
	//res.send('PUT request to homepage');
	
});

app.get('/new',function(req,res){

	res.render('new');
	
});


app.listen(3000,function(){
	console.log('Server corriendo.');
});

