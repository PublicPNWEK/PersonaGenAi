package com.personagen.ai.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import com.personagen.ai.feature.billing.BillingScreen
import com.personagen.ai.feature.dashboard.DashboardScreen
import com.personagen.ai.feature.scheduler.SchedulerScreen
import com.personagen.ai.feature.social.SocialConnectionsScreen
import com.personagen.ai.feature.settings.SettingsScreen
import com.personagen.ai.ui.state.AppState

@Composable
fun androidx.navigation.NavGraphBuilder.MainNavGraph(
    navController: NavHostController,
    appState: AppState
) {
    composable(Screen.Dashboard.route) {
        DashboardScreen(appState = appState, onNavigate = navController::navigate)
    }
    composable(Screen.Scheduler.route) {
        SchedulerScreen(appState = appState, onBack = navController::popBackStack)
    }
    composable(Screen.SocialConnections.route) {
        SocialConnectionsScreen(onBack = navController::popBackStack)
    }
    composable(Screen.Billing.route) {
        BillingScreen(onBack = navController::popBackStack)
    }
    composable(Screen.Settings.route) {
        SettingsScreen(onBack = navController::popBackStack)
    }
}
