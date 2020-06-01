var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controllerGet = require('./controladores/controller-get');
var controllerPost = require('./controladores/controller-post');
var controllerPut = require('./controladores/controller-put');
var controllerDelete = require('./controladores/controller-delete');

var app = express();
var puerto = '8080';

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias/:id/peliculas', controllerGet.buscarOpciones);
app.get('/competencias/:id/resultados', controllerGet.buscarMejoresTres)
app.get('/competencias', controllerGet.buscarCompetencias);
app.get('/generos', controllerGet.buscarGeneros);
app.get('/directores', controllerGet.buscarDirectores);
app.get('/actores', controllerGet.buscarActores);

app.post('/competencias/:idCompetencia/voto', controllerPost.votarPelicula);
app.post('/competencias', controllerPost.crearCompetencia);

app.put('/competencias/:idCompetencia', controllerPut.cambiarNombreCompetencia);

app.delete('/competencias/:idCompetencia/votos', controllerDelete.reiniciarCompetencia);
app.delete('/competencias/:idCompetencia', controllerDelete.eliminarCompetencia)

app.listen(puerto, () => {console.log('Escuchando al puerto', puerto);});