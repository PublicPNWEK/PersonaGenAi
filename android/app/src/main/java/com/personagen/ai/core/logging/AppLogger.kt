package com.personagen.ai.core.logging

import android.util.Log
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppLogger @Inject constructor() {
    private val tag = "PersonaGenAi"

    fun init() {
        Log.i(tag, "Logger initialised")
    }

    fun d(message: String) {
        Log.d(tag, message)
    }

    fun e(message: String, throwable: Throwable? = null) {
        Log.e(tag, message, throwable)
    }
}
