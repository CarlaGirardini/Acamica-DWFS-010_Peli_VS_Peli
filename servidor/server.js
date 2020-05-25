var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controller = require('./controladores/controller');

var app = express();
var puerto = '8080';

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/competencias/:idCompetencia/voto', controller.votarPelicula);
app.get('/competencias/:id/peliculas', controller.buscarOpciones);
app.get('/competencias/:id/resultados', controller.buscarMejoresTres)
app.get('/competencias', controller.buscarCompetencias);

app.listen(puerto, () => {console.log('Escuchando al puerto', puerto);});