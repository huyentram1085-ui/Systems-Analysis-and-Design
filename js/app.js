const app = document.getElementById('app');
const $ = id => document.getElementById(id);

const read = (key, fallback = null) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const bookings = () => read('demoBookings', []);
const setBookings = data => write('demoBookings', data);
const current = () => read('currentUser');
let selectedBookingId = null;
let layoutSelectedTables = read('layoutSelectedTables', []);

// Mỗi khu vực có 12 bàn riêng, mã bàn lần lượt bắt đầu bằng N, T và R.
const tableCapacities = [2, 2, 2, 4, 4, 4, 6, 6, 6, 8, 8, 8];
const initialTables = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `N${String(i + 1).padStart(2, '0')}`,
    capacity: tableCapacities[i], area: 'Trong nhà'
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `T${String(i + 1).padStart(2, '0')}`,
    capacity: tableCapacities[i], area: 'Ngoài trời'
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `R${String(i + 1).padStart(2, '0')}`,
    capacity: tableCapacities[i], area: 'Phòng riêng'
  }))
];

const pageFiles = {
  home: 'home.html', login: 'login.html', search: 'booking.html',
  tables: 'table-map.html', form: 'reservation.html', success: 'success.html',
  lookup: 'lookup.html', staff: 'management.html', checkin: 'checkin.html', layout: 'layout.html'
};

// Chuyển trang trong cùng thư mục pages, không phụ thuộc trang hiện tại.
const go = page => {
  const file = pageFiles[page] || pageFiles.home;
  location.href = new URL(file, location.href).href;
};

const button = (text, action, cls = 'btn') =>
  `<button class="${cls}" type="button" onclick="${String(action).replace(/&/g, '&amp;').replace(/\"/g, '&quot;')}">${text}</button>`;

const customerShell = content => `
  <main class="customer-page">
    <div class="customer-screen">${content}</div>
  </main>
`;

function render() {
  const filename = location.pathname.split('/').pop() || 'home.html';
  let page = filename.replace(/\.html?$/i, '') || 'home';
  const aliases = {
    index: 'home', booking: 'search', 'table-map': 'tables',
    reservation: 'form', management: 'staff'
  };
  page = aliases[page] || page;

  const user = current();

  // Chỉ trang quản lý yêu cầu đăng nhập nhân viên.
  // Trang quét mã vẫn mở độc lập để xem và trình diễn giao diện.
  if ((page === 'staff' || page === 'layout' || page === 'checkin') && !['staff', 'manager'].includes(user?.role)) {
    go('login');
    return;
  }

  const views = {
    home: homePage, login: loginPage, search: searchPage,
    tables: tablesPage, form: formPage, success: successPage,
    lookup: lookupPage, staff: staffPage, checkin: checkinPage, layout: layoutPage
  };

  app.innerHTML = (views[page] || homePage)();
}

/* TRANG CHỦ */
function homePage() {
  return `
    <main class="home-mobile">
      <section class="home-content">
        <p class="home-eyebrow">CHÀO MỪNG BẠN ĐẾN VỚI CHÚNG TÔI</p>
        <h1>ĐẶT BÀN<br>NHÀ HÀNG</h1>
        <p class="home-description">Trải nghiệm không gian ẩm thực và đặt bàn nhanh chóng, thuận tiện.</p>
        <div class="home-actions">
          ${button('ĐẶT BÀN', 'go("search")')}
          ${button('TRA CỨU ĐẶT BÀN', 'go("lookup")', 'btn btn-outline')}
        </div>
      </section>
    </main>
  `;
}

/* ĐĂNG NHẬP */
function loginPage() {
  return `
    <main class="login-page">
      <section class="login-card">
        <h1>ĐĂNG NHẬP</h1>
        <form onsubmit="login(event)">
          <div class="field">
            <label for="username">Tên đăng nhập</label>
            <input id="username" placeholder="Nhập tên đăng nhập" autocomplete="username" required>
          </div>
          <div class="field">
            <label for="password">Mật khẩu</label>
            <input id="password" type="password" placeholder="Nhập mật khẩu" autocomplete="current-password" required>
          </div>
          <p id="login-error" class="error"></p>
          <button class="btn login-submit" type="submit">ĐĂNG NHẬP</button>
          <button class="back-link" type="button" onclick="go('home')">VỀ TRANG CHỦ</button>
        </form>
      </section>
    </main>
  `;
}

function login(event) {
  event.preventDefault();
  const username = $('username').value.trim();
  const role = username === 'nhanvien' ? 'staff' : username === 'quanly' ? 'manager' : null;
  const password = $('password').value;
  const valid = !!role && password === '123456';

  if (!valid) {
    $('login-error').textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
    return;
  }
  write('currentUser', { role, username });
  go(role === 'staff' ? 'staff' : 'checkin');
}

