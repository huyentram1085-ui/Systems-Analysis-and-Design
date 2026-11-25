HỆ THỐNG ĐẶT BÀN - BẢN ĐÃ VIẾT LẠI

CÁCH MỞ
1. Giải nén thư mục website_dat_ban.
2. Mở thư mục này bằng Visual Studio Code.
3. Mở index.html bằng Live Server.
4. Có thể mở từng trang trong thư mục pages để kiểm tra riêng.

CÁC TRANG
- home.html: Trang chủ
- login.html: Đăng nhập
- booking.html: Tìm bàn
- table-map.html: Sơ đồ bàn
- reservation.html: Thông tin đặt bàn
- success.html: Đặt bàn thành công
- lookup.html: Tra cứu đặt bàn (không yêu cầu đăng nhập)
- management.html: Quản lý đặt bàn (yêu cầu đăng nhập nhân viên hoặc quản lý)
- layout.html: Bố trí bàn (yêu cầu đăng nhập nhân viên hoặc quản lý)
- checkin.html: Quét mã QR (yêu cầu đăng nhập nhân viên hoặc quản lý)

TÀI KHOẢN DEMO
Nhân viên: nhanvien / 123456
Quản lý: quanly / 123456

LƯU Ý
- Đây là giao diện chạy phía trình duyệt, chưa kết nối máy chủ hay cơ sở dữ liệu.
- Dữ liệu đặt bàn được lưu trong localStorage của trình duyệt.
- Mỗi lượt sử dụng bàn là 2 giờ và cộng thêm 15 phút dọn bàn; bàn được khóa trong tổng cộng 2 giờ 15 phút.
- Tài khoản quản lý có thể chuyển qua lại giữa Quét mã QR, Bố trí bàn và Quản lý đặt bàn mà không bị đăng xuất.
- Để thử quét mã, hãy tạo một phiếu đặt bàn trước; mã đặt bàn được hiển thị ở màn hình thành công.
- Nếu trình duyệt đang lưu dữ liệu thử cũ, có thể xóa dữ liệu trang trong mục Application > Local Storage.
