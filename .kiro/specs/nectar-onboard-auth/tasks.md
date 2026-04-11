# Implementation Plan: Nectar Onboard + SignIn/SignUp

## Overview

This implementation plan breaks down the authentication feature into discrete coding tasks. The approach follows a bottom-up strategy: first establishing project dependencies and shared utilities, then building reusable UI components, implementing core authentication services, and finally assembling the three main screens (Onboarding, SignIn, SignUp) with full navigation integration.

## Tasks

- [x] 1. Install dependencies and configure project structure
  - Install React Navigation packages (@react-navigation/native, @react-navigation/native-stack, react-native-screens, react-native-safe-area-context)
  - Install authentication packages (expo-auth-session, expo-web-browser, @react-native-async-storage/async-storage, expo-secure-store)
  - Install UI packages (react-native-vector-icons, react-native-keyboard-aware-scroll-view)
  - Install validation packages (validator, libphonenumber-js)
  - Install testing packages (fast-check, @testing-library/react-native, @testing-library/jest-native, msw)
  - Create directory structure: src/screens, src/components, src/services, src/utils, src/navigation
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Implement validation utilities
  - [x] 2.1 Create email validation utility
    - Write validateEmail function using validator library
    - Export function from src/utils/validation.js
    - _Requirements: 4.1, 4.2, 11.1_
  
  - [ ]* 2.2 Write property test for email validation
    - **Property 2: Phone Number Validation Correctness** (adapted for email)
    - **Property 6: Email Validation with UI Feedback**
    - **Validates: Requirements 4.1, 4.2**
  
  - [x] 2.3 Create password validation utility
    - Write validatePassword function checking Strong_Password requirements (8+ chars, 1 uppercase, 1 lowercase, 1 number)
    - Export function from src/utils/validation.js
    - _Requirements: 4.3, 4.9_
  
  - [ ]* 2.4 Write property test for password validation
    - **Property 7: Password Validation Correctness**
    - **Validates: Requirements 4.3**
  
  - [x] 2.5 Create phone number validation utility
    - Write validatePhoneNumber function using libphonenumber-js for E.164 format
    - Export function from src/utils/validation.js
    - _Requirements: 2.1, 2.5_
  
  - [ ]* 2.6 Write property test for phone number validation
    - **Property 2: Phone Number Validation Correctness**
    - **Validates: Requirements 2.1**

- [x] 3. Implement shared UI components
  - [x] 3.1 Create CustomButton component
    - Implement button with variants: 'primary', 'social-google', 'social-facebook'
    - Support loading and disabled states
    - Add proper styling with TouchableOpacity
    - Export from src/components/CustomButton.js
    - _Requirements: 2.2, 3.1, 3.2, 4.5, 10.1, 10.2_
  
  - [x] 3.2 Create CustomInput component
    - Implement text input with validation states (error, validated)
    - Support rightIcon prop for checkmark/visibility toggle
    - Add error message display below input
    - Export from src/components/CustomInput.js
    - _Requirements: 2.1, 4.1, 4.2, 4.4, 11.2, 11.3_
  
  - [x] 3.3 Create Logo component
    - Implement logo with configurable sizes (small, medium, large)
    - Use Image component with proper aspect ratio
    - Export from src/components/Logo.js
    - _Requirements: Visual requirements for branding_

