# PersonaGen AI Android

This directory contains the Android rewrite of PersonaGen AI. The goal is to provide a Kotlin + Jetpack Compose application that can be opened directly in Android Studio, wired for future integrations with Instagram, X, TikTok, Google Calendar, AdMob, and in-app billing.

## Project overview

- **Tech stack**: Kotlin, Jetpack Compose, Hilt, WorkManager, Room, Retrofit/Ktor, Play Billing, Google Play services.
- **Architecture**: Single-activity Compose app with clean architecture layers (UI → Domain → Data). WorkManager drives post scheduling and background automation.
- **Modules**: Currently a single `app` module with structured packages; can be modularised later if needed.
- **Integrations prepared**:
  - OAuth-capable social connectors for Instagram (Graph API), X, and TikTok Business.
  - Google Calendar sync pipeline and CI/CD-style workflow templates.
  - Dual monetisation model (hosted API usage vs. bring-your-own key) with Play Billing scaffolding.
  - Google AdMob surface ready for banner/interstitial placements.

## Getting started

1. Ensure you have **Android Studio Ladybug** (or newer) with JDK 17.
2. From the repository root, open `android/` in Android Studio.
3. If the Gradle wrapper jar is missing, generate it once:
   ```bash
   cd android
   gradle wrapper
   ```
4. Sync the project and run the `app` configuration.

## Next steps

- Configure the backend endpoints in `core/network/PersonaApiService.kt`.
- Complete OAuth credentials and secrets injection using Play App Signing / Remote config (see `core/secrets` package).
- Implement real posting flows inside `social/*Connector` classes once business accounts are available.
- Fill out billing plan definitions in `billing/OfferingCatalog.kt` and connect to Play Console products.
- Provide AdMob unit IDs via remote config prior to production builds.

Refer to the inline TODOs across the Kotlin sources for specific implementation tasks.
