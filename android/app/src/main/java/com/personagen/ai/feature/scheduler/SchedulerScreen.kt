package com.personagen.ai.feature.scheduler

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.personagen.ai.core.model.AutomationDraft
import com.personagen.ai.ui.state.AppState
import java.time.ZoneId
import java.time.ZonedDateTime

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SchedulerScreen(appState: AppState, onBack: () -> Unit) {
    var title by remember { mutableStateOf("") }
    var caption by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        TextField(
            value = title,
            onValueChange = { title = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Post title") }
        )
        TextField(
            value = caption,
            onValueChange = { caption = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Caption / script") }
        )
        Button(onClick = {
            // TODO hook into scheduling use-case
        }) {
            Text("Schedule with Gemini")
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(appState.scheduledPosts) { scheduled ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(scheduled.title)
                        Text("Platform: ${'$'}{scheduled.platform.displayName}")
                        Text("Scheduled for: ${'$'}{scheduled.publishAt}")
                    }
                }
            }
        }

        Button(onClick = onBack) {
            Text("Back")
        }
    }
}