/* UI-01 - TÌM BÀN */
function searchPage() {
  return customerShell(`
    <div class="page-kicker">BẮT ĐẦU ĐẶT BÀN</div>
    <h1 class="screen-title">ĐẶT BÀN NHÀ HÀNG</h1>
    <p class="screen-subtitle">Vui lòng chọn thông tin đặt bàn</p>
    <div class="figma-form">
      <div class="field"><label for="date">Chọn ngày</label><input id="date" type="date" min="${new Date().toISOString().slice(0, 10)}"></div>
      <div class="field"><label for="time">Chọn giờ</label><input id="time" type="time" value="18:00"></div>
      <div class="field"><label for="guests">Số người</label><input id="guests" type="number" min="1" max="12" placeholder="Nhập số người"></div>
      <div class="field"><label for="area">Chọn khu vực</label><select id="area"><option value="Tất cả khu vực">Tất cả khu vực</option><option value="Trong nhà">Trong nhà</option><option value="Ngoài trời">Ngoài trời</option><option value="Phòng riêng">Phòng riêng</option></select></div>
      <p id="search-error" class="error"></p>
      ${button('TÌM BÀN', 'saveSearch()', 'btn btn-full')}
    </div>
    <button class="back-link" type="button" onclick="go('home')">VỀ TRANG CHỦ</button>
  `);
}

function saveSearch() {
  const data = {
    date: $('date').value, time: $('time').value,
    guests: Number($('guests').value), area: $('area').value
  };
  if (!data.date || !data.time || !data.guests || data.guests < 1 || data.guests > 12) {
    $('search-error').textContent = 'Vui lòng nhập đầy đủ thông tin và số khách từ 1 đến 12.';
    return;
  }
  write('bookingSearch', data);
  localStorage.removeItem('selectedTable');
  go('tables');
}

/* UI-02 - SƠ ĐỒ BÀN */
function tablesPage() {
  const search = read('bookingSearch', {});
  const selected = read('selectedTable');
  const rows = initialTables.filter(table => search.area === 'Tất cả khu vực' || !search.area || table.area === search.area).map(table => ({
    ...table,
    taken: !!search.date && !!search.time && isTableConflicted(table.id, { date: search.date, time: search.time }),
    tooSmall: table.capacity < Number(search.guests || 0)
  }));

  return customerShell(`
    <div class="page-kicker">BƯỚC 2 / 4</div>
    <h1 class="screen-title">CHỌN BÀN</h1>
    <div class="table-map-figma">
      ${rows.map(table => `<button class="table-figma ${table.taken ? 'reserved' : ''} ${table.tooSmall ? 'too-small' : ''} ${selected === table.id ? 'selected' : ''}" ${(table.taken || table.tooSmall) ? 'disabled' : `onclick="chooseTable('${table.id}')"`}><strong>${table.id}</strong><small>${table.capacity} người</small></button>`).join('')}
    </div>
    <section class="figma-info table-detail"><h3>THÔNG TIN BÀN ĐÃ CHỌN</h3><p>Mã bàn: <b>${selected || 'Chưa chọn'}</b></p><p>Sức chứa: <b>${selected ? initialTables.find(t => t.id === selected)?.capacity + ' người' : '—'}</b></p><p>Khu vực: <b>${selected ? initialTables.find(t => t.id === selected)?.area : '—'}</b></p></section>
    ${button('TIẾP TỤC', 'goForm()', 'btn btn-full')}
    <button class="back-link" type="button" onclick="go('search')">QUAY LẠI</button>
  `);
}

function chooseTable(id) {
  const table = initialTables.find(item => item.id === id);
  const search = read('bookingSearch', {});
  if (!table || table.capacity < Number(search.guests)) return;
  write('selectedTable', id);
  render();
}

function goForm() {
  if (!read('selectedTable')) {
    alert('Vui lòng chọn bàn trước khi tiếp tục.');
    return;
  }
  go('form');
}