- [x] 4. Implement authentication service
  - [x] 4.1 Create AuthService with token storage
    - Create src/services/AuthService.js
    - Implement storeToken and getToken functions using expo-secure-store
    - Implement removeToken function for logout
    - _Requirements: 8.1, 8.2, 8.5, 12.1_
  
  - [ ]* 4.2 Write property test for token storage
    - **Property 15: Auth Token Storage on Success**
    - **Property 17: Token Removal on Logout**
    - **Property 23: Secure Token Storage**
    - **Validates: Requirements 8.1, 8.5, 12.1**
  
  - [x] 4.3 Implement phone authentication method
    - Add authenticateWithPhone function to AuthService
    - Make API call to backend with phone number
    - Handle OTP response
    - _Requirements: 2.2, 2.3_
  
  - [ ]* 4.4 Write property test for phone authentication
    - **Property 3: Phone Number Authentication API Call**
    - **Validates: Requirements 2.2**
  
  - [x] 4.5 Implement social authentication methods
    - Add authenticateWithGoogle function using expo-auth-session
    - Add authenticateWithFacebook function using expo-auth-session
    - Implement OAuth flow with state parameter validation
    - Send OAuth token to backend for verification
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 12.4_
  
  - [ ]* 4.6 Write property test for OAuth token transmission
    - **Property 5: OAuth Token Backend Transmission**
    - **Property 26: OAuth State Parameter Validation**
    - **Validates: Requirements 3.3, 12.4**
  
  - [x] 4.7 Implement email/password registration method
    - Add registerWithEmail function to AuthService
    - Sanitize inputs before sending to backend
    - Handle registration response with user and token
    - Log terms acceptance timestamp
    - _Requirements: 4.5, 4.6, 5.4, 12.5_
  
  - [ ]* 4.8 Write property test for registration
    - **Property 9: Registration API Call with Valid Credentials**
    - **Property 12: Terms Acceptance Timestamp Logging**
    - **Property 27: Input Sanitization Before Backend Transmission**
    - **Validates: Requirements 4.5, 5.4, 12.5**
  
  - [x] 4.9 Implement session management methods
    - Add getCurrentUser function to retrieve stored user
    - Add isAuthenticated function to check auth state
    - Add logout function to clear tokens and user data
    - _Requirements: 8.2, 8.3, 8.5_
  
  - [ ]* 4.10 Write property test for token verification
    - **Property 16: Token Backend Verification Call**
    - **Validates: Requirements 8.3**
  
  - [x] 4.11 Add HTTPS enforcement and security measures
    - Ensure all API calls use HTTPS protocol
    - Add password plain text storage prevention
    - _Requirements: 12.2, 12.3, 12.5_
  
  - [ ]* 4.12 Write property test for security measures
    - **Property 24: Password Plain Text Storage Prevention**
    - **Property 25: HTTPS-Only API Communication**
    - **Validates: Requirements 12.2, 12.3**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement OnboardingScreen
  - [x] 6.1 Create OnboardingScreen component
    - Create src/screens/OnboardingScreen.js
    - Add background image with delivery person
    - Display welcome message and app tagline
    - Add "Get Started" button using CustomButton
    - Implement handleGetStarted to navigate to SignIn
    - _Requirements: 1.1, 1.3_
  
  - [x] 6.2 Add onboarding completion persistence
    - Use AsyncStorage to mark onboarding as completed
    - Set flag when screen is displayed
    - _Requirements: 1.4_
  
  - [ ]* 6.3 Write property test for onboarding persistence
    - **Property 1: Onboarding Completion Persistence**
    - **Validates: Requirements 1.4**

- [x] 7. Implement SignInScreen
  - [x] 7.1 Create SignInScreen component structure
    - Create src/screens/SignInScreen.js
    - Add Logo component at top
    - Add phone number input using CustomInput
    - Add social login buttons (Google, Facebook) using CustomButton
    - Add "Don't have an account? Sign Up" link
    - _Requirements: 2.1, 3.1, 3.2, 7.1_
  
  - [x] 7.2 Implement phone authentication flow
    - Add state for phone number and loading
    - Implement handlePhoneAuth function
    - Validate phone number before submission
    - Call AuthService.authenticateWithPhone
    - Navigate to Home on success
    - _Requirements: 2.1, 2.2, 2.4, 10.1_
  
  - [ ]* 7.3 Write property test for phone auth error display
    - **Property 4: Invalid Phone Number Error Display**
    - **Validates: Requirements 2.5**
  
  - [x] 7.4 Implement social authentication flows
    - Implement handleGoogleAuth function
    - Implement handleFacebookAuth function
    - Call respective AuthService methods
    - Navigate to Home on success
    - Handle OAuth cancellation gracefully (no error message)
    - _Requirements: 3.1, 3.2, 3.5, 3.6_
  
  - [x] 7.5 Add error handling and loading states
    - Display loading indicator on button during auth
    - Disable button while loading
    - Show inline error for invalid phone number
    - Handle network errors with toast message
    - _Requirements: 2.5, 9.1, 10.1, 10.3_
  
  - [ ]* 7.6 Write property test for network error handling
    - **Property 18: Network Error Message Display**
    - **Validates: Requirements 9.1**
  
  - [x] 7.7 Implement navigation to SignUp
    - Add navigateToSignUp function
    - Wire up "Sign Up" link to navigation
    - _Requirements: 7.1_

