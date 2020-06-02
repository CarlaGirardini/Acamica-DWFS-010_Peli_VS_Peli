var con = require('../conexionbd');

function buscarActores(req, res){
    var sql = 'select id, nombre from actor';
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor');
        }
        if(resp.length === 0){
            console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            return res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
        }
        var respuesta = [];
        resp.forEach(actor => {
            var objActor = {
                'id': actor.id,
                'nombre': actor.nombre
            }
            respuesta.push(objActor)
        })
        res.send(JSON.stringify(respuesta));
    })
}

function buscarCompetencias(req, res){
    // Esta función obtiene el ID y el nombre de cada competencia
    var sql = 'select * from competencia';
    con.query(sql, function(err, resp){
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor');
        }
        if(resp.length === 0){
            console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            return res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
        }
        var respuesta = [];
        resp.forEach(comp => {
            var id = comp.id;
            var nombre = comp.nombre;
            var competencia = {
                'id': id,
                'nombre': nombre
            }
            respuesta.push(competencia);
        });
        res.send(JSON.stringify(respuesta));
    });
}

function buscarDirectores(req, res) {
    var sql = 'select nombre, id from director';
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor');
        }
        if(resp.length === 0){
            console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            return res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
        }
        var respuesta = [];
        resp.forEach(director => {
            var objDirector = {
                'id': director.id,
                'nombre': director.nombre
            }
            respuesta.push(objDirector);
        })
        res.send(JSON.stringify(respuesta));
    })
}

function buscarGeneros(req, res){
    var sql = 'select nombre, id from genero'
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor');
        }
        if(resp.length === 0){
            console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            return res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
        }
        var respuesta = [];
        resp.forEach(genero => {
            var objGenero = {
                'id': genero.id,
                'nombre': genero.nombre
            }
            respuesta.push(objGenero);
        })
        res.send(JSON.stringify(respuesta));
    })
}

function buscarMejoresTres(req, res){
    var idCompetencia = req.params.id;
    var sql = `SELECT competencia.nombre nombreCompetencia, pelicula.id, pelicula.poster, pelicula.titulo, voto.pelicula_id peliculaVotada, count(voto.pelicula_id) votosRecibidos FROM competencia JOIN voto ON voto.competencia_id = competencia.id JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE competencia.id = ${idCompetencia} GROUP BY peliculaVotada ORDER BY votosRecibidos DESC LIMIT 0,3;`

    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor')
        }
        if(resp.length === 0){
            console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            return res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
        }
        
        var resultados = [];

        resp.forEach((peli) => {
            var pelicula = {
                'pelicula_id': peli.id,
                'poster': peli.poster,
                'titulo': peli.titulo,
                'votos': peli.votosRecibidos
            }
            resultados.push(pelicula);
        })
    
        var respuesta = {
            'competencia': resp[0].nombreCompetencia,
            'resultados': resultados
        }

        res.send(JSON.stringify(respuesta));
    })
}

function buscarOpciones(req, res){
    // Esta funcion obtiene dos películas aleatorias para una competencia.
    var idCompetencia = parseInt(req.params.id);
    var sql = `select genero_id, director_id, actor_id from competencia where id = ${idCompetencia}`;
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor');
        }
        if(resp.length === 0){
            console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            return res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
        }
        var idGenero = resp[0].genero_id;
        var idDirector = resp[0].director_id;
        var idActor = resp[0].actor_id;
        
        var competenciaPorGenero = true;
        var competenciaPorDirector = true;
        var competenciaPorActor = true;

        idGenero === null ? competenciaPorGenero = false : idGenero = parseInt(idGenero);
        idDirector === null ? competenciaPorDirector = false : idDirector = parseInt(idDirector);
        idActor === null ? competenciaPorActor = false : idActor = parseInt(idActor);

        var sql2 = 'SELECT pelicula.id idPelicula, pelicula.poster, pelicula.titulo, pelicula.genero_id';

        if(competenciaPorGenero){sql2 += ', competencia.genero_id'}
        if(competenciaPorDirector){sql2 += ', director.nombre'}
        if(competenciaPorActor){sql2 += ', actor.nombre'}
        
        sql2 += ' FROM pelicula';
        
        if(competenciaPorGenero){sql2 += ' JOIN genero ON pelicula.genero_id = genero.id JOIN competencia ON competencia.genero_id = genero.id'}
        if(competenciaPorDirector){sql2 += ' JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id JOIN director ON director.id = director_pelicula.director_id'}
        if(competenciaPorActor){sql2 += ' JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN actor ON actor.id = actor_pelicula.actor_id'}
        
        if(competenciaPorGenero || competenciaPorDirector || competenciaPorActor){ sql2 += ' WHERE'}
        
        if(competenciaPorGenero){sql2 += ` pelicula.genero_id = ${idGenero}`}
        if(competenciaPorDirector){
            if(competenciaPorGenero){sql2 += ' AND'}
            sql2 += ` director.id = ${idDirector}`;
        }
        if(competenciaPorActor){
            if(competenciaPorGenero || competenciaPorDirector){sql2 += ' AND'}
            sql2 += ` actor.id = ${idActor}`;
        }

        sql2 += ' ORDER BY (pelicula.id*rand()) limit 0,2;'
        sql2 += ` SELECT nombre nombreCompetencia FROM competencia WHERE id = ${idCompetencia}`

        con.query(sql2, (err, resp) => {
            if(err){
                console.log('Hubo un error en el servidor', err.message);
                return res.status(500).send('Hubo un error en el servidor');
            }
            if(resp.length === 0){
                console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
                return res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            }
            // La respuesta de la base de datos es un arreglo con dos elementos: El primero es un arreglo con la respuesta de la primer consulta y el segundo es un arreglo con la respuesta de la segunda consulta.
            // Armo el arreglo con las peliculas:

            var peliculas = [];
            resp[0].forEach(pelicula => {
                var objPelicula = {
                    'id': pelicula.idPelicula,
                    'poster': pelicula.poster,
                    'titulo': pelicula.titulo
                }
                peliculas.push(objPelicula)
            })
    
            var respuesta = {
                'competencia': resp[1][0].nombreCompetencia,
                'peliculas': peliculas
            }
            res.send(JSON.stringify(respuesta));
        })
    })
}

module.exports = {
    buscarActores,
    buscarCompetencias,
    buscarDirectores,
    buscarGeneros,
    buscarMejoresTres,
    buscarOpciones
};