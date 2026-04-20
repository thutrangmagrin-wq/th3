# 🎯 START HERE - NECTAR APP

## 👋 Chào mừng!

Bạn đang xem Nectar App - một ứng dụng mua sắm trực tuyến được xây dựng bằng React Native + Expo.

---

## 🚀 Bắt đầu trong 5 phút

### 1️⃣ Mở app
```
1. Mở Expo Go
2. Nhấn vào project Nectar
3. Chờ app load
```

### 2️⃣ Login
```
Email: test@example.com
Password: 123456
```

### 3️⃣ Test 3 chức năng
- ✅ **Thêm sản phẩm** → Tab Shop (🏪) → Nhấn "+"
- ✅ **Xem giỏ hàng** → Tab Cart (🛒)
- ✅ **Checkout** → Nhấn "Go to Checkout"

### 4️⃣ Tắt app → Mở lại
- ✅ **Dữ liệu vẫn còn** (được lưu vào AsyncStorage)

---

## 📚 Tài liệu

### 🎯 Nếu bạn muốn:

**Bắt đầu nhanh (5 phút)**
→ Đọc [`QUICK_START.md`](./QUICK_START.md)

**Hiểu vấn đề chi tiết**
→ Đọc [`DETAILED_EXPLANATION.md`](./DETAILED_EXPLANATION.md)

**Test ứng dụng (9 ảnh)**
→ Đọc [`HOW_TO_TEST.md`](./HOW_TO_TEST.md)

**Xem tất cả test cases (13 cases)**
→ Đọc [`TESTING_GUIDE.md`](./TESTING_GUIDE.md)

**Biết những gì đã thay đổi**
→ Đọc [`CHANGES_MADE.md`](./CHANGES_MADE.md)

**Tóm tắt chung**
→ Đọc [`SUMMARY.md`](./SUMMARY.md)

**Xem tất cả tài liệu**
→ Đọc [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md)

---

## 🎯 9 Ảnh cần chụp

| # | Mô tả |
|---|-------|
| 1 | Login thành công → Home screen |
| 2 | Tắt app → Mở lại vẫn login |
| 3 | Logout → Sign In screen |
| 4 | Thêm sản phẩm vào giỏ |
| 5 | Tắt app → Mở lại giỏ vẫn còn |
| 6 | Thay đổi số lượng |
| 7 | Checkout thành công |
| 8 | Danh sách đơn hàng |
| 9 | Tắt app → Mở lại đơn hàng vẫn còn |

---

## 🧪 Test nhanh

### Test 1: Thêm sản phẩm
```
1. Login → Home
2. Tab Shop (🏪)
3. Nhấn "+" trên sản phẩm
4. Tab Cart (🛒)
✅ Sản phẩm hiển thị
```

### Test 2: Tắt app → Mở lại
```
1. Sau khi thêm sản phẩm
2. Tắt app hoàn toàn
3. Mở lại app
4. Tab Cart (🛒)
✅ Sản phẩm vẫn còn
```

### Test 3: Checkout
```
1. Tab Cart (🛒)
2. Nhấn "Go to Checkout"
3. Chờ 2 giây
✅ Order Accepted screen
```

---

## 📊 Console Log

Xem console log để kiểm tra:
```
✅ User login saved with encryption
✅ Cart saved with encryption: X items
✅ Order saved with encryption: [order_id]
```

---

## 🎯 Chức năng

### ✅ Xác thực
- Login thành công
- Auto-login khi mở lại app
- Logout
- Token expiry (24 giờ)

### ✅ Giỏ hàng
- Thêm sản phẩm
- Lưu vào AsyncStorage (mã hóa)
- Tải khi mở lại app
- Thay đổi số lượng
- Xóa sản phẩm

### ✅ Đơn hàng
- Checkout thành công
- Lưu vào AsyncStorage (mã hóa)
- Xem danh sách đơn hàng
- Tải khi mở lại app

---

## 📁 Cấu trúc

```
nectar-app/
├── App.js (main file)
├── data.js (product data)
├── src/
│   ├── services/storageService.js (AsyncStorage)
│   ├── utils/encryption.js (mã hóa)
│   └── hooks/useStorage.js (custom hook)
├── assets/ (hình ảnh)
└── [tài liệu]
```

---

## 💡 Tips

- **Tắt app hoàn toàn** (không chỉ minimize)
- **Mở lại app** từ Expo Go
- **Kiểm tra console log** để xác nhận dữ liệu được lưu
- **Xem `HOW_TO_TEST.md`** để troubleshooting

---

## 🔧 Sửa lỗi

### Giỏ hàng không lưu?
1. Kiểm tra console log có lỗi không
2. Đảm bảo đã login
3. Xem `DETAILED_EXPLANATION.md`

### Dữ liệu không tải lại?
1. Kiểm tra console log: `❌ Error getting saved cart`
2. Xem `HOW_TO_TEST.md` để troubleshooting
3. Thử xóa app data và đăng nhập lại

---

## 📞 Liên hệ

Nếu có vấn đề:
1. Kiểm tra console log
2. Xem `DETAILED_EXPLANATION.md` để hiểu vấn đề
3. Xem `HOW_TO_TEST.md` để troubleshooting
4. Đảm bảo đã login trước khi test

---

## 🎯 Tiêu chí đạt yêu cầu

✅ **Tất cả 9 ảnh chứng minh**
✅ **Tất cả 3 chức năng hoạt động**
✅ **Console log không có lỗi**
✅ **Dữ liệu được mã hóa**
✅ **Token expiry hoạt động**
✅ **Loading screen hiển thị**

---

## 📚 Tài liệu đầy đủ

| File | Mô tả |
|------|-------|
| `QUICK_START.md` | Hướng dẫn nhanh (5 phút) |
| `HOW_TO_TEST.md` | Hướng dẫn test chi tiết (9 ảnh) |
| `DETAILED_EXPLANATION.md` | Giải thích chi tiết |
| `CART_FIX_SUMMARY.md` | Tóm tắt lỗi |
| `CHANGES_MADE.md` | Chi tiết thay đổi |
| `TESTING_GUIDE.md` | Hướng dẫn test (13 cases) |
| `SUMMARY.md` | Tóm tắt chung |
| `README_FINAL.md` | Final summary |
| `DOCUMENTATION_INDEX.md` | Index tài liệu |
| `START_HERE.md` | File này |

---

## 🚀 Bắt đầu ngay

1. Mở Expo Go
2. Nhấn vào project Nectar
3. Login: `test@example.com` / `123456`
4. Đọc `QUICK_START.md` hoặc `HOW_TO_TEST.md`
5. Thực hiện test
6. Chụp 9 ảnh chứng minh

---

**Tác giả:** Đỗ Quỳnh Thu Trang
**Ngày cập nhật:** 2024
**Phiên bản:** 1.0

Good luck! 🚀
