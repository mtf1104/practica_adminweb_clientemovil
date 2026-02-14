package com.TELLEZ.tiendaelectronicaapp.models

data class PedidoRequest(
    val usuario_id: Int,
    val productos: List<ItemPedido>
)

data class ItemPedido(
    val producto_id: Int,
    val cantidad: Int,
    val precio_unitario: Double
)