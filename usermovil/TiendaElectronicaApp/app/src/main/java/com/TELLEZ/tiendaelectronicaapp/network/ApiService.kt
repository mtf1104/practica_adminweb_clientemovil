package com.TELLEZ.tiendaelectronicaapp.network

import com.TELLEZ.tiendaelectronicaapp.models.PedidoRequest
import com.TELLEZ.tiendaelectronicaapp.models.Producto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {

    // Esta ruta ya existe en el server.js de tu compañera
    @GET("productos")
    suspend fun getProductos(): List<Producto>

    // IMPORTANTE: Tu compañera debe agregar esta ruta en su server.js
    // para que el botón "Pagar" funcione y se descuente el stock en la BD
    @POST("pedidos")
    suspend fun realizarPedido(@Body pedido: PedidoRequest): Response<Void>
}