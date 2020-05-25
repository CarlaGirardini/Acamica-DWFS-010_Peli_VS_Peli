var con = require('../conexionbd');

function buscarCompetencias(req, res){
    // Esta función obtiene el ID y el nombre de cada competencia
    var sql = 'select * from competencia';
    con.query(sql, function(err, resp){
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        var data = [];
        resp.forEach(comp => {
            var id = comp.id;
            var nombre = comp.nombre;
            var competencia = {
                'id': id,
                'nombre': nombre
            }
            data.push(competencia);
        });
        var respuesta = data;
        res.send(JSON.stringify(respuesta));
    });
}

function buscarOpciones(req, res){
    // Esta funcion obtiene dos películas aleatorias para una competencia.
    // server+"/competencias/"+id+"/peliculas"
    var idCompetencia = req.params.id;
    var sql = `select id, poster, titulo from pelicula order by (id*rand()) limit 0,2; select nombre nombreCompetencia from competencia where id=${idCompetencia}`;
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        // La respuesta de la base de datos es un arreglo con dos elementos: El primero es un arreglo con la respuesta de la primer consulta y el segundo es un arreglo con la respuesta de la segunda consulta.
        // Armo el arreglo con las peliculas:
        var peliculas = [
            {
                'id': resp[0][0].id,
                'poster': resp[0][0].poster,
                'titulo': resp[0][0].titulo
            },
            {
                'id': resp[0][1].id,
                'poster': resp[0][1].poster,
                'titulo': resp[0][1].titulo
            }
        ]

        var respuesta = {
            'competencia': resp[1][0].nombreCompetencia,
            'peliculas': peliculas
        }
        res.send(JSON.stringify(respuesta));
    })
}

function votarPelicula(req, res){
    var idPeliculaVotada = parseInt(req.body.idPelicula);
    var idCompetencia = req.params.idCompetencia;
    // La película que se está votando corresponde al último registro de películas mostradas:
    var sql = `insert into voto (pelicula_id, competencia_id) values (${idPeliculaVotada}, ${idCompetencia})`
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        res.send(JSON.stringify(resp.message));
    })
}

function buscarMejoresTres(req, res){
    var idCompetencia = req.params.id;
    var sql = `SELECT competencia.nombre nombreCompetencia, pelicula.id, pelicula.poster, pelicula.titulo, voto.pelicula_id peliculaVotada, count(voto.pelicula_id) votosRecibidos FROM competencia JOIN voto ON voto.competencia_id = competencia.id JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE competencia.id = ${idCompetencia} GROUP BY peliculaVotada ORDER BY votosRecibidos DESC LIMIT 0,3;`

    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta')
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

module.exports = {
    buscarCompetencias,
    buscarOpciones,
    votarPelicula,
    buscarMejoresTres
};