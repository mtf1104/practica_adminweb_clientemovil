// Simulación de datos iniciales (basados en tu SQL)
let productos = [
    { id: 1, nombre: 'iPhone 15', marca: 'Apple', precio: 999.00, stock: 50, descripcion: 'Smartphone última generación' },
    { id: 2, nombre: 'Galaxy S24', marca: 'Samsung', precio: 899.00, stock: 30, descripcion: 'Pantalla AMOLED 120Hz' }
];

const form = document.getElementById('producto-form');
const lista = document.getElementById('lista-productos');

// 1. RENDERIZAR PRODUCTOS
function renderProductos() {
    lista.innerHTML = '';
    productos.forEach(p => {
        lista.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>**${p.nombre}**</td>
                <td>${p.marca}</td>
                <td>$${p.precio}</td>
                <td><span class="badge ${p.stock < 10 ? 'bg-danger' : 'bg-success'}">${p.stock}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editProducto(${p.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProducto(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// 2. AGREGAR O ACTUALIZAR
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('producto-id').value;
    const nuevoProd = {
        id: id ? parseInt(id) : productos.length + 1,
        nombre: document.getElementById('nombre').value,
        marca: document.getElementById('marca').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        descripcion: document.getElementById('descripcion').value
    };

    if (id) {
        // Actualizar
        const index = productos.findIndex(p => p.id == id);
        productos[index] = nuevoProd;
    } else {
        // Crear
        productos.push(nuevoProd);
    }

    resetForm();
    renderProductos();
});

// 3. ELIMINAR
function deleteProducto(id) {
    if(confirm('¿Seguro que deseas eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        renderProductos();
    }
}

// 4. PREPARAR EDICIÓN
function editProducto(id) {
    const p = productos.find(prod => prod.id === id);
    document.getElementById('producto-id').value = p.id;
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('marca').value = p.marca;
    document.getElementById('precio').value = p.precio;
    document.getElementById('stock').value = p.stock;
    document.getElementById('descripcion').value = p.descripcion;
    
    document.getElementById('btn-save').innerText = 'Actualizar Cambios';
    document.getElementById('btn-cancel').classList.remove('d-none');
}

function resetForm() {
    form.reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('btn-save').innerText = 'Guardar Producto';
    document.getElementById('btn-cancel').classList.add('d-none');
}

// Carga inicial
renderProductos();