- [x] 8. Implement SignUpScreen
  - [x] 8.1 Create SignUpScreen component structure
    - Create src/screens/SignUpScreen.js
    - Add username input using CustomInput
    - Add email input with validation and checkmark
    - Add password input with visibility toggle
    - Add terms of service checkbox
    - Add "Sign Up" button using CustomButton
    - Add "Already have an account? Sign In" link
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 7.2_
  
  - [x] 8.2 Implement real-time email validation
    - Add debounced email validation (300ms)
    - Display checkmark icon when email is valid
    - Display error message when email is invalid
    - _Requirements: 4.1, 4.2, 4.8, 11.1, 11.2_
  
  - [ ]* 8.3 Write property test for email validation UI
    - **Property 6: Email Validation with UI Feedback**
    - **Property 20: Email Validation Debouncing**
    - **Validates: Requirements 4.1, 4.2, 11.1**
  
  - [x] 8.4 Implement password validation and visibility toggle
    - Add password validation on input
    - Display error for weak passwords
    - Implement togglePasswordVisibility function
    - _Requirements: 4.3, 4.4, 4.9_
  
  - [ ]* 8.5 Write property test for password visibility toggle
    - **Property 8: Password Visibility Toggle Idempotence**
    - **Property 10: Weak Password Error Display**
    - **Validates: Requirements 4.4, 4.9**
  
  - [x] 8.6 Implement terms acceptance validation
    - Add state for agreedToTerms checkbox
    - Prevent submission if terms not accepted
    - Display error message "You must accept the terms to continue"
    - Enable submit button only when terms accepted
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 8.7 Write property test for terms validation
    - **Property 11: Terms Acceptance Validation**
    - **Validates: Requirements 5.2**
  
  - [x] 8.8 Implement registration flow
    - Add state for form fields and loading
    - Implement handleSignUp function
    - Validate all fields before submission
    - Call AuthService.registerWithEmail
    - Navigate to Home on success
    - _Requirements: 4.5, 4.6, 4.7, 10.2_
  
  - [x] 8.9 Add error handling for email already exists
    - Handle email-already-exists error from backend
    - Display message "This email is already registered. Please sign in."
    - Provide link to navigate to SignIn
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 8.10 Write property test for email exists error
    - **Property 13: Email Exists Error Message Display**
    - **Validates: Requirements 6.2**
  
  - [x] 8.11 Add network error handling
    - Display toast for network errors
    - Preserve form data on error
    - Provide retry functionality
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 8.12 Write property test for form data preservation
    - **Property 19: Form Data Preservation on Network Error**
    - **Validates: Requirements 9.3**
  
  - [x] 8.13 Implement input validation feedback
    - Clear error messages when input becomes valid
    - Prevent form submission when validation fails
    - _Requirements: 11.4, 11.5_
  
  - [ ]* 8.14 Write property test for validation enforcement
    - **Property 21: Error Message Clearing on Valid Input**
    - **Property 22: Form Validation Enforcement**
    - **Validates: Requirements 11.4, 11.5**
  
  - [x] 8.15 Implement navigation to SignIn
    - Add navigateToSignIn function
    - Wire up "Sign In" link to navigation
    - _Requirements: 7.2_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement navigation system
  - [x] 10.1 Create navigation stack
    - Create src/navigation/AppNavigator.js
    - Set up React Navigation stack with screens: Onboarding, SignIn, SignUp, Home
    - Configure screen options and transitions
    - _Requirements: 1.1, 1.2, 7.3_
  
  - [x] 10.2 Implement conditional routing logic
    - Check AsyncStorage for onboarding completion flag
    - Check AuthService for valid auth token
    - Route to Onboarding if first launch
    - Route to Home if authenticated
    - Route to SignIn otherwise
    - _Requirements: 1.1, 1.2, 8.2, 8.3, 8.4_
  
  - [ ]* 10.3 Write property test for navigation stack integrity
    - **Property 14: Navigation Stack Integrity**
    - **Validates: Requirements 7.3**

- [x] 11. Create placeholder Home screen
  - [x] 11.1 Create basic HomeScreen component
    - Create src/screens/HomeScreen.js
    - Display welcome message with user data
    - Add logout button
    - Wire logout to AuthService.logout and navigate to SignIn
    - _Requirements: 2.4, 3.5, 4.7, 8.5_

- [x] 12. Integrate navigation into App.js
  - [x] 12.1 Update App.js to use AppNavigator
    - Import AppNavigator
    - Wrap with NavigationContainer
    - Remove placeholder content
    - Add SafeAreaProvider for safe area handling
    - _Requirements: All navigation requirements_

- [ ] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Add styling and polish
  - [ ] 14.1 Create theme constants
    - Create src/utils/theme.js with colors, fonts, spacing
    - Define brand colors matching Nectar design
    - _Requirements: Visual consistency_
  
  - [ ] 14.2 Apply styling to all screens
    - Style OnboardingScreen with background image
    - Style SignInScreen with proper spacing and layout
    - Style SignUpScreen with keyboard-aware scroll view
    - Ensure consistent button and input styling
    - _Requirements: Visual requirements_
  
  - [ ] 14.3 Add keyboard handling
    - Wrap SignInScreen and SignUpScreen with KeyboardAwareScrollView
    - Configure keyboard avoiding behavior
    - _Requirements: 11.1 (better UX for input)_

- [ ]* 15. Integration testing
  - [ ]* 15.1 Write integration test for complete sign-in flow
    - Test phone auth flow from input to navigation
    - Mock AuthService API calls
    - Verify navigation to Home on success
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [ ]* 15.2 Write integration test for complete sign-up flow
    - Test registration flow from input to navigation
    - Mock AuthService API calls
    - Verify all validation steps
    - Verify navigation to Home on success
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 4.7_
  
  - [ ]* 15.3 Write integration test for social auth flow
    - Test OAuth redirect and callback handling
    - Mock OAuth providers
    - Verify token transmission to backend
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 15.4 Write integration test for error recovery flows
    - Test network error recovery
    - Test form data preservation
    - Test retry functionality
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit and integration tests validate specific examples and end-to-end flows
- All implementation uses JavaScript (not TypeScript) to match existing project setup
- Authentication tokens will be stored in expo-secure-store for production security
- All API communication must use HTTPS protocol
- Input sanitization is required before sending data to backend