/* UI-03 - THÔNG TIN ĐẶT BÀN */
function formPage() {
  const search = read('bookingSearch', {});
  const table = read('selectedTable');
  if (!table) {
    go('tables');
    return '';
  }
  return customerShell(`
    <div class="page-kicker">BƯỚC 3 / 4</div>
    <h1 class="screen-title">THÔNG TIN ĐẶT BÀN</h1>
    <section class="figma-info"><h3>THÔNG TIN BÀN ĐÃ CHỌN</h3><p>Mã bàn: <b>${table}</b></p><p>Số khách: <b>${search.guests || ''}</b></p><p>Khu vực: <b>${initialTables.find(item => item.id === table)?.area || ''}</b></p><p>Thời gian: <b>${search.date || ''} - ${search.time || ''}</b></p></section>
    <section class="figma-form-section"><h3>THÔNG TIN KHÁCH HÀNG</h3>
      <div class="field"><label for="customer">Họ và tên</label><input id="customer" placeholder="Nhập họ và tên" required></div>
      <div class="field"><label for="phone">Số điện thoại</label><input id="phone" inputmode="tel" maxlength="10" placeholder="Nhập số điện thoại" required></div>
      <div class="field"><label for="email">Email</label><input id="email" type="email" placeholder="Nhập email"></div>
      <div class="field"><label for="note">Yêu cầu đặc biệt</label><textarea id="note" rows="3" placeholder="Nhập ghi chú (nếu có)"></textarea></div>
      <p id="form-error" class="error"></p>
    </section>
    ${button('XÁC NHẬN ĐẶT BÀN', 'confirmBooking()', 'btn btn-full')}
    <button class="back-link" type="button" onclick="go('tables')">QUAY LẠI CHỌN BÀN</button>
  `);
}

function confirmBooking() {
  const name = $('customer').value.trim();
  const phone = $('phone').value.trim();
  if (!name || !/^0[0-9]{9}$/.test(phone)) {
    $('form-error').textContent = 'Vui lòng nhập họ tên và số điện thoại gồm 10 chữ số.';
    return;
  }
  const search = read('bookingSearch', {});
  const id = `${read('selectedTable')}RR`;
  const booking = {
    id, table: read('selectedTable'), name, phone,
    email: $('email').value.trim(), note: $('note').value.trim(),
    date: search.date, time: search.time, guests: search.guests,
    area: initialTables.find(item => item.id === read('selectedTable'))?.area || search.area, status: 'Đã xác nhận'
  };
  setBookings([...bookings(), booking]);
  write('lastBooking', booking);
  write('lookupTarget', booking.id);
  go('success');
}

/* UI-04 - ĐẶT BÀN THÀNH CÔNG */
function successPage() {
  const booking = read('lastBooking', {});
  return customerShell(`
    <h1 class="screen-title">ĐẶT BÀN THÀNH CÔNG!</h1>
    <p class="screen-subtitle">Thông tin đặt bàn của bạn đã được ghi nhận.</p>
    <section class="figma-info"><h3>THÔNG TIN ĐẶT BÀN</h3>
      <p>Mã đặt bàn: <b>${booking.id || ''}</b></p><p>Họ và tên: <b>${booking.name || ''}</b></p><p>Ngày đặt: <b>${booking.date || ''}</b></p><p>Giờ đặt: <b>${booking.time || ''}</b></p><p>Số lượng khách: <b>${booking.guests || ''}</b></p><p>Mã bàn: <b>${booking.table || ''}</b></p>
    </section>
    <div class="qr-placeholder" aria-label="Mã QR"><span>MÃ QR<br>${booking.id || ''}</span></div>
    ${button('TRA CỨU PHIẾU ĐẶT', 'go("lookup")', 'btn btn-full')}
    ${button('VỀ TRANG CHỦ', 'go("home")', 'btn btn-outline btn-full')}
  `);
}

/* UI-05 - TRA CỨU ĐẶT BÀN */
function lookupPage() {
  return customerShell(`
    <div class="page-kicker">THÔNG TIN CỦA BẠN</div>
    <h1 class="screen-title">TRA CỨU ĐẶT BÀN</h1>
    <p class="screen-subtitle">Nhập mã đặt bàn và số điện thoại để xem thông tin.</p>
    <section class="figma-form-section">
      <div class="field"><label for="lookup-id">Mã đặt bàn</label><input id="lookup-id" placeholder="Ví dụ: T01RR"></div>
      <div class="field"><label for="lookup-phone">Số điện thoại</label><input id="lookup-phone" inputmode="tel" maxlength="10" placeholder="Số điện thoại đã đăng ký"></div>
      ${button('TRA CỨU', 'lookupBooking()', 'btn btn-full')}
    </section>
    <section class="figma-info lookup-result"><div class="result-heading"><h3>THÔNG TIN ĐẶT BÀN</h3><span id="lookup-status" class="status-pill">CHƯA TRA CỨU</span></div>
      <div id="lookup-result"><p>Mã đặt bàn: —</p><p>Họ và tên: —</p><p>Ngày hẹn: —</p><p>Giờ hẹn: —</p><p>Bàn đã chọn: —</p></div>
    </section>
    ${button('ĐỔI ĐẶT BÀN', 'openEditModal()', 'btn btn-outline btn-full')}
    ${button('HỦY PHIẾU ĐẶT', 'openCancelModal()', 'btn btn-danger btn-full')}
    <div id="booking-modal-root"></div>
    <p class="small cancel-note">* Chỉ được hủy phiếu đặt bàn trước giờ hẹn.</p>
    <button class="back-link" type="button" onclick="go('home')">VỀ TRANG CHỦ</button>
  `);
}

