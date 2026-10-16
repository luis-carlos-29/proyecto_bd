require("dotenv").config();
const mysql = require('mysql2');

// configuracion de la conexion a mysql

const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "tienda";

//opciones de configuracion 
const configuracion = {
  host: host,
  port: port,
  user: user,
  password: password,
  database: database,
};


// si el host es remoto (TiDB Cloud) habilitar el SSL automaticamente
if (host!=="localhost && host !==127.0.0.1") {
  configuracion.ssl = {
    minversion: "TLSV1.2",
    rejectUnauthorized: true  
  };
}

// crear la conexion con  mysql o TiDB CLoude 
const conexion  = mysql.createConnection(configuracion);

// comprobamos si la conexion fue exitosa
conexion.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    return;
  } else {
    console.log(`conexión exitosa a la base de datos(${host}:${port})`);
  }
});

// exportar la conexion para usarla en otros archivos
module.exports = conexion;