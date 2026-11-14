
// UI-02: Chon ban

let tables = document.querySelectorAll(".table.available");
let tableInfo = document.getElementById("table-info");
let continueBtn = document.getElementById("continue-btn");

if (continueBtn) {

    tables.forEach(function(table) {

        table.addEventListener("click", function() {

            tables.forEach(function(item) {
                item.classList.remove("selected");
            });

            table.classList.add("selected");

            let name = table.dataset.name;
            let seat = table.dataset.seat;

            const infoName = document.getElementById("info-name");
            const infoSeat = document.getElementById("info-seat");
            const infoArea = document.getElementById("info-area");
            const infoStatus = document.getElementById("info-status");

            if (infoName) infoName.innerText = name;
            if (infoSeat) infoSeat.innerText = seat + " khách";
            if (infoArea) infoArea.innerText = table.dataset.area || "Chưa xác định";
            if (infoStatus) infoStatus.innerText = "Đang chọn";

            continueBtn.disabled = false;

            localStorage.setItem("selectedTable", name);
            localStorage.setItem("selectedSeat", seat);
        });

    });

    continueBtn.addEventListener("click", function() {
        window.location.href = "reservation.html";
    });
}


// UI-03: Hien thi ban da chon

let selectedTable = document.getElementById("selected-table");

if (selectedTable) {

    let name = localStorage.getItem("selectedTable");
    let seat = localStorage.getItem("selectedSeat");

    if (name) {
        selectedTable.innerText =
            "Bàn " + name + " - " + seat + " chỗ ngồi";
    } else {
        selectedTable.innerText = "Bạn chưa chọn bàn.";
    }
}


// UI-03: Xu ly form dat ban

let reservationForm = document.getElementById("reservation-form");

if (reservationForm) {

    reservationForm.addEventListener("submit", function(event) {

        event.preventDefault();

        localStorage.setItem("customerName",
            document.getElementById("customer-name").value);

        localStorage.setItem("customerPhone",
            document.getElementById("customer-phone").value);

        localStorage.setItem("customerEmail",
            document.getElementById("customer-email").value);

        localStorage.setItem("specialNote",
            document.getElementById("special-note").value);

        window.location.href = "confirmation.html";
    });
}


// UI-04: Hien thi thong tin xac nhan

let qrImage = document.getElementById("qr-image");

if (qrImage) {

    // Tao ma dat ban
    let code = "RSV" + Date.now().toString().slice(-8);

    localStorage.setItem("bookingCode", code);

    // Thong tin dat ban
    document.getElementById("booking-code-info").innerText = code;

    document.getElementById("confirm-name").innerText =
        localStorage.getItem("customerName") || "";

    document.getElementById("confirm-date").innerText =
        localStorage.getItem("bookingDate") || "";

    document.getElementById("confirm-time").innerText =
        localStorage.getItem("bookingTime") || "";

    document.getElementById("confirm-guests").innerText =
        localStorage.getItem("guestNumber") || "";

    let table = localStorage.getItem("selectedTable");

    document.getElementById("confirm-table").innerText =
        "Bàn " + (table || "");

    // Tao QR Code
    qrImage.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=170x170&data="
        + encodeURIComponent(code);
}

// UI-05: Tra cuu dat ban

let searchForm = document.getElementById("search-reservation");

if (searchForm) {

    searchForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let code = document.getElementById("search-code").value;
        let phone = document.getElementById("search-phone").value;

        let savedCode = localStorage.getItem("bookingCode");
        let savedPhone = localStorage.getItem("customerPhone");

        let result = document.getElementById("reservation-result");
        let message = document.getElementById("search-message");

        if (code === savedCode && phone === savedPhone) {

            result.style.display = "block";
            message.innerText = "";

            document.getElementById("my-code").innerText = savedCode;
            document.getElementById("my-name").innerText =
                localStorage.getItem("customerName");

            document.getElementById("my-phone").innerText = savedPhone;
            document.getElementById("my-email").innerText =
                localStorage.getItem("customerEmail");

            let table = localStorage.getItem("selectedTable");
            let seat = localStorage.getItem("selectedSeat");

            document.getElementById("my-table").innerText =
                table + " - " + seat + " chỗ";

        } else {

            result.style.display = "none";
            message.innerText = "Không tìm thấy thông tin đặt bàn!";
        }

    });

}


// Nut thay doi dat ban

let changeBtn = document.getElementById("change-btn");

