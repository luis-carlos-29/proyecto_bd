const API_URL = "https://proyecto-bd-1nkk.onrender.com";

// Elementos del DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const formContacto = document.getElementById("formularioContacto");
const listaContactos = document.getElementById("listaContactos");

// 1. Cargar y mostrar productos
async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// 2. Cargar producto para editar
function cargarEnFormulario(id, nombre, precio, stock) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

// 3. Cancelar edición
function cancelarEdicion() {
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

// 4. Guardar o actualizar productos
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      let respuesta;

      if (id) {
        respuesta = await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock })
        });
      } else {
        respuesta = await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock })
        });
      }

      if (!respuesta.ok) {
        alert("No se pudo guardar el producto.");
        return;
      }

      cancelarEdicion();
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("No se pudo conectar con el servidor.");
    }
  });
}

// 5. Eliminar productos
async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      alert("No se pudo eliminar el producto.");
      return;
    }

    if (productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// 6. Cargar y mostrar mensajes de contacto
async function cargarContactos() {
  if (!listaContactos) return;

  try {
    const respuesta = await fetch(`${API_URL}/contactos`);

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar los mensajes.");
    }

    const contactos = await respuesta.json();
    listaContactos.innerHTML = "";

    if (contactos.length === 0) {
      listaContactos.textContent = "No hay mensajes recibidos.";
      return;
    }

    contactos.forEach((contacto) => {
      const elemento = document.createElement("div");

      const nombre = document.createElement("h3");
      nombre.textContent = contacto.nombre;

      const correo = document.createElement("p");
      correo.textContent = "Correo: " + contacto.correo;

      const asunto = document.createElement("p");
      asunto.textContent = "Asunto: " + contacto.asunto;

      const mensaje = document.createElement("p");
      mensaje.textContent = "Mensaje: " + contacto.mensaje;

      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.addEventListener("click", () => {
        eliminarContacto(contacto.id);
      });

      elemento.appendChild(nombre);
      elemento.appendChild(correo);
      elemento.appendChild(asunto);
      elemento.appendChild(mensaje);
      elemento.appendChild(botonEliminar);
      elemento.appendChild(document.createElement("hr"));

      listaContactos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar los mensajes:", error);
    listaContactos.textContent = "Error al cargar los mensajes recibidos.";
  }
}

// 7. Enviar mensaje de contacto
if (formContacto) {
  formContacto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const contacto = {
      nombre: document.getElementById("nombreContacto").value,
      correo: document.getElementById("correoContacto").value,
      asunto: document.getElementById("asuntoContacto").value,
      mensaje: document.getElementById("mensajeContacto").value
    };

    try {
      const respuesta = await fetch(`${API_URL}/contactos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contacto)
      });

      if (!respuesta.ok) {
        alert("No se pudo enviar el mensaje.");
        return;
      }

      alert("Mensaje enviado correctamente.");
      formContacto.reset();
      cargarContactos();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("No se pudo conectar con el servidor.");
    }
  });
}

// 8. Eliminar mensajes de contacto
async function eliminarContacto(id) {
  const confirmar = confirm("¿Deseas eliminar este mensaje?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/contactos/${id}`, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      alert("No se pudo eliminar el mensaje.");
      return;
    }

    cargarContactos();
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    alert("No se pudo conectar con el servidor.");
  }
}

// Cargar información al iniciar
cargarProductos();
cargarContactos();