function lookupBooking() {
  const id = $('lookup-id').value.trim();
  const phone = $('lookup-phone').value.trim();
  const booking = bookings().find(item => item.id === id && item.phone === phone);
  if (!booking) {
    write('lookupTarget', null);
    $('lookup-status').textContent = 'KHÔNG TÌM THẤY';
    $('lookup-result').innerHTML = '<p class="error">Không tìm thấy phiếu đặt bàn phù hợp.</p>';
    return;
  }
  write('lookupTarget', booking.id);
  $('lookup-status').textContent = booking.status.toUpperCase();
  $('lookup-result').innerHTML = `
    <p>Mã đặt bàn: <b>${booking.id}</b></p><p>Họ và tên: <b>${booking.name}</b></p>
    <p>Ngày hẹn: <b>${booking.date}</b></p><p>Giờ hẹn: <b>${booking.time}</b></p><p>Bàn đã chọn: <b>${booking.table}</b></p>
  `;
}

function getLookupBooking() {
  const id = read('lookupTarget');
  return id ? bookings().find(item => item.id === id) : null;
}

function openCancelModal() {
  const target = getLookupBooking();
  if (!target) { alert('Vui lòng tra cứu phiếu đặt bàn trước.'); return; }
  const appointment = new Date(`${target.date}T${target.time}`);
  if (target.status === 'Đã hủy') { alert('Phiếu đặt bàn này đã được hủy.'); return; }
  if (Number.isNaN(appointment.getTime()) || appointment <= new Date()) { alert('Phiếu đặt bàn đã đến giờ hẹn hoặc không hợp lệ, không thể hủy.'); return; }
  $('booking-modal-root').innerHTML = `<div class="modal-backdrop" onclick="closeBookingModal(event)"><section class="booking-modal" onclick="event.stopPropagation()"><h2>HỦY PHIẾU ĐẶT</h2><p>Bạn có chắc chắn muốn hủy phiếu <b>${target.id}</b> không?</p><div class="modal-actions"><button class="btn btn-outline" onclick="closeBookingModal()">QUAY LẠI</button><button class="btn btn-danger" onclick="confirmCancelBooking()">XÁC NHẬN HỦY</button></div></section></div>`;
}

function confirmCancelBooking() {
  const target = getLookupBooking();
  if (!target) return;
  setBookings(bookings().map(item => item.id === target.id ? { ...item, status: 'Đã hủy' } : item));
  $('lookup-status').textContent = 'ĐÃ HỦY';
  lookupBookingAfterCancel(target.id);
  closeBookingModal();
}

function openEditModal() {
  const target = getLookupBooking();
  if (!target) { alert('Vui lòng tra cứu phiếu đặt bàn trước.'); return; }
  if (target.status === 'Đã hủy') { alert('Phiếu đã hủy nên không thể thay đổi.'); return; }
  const appointment = new Date(`${target.date}T${target.time}`);
  if (Number.isNaN(appointment.getTime()) || appointment <= new Date()) { alert('Phiếu đã đến giờ hẹn, không thể thay đổi.'); return; }
  $('booking-modal-root').innerHTML = `<div class="modal-backdrop" onclick="closeBookingModal(event)"><section class="booking-modal" onclick="event.stopPropagation()"><h2>ĐỔI THÔNG TIN ĐẶT BÀN</h2><p>Mã đặt bàn: <b>${target.id}</b> · Bàn: <b>${target.table}</b></p><div class="field"><label for="edit-date">Ngày mới</label><input id="edit-date" type="date" min="${new Date().toISOString().slice(0,10)}" value="${target.date}"></div><div class="field"><label for="edit-time">Giờ mới</label><input id="edit-time" type="time" value="${target.time}"></div><div class="field"><label for="edit-guests">Số khách</label><input id="edit-guests" type="number" min="1" max="12" value="${target.guests}"></div><p id="edit-error" class="error"></p><div class="modal-actions"><button class="btn btn-outline" onclick="closeBookingModal()">QUAY LẠI</button><button class="btn" onclick="saveBookingChanges()">LƯU THAY ĐỔI</button></div></section></div>`;
}

