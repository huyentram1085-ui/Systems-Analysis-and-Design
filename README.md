# 🍽️ RESTAURANT TABLE BOOKING SYSTEM
### Hệ thống đặt bàn nhà hàng

## 1. Giới thiệu dự án

**Restaurant Table Booking System** là dự án được thực hiện trong khuôn khổ học phần **Phân tích và Thiết kế Hệ thống** tại Trường Đại học Giao thông Vận tải TP. Hồ Chí Minh.

Dự án hướng đến xây dựng một website hỗ trợ khách hàng tra cứu bàn trống, đặt bàn trực tuyến và nhận mã QR xác nhận. Đồng thời, hệ thống cung cấp các chức năng hỗ trợ nhân viên quản lý phiếu đặt, xác thực QR Check-in và quản lý trạng thái bàn.

Nhóm lựa chọn phạm vi triển khai đơn giản, tập trung vào các nghiệp vụ cốt lõi và phù hợp với năng lực của sinh viên năm 2.

## 2. Mục tiêu dự án

- Số hóa quy trình đặt bàn tại nhà hàng.
- Hỗ trợ khách hàng tra cứu bàn khả dụng theo thời gian, số lượng người và khu vực.
- Xây dựng sơ đồ bàn 2D trực quan, hỗ trợ lựa chọn bàn.
- Quản lý phiếu đặt bàn, đổi hoặc hủy đặt bàn.
- Tích hợp mã QR phục vụ xác thực Check-in.
- Hỗ trợ nhân viên và quản lý theo dõi trạng thái bàn, phiếu đặt.

## 3. Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| HTML | Xây dựng cấu trúc giao diện |
| CSS | Thiết kế và định dạng giao diện |
| JavaScript | Xử lý tương tác Frontend |
| C++ | Xây dựng Backend và xử lý nghiệp vụ |
| MySQL | Quản lý và lưu trữ dữ liệu |
| Figma | Thiết kế UI Prototype |
| draw.io | Thiết kế các sơ đồ phân tích và hệ thống |
| GitHub | Quản lý mã nguồn và phối hợp nhóm |
| CMake | Cấu hình và quản lý quá trình biên dịch C++ |

## 4. Chức năng chính

### 4.1. Phân hệ khách hàng

- Tra cứu bàn khả dụng.
- Xem và lựa chọn bàn trên sơ đồ bàn 2D.
- Nhập thông tin và xác nhận đặt bàn.
- Nhận mã đặt bàn và mã QR.
- Tra cứu phiếu đặt bằng mã đặt bàn và số điện thoại.
- Thực hiện đổi hoặc hủy phiếu theo quy tắc nghiệp vụ.

### 4.2. Phân hệ nhân viên

- Đăng nhập hệ thống nội bộ.
- Quản lý danh sách đặt bàn.
- Lọc phiếu đặt theo ngày và trạng thái.
- Bố trí hoặc ghép bàn.
- Xác thực QR Check-in.
- Cập nhật trạng thái hoàn tất hoặc khách không đến.

### 4.3. Phân hệ quản lý

- Đăng nhập với quyền quản trị.
- Quản lý danh mục khu vực.
- Thêm, sửa và ngưng sử dụng bàn.
- Cập nhật sức chứa và trạng thái sử dụng của bàn.
- Theo dõi danh sách đặt bàn.

## 5. Cấu trúc thư mục dự án

```text
Systems-Analysis-and-Design/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── api.js
│   └── booking.js
│
├── pages/
│   ├── booking.html
│   ├── table-map.html
│   ├── reservation.html
│   ├── confirmation.html
│   ├── my-reservation.html
│   ├── staff.html
│   ├── checkin.html
│   ├── login.html
│   └── admin.html
│
├── assets/
│   ├── images/
│   └── icons/
│
├── database/
│   ├── init_schema.sql
│   └── seed_data.sql
│
├── backend/
│   ├── include/
│   ├── src/
│   └── CMakeLists.txt
│
├── docs/
│   ├── diagrams/
│   └── report/
│       └── tieuluandatbannhahang.docx
│
├── .gitignore
│
└── README.md
```

### Mô tả các thư mục

| Thư mục/File | Chức năng |
|---|---|
| `css/` | Lưu các file định dạng giao diện |
| `js/` | Xử lý logic và kết nối API |
| `pages/` | Chứa các màn hình chức năng |
| `assets/` | Lưu hình ảnh và biểu tượng |
| `database/` | Chứa mã SQL và dữ liệu mẫu |
| `backend/` | Chứa mã nguồn xử lý nghiệp vụ C++ |
| `docs/diagrams/` | Lưu các sơ đồ thiết kế gốc |
| `docs/report/` | Lưu báo cáo tiểu luận |
| `.gitignore` | Quy định các file không đưa lên GitHub |

## 6. Kiến trúc hệ thống

Hệ thống được tổ chức theo mô hình Frontend – Backend – Database.

```text
             CUSTOMER / STAFF / ADMIN
                       |
                       v
              FRONTEND (WEB)
             HTML / CSS / JavaScript
                       |
                       | HTTP / REST API
                       v
                BACKEND (C++)
             Xử lý nghiệp vụ hệ thống
                       |
                       | Database Connection
                       v
                DATABASE
                   MySQL
```

