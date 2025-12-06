package com.personagen.ai.ui

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController
import com.personagen.ai.ui.navigation.MainNavGraph
import com.personagen.ai.ui.navigation.Screen
import com.personagen.ai.ui.viewmodel.AppViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PersonaApp() {
    val navController = rememberNavController()
    val viewModel: AppViewModel = hiltViewModel()
    val appState by viewModel.appState.collectAsState()

    Scaffold { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = androidx.compose.ui.Modifier.padding(paddingValues)
        ) {
            MainNavGraph(navController = navController, appState = appState)
        }
    }
}