function saveBookingChanges() {
  const target = getLookupBooking();
  const date = $('edit-date').value, time = $('edit-time').value, guests = Number($('edit-guests').value);
  if (!date || !time || guests < 1 || guests > 12) { $('edit-error').textContent = 'Vui lòng nhập ngày, giờ và số khách hợp lệ.'; return; }
  if (new Date(`${date}T${time}`) <= new Date()) { $('edit-error').textContent = 'Thời gian mới phải ở tương lai.'; return; }
  const table = initialTables.find(item => item.id === target.table);
  if (!table || table.capacity < guests) { $('edit-error').textContent = 'Bàn hiện tại không đủ chỗ cho số khách mới. Vui lòng giữ số khách phù hợp với sức chứa bàn.'; return; }
  const conflict = bookings().some(item => item.id !== target.id && item.table === target.table && item.date === date && item.time === time && item.status !== 'Đã hủy');
  if (conflict) { $('edit-error').textContent = 'Bàn này đã có người đặt vào thời gian đó.'; return; }
  setBookings(bookings().map(item => item.id === target.id ? { ...item, date, time, guests } : item));
  lookupBookingAfterCancel(target.id);
  closeBookingModal();
}

function closeBookingModal(event) {
  if (event && event.target !== event.currentTarget) return;
  const root = $('booking-modal-root');
  if (root) root.innerHTML = '';
}

function lookupBookingAfterCancel(id) {
  const booking = bookings().find(item => item.id === id);
  if (booking) {
    $('lookup-status').textContent = booking.status.toUpperCase();
    $('lookup-result').innerHTML = `<p>Mã đặt bàn: <b>${booking.id}</b></p><p>Họ và tên: <b>${booking.name}</b></p><p>Ngày hẹn: <b>${booking.date}</b></p><p>Giờ hẹn: <b>${booking.time}</b></p><p>Bàn đã chọn: <b>${booking.table}</b></p>`;
  }
}

/* THANH ĐIỀU HƯỚNG NHÂN VIÊN */
function side(active) {
  return `
    <aside class="sidebar"><div class="sidebar-heading">KHU VỰC NHÂN VIÊN</div><nav>
      <button class="${active === 'checkin' ? 'active' : ''}" onclick="go('checkin')">QUÉT MÃ QR</button>
      <button class="${active === 'layout' ? 'active' : ''}" onclick="go('layout')">BỐ TRÍ BÀN</button>
      <button class="${active === 'staff' ? 'active' : ''}" onclick="go('staff')">QUẢN LÝ ĐẶT BÀN</button>
    </nav>
    ${current() ? '<button class="logout" onclick="logout()">ĐĂNG XUẤT</button>' : '<button class="logout" onclick="go(\'login\')">ĐĂNG NHẬP</button>'}
    </aside>
  `;
}

function adminShell(active, title, body) {
  return `<main class="admin-layout">${side(active)}<section class="admin-main"><h1 class="admin-title">${title}</h1>${body}</section></main>`;
}

/* UI-06 - QUẢN LÝ ĐẶT BÀN */
function staffPage() {
  const data = bookings();
  const count = status => data.filter(item => item.status === status).length;
  return adminShell('staff', 'QUẢN LÝ ĐẶT BÀN', `
    <div class="stats"><div class="stat">TỔNG ĐẶT BÀN<strong>${data.length}</strong></div><div class="stat">ĐÃ XÁC NHẬN<strong>${count('Đã xác nhận')}</strong></div><div class="stat">ĐANG SỬ DỤNG<strong>${count('Đang sử dụng')}</strong></div><div class="stat">ĐANG CHỜ<strong>${count('Đang chờ')}</strong></div></div>
    <div class="filters">
      <select id="filter-date"><option value="">Ngày</option>${[...new Set(data.map(item => item.date))].filter(Boolean).map(date => `<option value="${date}">${date}</option>`).join('')}</select>
      <select id="filter-status"><option value="">Trạng thái</option><option>Đã xác nhận</option><option>Đang sử dụng</option><option>Đang chờ</option><option>Đã hủy</option></select>
      <select id="filter-area"><option value="">Khu vực</option><option>Trong nhà</option><option>Ngoài trời</option><option>Phòng riêng</option></select>
      ${button('TÌM', 'filterBookings()')}
    </div>
    <p class="selection-hint">Chọn một dòng thông tin khách hàng, sau đó bấm nút cập nhật trạng thái.</p>
    <div id="booking-list">${bookingTable(data)}</div>
    <div class="table-actions">${button('HOÀN TẤT', 'finishBookings()', 'btn btn-small')}${button('KHÔNG ĐẾN', 'markNoShow()', 'btn btn-small btn-outline')}</div>
  `);
}

