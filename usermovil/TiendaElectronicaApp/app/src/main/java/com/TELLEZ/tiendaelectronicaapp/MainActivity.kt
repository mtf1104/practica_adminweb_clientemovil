package com.TELLEZ.tiendaelectronicaapp

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.TELLEZ.tiendaelectronicaapp.adapter.ProductoAdapter
import com.TELLEZ.tiendaelectronicaapp.databinding.ActivityMainBinding
import com.TELLEZ.tiendaelectronicaapp.models.ItemPedido
import com.TELLEZ.tiendaelectronicaapp.models.PedidoRequest
import com.TELLEZ.tiendaelectronicaapp.models.Producto
import com.TELLEZ.tiendaelectronicaapp.network.RetrofitClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private var listaProductos: List<Producto> = listOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.rvCatalogo.layoutManager = LinearLayoutManager(this)

        cargarProductos()

        binding.btnPagar.setOnClickListener {
            procesarPago()
        }
    }

    private fun cargarProductos() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                listaProductos = RetrofitClient.instance.getProductos()
                withContext(Dispatchers.Main) {
                    binding.rvCatalogo.adapter = ProductoAdapter(listaProductos)
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@MainActivity, "Error de conexión: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun procesarPago() {
        // Filtramos los productos que el usuario marcó con una cantidad mayor a 0
        val productosSeleccionados = listaProductos.filter { it.cantidadSeleccionada > 0 }

        if (productosSeleccionados.isEmpty()) {
            Toast.makeText(this, "El carrito está vacío", Toast.LENGTH_SHORT).show()
            return
        }

        // Creamos la lista de items para la base de datos
        val items = productosSeleccionados.map {
            ItemPedido(it.id, it.cantidadSeleccionada, it.precio)
        }

        // Usamos el usuario_id 1 por defecto (Juan Perez en tu SQL)
        val pedido = PedidoRequest(usuario_id = 1, productos = items)

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = RetrofitClient.instance.realizarPedido(pedido)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@MainActivity, "¡Pago realizado! Stock actualizado", Toast.LENGTH_LONG).show()
                        cargarProductos() // Recargamos para ver el nuevo stock
                    } else {
                        Toast.makeText(this@MainActivity, "Error al procesar pedido", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@MainActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}