/**
 * Example: Integration with PersonaGenAI Backend
 * 
 * This example demonstrates how to use the backend API
 * from different platforms and programming languages.
 */

// ============================================
// JavaScript/TypeScript Example (Node.js/Browser)
// ============================================

const API_BASE_URL = 'http://localhost:3001/api';

// Generate content with Gemini AI
async function generateContent(prompt) {
  const response = await fetch(`${API_BASE_URL}/google/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      temperature: 0.7,
      maxTokens: 1000
    })
  });

  const data = await response.json();
  return data.content;
}

// Schedule a post
async function schedulePost(platform, content, scheduledTime, userId) {
  const response = await fetch(`${API_BASE_URL}/scheduling/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      platform,
      content,
      scheduledTime,
      userId
    })
  });

  return await response.json();
}

// Create a subscription
async function createSubscription(email, priceId) {
  // First create a customer
  const customerResponse = await fetch(`${API_BASE_URL}/monetization/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });

  const { customer } = await customerResponse.json();

  // Then create a subscription
  const subscriptionResponse = await fetch(`${API_BASE_URL}/monetization/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId: customer.id,
      priceId
    })
  });

  return await subscriptionResponse.json();
}

// ============================================
// Python Example
// ============================================

/*
import requests
import json

API_BASE_URL = 'http://localhost:3001/api'

def generate_content(prompt):
    response = requests.post(
        f'{API_BASE_URL}/google/generate',
        json={
            'prompt': prompt,
            'temperature': 0.7,
            'maxTokens': 1000
        }
    )
    return response.json()['content']

def schedule_post(platform, content, scheduled_time, user_id):
    response = requests.post(
        f'{API_BASE_URL}/scheduling/schedule',
        json={
            'platform': platform,
            'content': content,
            'scheduledTime': scheduled_time,
            'userId': user_id
        }
    )
    return response.json()

def research_topic(topic):
    response = requests.post(
        f'{API_BASE_URL}/perplexity/research',
        json={'topic': topic}
    )
    return response.json()['research']
*/

// ============================================
// Kotlin/Android Example
// ============================================

/*
import okhttp3.*
import org.json.JSONObject

class PersonaGenAIClient(private val baseUrl: String = "http://localhost:3001/api") {
    private val client = OkHttpClient()
    
    fun generateContent(prompt: String, callback: (String?) -> Unit) {
        val json = JSONObject()
        json.put("prompt", prompt)
        json.put("temperature", 0.7)
        json.put("maxTokens", 1000)
        
        val body = RequestBody.create(
            MediaType.parse("application/json"), 
            json.toString()
        )
        
        val request = Request.Builder()
            .url("$baseUrl/google/generate")
            .post(body)
            .build()
        
        client.newCall(request).enqueue(object : Callback {
            override fun onResponse(call: Call, response: Response) {
                val responseData = response.body()?.string()
                val jsonResponse = JSONObject(responseData)
                callback(jsonResponse.getString("content"))
            }
            
            override fun onFailure(call: Call, e: IOException) {
                callback(null)
            }
        })
    }
    
    fun schedulePost(
        platform: String,
        content: String,
        scheduledTime: String,
        userId: String,
        callback: (Boolean) -> Unit
    ) {
        val json = JSONObject()
        json.put("platform", platform)
        json.put("content", content)
        json.put("scheduledTime", scheduledTime)
        json.put("userId", userId)
        
        val body = RequestBody.create(
            MediaType.parse("application/json"),
            json.toString()
        )
        
        val request = Request.Builder()
            .url("$baseUrl/scheduling/schedule")
            .post(body)
            .build()
        
        client.newCall(request).enqueue(object : Callback {
            override fun onResponse(call: Call, response: Response) {
                callback(response.isSuccessful)
            }
            
            override fun onFailure(call: Call, e: IOException) {
                callback(false)
            }
        })
    }
}
*/

// ============================================
// C#/.NET Example
// ============================================

/*
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class PersonaGenAIClient
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "http://localhost:3001/api";

    public PersonaGenAIClient()
    {
        _httpClient = new HttpClient();
    }

    public async Task<string> GenerateContentAsync(string prompt)
    {
        var requestBody = new
        {
            prompt = prompt,
            temperature = 0.7,
            maxTokens = 1000
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{BaseUrl}/google/generate", content);
        var responseString = await response.Content.ReadAsStringAsync();
        
        using var doc = JsonDocument.Parse(responseString);
        return doc.RootElement.GetProperty("content").GetString();
    }

    public async Task<bool> SchedulePostAsync(
        string platform, 
        string content, 
        DateTime scheduledTime, 
        string userId)
    {
        var requestBody = new
        {
            platform = platform,
            content = content,
            scheduledTime = scheduledTime.ToString("o"),
            userId = userId
        };

        var json = JsonSerializer.Serialize(requestBody);
        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{BaseUrl}/scheduling/schedule", httpContent);
        return response.IsSuccessStatusCode;
    }
}
*/

// ============================================
// Usage Examples
// ============================================

// Example 1: Generate and schedule a post
async function automatedPostWorkflow() {
  const userId = 'user123';
  
  // Generate content
  const content = await generateContent(
    'Write a motivational quote for social media about productivity'
  );
  
  // Schedule for tomorrow at 9 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  
  // Schedule on multiple platforms
  const platforms = ['twitter', 'linkedin', 'instagram'];
  
  for (const platform of platforms) {
    await schedulePost(platform, content, tomorrow.toISOString(), userId);
  }
  
  console.log('Posts scheduled successfully!');
}

// Example 2: Research and create content
async function researchBasedContent() {
  // Research a topic using Perplexity
  const research = await fetch(`${API_BASE_URL}/perplexity/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: 'Latest AI developments 2024' })
  }).then(r => r.json());
  
  // Generate content based on research
  const content = await generateContent(
    `Based on this research: ${research.summary}, write an engaging social media post`
  );
  
  // Save to Notion
  await fetch(`${API_BASE_URL}/notion/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      databaseId: 'your_database_id',
      title: 'AI Post',
      date: new Date().toISOString().split('T')[0],
      platform: 'Twitter',
      content: content,
      status: 'Draft'
    })
  });
}

// Example 3: Subscription workflow
async function subscriptionWorkflow(userEmail) {
  const priceId = 'price_xxxxx'; // Your Stripe price ID
  
  const subscription = await createSubscription(userEmail, priceId);
  
  if (subscription.subscription) {
    console.log('Subscription created:', subscription.subscription.id);
    // Grant access to premium features
  }
}

// Example 4: GitHub integration
async function githubWorkflow() {
  // Create an issue for tracking
  await fetch(`${API_BASE_URL}/github/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      owner: 'yourusername',
      repo: 'yourrepo',
      title: 'New feature request from social media',
      body: 'User feedback collected from social channels',
      labels: ['feature-request', 'social-media']
    })
  });
}

// Export for use in other modules
export {
  generateContent,
  schedulePost,
  createSubscription,
  automatedPostWorkflow,
  researchBasedContent,
  subscriptionWorkflow,
  githubWorkflow
};