function bookingTable(data) {
  return `<div class="table-wrap"><table><thead><tr><th>MÃ ĐẶT</th><th>KHÁCH HÀNG</th><th>SỐ ĐIỆN THOẠI</th><th>GIỜ</th><th>SỐ NGƯỜI</th><th>KHU VỰC</th><th>BÀN</th><th>TRẠNG THÁI</th></tr></thead><tbody>
    ${data.map(item => `<tr class="booking-row ${selectedBookingId === item.id ? 'selected-booking' : ''}" onclick="selectBooking('${item.id}')"><td>${item.id}</td><td>${item.name}</td><td>${item.phone}</td><td>${item.time}</td><td>${item.guests}</td><td>${item.area}</td><td>${item.table}</td><td>${item.status}</td></tr>`).join('') || '<tr><td colspan="8" class="empty-cell">Chưa có phiếu đặt bàn</td></tr>'}
    ${Array.from({ length: Math.max(0, 4 - data.length) }, () => '<tr class="empty-row">' + '<td></td>'.repeat(8) + '</tr>').join('')}
  </tbody></table></div>`;
}

function selectBooking(id) {
  selectedBookingId = id;
  document.querySelectorAll('.booking-row').forEach(row => row.classList.remove('selected-booking'));
  const selected = [...document.querySelectorAll('.booking-row')].find(row => row.getAttribute('onclick') === `selectBooking('${id}')`);
  if (selected) selected.classList.add('selected-booking');
}

function filterBookings() {
  selectedBookingId = null;
  const date = $('filter-date').value;
  const status = $('filter-status').value;
  const area = $('filter-area').value;
  const result = bookings().filter(item => (!date || item.date === date) && (!status || item.status === status) && (!area || item.area === area));
  $('booking-list').innerHTML = bookingTable(result);
}

function changeStatus(id, status) {
  selectedBookingId = id;
  setBookings(bookings().map(item => item.id === id ? { ...item, status } : item));
  render();
}
function updateSelectedBooking(status) {
  if (!selectedBookingId) { alert('Vui lòng chọn một khách hàng trong danh sách trước.'); return; }
  const selected = bookings().find(item => item.id === selectedBookingId);
  if (!selected) { alert('Không tìm thấy thông tin khách hàng đã chọn.'); selectedBookingId = null; return; }
  setBookings(bookings().map(item => item.id === selectedBookingId ? { ...item, status } : item));
  alert(`Đã cập nhật trạng thái của ${selected.name} thành: ${status}.`);
  render();
}
function finishBookings() { updateSelectedBooking('Đã hoàn tất'); }
function markNoShow() { updateSelectedBooking('Không đến'); }

/* BỐ TRÍ BÀN - GÁN / ĐỔI / GHÉP BÀN CHO PHIẾU */
function bookingTableIds(item) {
  if (Array.isArray(item?.tables) && item.tables.length) return item.tables;
  if (Array.isArray(item?.table)) return item.table;
  return item?.table ? String(item.table).split(',').map(value => value.trim()).filter(Boolean) : [];
}

function bookingIsActive(item) {
  return !['Đã hủy', 'Không đến', 'Đã hoàn tất'].includes(item.status);
}

function getLayoutTarget() {
  const id = read('layoutTarget');
  return id ? bookings().find(item => item.id === id) : null;
}

