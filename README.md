# 🧮 Giải Hệ Phương Trình Bậc Nhất 2 Ẩn

Ứng dụng web đơn giản cho phép người dùng nhập hệ số của hệ phương trình bậc nhất hai ẩn và chọn phép toán (cộng, trừ, nhân, chia) để tìm nghiệm.

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Sử dụng](#-cài-đặt--sử-dụng)
- [Cách hoạt động](#-cách-hoạt-động)
- [Công thức toán học](#-công-thức-toán-học)
- [Ví dụ minh họa](#-ví-dụ-minh-họa)
- [Xử lý lỗi](#-xử-lý-lỗi)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Tùy chỉnh](#-tùy-chỉnh)
- [Giấy phép](#-giấy-phép)

---

## 🎯 Giới thiệu

Đây là một ứng dụng web nhỏ gọn giúp giải **hệ phương trình bậc nhất hai ẩn** dạng:

Ứng dụng sử dụng **quy tắc Cramer** (định thức) để tìm nghiệm, đồng thời cho phép người dùng chọn phép toán (+, −, ×, ÷) áp dụng trong quá trình tính toán nhằm mục đích minh họa.

---

## ✨ Tính năng

- ✅ Nhập 6 hệ số của hệ phương trình (a₁, b₁, c₁, a₂, b₂, c₂)
- ✅ Chọn phép toán: **Cộng (+)**, **Trừ (−)**, **Nhân (×)**, **Chia (÷)**
- ✅ Tự động nhận diện 3 trường hợp:
  - Hệ có **nghiệm duy nhất**
  - Hệ **vô số nghiệm**
  - Hệ **vô nghiệm**
- ✅ Hiển thị giá trị định thức `D`, `Dx`, `Dy`
- ✅ Giao diện đẹp, responsive, hỗ trợ mobile
- ✅ Nhấn **Enter** trong ô input để giải nhanh
- ✅ Nút **Xóa** để reset toàn bộ form
- ✅ Xử lý lỗi chia cho 0 và input rỗng

---

## 📁 Cấu trúc dự án

---

## 🚀 Cài đặt & Sử dụng

### Cách 1: Chạy trực tiếp

1. Tải toàn bộ 4 file về cùng một thư mục.
2. Mở file `index.html` bằng trình duyệt (Chrome, Firefox, Edge,...).
3. Nhập hệ số và bấm **Giải hệ**.

### Cách 2: Chạy qua Live Server (khuyến nghị)

Nếu dùng **VS Code**:

1. Cài extension **Live Server**.
2. Click chuột phải vào `index.html` → **Open with Live Server**.

Hoặc dùng Python:

```bash
python -m http.server 8000
