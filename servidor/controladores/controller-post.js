var con = require('../conexionbd');

function crearCompetencia(req, res){
    var nombreCompetencia = req.body.nombre;
    var idGenero = parseInt(req.body.genero);
    var idDirector = parseInt(req.body.director);
    var idActor = parseInt(req.body.actor);

    if(idGenero === 0) {idGenero = null}
    if(idDirector === 0) {idDirector = null}
    if(idActor === 0) {idActor = null}

    var sql = 'SELECT nombre FROM competencia;';

    var competenciaPorGenero;
    var competenciaPorDirector;
    var competenciaPorActor;

    idGenero === null ? competenciaPorGenero = false : competenciaPorGenero = true;
    idDirector === null ? competenciaPorDirector = false : competenciaPorDirector = true;
    idActor === null ? competenciaPorActor = false : competenciaPorActor = true;

    sql += ' SELECT pelicula.id idPelicula, pelicula.genero_id';

    if(competenciaPorGenero){sql += ', genero.id'}
    if(competenciaPorDirector){sql += ', director.nombre'}
    if(competenciaPorActor){sql += ', actor.nombre'}
        
    sql += ' FROM pelicula';
        
    if(competenciaPorGenero){sql += ' JOIN genero ON pelicula.genero_id = genero.id'}
    if(competenciaPorDirector){sql += ' JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id JOIN director ON director.id = director_pelicula.director_id'}
    if(competenciaPorActor){sql += ' JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN actor ON actor.id = actor_pelicula.actor_id'}
    
    if(competenciaPorGenero || competenciaPorDirector || competenciaPorActor){ sql += ' WHERE'}
    
    if(competenciaPorGenero){sql += ` pelicula.genero_id = ${idGenero}`}
    if(competenciaPorDirector){
        if(competenciaPorGenero){sql += ' AND'}
        sql += ` director.id = ${idDirector}`;
    }
    if(competenciaPorActor){
        if(competenciaPorGenero || competenciaPorDirector){sql += ' AND'}
        sql += ` actor.id = ${idActor}`;
    }

    // Primero valido si el nombre existe y si existen al menos dos películas que cumplan los requisitos
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor');
        }
        var pasoValidaciones = true;
        resp[0].forEach((competencia) => {
            if(competencia.nombre === nombreCompetencia){
                console.log('Esa competencia ya existe');
                pasoValidaciones = false;
                res.status(422).send('El nombre de la competencia ya existe');
                return pasoValidaciones;
            }
        })
        if(resp[1].length < 2){
            console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            return pasoValidaciones = false;
        };
        // Si pasó las validaciones, hago el post:
        if(pasoValidaciones){
            var sql2 = `insert into competencia (nombre, genero_id, director_id, actor_id) values ('${nombreCompetencia}', ${idGenero}, ${idDirector}, ${idActor})`;
            con.query(sql2, (err2, resp2) => {
                if(err2){
                    console.log('Hubo un error en el servidor', err2.message);
                    return res.status(500).send('Hubo un error en el servidor');
                }
                return res.status(200).send('Competencia creada');
            })
        }
    })
}

function votarPelicula(req, res){
    var idPeliculaVotada = parseInt(req.body.idPelicula);
    var idCompetencia = parseInt(req.params.idCompetencia);
    // La película que se está votando corresponde al último registro de películas mostradas:
    var sql = `insert into voto (pelicula_id, competencia_id) values (${idPeliculaVotada}, ${idCompetencia})`
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor');
        }
        res.status(200).send(JSON.stringify(resp.message));
    })
}

module.exports = {
    crearCompetencia,
    votarPelicula
};