function layoutPage() {
  const availableBookings = bookings().filter(bookingIsActive);
  let target = getLayoutTarget();
  if (!target && availableBookings.length) {
    target = availableBookings[0];
    write('layoutTarget', target.id);
    write('layoutArea', target.area || 'Trong nhà');
    layoutSelectedTables = bookingTableIds(target);
    write('layoutSelectedTables', layoutSelectedTables);
  }
  if (!target) layoutSelectedTables = [];
  const area = read('layoutArea', target?.area || 'Trong nhà');
  const chosen = layoutSelectedTables;
  const selectedCapacity = initialTables.filter(table => chosen.includes(table.id)).reduce((sum, table) => sum + table.capacity, 0);
  const sameAreaTables = initialTables.filter(table => table.area === area);
  const conflictIds = target ? sameAreaTables.filter(table => isTableConflicted(table.id, target)).map(table => table.id) : [];
  const guests = Number(target?.guests || 0);
  const enough = selectedCapacity >= guests && chosen.length > 0;
  const conflict = chosen.some(id => conflictIds.includes(id));
  const canSave = !!target && enough && !conflict && chosen.every(id => initialTables.find(table => table.id === id)?.area === area);
  return adminShell('layout', 'BỐ TRÍ BÀN', `
    <div class="layout-instructions"><p>Chọn phiếu đặt bàn, sau đó chọn một hoặc nhiều bàn trong cùng khu vực. Hệ thống sẽ kiểm tra sức chứa và thời gian trước khi lưu.</p></div>
    <section class="layout-panel">
      <div class="field"><label for="layout-booking">Phiếu đặt bàn</label>
        <select id="layout-booking" onchange="selectLayoutBooking(this.value)">
          ${availableBookings.map(item => `<option value="${item.id}" ${target?.id === item.id ? 'selected' : ''}>${item.id} · ${item.name} · ${item.guests} khách · ${item.date || 'Chưa có ngày'} ${item.time || ''}</option>`).join('')}
        </select>
      </div>
      ${target ? `<div class="layout-booking-info"><div><span>Mã phiếu</span><b>${target.id}</b></div><div><span>Khách hàng</span><b>${target.name}</b></div><div><span>Số khách</span><b>${target.guests} người</b></div><div><span>Thời gian</span><b>${target.date} · ${target.time}</b></div><div><span>Bàn hiện tại</span><b>${bookingTableIds(target).join(', ') || 'Chưa gán bàn'}</b></div></div>` : '<p class="empty-layout">Hiện không có phiếu đặt bàn cần bố trí.</p>'}
      <div class="field"><label for="layout-area">Khu vực bố trí</label><select id="layout-area" onchange="changeLayoutArea(this.value)" ${!target ? 'disabled' : ''}><option ${area === 'Trong nhà' ? 'selected' : ''}>Trong nhà</option><option ${area === 'Ngoài trời' ? 'selected' : ''}>Ngoài trời</option><option ${area === 'Phòng riêng' ? 'selected' : ''}>Phòng riêng</option></select></div>
      <h2 class="layout-subtitle">CHỌN BÀN</h2>
      <p class="layout-help">Bấm vào các bàn để chọn hoặc bỏ chọn. Bàn đang có phiếu khác trong cùng khung giờ sẽ bị khóa.</p>
      <div class="layout-table-grid">
        ${sameAreaTables.map(table => {
          const busy = conflictIds.includes(table.id);
          const isChosen = chosen.includes(table.id);
          return `<button type="button" class="layout-table ${busy ? 'busy' : ''} ${isChosen ? 'chosen' : ''}" ${busy || !target ? 'disabled' : `onclick="toggleLayoutTable('${table.id}')"`}><b>${table.id}</b><small>${table.capacity} người</small><em>${busy ? 'Đã có khách' : isChosen ? 'Đang chọn' : 'Còn trống'}</em></button>`;
        }).join('')}
      </div>
      <div class="layout-summary"><div><span>Bàn đang chọn</span><b>${chosen.join(', ') || 'Chưa chọn'}</b></div><div><span>Tổng sức chứa</span><b>${selectedCapacity} / ${guests} khách</b></div></div>
      <p class="${conflict ? 'error' : enough ? 'success' : 'layout-warning'}" id="layout-validation">${!target ? 'Chưa có phiếu để bố trí.' : conflict ? 'Có bàn bị trùng thời gian. Vui lòng chọn lại.' : !chosen.length ? 'Vui lòng chọn ít nhất một bàn.' : !enough ? `Tổng sức chứa chưa đủ. Cần ít nhất ${guests} chỗ.` : 'Tổ hợp bàn hợp lệ, có thể lưu bố trí.'}</p>
      <div class="layout-actions">${button('LƯU BỐ TRÍ', 'saveTableLayout()', 'btn')}${button('BỎ CHỌN', 'clearLayoutTables()', 'btn btn-outline')}</div>
    </section>
  `);
}

function selectLayoutBooking(id) {
  const target = bookings().find(item => item.id === id);
  write('layoutTarget', id);
  write('layoutArea', target?.area || 'Trong nhà');
  layoutSelectedTables = target ? bookingTableIds(target) : [];
  write('layoutSelectedTables', layoutSelectedTables);
  render();
}

function changeLayoutArea(area) {
  write('layoutArea', area);
  layoutSelectedTables = [];
  write('layoutSelectedTables', layoutSelectedTables);
  render();
}

function toggleLayoutTable(id) {
  const target = getLayoutTarget();
  if (!target) return;
  const area = $('layout-area').value;
  const table = initialTables.find(item => item.id === id);
  if (!table || table.area !== area || isTableConflicted(id, target)) return;
  layoutSelectedTables = layoutSelectedTables.includes(id)
    ? layoutSelectedTables.filter(value => value !== id)
    : [...layoutSelectedTables, id];
  write('layoutSelectedTables', layoutSelectedTables);
  render();
}

function timeRange(item) {
  const start = new Date(`${item.date}T${item.time}`);
  if (Number.isNaN(start.getTime())) return null;
  // Khóa bàn 2 giờ phục vụ khách + 15 phút dọn bàn.
  const end = new Date(start.getTime() + 135 * 60 * 1000);
  return { start, end };
}

