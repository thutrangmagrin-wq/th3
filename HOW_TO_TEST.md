# 📱 HƯỚNG DẪN TEST NECTAR APP - CHI TIẾT

## 🎯 Mục tiêu
Kiểm tra 3 chức năng chính:
1. ✅ **Xác thực & Lưu đăng nhập** (Login, Auto-login, Logout)
2. ✅ **Giỏ hàng** (Add, Save, Load, Update)
3. ✅ **Đơn hàng** (Checkout, Save, Load)

---

## 📋 PHẦN 1: ĐĂNG NHẬP & AUTO-LOGIN

### ✅ Ảnh 1: Login thành công

**Bước thực hiện:**
1. Mở app → Splash screen (hiển thị "nectar" + loading bar)
2. Chờ 3 giây → Onboarding screen
3. Nhấn "Get Started" → Sign In screen
4. Nhấn "Log In with Email" → Login screen
5. Nhập email: `test@example.com`
6. Nhập password: `123456`
7. Nhấn "Log In"

**Kết quả mong đợi:**
- ✅ Chuyển sang Home screen
- ✅ Hiển thị tab Shop, Explore, Cart, Favourite, Account
- ✅ Console log: `✅ User login saved with encryption`

**Chụp ảnh:** Home screen sau khi login thành công

---

### ✅ Ảnh 2: Tắt app → Mở lại vẫn login

**Bước thực hiện:**
1. Sau khi login thành công (Ảnh 1)
2. **Tắt app hoàn toàn** (không chỉ minimize)
   - Android: Nhấn nút back hoặc close app
   - iOS: Swipe up để close app
3. **Mở lại app** (nhấn vào Expo Go → project)

**Kết quả mong đợi:**
- ✅ Splash screen hiển thị "Loading..." + loading bar
- ✅ **Tự động chuyển sang Home screen** (không cần login lại)
- ✅ Console log: `✅ User data retrieved and decrypted`

**Chụp ảnh:** Home screen sau khi mở lại app (chứng minh auto-login)

---

### ✅ Ảnh 3: Logout → Quay về login screen

**Bước thực hiện:**
1. Ở Home screen
2. Nhấn tab "Account" (👤) ở dưới cùng
3. Scroll xuống
4. Nhấn "Log Out" (🚪)

**Kết quả mong đợi:**
- ✅ Quay về Sign In screen
- ✅ Tất cả dữ liệu user bị xóa
- ✅ Console log: `✅ User logged out`

**Chụp ảnh:** Sign In screen sau khi logout

---

## 🛒 PHẦN 2: GIỎ HÀNG

### ✅ Ảnh 4: Thêm sản phẩm vào giỏ

**Bước thực hiện:**
1. Login thành công (Ảnh 1)
2. Ở Home screen → Nhấn tab "Shop" (🏪)
3. Kéo xuống → Tìm "Exclusive Offer" section
4. Nhấn nút "+" trên "Red Apple"
5. Quay lại Shop screen
6. Thêm sản phẩm khác (ví dụ: "Banana" ở "Best Selling")
7. Nhấn nút "+" trên "Banana"

**Kết quả mong đợi:**
- ✅ Sản phẩm được thêm vào giỏ
- ✅ Có animation feedback khi thêm
- ✅ Console log: `✅ Cart saved with encryption: 1 items`
- ✅ Console log: `✅ Cart saved with encryption: 2 items`

**Chụp ảnh:** Shop screen với sản phẩm được thêm (hoặc Cart screen)

---

### ✅ Ảnh 5: Tắt app → Mở lại giỏ vẫn còn

**Bước thực hiện:**
1. Sau khi thêm sản phẩm (Ảnh 4)
2. Nhấn tab "Cart" (🛒) để xem giỏ hàng
3. **Tắt app hoàn toàn**
4. **Mở lại app**
5. Nhấn tab "Cart" (🛒)

**Kết quả mong đợi:**
- ✅ Auto-login thành công
- ✅ **Giỏ hàng vẫn còn các sản phẩm đã thêm**
- ✅ Số lượng, giá vẫn đúng
- ✅ Console log: `✅ Cart retrieved and decrypted`

**Chụp ảnh:** Cart screen với sản phẩm vẫn còn

---

### ✅ Ảnh 6: Thay đổi số lượng

**Bước thực hiện:**
1. Ở Cart screen (có sản phẩm)
2. Nhấn nút "+" để tăng số lượng (ví dụ: từ 1 → 2)
3. Nhấn nút "−" để giảm số lượng (ví dụ: từ 2 → 1)
4. Quan sát tổng tiền thay đổi
5. **Tắt app hoàn toàn**
6. **Mở lại app**
7. Nhấn tab "Cart" (🛒)

**Kết quả mong đợi:**
- ✅ Số lượng thay đổi ngay lập tức
- ✅ Tổng tiền cập nhật
- ✅ **Sau khi tắt app → mở lại, số lượng vẫn giữ nguyên**
- ✅ Console log: `✅ Cart saved with encryption`

**Chụp ảnh:** Cart screen với số lượng đã thay đổi

---

## 📦 PHẦN 3: ĐƠN HÀNG

### ✅ Ảnh 7: Đặt hàng thành công

**Bước thực hiện:**
1. Ở Cart screen (có sản phẩm)
2. Nhấn "Go to Checkout"
3. Chờ 2 giây (hiển thị "Processing... ⏳")
4. Nếu thành công → "Order Accepted" screen

**Kết quả mong đợi:**
- ✅ Hiển thị "Your Order has been accepted"
- ✅ Có checkmark animation (✓)
- ✅ Giỏ hàng được xóa trống
- ✅ Console log: `✅ Order saved with encryption: [order_id]`