if (changeBtn) {
    changeBtn.addEventListener("click", function() {
        alert("Chức năng thay đổi đặt bàn sẽ được thực hiện sau.");
    });
}


// Nut huy dat ban

let cancelBtn = document.getElementById("cancel-btn");

if (cancelBtn) {
    cancelBtn.addEventListener("click", function() {

        let confirmCancel = confirm("Bạn có chắc chắn muốn hủy đặt bàn?");

        if (confirmCancel) {
            alert("Đã gửi yêu cầu hủy đặt bàn!");

            localStorage.removeItem("bookingCode");

            document.getElementById("reservation-result").style.display = "none";
        }

    });
}



/* UI-06: Staff Booking Management */

const staffSearch = document.getElementById("staff-search");
const staffPhone = document.getElementById("staff-phone");
const staffStatus = document.getElementById("staff-status");
const staffSearchBtn = document.getElementById("staff-search-btn");

const staffResults = document.getElementById("staff-results");
const staffNoResult = document.getElementById("staff-no-result");

// Du lieu dat ban mau
const staffBookings = [
    {
        code: "RSV001",
        name: "Nguyễn Văn A",
        phone: "0901234567",
        time: "18:00 - 05/11/2026",
        guests: "4 người",
        table: "T04",
        status: "Đã xác nhận"
    },
    {
        code: "RSV002",
        name: "Trần Thị B",
        phone: "0912345678",
        time: "19:00 - 05/11/2026",
        guests: "2 người",
        table: "T02",
        status: "Đang sử dụng"
    },
    {
        code: "RSV003",
        name: "Lê Văn C",
        phone: "0987654321",
        time: "20:00 - 05/11/2026",
        guests: "6 người",
        table: "T08",
        status: "Đang chờ"
    }
];

if (staffSearch && staffPhone && staffStatus && staffSearchBtn) {

    staffSearchBtn.addEventListener("click", function () {

        const keyword = staffSearch.value.trim().toLowerCase();
        const phone = staffPhone.value.trim();
        const status = staffStatus.value;

        const booking = staffBookings.find(function (item) {

            const matchKeyword =
                item.code.toLowerCase().includes(keyword) ||
                item.name.toLowerCase().includes(keyword);

            const matchPhone =
                phone === "" || item.phone.includes(phone);

            const matchStatus =
                status === "" || item.status === status;

            return matchKeyword && matchPhone && matchStatus;
        });

        staffResults.style.display = "block";

        if (!booking) {
            document.getElementById("staff-booking-card").style.display = "none";
            staffNoResult.style.display = "block";
            return;
        }

        document.getElementById("staff-booking-card").style.display = "block";
        staffNoResult.style.display = "none";

        document.getElementById("result-code").textContent = booking.code;
        document.getElementById("result-name").textContent = booking.name;
        document.getElementById("result-time").textContent = booking.time;
        document.getElementById("result-guests").textContent = booking.guests;
        document.getElementById("result-table").textContent = booking.table;

        const statusElement = document.getElementById("result-status");

        statusElement.textContent = booking.status.toUpperCase();
        statusElement.className = "booking-status";

        if (booking.status === "Đã xác nhận") {
            statusElement.classList.add("confirmed");
        } else if (booking.status === "Đang sử dụng") {
            statusElement.classList.add("using");
        } else {
            statusElement.classList.add("waiting");
        }

    });

}




/* UI-07: QR Check-in */

const checkinCode = document.getElementById("checkin-code");
const checkinSearchBtn = document.getElementById("checkin-search-btn");
const checkinMessage = document.getElementById("checkin-message");

const checkinInfoSection = document.getElementById("checkin-info-section");
const checkinSuccess = document.getElementById("checkin-success");
const checkinConfirmBtn = document.getElementById("checkin-confirm-btn");

// Du lieu dat ban mau
const checkinBookings = [
    {
        name: "Nguyễn Văn A",
        code: "RSV001",
        phone: "0901234567",
        email: "nguyenvana@gmail.com",
        table: "T04 - 4 chỗ",
        guests: "4 người",
        time: "18:00 - 05/11/2026",
        status: "Đã xác nhận"
    },
    {
        name: "Trần Thị B",
        code: "RSV002",
        phone: "0912345678",
        email: "tranthib@gmail.com",
        table: "T02 - 2 chỗ",
        guests: "2 người",
        time: "19:00 - 05/11/2026",
        status: "Đang sử dụng"
    },
    {
        name: "Lê Văn C",
        code: "RSV003",
        phone: "0987654321",
        email: "levanc@gmail.com",
        table: "T08 - 6 chỗ",
        guests: "6 người",
        time: "20:00 - 05/11/2026",
        status: "Đang chờ"
    }
];

