const mysql = require('mysql2');

// configuracion de la conexion a mysql
const conexion = mysql.createConnection({
  host: 'localhost',   // servidor local
  user: 'root',        // usuario de mysql (por defecto en xampp)
  database: 'tienda'   // nombre de la base de datos
});

// comprobar si la conexion fue exitosa
conexion.connect((error) =>{
  if (error) {
    console.error('Error al conectar con MySQL: ' + error);
    return;
  }else {
    console.log('Conexión exitosa a MySQL');
  }
});

// exportar la conexion para usarla en otros archivos
module.exports = conexion;