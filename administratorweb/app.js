const API_URL = 'http://localhost:3000/productos';

async function cargarProductos() {
    const res = await fetch(API_URL);
    const productos = await res.json();
    const lista = document.getElementById('lista-productos');
    lista.innerHTML = '';

    productos.forEach(p => {
        lista.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.marca}</td>
                <td>$${p.precio}</td>
                <td><span class="badge ${p.stock < 5 ? 'bg-danger' : 'bg-primary'}">${p.stock}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-info" onclick="llenarForm(${JSON.stringify(p).replace(/"/g, '&quot;')})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminar(${p.id})">Borrar</button>
                </td>
            </tr>`;
    });
}

document.getElementById('producto-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('producto-id').value;
    const datos = {
        nombre: document.getElementById('nombre').value,
        marca: document.getElementById('marca').value,
        precio: document.getElementById('precio').value,
        stock: document.getElementById('stock').value,
        descripcion: document.getElementById('descripcion').value
    };

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    form.reset();
    document.getElementById('producto-id').value = '';
    cargarProductos();
});

async function eliminar(id) {
    if(confirm('¿Deseas eliminarlo?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarProductos();
    }
}

function llenarForm(p) {
    document.getElementById('producto-id').value = p.id;
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('marca').value = p.marca;
    document.getElementById('precio').value = p.precio;
    document.getElementById('stock').value = p.stock;
    document.getElementById('descripcion').value = p.descripcion;
}

cargarProductos();