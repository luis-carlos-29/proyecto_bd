require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conexion = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// 1. Consultar productos
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar productos:", error);
      return res.status(500).json({
        mensaje: "Error al consultar los productos"
      });
    }

    res.json(resultados);
  });
});

// 2. Crear producto
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  const sql =
    "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";

  conexion.query(sql, [nombre, precio, stock], (error, resultado) => {
    if (error) {
      console.error("Error al crear producto:", error);
      return res.status(500).json({
        mensaje: "Error al crear el producto"
      });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId
    });
  });
});

// 3. Actualizar producto
app.put("/productos/:id", (req, res) => {
  const { nombre, precio, stock } = req.body;
  const id = req.params.id;

  const sql =
    "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";

  conexion.query(sql, [nombre, precio, stock, id], (error) => {
    if (error) {
      console.error("Error al actualizar producto:", error);
      return res.status(500).json({
        mensaje: "Error al actualizar el producto"
      });
    }

    res.json({
      mensaje: "Producto actualizado correctamente"
    });
  });
});

// 4. Eliminar producto
app.delete("/productos/:id", (req, res) => {
  const sql = "DELETE FROM productos WHERE id = ?";

  conexion.query(sql, [req.params.id], (error) => {
    if (error) {
      console.error("Error al eliminar producto:", error);
      return res.status(500).json({
        mensaje: "Error al eliminar el producto"
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente"
    });
  });
});

// 5. Consultar mensajes de contacto
app.get("/contactos", (req, res) => {
  const sql = `
    SELECT id, nombre, correo, asunto, mensaje, fecha
    FROM contactos
    ORDER BY fecha DESC, id DESC
  `;
  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar contactos:", error);
      return res.status(500).json({
        mensaje: "Error al consultar los mensajes"
      });
    }

    res.json(resultados);
  });
});

// 6. Guardar un mensaje de contacto
app.post("/contactos", (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (
    typeof nombre !== "string" ||
    typeof correo !== "string" ||
    typeof asunto !== "string" ||
    typeof mensaje !== "string" ||
    !nombre.trim() ||
    !correo.trim() ||
    !asunto.trim() ||
    !mensaje.trim()
  ) {
    return res.status(400).json({
      mensaje: "Debes completar todos los campos"
    });
  }

  const sql = `INSERT INTO contactos (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)`;

  const valores = [nombre.trim(),correo.trim(),asunto.trim(),mensaje.trim()];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al guardar contacto:", error);
      return res.status(500).json({
        mensaje: "Error al guardar el mensaje de contacto"
      });
    }

    res.status(201).json({
      mensaje: "Mensaje guardado correctamente",
      id: resultado.insertId
    });
  });
});

// 7. Eliminar un mensaje de contacto
app.delete("/contactos/:id", (req, res) => {
  const sql = "DELETE FROM contactos WHERE id = ?";

  conexion.query(sql, [req.params.id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar contacto:", error);
      return res.status(500).json({
        mensaje: "Error al eliminar el mensaje"
      });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "No se encontró el mensaje"
      });
    }
    res.json({
      mensaje: "Mensaje eliminado correctamente"
    });
  });
});

// Iniciar servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});


// nada estaba mallll :(