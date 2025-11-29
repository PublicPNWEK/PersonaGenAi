package com.personagen.ai.feature.social

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.personagen.ai.core.social.SocialPlatform
import com.personagen.ai.core.social.SocialProfileState

@Composable
fun SocialConnectionsScreen(onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        SocialPlatform.entries.forEach { platform ->
            val state = SocialProfileState(platform = platform)
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(platform.displayName)
                    Text(state.connectionStatus)
                    Button(onClick = { /* TODO launch OAuth */ }) {
                        Text(if (state.isConnected) "Manage" else "Connect")
                    }
                }
            }
        }

        Button(onClick = onBack) {
            Text("Back")
        }
    }
}
