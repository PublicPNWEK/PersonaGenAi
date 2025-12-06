package com.personagen.ai

import android.app.Application
import com.personagen.ai.core.logging.AppLogger
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class PersonaGenAiApp : Application() {
    @Inject
    lateinit var appLogger: AppLogger

    override fun onCreate() {
        super.onCreate()
        appLogger.init()
    }
}
