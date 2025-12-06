package com.personagen.ai.feature.dashboard

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.personagen.ai.ui.navigation.Screen
import com.personagen.ai.ui.state.AppState

@Composable
fun DashboardScreen(appState: AppState, onNavigate: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(
            text = "Welcome back, ${'$'}{appState.currentUser?.displayName ?: "Creator"}",
            style = MaterialTheme.typography.headlineSmall
        )

        Card {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text("Upcoming scheduled posts", style = MaterialTheme.typography.titleMedium)
                if (appState.scheduledPosts.isEmpty()) {
                    Text("No posts scheduled. Create one now.")
                } else {
                    appState.scheduledPosts.take(3).forEach { post ->
                        Text("• ${'$'}{post.platform.displayName}: ${'$'}{post.title}")
                    }
                }
                Button(onClick = { onNavigate(Screen.Scheduler.route) }) {
                    Text("Open Scheduler")
                }
            }
        }

        Card {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text("Social connections", style = MaterialTheme.typography.titleMedium)
                Text("Connected: ${'$'}{appState.connectedAccounts.size}/3")
                Button(onClick = { onNavigate(Screen.SocialConnections.route) }) {
                    Text("Manage accounts")
                }
            }
        }

        Card {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text("Automation workflows", style = MaterialTheme.typography.titleMedium)
                Text("${'$'}{appState.workflowTemplates.size} templates ready")
                Button(onClick = { onNavigate(Screen.Settings.route) }) {
                    Text("Workflow library")
                }
            }
        }

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Button(onClick = { onNavigate(Screen.Billing.route) }) {
                Text("Upgrade & manage usage")
            }
        }
    }
}
