# 📋 HƯỚNG DẪN TEST NECTAR APP (P5) - ASYNCSTORAGE

## 🎯 Các tính năng cần test

### 1️⃣ **LOGIN & AUTO-LOGIN (Xác thực & Lưu đăng nhập)**

#### Test 1: Login thành công
```
1. Mở app → Splash screen
2. Chờ 3 giây → Onboarding screen
3. Nhấn "Get Started" → Sign In screen
4. Nhấn "Log In with Email" → Login screen
5. Nhập email: test@example.com
6. Nhập password: 123456
7. Nhấn "Log In" → Home screen
✅ Kết quả: Vào được Home screen, dữ liệu được lưu (mã hóa)
```

#### Test 2: Auto-login (Tắt app → Mở lại)
```
1. Sau khi login thành công (Test 1)
2. Tắt app hoàn toàn
3. Mở lại app
✅ Kết quả: 
   - Splash screen hiển thị "Loading..."
   - Tự động vào Home screen (không cần login lại)
   - Dữ liệu user được lấy từ AsyncStorage (đã giải mã)
```

#### Test 3: Logout
```
1. Ở Home screen → Tab Account (👤)
2. Scroll xuống → Nhấn "Log Out" (🚪)
✅ Kết quả:
   - Quay về Sign In screen
   - Tất cả dữ liệu user bị xóa
   - Lần sau mở app sẽ vào Splash → Onboarding
```

#### Test 4: Token Expiry (24 giờ)
```
1. Login thành công
2. Chờ 24 giờ (hoặc sửa TOKEN_EXPIRY_TIME trong useStorage.js thành 10 giây để test)
3. Mở lại app
✅ Kết quả:
   - Token hết hạn → Tự động logout
   - Quay về Sign In screen
   - Console log: "⏰ Login session expired"
```

---

### 2️⃣ **GIỎ HÀNG (Cart Management)**

#### Test 5: Thêm sản phẩm vào giỏ
```
1. Login thành công → Home screen
2. Tab Shop (🏪)
3. Nhấn "+" trên Red Apple (Exclusive Offer)
✅ Kết quả:
   - Sản phẩm được thêm vào giỏ
   - Console log: "✅ Cart saved with encryption: 1 items"
   - Dữ liệu được mã hóa lưu vào AsyncStorage
```

#### Test 6: Tắt app → Mở lại (Giỏ hàng vẫn còn)
```
1. Sau khi thêm sản phẩm (Test 5)
2. Tắt app
3. Mở lại app
4. Tab Cart (🛒)
✅ Kết quả:
   - Giỏ hàng vẫn có sản phẩm
   - Console log: "✅ Cart retrieved and decrypted"
   - Dữ liệu được giải mã từ AsyncStorage
```

#### Test 7: Tăng/Giảm số lượng
```
1. Ở Cart screen
2. Nhấn "+" để tăng số lượng
3. Nhấn "-" để giảm số lượng
✅ Kết quả:
   - Số lượng thay đổi
   - Tổng tiền cập nhật
   - Console log: "✅ Cart saved with encryption"
```

#### Test 8: Xóa item khỏi giỏ
```
1. Ở Cart screen
2. Nhấn "✕" để xóa sản phẩm
✅ Kết quả:
   - Sản phẩm bị xóa
   - Giỏ hàng cập nhật
   - Console log: "✅ Cart saved with encryption"
```

---

### 3️⃣ **ĐƠN HÀNG (Orders Management)**

#### Test 9: Đặt hàng thành công
```
1. Ở Cart screen (có sản phẩm)
2. Nhấn "Go to Checkout"
3. Chờ 2 giây (processing)
4. Nếu thành công → Order Accepted screen
✅ Kết quả:
   - Hiển thị "Your Order has been accepted"
   - Console log: "✅ Order saved with encryption: [order_id]"
   - Giỏ hàng được xóa
   - Đơn hàng được lưu (mã hóa)
```

#### Test 10: Xem danh sách đơn hàng
```
1. Sau khi đặt hàng thành công (Test 9)
2. Tab Orders (📦)
✅ Kết quả:
   - Hiển thị danh sách đơn hàng
   - Mỗi đơn gồm:
     - Order ID
     - Số lượng items
     - Tổng tiền
     - Thời gian đặt
   - Console log: "✅ Orders retrieved and decrypted"
```

#### Test 11: Tắt app → Mở lại (Đơn hàng vẫn còn)
```
1. Sau khi xem đơn hàng (Test 10)
2. Tắt app
3. Mở lại app
4. Tab Orders (📦)
✅ Kết quả:
   - Danh sách đơn hàng vẫn còn
   - Dữ liệu được giải mã từ AsyncStorage
   - Console log: "✅ Orders retrieved and decrypted"
```

---

### 4️⃣ **MÃ HÓA DỮ LIỆU (Encryption)**

