package com.TELLEZ.tiendaelectronicaapp.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.widget.addTextChangedListener
import androidx.recyclerview.widget.RecyclerView
// Estos son los que deben cambiar:
import com.TELLEZ.tiendaelectronicaapp.databinding.ItemProductoBinding
import com.TELLEZ.tiendaelectronicaapp.models.Producto

class ProductoAdapter(private val productos: List<Producto>) :
    RecyclerView.Adapter<ProductoAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemProductoBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemProductoBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val p = productos[position]
        holder.binding.tvNombreProducto.text = p.nombre
        holder.binding.tvPrecioProducto.text = "$${p.precio}"
        holder.binding.tvStockDisponible.text = "Stock: ${p.stock}"

        holder.binding.etCantidad.addTextChangedListener {
            val cant = it.toString().toIntOrNull() ?: 0
            p.cantidadSeleccionada = cant
        }
    }

    override fun getItemCount() = productos.size
}