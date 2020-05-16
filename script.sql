USE competencias; -- Este es el nombre de la base de datos creada a través del archivo dump_base_de_datos.sql

DROP TABLE IF EXISTS competencia;
CREATE TABLE `competencia`(
    `id` INT NOT NULL auto_increment,
    `nombre` VARCHAR(200),
    PRIMARY KEY (`id`)
);

INSERT INTO competencia (nombre) VALUES ('¿Cuál es la mejor película?'), ('¿Qué drama te hizo llorar más?'), ('¿Cuál es la peli más bizarra?');