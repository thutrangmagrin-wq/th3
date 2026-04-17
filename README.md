# Nectar App - Onboarding & Authentication

## Thông tin sinh viên

**Họ và tên:** Đỗ Quỳnh Thu Trang  
**MSSV:** 23810310379

---

## Giới thiệu

Ứng dụng Nectar là một ứng dụng mua sắm tạp hóa trực tuyến được xây dựng bằng React Native và Expo. Dự án này bao gồm các màn hình:

- **Splash Screen** - Màn hình chào mừng với logo Nectar
- **Onboarding Screen** - Giới thiệu ứng dụng cho người dùng lần đầu
- **Sign In Screen** - Đăng nhập với số điện thoại hoặc mạng xã hội
- **Sign Up Screen** - Đăng ký tài khoản mới với email và mật khẩu

---

## Công nghệ sử dụng

- **React Native** - Framework phát triển mobile app
- **Expo** - Platform để build và test React Native app
- **JavaScript** - Ngôn ngữ lập trình

---

## Hướng dẫn cài đặt và chạy app

### Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn
- Expo Go app trên điện thoại (iOS/Android)
- Hoặc Android Emulator / iOS Simulator

### Bước 1: Clone hoặc tải project

```bash
# Nếu có git
git clone [link-repository]

# Hoặc tải file zip và giải nén
```

### Bước 2: Cài đặt dependencies

```bash
# Di chuyển vào thư mục project
cd nectar-app

# Cài đặt các package cần thiết
npm install
```

### Bước 3: Chạy ứng dụng

```bash
# Khởi động Metro bundler
npm start

# Hoặc
npx expo start
```

### Bước 4: Xem app trên thiết bị

#### Trên điện thoại thật:

1. Tải **Expo Go** từ App Store (iOS) hoặc Google Play (Android)
2. Mở Expo Go app
3. Quét mã QR hiển thị trên terminal hoặc browser
4. App sẽ tự động load và chạy

#### Trên Emulator/Simulator:

```bash
# Chạy trên Android Emulator
npm start
# Nhấn 'a' trong terminal

# Chạy trên iOS Simulator (chỉ trên Mac)
npm start
# Nhấn 'i' trong terminal
```

### Bước 5: Test các màn hình

1. **Splash Screen** - Tự động hiển thị 3 giây khi mở app
2. **Onboarding** - Nhấn "Get Started" để chuyển sang Sign In
3. **Sign In** - Nhấn "Sign Up" để chuyển sang Sign Up
4. **Sign Up** - Điền thông tin và test validation

---

## Tính năng đã implement

### ✅ Splash Screen
- Logo Nectar trên nền xanh lá
- Tự động chuyển sang Onboarding sau 3 giây

### ✅ Onboarding Screen
- Background image với delivery person
- Welcome message
- Hiển thị tên tác giả
- Button "Get Started"

### ✅ Sign In Screen
- Logo Nectar
- Input số điện thoại
- Button "Continue with Google"
- Button "Continue with Facebook"
- Link chuyển sang Sign Up

### ✅ Sign Up Screen
- Input Username
- Input Email với validation real-time
- Hiển thị checkmark khi email hợp lệ
- Input Password với toggle show/hide
- Checkbox Terms of Service
- Validation đầy đủ
- Link chuyển về Sign In

### ✅ Validation
- Email format validation
- Password strength validation (8+ ký tự, có chữ hoa, chữ thường, số)
- Real-time feedback
- Error messages rõ ràng

---

## Cấu trúc thư mục

```
nectar-app/
├── assets/                    # Hình ảnh và tài nguyên
│   ├── onboarding-bg.png     # Background cho Onboarding
│   └── signin-logo.png       # Logo cho Sign In
├── App.js                     # File chính chứa tất cả màn hình
├── package.json               # Dependencies
└── README.md                  # File này
```

---

## Screenshots

### 1. Splash Screen
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/54736465-785b-42ff-bd38-36508057a47e" />

*Màn hình mở đầu với logo Nectar*

### 2. Onboarding Screen
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/11c479ce-7bd7-463f-b08a-57d3f4a0c32f" />

*Màn hình giới thiệu ứng dụng*

### 3. Sign In Screen
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/3bc2b3ac-1841-46c3-9300-5b472503c097" />

*Màn hình đăng nhập*

### 4. Sign Up Screen
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/34012d52-7aff-4def-b1c6-c435a3bc670e" />



<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/a7c983e0-fb75-4f02-84ec-7ca745242c22" />
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/314b2d87-1314-403e-901a-fc01bea780f6" />
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/46a4af12-c4f3-4b14-aa39-cff0a820b994" />
<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/4993ae1b-9b79-4166-845c-82e7cf1e9697" />

<img width="1080" height="2400" alt="image" src="https://github.com/user-attachments/assets/4cff4df6-34ac-4fed-9797-c62ad8422abf" />

*Màn hình đăng ký*

---

## Video Demo
https://res.cloudinary.com/dhnrlnoee/video/upload/v1775918157/7715806912351_ze5woj.mp4

## 

- App hiện tại chỉ có UI, chưa kết nối backend thật
- Social login (Google/Facebook) là mock, chưa implement OAuth
- Validation chỉ ở phía client
- Để production cần thêm:
  - Backend API
  - Database
  - Authentication service
  - OAuth integration

---