let currentCheckinBooking = null;

if (checkinCode && checkinSearchBtn) {

    // Kiem tra ma dat ban
    checkinSearchBtn.addEventListener("click", function () {

        const code = checkinCode.value.trim().toUpperCase();

        checkinSuccess.style.display = "none";
        checkinMessage.style.display = "none";
        currentCheckinBooking = null;

        // Xoa thong tin cu truoc khi tim kiem moi
        document.getElementById("checkin-name").textContent = "";
        document.getElementById("checkin-result-code").textContent = "";
        document.getElementById("checkin-phone").textContent = "";
        document.getElementById("checkin-email").textContent = "";
        document.getElementById("checkin-table").textContent = "";
        document.getElementById("checkin-guests").textContent = "";
        document.getElementById("checkin-time").textContent = "";

        checkinConfirmBtn.disabled = true;
        checkinConfirmBtn.textContent = "XÁC NHẬN CHECK-IN";

        if (code === "") {
            checkinMessage.textContent = "Vui lòng nhập mã đặt bàn.";
            checkinMessage.style.display = "block";
            return;
        }

        const booking = checkinBookings.find(function (item) {
            return item.code === code;
        });

        if (!booking) {
            checkinMessage.textContent = "Không tìm thấy mã đặt bàn.";
            checkinMessage.style.display = "block";
            return;
        }

        currentCheckinBooking = booking;

        // Hien thi thong tin khach hang
        document.getElementById("checkin-name").textContent = booking.name;
        document.getElementById("checkin-result-code").textContent = booking.code;
        document.getElementById("checkin-phone").textContent = booking.phone;
        document.getElementById("checkin-email").textContent = booking.email;
        document.getElementById("checkin-table").textContent = booking.table;
        document.getElementById("checkin-guests").textContent = booking.guests;
        document.getElementById("checkin-time").textContent = booking.time;

        const status = document.getElementById("checkin-status");

        status.textContent = booking.status;
        status.className = "";

        if (booking.status === "Đã xác nhận") {
            status.classList.add("checkin-confirmed");
            checkinConfirmBtn.disabled = false;
            checkinConfirmBtn.textContent = "XÁC NHẬN CHECK-IN";
        } else if (booking.status === "Đang sử dụng") {
            status.classList.add("checkin-already");
            checkinConfirmBtn.disabled = true;
            checkinConfirmBtn.textContent = "KHÁCH ĐÃ CHECK-IN";
        } else {
            status.classList.add("checkin-waiting");
            checkinConfirmBtn.disabled = true;
            checkinConfirmBtn.textContent = "CHƯA ĐỦ ĐIỀU KIỆN CHECK-IN";
        }
    });

    // Xac nhan check-in
    checkinConfirmBtn.addEventListener("click", function () {

        if (!currentCheckinBooking ||
            currentCheckinBooking.status !== "Đã xác nhận") {
            return;
        }

        currentCheckinBooking.status = "Đang sử dụng";

        checkinConfirmBtn.textContent = "ĐÃ CHECK-IN";
        checkinConfirmBtn.disabled = true;

        document.getElementById("checkin-success-message").style.display = "block";

    });

    // Cho phep nhan Enter de tim kiem
    checkinCode.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            checkinSearchBtn.click();
        }
    });

}

// UI-01: Luu thong tin tim ban

let searchBtn = document.querySelector(".search-btn");

if (searchBtn) {
    searchBtn.addEventListener("click", function () {

        let date = document.getElementById("booking-date").value;
        let time = document.getElementById("booking-time").value;
        let guests = document.getElementById("guest-number").value;
        let area = document.getElementById("booking-area").value;

        if (!date || !time || !guests || !area) {
            alert("Vui lòng nhập đầy đủ thông tin đặt bàn!");
            return;
        }

        localStorage.setItem("bookingDate", date);
        localStorage.setItem("bookingTime", time);
        localStorage.setItem("guestNumber", guests);
        localStorage.setItem("bookingArea", area);

        window.location.href = "table-map.html";
    });
}

// Tao QR Code tu ma dat ban
qrImage = document.getElementById("qr-image");

if (qrImage) {
    qrImage.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="
        + encodeURIComponent(code);

    qrImage.alt = "Ma QR xac nhan dat ban";
}