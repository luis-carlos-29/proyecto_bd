const express = require("express");
const cors = require("cors");
const conexion = require("./db"); // Importar la conexión a la base de datos

const app = express();

// Middlewares Globales - Seguridad de sistema
app.use(cors()); // Permitir recibir peticiones desde el frontend
app.use(express.json()); // habilitar la lectura de datos en formato JSON en el cuerpo (req.body)

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor Funcionando Correctamente");
});

// 1. Obtener todos los productos (READ)
app.get("/productos", (req, res) => {
    const sql = "SELECT * FROM productos";
    
conexion.query(sql, (error, resultados) =>{
    if (error){
        console.error("Error al consultar: ", error);
        return res.status(500).json({
            mensaje:"Error al consultar los productos"
        });
    }
    //retornamos el array de productos como JSON al cliente
    res.json(resultados);
  });
});

// 2. crear un producto (CREATE)
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

// consulta parametrizada con '?' paraprevenir inyeccion SQL
  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultados) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({mensaje: "Error al crear el producto"});
    }

    res.status(201).json({
        mensaje: "Producto creado correctamente"
    });
  });
});

// 3. Actualizar un producto exitosamente (UPDATE)
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock } = req.body;
  
  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  const valores = [nombre, precio, stock, id];
  
  conexion.query(sql, valores, (error, resultados) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({mensaje: "Error al actualizar el producto"});
    }
    res.json({mensaje: "Producto actualizado correctamente"});
  });
});

// 4. Eliminar un producto exitosamente (DELETE)
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM productos WHERE id = ?";
  

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({mensaje: "Error al eliminar el producto"});
    }
    res.json({mensaje: "Producto eliminado correctamente"});
  });
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Servidor ejecutandose en http://localhost:3000");
});
