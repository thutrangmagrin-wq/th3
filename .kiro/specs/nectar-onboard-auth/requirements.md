# Requirements Document: Nectar Onboard + SignIn/SignUp

## Introduction

This document specifies the functional requirements for the Nectar grocery delivery mobile application's onboarding and authentication system. The system enables first-time users to learn about the app through an onboarding experience, and provides multiple authentication methods including phone number authentication, social login (Google and Facebook), and email/password registration. The requirements ensure secure, user-friendly authentication flows that comply with modern mobile app standards.

## Glossary

- **Onboarding_Screen**: The initial welcome screen shown to first-time users that introduces the Nectar app
- **SignIn_Screen**: The authentication screen where users can log in using phone number or social providers
- **SignUp_Screen**: The registration screen where new users create accounts with email and password
- **Auth_Service**: The centralized service managing authentication logic and API communication
- **Navigation_System**: React Navigation stack managing screen transitions and routing
- **User**: An authenticated individual with access to the Nectar app
- **Auth_Token**: A secure token representing an authenticated session
- **AsyncStorage**: Local persistent storage for app data and preferences
- **OAuth_Provider**: External authentication service (Google or Facebook)
- **Valid_Email**: Email address matching standard email format regex pattern
- **Strong_Password**: Password with at least 8 characters including 1 uppercase, 1 lowercase, and 1 number
- **E164_Phone**: Phone number in international E.164 format

## Requirements

### Requirement 1: First-Time User Onboarding

**User Story:** As a first-time user, I want to see a welcome screen that introduces the app, so that I understand what Nectar offers before signing in.

#### Acceptance Criteria

1. WHEN the app launches for the first time, THE Navigation_System SHALL display the Onboarding_Screen
2. WHEN the app launches on subsequent visits, THE Navigation_System SHALL skip the Onboarding_Screen and display the SignIn_Screen
3. WHEN a user taps the "Get Started" button, THE Onboarding_Screen SHALL navigate to the SignIn_Screen
4. WHEN the Onboarding_Screen is displayed, THE system SHALL mark onboarding as completed in AsyncStorage

### Requirement 2: Phone Number Authentication

**User Story:** As a user, I want to sign in with my phone number, so that I can quickly access my account without remembering a password.

#### Acceptance Criteria

1. WHEN a user enters a phone number, THE SignIn_Screen SHALL validate it against E164_Phone format
2. WHEN a valid phone number is submitted, THE Auth_Service SHALL send the phone number to the backend for verification
3. WHEN the backend verifies the phone number, THE Auth_Service SHALL receive an OTP confirmation
4. WHEN authentication succeeds, THE Navigation_System SHALL navigate to the Home screen with the User object
5. IF the phone number format is invalid, THEN THE SignIn_Screen SHALL display an inline error message "Please enter a valid phone number"

### Requirement 3: Social Authentication

**User Story:** As a user, I want to sign in with Google or Facebook, so that I can use my existing social accounts without creating new credentials.

#### Acceptance Criteria

1. WHEN a user taps "Continue with Google", THE Auth_Service SHALL initiate the Google OAuth flow
2. WHEN a user taps "Continue with Facebook", THE Auth_Service SHALL initiate the Facebook OAuth flow
3. WHEN the OAuth flow completes successfully, THE Auth_Service SHALL send the OAuth token to the backend for verification
4. WHEN the backend verifies the OAuth token, THE Auth_Service SHALL receive the User object and Auth_Token
5. WHEN social authentication succeeds, THE Navigation_System SHALL navigate to the Home screen
6. IF the user cancels the OAuth flow, THEN THE SignIn_Screen SHALL remain displayed without showing an error message

### Requirement 4: Email and Password Registration

**User Story:** As a new user, I want to create an account with email and password, so that I can access the Nectar app with my own credentials.

#### Acceptance Criteria

1. WHEN a user enters an email address, THE SignUp_Screen SHALL validate it against Valid_Email format in real-time
2. WHEN the email is valid, THE SignUp_Screen SHALL display a checkmark indicator
3. WHEN a user enters a password, THE SignUp_Screen SHALL validate it against Strong_Password requirements
4. WHEN a user taps the password visibility toggle, THE SignUp_Screen SHALL show or hide the password text
5. WHEN a user submits the sign-up form with valid credentials and accepted terms, THE Auth_Service SHALL send the registration request to the backend
6. WHEN the backend creates the account successfully, THE Auth_Service SHALL receive the User object and Auth_Token
7. WHEN registration succeeds, THE Navigation_System SHALL navigate to the Home screen
8. IF the email format is invalid, THEN THE SignUp_Screen SHALL display an inline error message below the email field
9. IF the password does not meet Strong_Password requirements, THEN THE SignUp_Screen SHALL display an inline error message "Password must be at least 8 characters with uppercase, lowercase, and number"