**Frontend:** Tiếp nhận thao tác người dùng, hiển thị dữ liệu và gửi yêu cầu đến Backend.

**Backend:** Xử lý nghiệp vụ tra cứu, đặt bàn, đổi/hủy phiếu, kiểm tra khả dụng và QR Check-in.

**Database:** Lưu trữ thông tin khách hàng, bàn, khu vực, phiếu đặt và tài khoản nội bộ.

## 7. Phân công nhiệm vụ thành viên

| Thành viên | Vai trò | Trách nhiệm chính |
|---|---|---|
| Nguyễn Đặng Huyền Trâm | Project Leader & Report Coordinator | Chương 1, 2, 5; quản lý GitHub; tổng hợp và chỉnh sửa tiểu luận; điều phối và duyệt bàn giao |
| Trần Tuấn Hưng | System Analyst & Test Coordinator | Các sơ đồ phân tích, thiết kế theo phân công; đặc tả Use Case; kiểm thử và ma trận Test Case |
| Lương Gia Bảo | Database Engineer | ERD; Data Dictionary; `init_schema.sql`; `seed_data.sql`; thiết kế và quản lý dữ liệu mẫu |
| Nguyễn Thị Yến Nhi | UI/UX Designer & Frontend Developer | Thiết kế Figma 7 màn hình; lập trình HTML, CSS, JavaScript; xây dựng giao diện website |
| Hồ Đăng Khoa | Backend Developer | Class Diagram; thiết kế API C++; xây dựng C++ Core; kết nối Backend với MySQL |

### Quy trình phối hợp

- **TV1 – Huyền Trâm:** Điều phối tiến độ, quản lý Repository, kiểm tra và tích hợp sản phẩm.
- **TV2 – Tuấn Hưng:** Đối chiếu nghiệp vụ, đảm bảo các sơ đồ và kịch bản kiểm thử thống nhất với yêu cầu hệ thống.
- **TV3 – Gia Bảo:** Phối hợp với TV5 để thống nhất cấu trúc cơ sở dữ liệu và cách truy vấn dữ liệu.
- **TV4 – Yến Nhi:** Phối hợp với TV5 để thống nhất API, dữ liệu hiển thị và trạng thái bàn.
- **TV5 – Đăng Khoa:** Phối hợp với TV3 về MySQL và TV4 về kết nối Frontend – Backend.

## 8. Hướng dẫn cài đặt và chạy dự án

### 8.1. Yêu cầu môi trường

- Visual Studio Code hoặc IDE phù hợp.
- Trình biên dịch C++.
- CMake.
- MySQL Server và MySQL Workbench.
- Trình duyệt Google Chrome hoặc Microsoft Edge.

### 8.2. Lấy mã nguồn dự án

```bash
git clone <GITHUB_REPOSITORY_URL>
```

Di chuyển vào thư mục dự án:

```bash
cd Systems-Analysis-and-Design
```

### 8.3. Khởi tạo cơ sở dữ liệu

1. Mở MySQL Workbench.
2. Kết nối đến MySQL Server.
3. Mở file `database/init_schema.sql`.
4. Thực thi lệnh SQL để tạo cơ sở dữ liệu và các bảng.
5. Thực thi `database/seed_data.sql` để thêm dữ liệu mẫu.

### 8.4. Biên dịch Backend C++

Khi mã nguồn và cấu hình CMake đã hoàn thiện, có thể sử dụng:

```bash
cmake -S backend -B backend/build
cmake --build backend/build
```

Sau đó chạy chương trình Backend theo cấu hình thực tế của dự án.

### 8.5. Chạy Frontend

Mở thư mục dự án bằng Visual Studio Code và sử dụng tiện ích Live Server để chạy giao diện website trên trình duyệt.

**Lưu ý:** Frontend cần kết nối đúng địa chỉ API của Backend đang chạy. GitHub Pages chỉ có thể lưu trữ Frontend tĩnh, không trực tiếp chạy chương trình C++ hoặc MySQL.

## 9. Phạm vi và giới hạn dự án

Phiên bản đầu tiên tập trung vào các nghiệp vụ đặt bàn cơ bản tại một nhà hàng mẫu.

Các chức năng chưa triển khai trong phạm vi hiện tại:

- Thanh toán trực tuyến.
- Gửi Email/SMS tự động.
- Quản lý nhiều chi nhánh.
- Cập nhật dữ liệu thời gian thực bằng WebSocket.
- Thuật toán tự động tìm các bàn kề nhau.
- Khóa bàn tạm thời trong 5 phút.

## 10. Quản lý mã nguồn và đóng góp

Nhóm sử dụng GitHub để quản lý mã nguồn và phối hợp trong quá trình phát triển.

Quy trình làm việc:

1. Mỗi thành viên phụ trách phần công việc được phân công.
2. Tạo branch riêng khi phát triển chức năng.
3. Commit mã nguồn thường xuyên với nội dung rõ ràng.
4. Tạo Pull Request để đề xuất tích hợp mã nguồn.
5. Nhóm trưởng kiểm tra và hợp nhất các thay đổi vào branch `main`.


