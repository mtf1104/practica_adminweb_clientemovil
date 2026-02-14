package com.TELLEZ.tiendaelectronicaapp.models

data class Producto(
    val id: Int,
    val nombre: String,
    val marca: String,
    val descripcion: String?,
    val precio: Double,
    var stock: Int,
    val imagen_url: String?,
    var cantidadSeleccionada: Int = 0 // Para el carrito en la app
)