**Chụp ảnh:** Order Accepted screen

---

### ✅ Ảnh 8: Danh sách đơn hàng

**Bước thực hiện:**
1. Sau khi đặt hàng thành công (Ảnh 7)
2. Nhấn "Back to home"
3. Nhấn tab "Orders" (📦)

**Kết quả mong đợi:**
- ✅ Hiển thị danh sách đơn hàng
- ✅ Mỗi đơn gồm:
  - Order ID (ví dụ: Order #1234567890)
  - Trạng thái: "completed"
  - Số lượng items
  - Tổng tiền
  - Thời gian đặt (ngày + giờ)
  - Danh sách sản phẩm trong đơn
- ✅ Console log: `✅ Orders retrieved and decrypted`

**Chụp ảnh:** Orders screen với danh sách đơn hàng

---

### ✅ Ảnh 9: Reload app vẫn còn đơn hàng

**Bước thực hiện:**
1. Sau khi xem danh sách đơn hàng (Ảnh 8)
2. **Tắt app hoàn toàn**
3. **Mở lại app**
4. Nhấn tab "Orders" (📦)

**Kết quả mong đợi:**
- ✅ Auto-login thành công
- ✅ **Danh sách đơn hàng vẫn còn**
- ✅ Dữ liệu đơn hàng không thay đổi
- ✅ Console log: `✅ Orders retrieved and decrypted`

**Chụp ảnh:** Orders screen sau khi reload app

---

## 🔍 KIỂM TRA CONSOLE LOG

### Cách xem console log:

**Cách 1: Expo DevTools**
```
1. Mở app trên Expo Go
2. Nhấn Ctrl+J (hoặc Cmd+J trên Mac)
3. Xem console output
```

**Cách 2: React Native Debugger**
```
1. Cài đặt: npm install -g react-native-debugger
2. Mở app trên Expo
3. Nhấn Ctrl+M (Android) hoặc Cmd+D (iOS)
4. Chọn "Open Debugger"
5. Xem Console tab
```

### Console log cần thấy:

**Login:**
```
✅ User login saved with encryption
✅ User data retrieved and decrypted
✅ User logged out
```

**Cart:**
```
✅ Cart saved with encryption: 1 items
✅ Cart saved with encryption: 2 items
✅ Cart retrieved and decrypted
```

**Orders:**
```
✅ Order saved with encryption: 1234567890
✅ Orders retrieved and decrypted
```

---

## 📸 TÓMLẠI CÁC ẢNH CẦN CHỤP

| Ảnh | Mô tả | Bước |
|-----|-------|------|
| 1 | Login thành công → Home screen | Phần 1 |
| 2 | Tắt app → Mở lại vẫn login | Phần 1 |
| 3 | Logout → Quay về login screen | Phần 1 |
| 4 | Thêm sản phẩm vào giỏ | Phần 2 |
| 5 | Tắt app → Mở lại giỏ vẫn còn | Phần 2 |
| 6 | Thay đổi số lượng | Phần 2 |
| 7 | Đặt hàng thành công | Phần 3 |
| 8 | Danh sách đơn hàng | Phần 3 |
| 9 | Reload app vẫn còn đơn hàng | Phần 3 |

---

## ⚠️ TROUBLESHOOTING

### Giỏ hàng không lưu
**Vấn đề:** Thêm sản phẩm nhưng không lưu được
**Giải pháp:**
- Kiểm tra console log có lỗi không
- Đảm bảo đã login (`isLoggedIn = true`)
- Kiểm tra AsyncStorage permissions

### Dữ liệu không tải lại
**Vấn đề:** Tắt app → mở lại nhưng dữ liệu không còn
**Giải pháp:**
- Kiểm tra console log: `❌ Error getting saved cart`
- Kiểm tra encryption/decryption có lỗi không
- Thử xóa app data và đăng nhập lại

### Checkout không hoạt động
**Vấn đề:** Nhấn "Go to Checkout" nhưng không có gì xảy ra
**Giải pháp:**
- Kiểm tra giỏ hàng có sản phẩm không
- Chờ 2 giây để processing hoàn tất
- Kiểm tra console log có lỗi không

---

## 🎯 TIÊU CHÍ ĐẠT YÊU CẦU

✅ **Tất cả 9 ảnh chứng minh**
✅ **Tất cả 3 phần hoạt động đúng**
✅ **Console log không có lỗi**
✅ **Dữ liệu được mã hóa trước khi lưu**
✅ **Token expiry hoạt động (24 giờ)**
✅ **Loading screen hiển thị khi khởi động**

---

## 💡 TIPS

### Để test nhanh hơn:
1. Sử dụng email/password đơn giản (ví dụ: test@example.com / 123456)
2. Không cần điền đầy đủ thông tin, chỉ cần email + password
3. Có thể thêm nhiều sản phẩm để test giỏ hàng

### Để xem dữ liệu mã hóa:
1. Mở React Native Debugger
2. Vào tab "Storage" hoặc "AsyncStorage"
3. Xem dữ liệu (sẽ là chuỗi mã hóa, không đọc được)

### Để xóa tất cả dữ liệu test:
1. Logout
2. Hoặc xóa app data trong settings

---

## 📞 LIÊN HỆ

Nếu có vấn đề, kiểm tra:
1. Console log có lỗi không?
2. AsyncStorage có được cài đặt không?
3. Encryption/Decryption có lỗi không?
4. Đã login chưa?

---

**Tác giả:** Đỗ Quỳnh Thu Trang
**Ngày cập nhật:** 2024
**Phiên bản:** 1.0

Good luck! 🚀