function isTableConflicted(tableId, target) {
  const targetRange = timeRange(target);
  if (!targetRange) return false;
  return bookings().some(item => {
    if (item.id === target.id || !bookingIsActive(item) || !bookingTableIds(item).includes(tableId)) return false;
    const range = timeRange(item);
    if (!range) return false;
    return targetRange.start < range.end && range.start < targetRange.end;
  });
}

function clearLayoutTables() {
  layoutSelectedTables = [];
  write('layoutSelectedTables', layoutSelectedTables);
  render();
}

function saveTableLayout() {
  const target = getLayoutTarget();
  if (!target) { alert('Vui lòng chọn phiếu đặt bàn.'); return; }
  const area = $('layout-area').value;
  const selected = initialTables.filter(table => layoutSelectedTables.includes(table.id));
  if (!selected.length) { alert('Vui lòng chọn ít nhất một bàn.'); return; }
  if (selected.some(table => table.area !== area)) { alert('Các bàn phải thuộc cùng một khu vực.'); return; }
  const capacity = selected.reduce((sum, table) => sum + table.capacity, 0);
  if (capacity < Number(target.guests)) { alert(`Tổng sức chứa ${capacity} chỗ chưa đủ cho ${target.guests} khách.`); return; }
  const conflicts = selected.filter(table => isTableConflicted(table.id, target));
  if (conflicts.length) { alert(`Các bàn ${conflicts.map(table => table.id).join(', ')} bị trùng thời gian. Vui lòng chọn lại.`); return; }
  const ids = selected.map(table => table.id);
  setBookings(bookings().map(item => item.id === target.id ? { ...item, tables: ids, table: ids.join(', '), area } : item));
  layoutSelectedTables = ids;
  write('layoutSelectedTables', layoutSelectedTables);
  alert(`Đã lưu bố trí ${ids.join(', ')} cho phiếu ${target.id}.`);
  render();
}

/* UI-07 - QUÉT MÃ QR */
function checkinPage() {
  return adminShell('checkin', 'QUÉT MÃ QR', `
    <div class="checkin-layout">
      <section class="checkin-left"><div class="scan-box"><div class="scan-frame"><span>ĐƯA MÃ QR VÀO KHU VỰC NÀY</span></div></div>
        <div class="field check-code-field"><label for="check-code">Mã đặt bàn</label><input id="check-code" placeholder="Nhập mã đặt bàn"></div>
        ${button('KIỂM TRA MÃ', 'checkCode()', 'btn btn-full')}<div id="check-result"></div>
      </section>
      <section class="checkin-info"><h2>THÔNG TIN ĐẶT BÀN</h2><div id="check-info"><p>Mã đặt bàn: —</p><p>Khách hàng: —</p><p>Số lượng khách: —</p><p>Khu vực: —</p><p>Vị trí bàn: —</p><p>Trạng thái: —</p></div><div id="check-confirm">${button('XÁC NHẬN KHÁCH ĐẾN', 'confirmCheckin()', 'btn btn-full')}</div></section>
    </div>
  `);
}

function checkCode() {
  const code = $('check-code').value.trim();
  const booking = bookings().find(item => item.id === code);
  if (!booking) {
    write('checkinTarget', null);
    $('check-result').innerHTML = '<p class="error">Không tìm thấy mã đặt bàn.</p>';
    return;
  }
  write('checkinTarget', booking.id);
  $('check-result').innerHTML = '<p class="success">Đã tìm thấy phiếu đặt bàn.</p>';
  $('check-info').innerHTML = `<p>Mã đặt bàn: <b>${booking.id}</b></p><p>Khách hàng: <b>${booking.name}</b></p><p>Số lượng khách: <b>${booking.guests}</b></p><p>Khu vực: <b>${booking.area}</b></p><p>Vị trí bàn: <b>${booking.table}</b></p><p>Trạng thái: <b>${booking.status}</b></p>`;
}

function confirmCheckin() {
  const id = read('checkinTarget');
  if (!id) { alert('Vui lòng kiểm tra mã đặt bàn trước.'); return; }
  setBookings(bookings().map(item => item.id === id ? { ...item, status: 'Đang sử dụng' } : item));
  alert('Đã xác nhận khách đến.');
  render();
}

function logout() {
  localStorage.removeItem('currentUser');
  go('login');
}

/* KẾT NỐI HÀM */
Object.assign(window, {
  go, login, saveSearch, chooseTable, goForm, confirmBooking,
  lookupBooking, openEditModal, openCancelModal, confirmCancelBooking,
  saveBookingChanges, closeBookingModal, filterBookings, selectBooking, changeStatus,
  finishBookings, markNoShow, checkCode, confirmCheckin, logout, selectLayoutBooking, changeLayoutArea, toggleLayoutTable, clearLayoutTables, saveTableLayout
});

render();