### Requirement 5: Terms of Service Acceptance

**User Story:** As a new user, I want to review and accept terms of service, so that I understand the app's policies before creating an account.

#### Acceptance Criteria

1. WHEN the SignUp_Screen is displayed, THE system SHALL show a checkbox for terms of service and privacy policy agreement
2. WHEN a user attempts to submit the sign-up form without accepting terms, THE SignUp_Screen SHALL prevent submission and display an error message "You must accept the terms to continue"
3. WHEN a user accepts the terms, THE system SHALL enable the sign-up button
4. WHEN a user successfully registers, THE Auth_Service SHALL log the timestamp of terms acceptance

### Requirement 6: Email Uniqueness Validation

**User Story:** As a returning user, I want to be notified if my email is already registered, so that I can sign in instead of creating a duplicate account.

#### Acceptance Criteria

1. WHEN a user submits a sign-up form with an email that already exists, THE Auth_Service SHALL receive an error from the backend
2. WHEN the email already exists error is received, THE SignUp_Screen SHALL display the message "This email is already registered. Please sign in."
3. WHEN the email already exists error is displayed, THE SignUp_Screen SHALL provide a link to navigate to the SignIn_Screen

### Requirement 7: Navigation Between Authentication Screens

**User Story:** As a user, I want to easily switch between sign-in and sign-up screens, so that I can choose the appropriate action for my situation.

#### Acceptance Criteria

1. WHEN the SignIn_Screen is displayed, THE system SHALL provide a navigation link to the SignUp_Screen for new users
2. WHEN the SignUp_Screen is displayed, THE system SHALL provide a navigation link to the SignIn_Screen for existing users
3. WHEN a user navigates between authentication screens, THE Navigation_System SHALL preserve the navigation stack correctly

### Requirement 8: Authentication State Management

**User Story:** As a user, I want my authentication session to persist, so that I don't have to sign in every time I open the app.

#### Acceptance Criteria

1. WHEN authentication succeeds, THE Auth_Service SHALL store the Auth_Token in AsyncStorage
2. WHEN the app launches, THE Auth_Service SHALL retrieve the Auth_Token from AsyncStorage
3. WHEN a valid Auth_Token exists, THE Auth_Service SHALL verify the token with the backend
4. WHEN the token is valid, THE Navigation_System SHALL navigate directly to the Home screen
5. WHEN a user logs out, THE Auth_Service SHALL remove the Auth_Token from AsyncStorage

### Requirement 9: Error Handling for Network Failures

**User Story:** As a user, I want to be informed when network errors occur, so that I understand why authentication failed and can retry.

#### Acceptance Criteria

1. IF an authentication API request fails due to network connectivity, THEN THE system SHALL display a toast message "Network error. Please check your connection and try again."
2. WHEN a network error occurs, THE system SHALL provide a retry button
3. WHEN a network error occurs during form submission, THE system SHALL preserve the form data to prevent loss
4. WHEN the user taps retry, THE Auth_Service SHALL reattempt the failed request

### Requirement 10: Loading States During Authentication

**User Story:** As a user, I want to see loading indicators during authentication, so that I know the app is processing my request.

#### Acceptance Criteria

1. WHEN an authentication request is in progress, THE SignIn_Screen SHALL display a loading indicator on the submit button
2. WHEN a registration request is in progress, THE SignUp_Screen SHALL display a loading indicator on the submit button
3. WHILE an authentication request is in progress, THE system SHALL disable the submit button to prevent duplicate submissions
4. WHEN the authentication request completes, THE system SHALL hide the loading indicator and re-enable the button

### Requirement 11: Input Validation and User Feedback

**User Story:** As a user, I want immediate feedback on my input, so that I can correct errors before submitting the form.

#### Acceptance Criteria

1. WHEN a user types in the email field, THE SignUp_Screen SHALL validate the email format with a 300ms debounce
2. WHEN the email validation passes, THE SignUp_Screen SHALL display a checkmark icon
3. WHEN the email validation fails, THE SignUp_Screen SHALL display an error message below the input field
4. WHEN a user corrects an invalid input to a valid value, THE system SHALL clear the error message
5. WHEN form validation fails, THE system SHALL prevent form submission

### Requirement 12: Secure Authentication Token Storage

**User Story:** As a user, I want my authentication credentials stored securely, so that my account remains protected.

#### Acceptance Criteria

1. THE Auth_Service SHALL store Auth_Token values in secure storage
2. THE Auth_Service SHALL never store passwords in plain text
3. THE Auth_Service SHALL communicate with the backend exclusively over HTTPS
4. WHEN OAuth authentication is used, THE Auth_Service SHALL validate the OAuth state parameter to prevent CSRF attacks
5. THE Auth_Service SHALL sanitize all user inputs before sending to the backend