#### Test 12: Kiểm tra dữ liệu được mã hóa
```
1. Login thành công
2. Mở DevTools / React Native Debugger
3. Kiểm tra AsyncStorage:
   - Dữ liệu user: Mã hóa (không đọc được)
   - Dữ liệu cart: Mã hóa (không đọc được)
   - Dữ liệu orders: Mã hóa (không đọc được)
✅ Kết quả:
   - Tất cả dữ liệu đều được mã hóa
   - Không thể đọc trực tiếp từ AsyncStorage
   - Chỉ có thể giải mã bằng decryptData()
```

---

### 5️⃣ **LOADING SCREEN (Skeleton)**

#### Test 13: Loading screen khi khởi động
```
1. Mở app
2. Quan sát Splash screen
✅ Kết quả:
   - Hiển thị "Loading..."
   - Có loading bar animation
   - Chờ khoảng 1-2 giây
   - Tự động vào Home (nếu đã login) hoặc Onboarding
```

---

## 🔍 **CONSOLE LOG ĐỂ KIỂM TRA**

Mở DevTools / React Native Debugger để xem console log:

### Login:
```
✅ User login saved with encryption
✅ User data retrieved and decrypted
⏰ Login session expired (nếu hết hạn)
```

### Cart:
```
✅ Cart saved with encryption: X items
✅ Cart retrieved and decrypted
```

### Orders:
```
✅ Order saved with encryption: [order_id]
✅ Orders retrieved and decrypted
```

### Errors:
```
❌ Error saving user login: [error message]
❌ Error getting saved user: [error message]
❌ Encryption failed
❌ Decryption failed
```

---

## 📱 **CÁCH MỞ DEVTOOLS**

### React Native Debugger:
```
1. Cài đặt: npm install -g react-native-debugger
2. Mở app trên Expo
3. Nhấn Ctrl+M (Android) hoặc Cmd+D (iOS)
4. Chọn "Open Debugger"
5. Xem Console tab
```

### Expo DevTools:
```
1. Mở app trên Expo
2. Nhấn Ctrl+J (hoặc Cmd+J trên Mac)
3. Xem console output
```

---

## ✅ **CHECKLIST TEST**

- [ ] Test 1: Login thành công
- [ ] Test 2: Auto-login (tắt app → mở lại)
- [ ] Test 3: Logout
- [ ] Test 4: Token expiry (24 giờ)
- [ ] Test 5: Thêm sản phẩm vào giỏ
- [ ] Test 6: Giỏ hàng vẫn còn sau khi tắt app
- [ ] Test 7: Tăng/giảm số lượng
- [ ] Test 8: Xóa item khỏi giỏ
- [ ] Test 9: Đặt hàng thành công
- [ ] Test 10: Xem danh sách đơn hàng
- [ ] Test 11: Đơn hàng vẫn còn sau khi tắt app
- [ ] Test 12: Kiểm tra dữ liệu được mã hóa
- [ ] Test 13: Loading screen khi khởi động

---

## 🎬 **VIDEO DEMO**

Khi quay video demo, hãy:
1. **Ảnh 1**: Login thành công → Home screen
2. **Ảnh 2**: Tắt app → Mở lại vẫn login
3. **Ảnh 3**: Logout → Quay về login screen
4. **Ảnh 4**: Thêm sản phẩm vào giỏ
5. **Ảnh 5**: Tắt app → Mở lại giỏ vẫn còn
6. **Ảnh 6**: Thay đổi số lượng
7. **Ảnh 7**: Đặt hàng thành công
8. **Ảnh 8**: Danh sách đơn hàng
9. **Ảnh 9**: Reload app vẫn còn đơn hàng

---

## 💡 **TIPS**

- Để test token expiry nhanh, sửa `TOKEN_EXPIRY_TIME` thành 10 giây:
  ```javascript
  // src/hooks/useStorage.js
  const TOKEN_EXPIRY_TIME = 10 * 1000; // 10 giây
  ```

- Để xóa tất cả dữ liệu test, thêm button debug:
  ```javascript
  // Trong Account screen
  <TouchableOpacity onPress={() => clearAllStorage()}>
    <Text>🧹 Clear All Storage (Debug)</Text>
  </TouchableOpacity>
  ```

- Để xem dữ liệu mã hóa, dùng React Native Debugger:
  ```
  1. Mở Debugger
  2. Vào tab "Storage" hoặc "AsyncStorage"
  3. Xem dữ liệu (sẽ là chuỗi mã hóa)
  ```

---

## 📞 **LIÊN HỆ**

Nếu có vấn đề, kiểm tra:
1. Console log có lỗi không?
2. AsyncStorage có được cài đặt không?
3. Encryption/Decryption có lỗi không?
4. Token có hết hạn không?

Good luck! 🚀
