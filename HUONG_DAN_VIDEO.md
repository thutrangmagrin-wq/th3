# Hướng dẫn thêm Video Demo vào GitHub

## Vấn đề: GitHub không hỗ trợ upload video trực tiếp

GitHub có giới hạn kích thước file và không hỗ trợ tốt cho video. Có 3 cách giải quyết:

---

## ✅ Cách 1: Upload lên YouTube (Khuyến nghị)

### Bước 1: Quay video demo app
- Sử dụng screen recorder trên điện thoại hoặc emulator
- Thời lượng: 1-3 phút
- Nội dung: Demo các màn hình và tính năng

### Bước 2: Upload lên YouTube
1. Truy cập: https://youtube.com
2. Đăng nhập tài khoản
3. Click nút "Create" (biểu tượng camera +)
4. Chọn "Upload video"
5. Chọn file video
6. Điền thông tin:
   - Title: "Nectar App - Demo by Đỗ Quỳnh Thu Trang"
   - Description: Mô tả ngắn về app
   - Visibility: **Unlisted** (không công khai, chỉ người có link mới xem)
7. Click "Publish"

### Bước 3: Copy link và thêm vào README.md

```markdown
## Video Demo

[![Nectar App Demo](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

Hoặc xem trực tiếp: https://www.youtube.com/watch?v=VIDEO_ID
```

**Lưu ý:** Thay `VIDEO_ID` bằng ID trong URL YouTube của bạn

---

## ✅ Cách 2: Upload lên Google Drive

### Bước 1: Upload video lên Google Drive
1. Truy cập: https://drive.google.com
2. Click "New" → "File upload"
3. Chọn file video demo
4. Đợi upload xong

### Bước 2: Chia sẻ link
1. Click chuột phải vào file video
2. Chọn "Share" hoặc "Get link"
3. Đổi quyền thành: **Anyone with the link can view**
4. Copy link

### Bước 3: Thêm vào README.md

```markdown
## Video Demo

📹 [Xem video demo trên Google Drive](https://drive.google.com/file/d/YOUR_FILE_ID/view)
```

---

## ✅ Cách 3: Sử dụng GitHub Releases (cho file nhỏ < 25MB)

### Bước 1: Nén video (nếu cần)
- Sử dụng tool: HandBrake, FFmpeg, hoặc online converter
- Giảm resolution xuống 720p
- Giảm bitrate
- Target: < 25MB

### Bước 2: Tạo Release trên GitHub
1. Vào repository trên GitHub
2. Click tab "Releases"
3. Click "Create a new release"
4. Điền thông tin:
   - Tag: `v1.0`
   - Title: "Nectar App v1.0 - Demo"
   - Description: Mô tả ngắn
5. Kéo thả file video vào phần "Attach binaries"
6. Click "Publish release"

### Bước 3: Copy link và thêm vào README.md

```markdown
## Video Demo

📹 [Download video demo](https://github.com/username/repo-name/releases/download/v1.0/demo.mp4)
```

---

## ✅ Cách 4: Chuyển video thành GIF (cho preview ngắn)

### Bước 1: Convert video sang GIF
Sử dụng online tool:
- https://ezgif.com/video-to-gif
- https://cloudconvert.com/mp4-to-gif

Hoặc dùng FFmpeg:
```bash
ffmpeg -i demo.mp4 -vf "fps=10,scale=320:-1" -t 10 output.gif
```

### Bước 2: Upload GIF lên GitHub
1. Tạo thư mục `screenshots/` trong project
2. Copy file GIF vào đó
3. Commit và push

### Bước 3: Thêm vào README.md

```markdown
## Demo Preview

![App Demo](./screenshots/demo.gif)

📹 [Xem video đầy đủ trên YouTube](link-youtube)
```

---

## 📱 Cách quay video demo

### Trên Android:
1. Mở app
2. Vuốt xuống từ trên cùng 2 lần
3. Tìm "Screen record" hoặc "Quay màn hình"
4. Bắt đầu quay
5. Demo app
6. Dừng quay

### Trên iOS:
1. Vào Settings → Control Center
2. Thêm "Screen Recording"
3. Vuốt xuống từ góc trên bên phải
4. Nhấn nút Record (hình tròn)
5. Demo app
6. Dừng quay

### Trên Emulator/Simulator:
- **Android Studio**: Có nút Record built-in
- **Xcode Simulator**: Cmd + R để record
- **Hoặc dùng OBS Studio**: https://obsproject.com/

---

## 📝 Template README.md với video

```markdown
# Nectar App - Onboarding & Authentication

## Thông tin sinh viên

**Họ và tên:** Đỗ Quỳnh Thu Trang  
**MSSV:** [MSSV của bạn]

---

## Video Demo

### 🎥 Xem video demo đầy đủ:

[![Nectar App Demo](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

**Hoặc xem trực tiếp tại:**
- YouTube: https://www.youtube.com/watch?v=VIDEO_ID
- Google Drive: https://drive.google.com/file/d/FILE_ID/view

---

## Screenshots

### Splash Screen
![Splash](./screenshots/splash.png)

### Onboarding
![Onboarding](./screenshots/onboarding.png)

### Sign In
![Sign In](./screenshots/signin.png)

### Sign Up
![Sign Up](./screenshots/signup.png)

---

## Demo GIF (Preview)

![App Demo](./screenshots/demo.gif)

---

[... phần còn lại của README ...]
```

---

## 🎬 Checklist cho video demo

- [ ] Quay video demo app (1-3 phút)
- [ ] Hiển thị đầy đủ 4 màn hình
- [ ] Demo các tính năng chính
- [ ] Chất lượng video rõ ràng
- [ ] Upload lên YouTube/Google Drive
- [ ] Copy link video
- [ ] Thêm link vào README.md
- [ ] Chụp screenshots các màn hình
- [ ] Tạo thư mục screenshots/
- [ ] Thêm screenshots vào README.md
- [ ] (Optional) Tạo GIF preview
- [ ] Commit và push lên GitHub

---

## 💡 Tips

1. **Video ngắn gọn**: 1-3 phút là đủ
2. **Chất lượng tốt**: 720p hoặc 1080p
3. **Có âm thanh**: Giải thích các tính năng (optional)
4. **Unlisted trên YouTube**: Không công khai, chỉ người có link xem được
5. **Thêm timestamp**: Trong description YouTube để dễ navigate

---

## ❓ FAQ

**Q: Video quá lớn, không upload được?**  
A: Nén video xuống 720p hoặc giảm bitrate

**Q: Không muốn public video?**  
A: Chọn "Unlisted" trên YouTube hoặc dùng Google Drive

**Q: GitHub có giới hạn gì?**  
A: File < 100MB, nhưng khuyến nghị < 25MB

**Q: Có cần âm thanh không?**  
A: Không bắt buộc, nhưng có thì tốt hơn

---

## 🔗 Links hữu ích

- YouTube: https://youtube.com
- Google Drive: https://drive.google.com
- EZGIF (video to GIF): https://ezgif.com/video-to-gif
- HandBrake (nén video): https://handbrake.fr/
- OBS Studio (screen record): https://obsproject.com/

---

*Chúc bạn thành công! 🎬*
