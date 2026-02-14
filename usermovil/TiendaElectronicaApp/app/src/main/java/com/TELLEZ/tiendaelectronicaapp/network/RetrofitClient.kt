package com.TELLEZ.tiendaelectronicaapp.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    // Usamos tu IP 192.168.137.8 y el puerto 3000 de tu servidor Node.js
    private const val BASE_URL = "http://192.168.137.166:3000/"

    val instance: ApiService by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        retrofit.create(ApiService::class.java)
    }
}