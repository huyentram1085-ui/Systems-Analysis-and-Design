# HƯỚNG DẪN CHẠY FRONTEND

## 1. Giới thiệu

Frontend là phần giao diện người dùng của hệ thống đặt bàn nhà hàng, được xây dựng bằng HTML, CSS và JavaScript.

## 2. Công nghệ sử dụng

- HTML5: Xây dựng cấu trúc giao diện.
- CSS3: Thiết kế và định dạng giao diện.
- JavaScript: Xử lý các thao tác và tương tác cơ bản.
- Visual Studio Code: Công cụ chỉnh sửa mã nguồn.
- Live Server: Hỗ trợ chạy website trên trình duyệt.

## 3. Cấu trúc thư mục

```text
frontend/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── api.js
│   └── booking.js
├── pages/
│   ├── booking.html
│   ├── table-map.html
│   ├── reservation.html
│   ├── confirmation.html
│   ├── my-reservation.html
│   ├── management.html
│   └── checkin.html
└── assets/
    └── images/
```

## 4. Yêu cầu môi trường

- Máy tính có trình duyệt web (Google Chrome, Microsoft Edge hoặc trình duyệt tương đương).
- Visual Studio Code.
- Extension Live Server trong Visual Studio Code.

## 5. Các bước chạy Frontend

**Bước 1:** Mở Visual Studio Code và chọn Open Folder để mở thư mục dự án.

**Bước 2:** Cài đặt extension Live Server nếu máy tính chưa có.

**Bước 3:** Mở file `frontend/index.html`.

**Bước 4:** Nhấn chuột phải vào file và chọn **Open with Live Server**.

**Bước 5:** Trình duyệt sẽ tự động mở website. Người dùng có thể truy cập các giao diện và thực hiện các thao tác mô phỏng trên hệ thống.

## 6. Lưu ý

- Đảm bảo giữ nguyên cấu trúc thư mục để các đường dẫn HTML, CSS và JavaScript hoạt động chính xác.
- Nên chạy website thông qua Live Server thay vì mở trực tiếp file HTML.
- Phiên bản hiện tại tập trung vào giao diện và mô phỏng một số thao tác cơ bản bằng JavaScript và LocalStorage.
- Một số chức năng cần Backend và cơ sở dữ liệu để hoạt động hoàn chỉnh trong thực tế.