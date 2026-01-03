# Design System

This document outlines the high-level design system, including general style requirements and a breakdown of components used in key user flows: Onboarding, Index, and Create Split.

## General Style Requirements

### Colors

The application primarily supports a Dark Mode aesthetic.

| Token | Light Value | Dark Value | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#fff` | `#000` | Main screen background |
| **Text** | `#000` | `#fff` | Primary text color |
| **Tint** | `#2f95dc` | `#fff` | Active state / accents |
| **Secondary Text** | N/A | `#666` / `#888` | Subtitles, labels, placeholders |
| **Input Border** | N/A | `#333` | Text input borders |
| **Input Background**| N/A | Transparent | Text input background |
| **Error** | N/A | `#FF4D4F` | Validation error text & border |

### Margins & Spacing

-   **Screen Padding**: Horizontal padding of `20` (or `5%` in some views) is standard for consistent gutter alignment.
-   **Element Spacing**:
    -   `marginBottom: 16` (Standard gap between major elements)
    -   `marginBottom: 6` (Label to Input gap)
-   **Component Sizing**:
    -   **Buttons**: Height `52`, Border Radius `10`
    -   **Inputs**: Height `48`, Border Radius `8`

### Reusable Components (App Level)

These components are used across multiple flows and define the core interaction patterns.

-   **`PrimaryButton`**
    -   **Usage**: The main "Call to Action" on any screen (e.g., "Next", "Save", "Continue").
    -   **Style**: Full width (typically), white background (in dark mode), black text, bold (`600` weight).
    -   **States**: Supports `loading` (spinner) and `disabled` (0.5 opacity).

-   **`TextInputField`**
    -   **Usage**: Standard text entry.
    -   **Style**: Outlined box (1px `#333`), white text.
    -   **Features**: Includes a top label (`#AAA`, 12px) and bottom error text (`#FF4D4F`, 12px).

-   **`SelectField` / `Dropdown`**
    -   **Usage**: Selecting a value from a predefined list (e.g., Gender, Training Style).
    -   **Style**: Matches `TextInputField` visual style for consistency.

-   **`NumericInputField` / `NumberInputWithUnit`**
    -   **Usage**: Entry for numerical data like Age, Weight, Height.
    -   **Style**: Matches `TextInputField`, optionally includes a unit toggle.

-   **`GravitusHeader`**
    -   **Usage**: Top-level app branding header.
    -   **Style**: Displays the "GRAVITUS" logo/text, typically centered or left-aligned depending on context.

-   **`SectionHeader`**
    -   **Usage**: Dividers between content sections (e.g., "Today's Plan", "Explore").
    -   **Style**: Simple text header to delineate vertical rhythm.

---

## Screen or Flow Breakdown

### Onboarding Flow
*Screens: Welcome, Basic Info, Fitness Goals, etc.*

-   **`OnboardingLayout`**
    -   **Usage**: Wrapper for onboarding screens steps.
    -   **Features**: Displays the current step progress (e.g., "Step 2 of 7"), a title, and ensures consistent padding/layout.

-   **`BrandHeader`**
    -   **Usage**: Prominent branding used on the initial `WelcomeScreen`.
    -   **Style**: Large logo display.

-   **`OnboardingCarousel`**
    -   **Usage**: Slideshow on the `WelcomeScreen` to introduce app features.

-   **`FormFieldStack`**
    -   **Usage**: Layout container to stack multiple input fields (like Name, Age, Weight) with consistent vertical spacing.

-   **`AuthActions`**
    -   **Usage**: Group of action buttons on the Welcome screen (Sign Up / Sign In).

-   **`LoginLink`**
    -   **Usage**: Text link for existing users to navigate to login.

### Index (Home) Screen
*Screen: `app/(tabs)/index.tsx`*

-   **`TodayPlanCard`**
    -   **Usage**: Large "Hero" card showing the user's immediate workout task.
    -   **Style**: Prominent visual weight, displays workout status.

-   **`ExploreCard`**
    -   **Usage**: Navigation cards to other major app sections (History, Training Splits, Exercises).
    -   **Style**: Consistent height (`110`), icon on the left/right, background image or gradient.

-   **`LinearGradient`**
    -   **Usage**: Background visual flair (top right corner) to give depth to the dark mode theme.

### Create Split Flow
*Screen: `app/(trainingSplits)/create.tsx`*

-   **`CreateSplitHeader`**
    -   **Usage**: Form section for the split's metadata (Name, Description, Duration).
    -   **components**: Contains `TextInputField`s for the split details.

-   **`SplitScheduleForm`**
    -   **Usage**: Interface for selecting the "Days per Week" and specific training days.
    -   **Interaction**: Toggles for days (Mon, Tue, etc.) or simple count selection.

-   **`WorkoutDayEditor`**
    -   **Usage**: The container for editing a specific workout day (e.g., "Day 1 - Push").
    -   **Features**: Allows renaming the day and adding exercises.

-   **`ExerciseRowEditor`**
    -   **Usage**: A row representing a single exercise within a workout day.
    -   **Features**: Inputs for Sets, Reps (Min/Max), RPE. Deletable row.
    -   **Style**: Compact horizontal layout for data entry.

-   **`ExerciseSearchModal`**
    -   **Usage**: Modal overlay to search and select exercises to add to a workout.

-   **`SplitReview`**
    -   **Usage**: Read-only summary view of the created split before saving.
