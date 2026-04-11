# Nectar App - Onboarding & Authentication

## Tổng quan

Ứng dụng Nectar với 3 màn hình chính:
1. **Onboarding Screen** - Màn hình chào mừng cho người dùng lần đầu
2. **Sign In Screen** - Đăng nhập với số điện thoại hoặc mạng xã hội
3. **Sign Up Screen** - Đăng ký tài khoản mới với email/password

## Cấu trúc thư mục

```
src/
├── components/          # Các component UI tái sử dụng
│   ├── CustomButton.js  # Button với nhiều variants
│   ├── CustomInput.js   # Input field với validation
│   └── Logo.js          # Logo component
├── screens/             # Các màn hình chính
│   ├── OnboardingScreen.js
│   ├── SignInScreen.js
│   ├── SignUpScreen.js
│   └── HomeScreen.js
├── services/            # Business logic
│   └── AuthService.js   # Authentication service
├── utils/               # Utilities
│   └── validation.js    # Email, password, phone validation
└── navigation/          # Navigation setup
    └── AppNavigator.js  # React Navigation configuration
```

## Tính năng đã implement

### OnboardingScreen
- ✅ Hiển thị welcome message và tagline
- ✅ Background image với delivery person
- ✅ Button "Get Started" để chuyển sang SignIn
- ✅ Lưu trạng thái onboarding completed vào AsyncStorage

### SignInScreen
- ✅ Logo Nectar
- ✅ Input số điện thoại với validation E.164
- ✅ Button "Continue with Google" (mock)
- ✅ Button "Continue with Facebook" (mock)
- ✅ Link chuyển sang SignUp screen
- ✅ Error handling và loading states

### SignUpScreen
- ✅ Input username, email, password
- ✅ Real-time email validation với checkmark
- ✅ Password visibility toggle
- ✅ Password strength validation (8+ chars, uppercase, lowercase, number)
- ✅ Terms of Service checkbox
- ✅ Error messages cho từng field
- ✅ Link chuyển sang SignIn screen
- ✅ Debounced validation (300ms)

### AuthService
- ✅ Token storage với expo-secure-store
- ✅ Phone authentication (mock API)
- ✅ Social authentication (mock)
- ✅ Email/password registration (mock API)
- ✅ Session management
- ✅ Input sanitization
- ✅ HTTPS enforcement

### Navigation
- ✅ Conditional routing dựa trên onboarding status và auth state
- ✅ React Navigation với native stack
- ✅ Smooth transitions giữa các màn hình

## Cách chạy

1. **Cài đặt dependencies** (đã cài):
   ```bash
   npm install
   ```

2. **Chạy app**:
   ```bash
   npm start
   ```
   hoặc
   ```bash
   npx expo start
   ```

3. **Chạy trên thiết bị**:
   - Scan QR code với Expo Go app (iOS/Android)
   - Hoặc nhấn `i` cho iOS simulator
   - Hoặc nhấn `a` cho Android emulator

## Validation Rules

### Email
- Phải đúng format email chuẩn
- Hiển thị checkmark khi valid
- Debounce 300ms

### Password
- Tối thiểu 8 ký tự
- Ít nhất 1 chữ hoa
- Ít nhất 1 chữ thường
- Ít nhất 1 số

### Phone Number
- Format E.164 (ví dụ: +84912345678)
- Validation với libphonenumber-js

## Mock API

Hiện tại AuthService sử dụng mock API calls. Để kết nối với backend thật:

1. Thay đổi `API_BASE_URL` trong `src/services/AuthService.js`
2. Implement OAuth flows trong `authenticateWithGoogle()` và `authenticateWithFacebook()`
3. Update error handling theo API response format của backend

## Dependencies chính

- `@react-navigation/native` - Navigation framework
- `expo-secure-store` - Secure token storage
- `@react-native-async-storage/async-storage` - Local storage
- `validator` - Email validation
- `libphonenumber-js` - Phone number validation

## Lưu ý

- Social authentication (Google/Facebook) hiện tại là mock, cần implement OAuth flow đầy đủ
- API calls đang mock, cần kết nối với backend thật
- Có thể thêm loading screen khi app khởi động
- Có thể thêm splash screen với expo-splash-screen

## Next Steps

1. Implement OAuth flows cho Google và Facebook
2. Kết nối với backend API thật
3. Thêm unit tests và integration tests
4. Thêm property-based tests với fast-check
5. Improve styling và animations
6. Thêm keyboard handling tốt hơn
7. Implement OTP verification cho phone auth
