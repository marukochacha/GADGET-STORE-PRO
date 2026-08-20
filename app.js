/* ======================= DATA PRODUK GADGET ======================= */
/* Catatan PENTING soal foto & video lokal:
   Produk di bawah ini memakai nama FILE LOKAL (bukan link internet),
   contoh: "ipad.jpg" dan "ipad.mp4". Supaya muncul, taruh file-file berikut
   PERSIS di folder assets/ (satu folder dengan index.html):
     - assets/ipad.jpg      + assets/ipad.mp4
     - assets/iphone 15.jpg + assets/iphone.mp4
     - assets/case.jpg      + assets/case.mp4
     - assets/macbook.jpg   + assets/VID MACBOOK.mp4
   Nama file yang ada spasi ("iphone 15.jpg", "VID MACBOOK.mp4")
   ditulis di kode pakai %20 (kode untuk spasi), tapi file aslinya tetap
   kamu simpan dengan nama asli (pakai spasi biasa), tidak perlu diganti. */
const DEMO_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const products = [
  {id:1,name:"iPad",price:7999000,oldPrice:8999000,desc:"Tablet layar lebar dengan performa kencang, cocok untuk kerja, belajar, gambar digital, dan hiburan.",rating:4.8,sold:412,stock:48,cat:"ipad",badge:"Best Seller",
   img:"assets/ipad.jpg",
   gallery:["assets/ipad.jpg"],
   video:"assets/ipad.mp4",
   colors:[{name:"Space Gray",hex:"#3a3d40"},{name:"Silver",hex:"#c9cdd1"}],
   sizes:["128GB","256GB"]},
  {id:2,name:"iPhone 15",price:13999000,oldPrice:14999000,desc:"Smartphone flagship dengan kamera canggih, performa cepat, dan desain premium.",rating:4.9,sold:288,stock:120,cat:"smartphone",badge:"Baru",
   img:"assets/iphone%2015.jpg",
   gallery:["assets/iphone%2015.jpg"],
   video:"assets/iphone.mp4",
   colors:[{name:"Hitam",hex:"#1c1c1c"},{name:"Putih",hex:"#f5f5f5"},{name:"Biru",hex:"#2e6cd9"}],
   sizes:["128GB","256GB"]},
  {id:3,name:"Case",price:99000,oldPrice:129000,desc:"Case pelindung pas di bodi, bahan kuat anti benturan, tetap tipis dan nyaman digenggam.",rating:4.7,sold:196,stock:65,cat:"aksesoris",badge:"Best Seller",
   img:"assets/case.jpg",
   gallery:["assets/case.jpg"],
   video:"assets/case.mp4",
   colors:[{name:"Hitam",hex:"#1c1c1c"},{name:"Bening",hex:"#e9e9e9"}],
   sizes:["Standard"]},
  {id:4,name:"MacBook",price:16999000,oldPrice:null,desc:"Laptop tipis dan ringan dengan performa kencang, baterai awet, cocok untuk kerja maupun kuliah.",rating:4.8,sold:150,stock:20,cat:"macbook",badge:"Baru",
   img:"assets/macbook.jpg",
   gallery:["assets/macbook.jpg"],
   video:"assets/VID%20MACBOOK.mp4",
   colors:[{name:"Silver",hex:"#c9cdd1"},{name:"Space Gray",hex:"#3a3d40"}],
   sizes:["256GB","512GB"]},
];

const sampleReviews = [
  {name:"Dimas Pratama",avatar:"https://i.pravatar.cc/60?img=33",rating:5,text:"Kualitas build-nya premium, pengiriman cepat dan packing aman!"},
  {name:"Sinta Amelia",avatar:"https://i.pravatar.cc/60?img=45",rating:4,text:"Barangnya bagus, cuma dus agak penyok dikit pas nyampe."},
  {name:"Fajar Nugroho",avatar:"https://i.pravatar.cc/60?img=22",rating:5,text:"Sudah kedua kalinya beli di sini, garansi resmi dan responsif."},
];

/* ======================= DATA SUPPLIER ======================= */
let suppliers = [
  {id:1, name:"CV Sumber Elektronik", contact:"Budi Santoso", phone:"081234567890", email:"budi@sumberelektronik.co.id", cat:"smartphone", address:"Jl. Pasar Baru No. 12, Jakarta", status:"Aktif"},
  {id:2, name:"PT Aksesoris Nusantara", contact:"Rina Wulandari", phone:"081298765432", email:"rina@aksesorisnusantara.id", cat:"aksesoris", address:"Jl. Kembang Raya No. 5, Bandung", status:"Aktif"},
  {id:3, name:"UD Gadget Sejahtera", contact:"Andi Firmansyah", phone:"081311223344", email:"andi@gadgetsejahtera.com", cat:"ipad", address:"Jl. Diponegoro No. 88, Surabaya", status:"Nonaktif"},
];
let nextSupplierId = 4;
let editingSupplierId = null;
let deletingSupplierId = null;

/* ======================= AKUN (PERSIST DI localStorage) =======================
   registeredUsers dan sesi login pembeli yang aktif disimpan ke localStorage
   supaya kalau halaman dibuka lagi (bukan lewat tombol "Keluar Akun"),
   pembeli yang sudah login tidak perlu login ulang — langsung masuk ke
   halaman pembeli. */
let registeredUsers = [];              // {email, username, password, phone, address}
const ADMIN_CREDENTIALS = {username:"admin", password:"admin123"};
let addImageObjectURL = null;
let addVideoObjectURL = null;

const STORAGE_KEY_USERS = 'gsp_registeredUsers';
const STORAGE_KEY_ACTIVE = 'gsp_activeUserEmail';

function saveUsersToStorage(){
  try{ localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers)); }catch(e){}
}
function setActiveSession(email){
  try{ localStorage.setItem(STORAGE_KEY_ACTIVE, email); }catch(e){}
}
function clearActiveSession(){
  try{ localStorage.removeItem(STORAGE_KEY_ACTIVE); }catch(e){}
}

/* ======================= PESANAN GLOBAL (TOKO) =======================
   PENTING: daftar pesanan ini SENGAJA dipisah dari appState dan TIDAK
   pernah direset saat pembeli logout. Ini yang membuat pesanan yang baru
   dibuat pembeli tetap muncul di dashboard Admin > Pesanan, karena satu-
   satunya cara membuka dashboard admin di demo ini adalah lewat halaman
   pilih peran (yang mengharuskan pembeli logout dulu). */
let allOrders = []; // {id, owner, items, subtotal, shipping, total, address, payment, status, date, dateObj}

/* ======================= STATE APLIKASI ======================= */
let appState = {
  loggedIn:false,
  user:{email:"",username:"",password:"",phone:"",address:""},
  cart:[],       // {lineId, productId, name, price, img, color, size, qty, checked}
  currentProductId:null,
  selectedColor:null,
  selectedSize:null,
  checkoutItems:[],
  activeCat:"semua",
  gallerySlideIndex:0,
  editingProductId:null,
  reportRange:"harian",
};
let nextLineId = 1;

/* ======================= SESI OTOMATIS SAAT APLIKASI DIBUKA ======================= */
function initSession(){
  try{
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    if(savedUsers) registeredUsers = JSON.parse(savedUsers);
  }catch(e){ registeredUsers = []; }

  let activeEmail = null;
  try{ activeEmail = localStorage.getItem(STORAGE_KEY_ACTIVE); }catch(e){}

  if(activeEmail){
    const match = registeredUsers.find(u => u.email === activeEmail);
    if(match){
      appState.user = {...match};
      appState.loggedIn = true;

      document.getElementById('roleOverlay').style.display = 'none';
      document.getElementById('app').style.display = 'block';

      document.getElementById('profileName').textContent = appState.user.username;
      document.getElementById('profileEmail').textContent = appState.user.email;
      document.getElementById('profilePhone').textContent = appState.user.phone;

      renderHome();
      updateCartBadge();
    }
  }
}

/* ======================= ROLE SELECT LOGIC ======================= */
function chooseRole(role){
  document.getElementById('roleOverlay').style.display = 'none';
  if(role === 'buyer'){
    if(registeredUsers.length > 0){
      document.getElementById('loginOverlay').style.display = 'flex';
    } else {
      document.getElementById('onboardingOverlay').style.display = 'flex';
    }
  } else {
    document.getElementById('adminLoginOverlay').style.display = 'flex';
  }
}

/* ---- login pembeli yang sudah punya akun ---- */
function cancelBuyerLogin(){
  document.getElementById('loginOverlay').style.display = 'none';
  document.getElementById('roleOverlay').style.display = 'flex';
}
function goToSignupFromLogin(){
  document.getElementById('loginOverlay').style.display = 'none';
  document.getElementById('onboardingOverlay').style.display = 'flex';
}
function goToLoginFromSignup(){
  document.getElementById('onboardingOverlay').style.display = 'none';
  document.getElementById('loginOverlay').style.display = 'flex';
}

function loginBuyer(){
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const match = registeredUsers.find(u => u.email === email && u.password === pass);
  const err = document.getElementById('errLogin');
  if(!match){
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';
  appState.user = {...match};
  appState.loggedIn = true;
  setActiveSession(appState.user.email);

  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginOverlay').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  document.getElementById('profileName').textContent = appState.user.username;
  document.getElementById('profileEmail').textContent = appState.user.email;
  document.getElementById('profilePhone').textContent = appState.user.phone;

  renderHome();
  updateCartBadge();
  showToast(`Selamat datang kembali, ${appState.user.username}! ⚡`);
}

/* ---- login admin ---- */
function cancelAdminLogin(){
  document.getElementById('adminLoginOverlay').style.display = 'none';
  document.getElementById('roleOverlay').style.display = 'flex';
}
function adminLoginSubmit(){
  const u = document.getElementById('adminUsername').value.trim();
  const p = document.getElementById('adminPassword').value;
  const err = document.getElementById('errAdminLogin');
  if(u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password){
    err.style.display = 'none';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminLoginOverlay').style.display = 'none';
    document.getElementById('adminApp').style.display = 'block';
    adminGoTo('ringkasan');
  } else {
    err.style.display = 'block';
  }
}

/* admin exit lewat modal konfirmasi */
function openAdminExitModal(){ document.getElementById('adminExitModal').classList.add('open'); }
function closeAdminExitModal(){ document.getElementById('adminExitModal').classList.remove('open'); }
function confirmAdminExit(){
  closeAdminExitModal();
  document.getElementById('adminApp').style.display = 'none';
  document.getElementById('roleOverlay').style.display = 'flex';
  showToast("Keluar dari dashboard admin");
}

/* ======================= ONBOARDING LOGIC ======================= */
function setDot(step){
  document.querySelectorAll('.ob-dot').forEach(d=>{
    d.classList.toggle('active', parseInt(d.dataset.dot) === step);
  });
}

function obNext(fromStep){
  if(fromStep === 1){
    const email = document.getElementById('obEmail').value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.getElementById('errEmail').style.display = valid ? 'none' : 'block';
    if(!valid) return;
    appState.user.email = email;
    document.getElementById('obStep1').classList.remove('active');
    document.getElementById('obStep2').classList.add('active');
    setDot(2);
  }
  if(fromStep === 2){
    const uname = document.getElementById('obUsername').value.trim();
    const pass = document.getElementById('obPassword').value;
    let ok = true;
    if(!uname){ document.getElementById('errUsername').style.display='block'; ok=false; }
    else document.getElementById('errUsername').style.display='none';
    if(pass.length < 6){ document.getElementById('errPassword').style.display='block'; ok=false; }
    else document.getElementById('errPassword').style.display='none';
    if(!ok) return;
    appState.user.username = uname;
    appState.user.password = pass;
    document.getElementById('obStep2').classList.remove('active');
    document.getElementById('obStep3').classList.add('active');
    setDot(3);
  }
}

function obBack(fromStep){
  if(fromStep === 2){
    document.getElementById('obStep2').classList.remove('active');
    document.getElementById('obStep1').classList.add('active');
    setDot(1);
  }
  if(fromStep === 3){
    document.getElementById('obStep3').classList.remove('active');
    document.getElementById('obStep2').classList.add('active');
    setDot(2);
  }
}

function obFinish(){
  const phone = document.getElementById('obPhone').value.trim();
  const valid = /^[0-9]{9,14}$/.test(phone);
  document.getElementById('errPhone').style.display = valid ? 'none' : 'block';
  if(!valid) return;
  appState.user.phone = phone;
  appState.user.address = "";
  appState.loggedIn = true;

  // simpan akun supaya lain kali langsung login, tidak perlu daftar ulang
  registeredUsers.push({...appState.user});
  saveUsersToStorage();
  setActiveSession(appState.user.email);

  document.getElementById('onboardingOverlay').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  document.getElementById('profileName').textContent = appState.user.username || "Raka";
  document.getElementById('profileEmail').textContent = appState.user.email;
  document.getElementById('profilePhone').textContent = appState.user.phone;

  renderHome();
  updateCartBadge();
  showToast(`Selamat datang, ${appState.user.username}! ⚡`);
}

/* ======================= NAVIGASI VIEW (PEMBELI) ======================= */
function goTo(viewName, opts){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-' + viewName).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n=>{
    n.classList.toggle('active', n.dataset.nav === viewName);
  });

  const headerHome = document.getElementById('headerHomeState');
  const headerBack = document.getElementById('headerBackState');
  const titles = {detail:"Detail Produk", cart:"Keranjang Belanja", checkout:"Checkout", orders:"Status Pesanan", profile:"Profil Saya"};

  if(viewName === 'home'){
    headerHome.style.display = 'flex';
    headerBack.style.display = 'none';
  } else {
    headerHome.style.display = 'none';
    headerBack.style.display = 'flex';
    document.getElementById('headerTitle').textContent = titles[viewName] || "";
  }

  if(viewName === 'cart') renderCart();
  if(viewName === 'orders') renderOrders();
  if(viewName === 'profile') renderProfile();

  window.scrollTo({top:0, behavior:'instant'});
}

function handleBack(){
  const active = document.querySelector('.view.active').id.replace('view-','');
  if(active === 'checkout'){ goTo('cart'); return; }
  if(active === 'detail'){ goTo('home'); return; }
  goTo('home');
}

/* ======================= FORMAT HELPER ======================= */
function formatRp(n){ return "Rp " + n.toLocaleString('id-ID'); }
function starString(rating){
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5-full);
}

/* ======================= RENDER HOME ======================= */
function renderHome(){
  const best = products.filter(p => p.badge === "Best Seller");
  document.getElementById('bestsellerScroll').innerHTML = best.map(p => productCardHTML(p)).join('');
  renderProductGrid();
}

function renderProductGrid(){
  const filtered = appState.activeCat === "semua" ? products : products.filter(p => p.cat === appState.activeCat);
  document.getElementById('productGrid').innerHTML = filtered.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p){
  return `
    <div class="p-card">
      <div class="p-img" onclick="openDetail(${p.id})">
        ${p.badge ? `<span class="p-badge">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.name}">
        ${p.video ? `<span class="p-video-badge">▶ Video</span>` : ""}
      </div>
      <div class="p-body">
        <div class="p-name" onclick="openDetail(${p.id})">${p.name}</div>
        <div class="p-desc">${p.desc.slice(0,42)}...</div>
        <div class="p-rating"><span class="stars">★</span> ${p.rating} · ${p.sold} terjual</div>
        <div class="p-price">${formatRp(p.price)}</div>
        <div class="p-actions">
          <button class="btn-cart-sm" onclick="quickAddToCart(${p.id})">+ Keranjang</button>
          <button class="btn-buy-sm" onclick="openDetail(${p.id})">Beli Direct</button>
        </div>
      </div>
    </div>
  `;
}

document.getElementById('catChips').addEventListener('click', e=>{
  const chip = e.target.closest('.chip');
  if(!chip) return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  appState.activeCat = chip.dataset.cat;
  renderProductGrid();
});

function quickAddToCart(productId){
  const p = products.find(p => p.id === productId);
  addLineToCart(p, p.colors[0].name, p.sizes[0], 1);
  showToast(`${p.name} ditambahkan (${p.colors[0].name}, ${p.sizes[0]})`);
}

/* ======================= RENDER DETAIL PRODUK + GALERI FOTO/VIDEO ======================= */
function buildGallerySlides(p){
  const photos = (p.gallery && p.gallery.length) ? p.gallery : [p.img];
  const slides = photos.map(src => ({type:'image', src}));
  if(p.video){ slides.push({type:'video', src:p.video}); }
  return slides;
}

function openDetail(productId){
  appState.currentProductId = productId;
  appState.gallerySlideIndex = 0;
  const p = products.find(p => p.id === productId);
  appState.selectedColor = p.colors[0].name;
  appState.selectedSize = p.sizes[0];
  const slides = buildGallerySlides(p);

  document.getElementById('view-detail').innerHTML = `
    <div class="pd-gallery">
      <div class="pd-slides" id="pdSlides">
        ${slides.map((s,i) => s.type === 'image'
          ? `<div class="pd-slide"><img src="${s.src}" alt="${p.name} foto ${i+1}"></div>`
          : `<div class="pd-slide video-slide"><video controls playsinline preload="metadata" poster="${p.img}"><source src="${s.src}" type="video/mp4"></video><span class="pd-play-hint">▶ Video Produk</span></div>`
        ).join('')}
      </div>
      ${slides.length > 1 ? `
        <div class="pd-arrow prev" onclick="pdSlideStep(-1)">‹</div>
        <div class="pd-arrow next" onclick="pdSlideStep(1)">›</div>
      ` : ""}
    </div>
    ${slides.length > 1 ? `
      <div class="pd-dots" id="pdDots">
        ${slides.map((s,i) => `<div class="pd-dot ${i===0?'active':''}" data-i="${i}" onclick="pdSlideGo(${i})"></div>`).join('')}
      </div>
    ` : ""}

    <div class="pd-cat">${p.cat}</div>
    <h2 class="pd-name">${p.name}</h2>
    <div class="pd-meta">
      <span>${starString(p.rating)} ${p.rating}</span>
      <span>·</span>
      <span>${p.sold} terjual</span>
    </div>
    <div class="pd-price">${formatRp(p.price)} ${p.oldPrice ? `<span style="font-size:13px;color:#c7a7ae;text-decoration:line-through;font-weight:400;">${formatRp(p.oldPrice)}</span>` : ""}</div>
    <p class="pd-desc">${p.desc}</p>

    <div class="variant-block">
      <h4>Pilih Warna: <span id="colorLabel">${p.colors[0].name}</span></h4>
      <div class="color-opts" id="colorOpts">
        ${p.colors.map((c,i) => `
          <div class="color-dot ${i===0?'selected':''}" data-color="${c.name}" onclick="selectColor('${c.name}')">
            <div class="color-inner" style="background:${c.hex};"></div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="variant-block">
      <h4>Pilih Varian: <span id="sizeLabel">${p.sizes[0]}</span></h4>
      <div class="size-opts" id="sizeOpts">
        ${p.sizes.map((s,i) => `
          <div class="size-opt ${i===0?'selected':''}" data-size="${s}" onclick="selectSize('${s}')">${s}</div>
        `).join('')}
      </div>
    </div>

    <div class="section-title" style="margin-top:10px;"><h2 style="font-size:15px;">Ulasan Pembeli</h2></div>
    ${sampleReviews.map(r => `
      <div class="review-item">
        <img src="${r.avatar}" alt="${r.name}">
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-stars">${starString(r.rating)}</div>
          <div class="review-text">${r.text}</div>
        </div>
      </div>
    `).join('')}

    <div class="pd-sticky-bar">
      <button class="btn-add-cart" onclick="addToCartFromDetail()">+ Keranjang</button>
      <button class="btn-buy-now" onclick="buyNowFromDetail()">Beli Sekarang</button>
    </div>
  `;

  const slidesEl = document.getElementById('pdSlides');
  if(slidesEl){
    slidesEl.addEventListener('scroll', ()=>{
      const idx = Math.round(slidesEl.scrollLeft / slidesEl.clientWidth);
      setActiveDot(idx);
    }, {passive:true});
  }

  goTo('detail');
}

function pdSlideGo(index){
  const slidesEl = document.getElementById('pdSlides');
  if(!slidesEl) return;
  slidesEl.scrollTo({left: index * slidesEl.clientWidth, behavior:'smooth'});
  setActiveDot(index);
}
function pdSlideStep(delta){
  const slidesEl = document.getElementById('pdSlides');
  if(!slidesEl) return;
  const current = Math.round(slidesEl.scrollLeft / slidesEl.clientWidth);
  const dotsCount = document.querySelectorAll('.pd-dot').length;
  let next = current + delta;
  if(next < 0) next = 0;
  if(next > dotsCount - 1) next = dotsCount - 1;
  pdSlideGo(next);
}
function setActiveDot(index){
  document.querySelectorAll('.pd-dot').forEach(d=>{
    d.classList.toggle('active', parseInt(d.dataset.i) === index);
  });
}

function selectColor(colorName){
  appState.selectedColor = colorName;
  document.getElementById('colorLabel').textContent = colorName;
  document.querySelectorAll('.color-dot').forEach(d=>{
    d.classList.toggle('selected', d.dataset.color === colorName);
  });
}
function selectSize(size){
  appState.selectedSize = size;
  document.getElementById('sizeLabel').textContent = size;
  document.querySelectorAll('.size-opt').forEach(d=>{
    d.classList.toggle('selected', d.dataset.size === size);
  });
}

function addToCartFromDetail(){
  const p = products.find(p => p.id === appState.currentProductId);
  addLineToCart(p, appState.selectedColor, appState.selectedSize, 1);
  showToast(`${p.name} (${appState.selectedColor}, ${appState.selectedSize}) masuk keranjang`);
}

function buyNowFromDetail(){
  const p = products.find(p => p.id === appState.currentProductId);
  appState.checkoutItems = [{
    lineId:null, productId:p.id, name:p.name, price:p.price, img:p.img,
    color:appState.selectedColor, size:appState.selectedSize, qty:1
  }];
  renderCheckout();
  goTo('checkout');
}

/* ======================= CART LOGIC ======================= */
function addLineToCart(p, color, size, qty){
  const existing = appState.cart.find(l => l.productId === p.id && l.color === color && l.size === size);
  if(existing){
    existing.qty += qty;
  } else {
    appState.cart.push({
      lineId: nextLineId++, productId:p.id, name:p.name, price:p.price, img:p.img,
      color, size, qty, checked:true
    });
  }
  updateCartBadge();
}

function updateCartBadge(){
  const totalQty = appState.cart.reduce((s,l) => s + l.qty, 0);
  document.getElementById('headerCartBadge').textContent = totalQty;
  const navBadge = document.getElementById('navCartBadge');
  navBadge.textContent = totalQty;
  navBadge.style.display = totalQty > 0 ? 'flex' : 'none';
}

function renderCart(){
  const el = document.getElementById('cartContent');
  if(appState.cart.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="emoji">🛒</div>Keranjang kamu masih kosong.<br>Yuk mulai belanja gadget!</div>`;
    return;
  }

  const itemsHTML = appState.cart.map(l => `
    <div class="cart-item">
      <input type="checkbox" class="cart-check" ${l.checked?'checked':''} onchange="toggleCartCheck(${l.lineId})">
      <img src="${l.img}" alt="${l.name}">
      <div class="ci-info">
        <div class="ci-name">${l.name}</div>
        <div class="ci-variant">Warna: ${l.color} · Varian: ${l.size}</div>
        <div class="ci-price">${formatRp(l.price)}</div>
        <div class="ci-qty">
          <button class="qbtn" onclick="changeQty(${l.lineId},-1)">−</button>
          <span>${l.qty}</span>
          <button class="qbtn" onclick="changeQty(${l.lineId},1)">+</button>
        </div>
        <div class="ci-delete" onclick="removeLine(${l.lineId})">Hapus</div>
      </div>
    </div>
  `).join('');

  const checkedLines = appState.cart.filter(l => l.checked);
  const subtotal = checkedLines.reduce((s,l) => s + l.price * l.qty, 0);
  const shipping = checkedLines.length > 0 ? 20000 : 0;
  const total = subtotal + shipping;

  el.innerHTML = itemsHTML + `
    <div class="summary-box">
      <div class="summary-row"><span>Subtotal (${checkedLines.length} produk dipilih)</span><span>${formatRp(subtotal)}</span></div>
      <div class="summary-row"><span>Ongkos Kirim</span><span>${formatRp(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatRp(total)}</span></div>
      <button class="checkout-btn" ${checkedLines.length===0?'disabled':''} onclick="goToCheckout()">Checkout (${checkedLines.length})</button>
    </div>
  `;
}

function toggleCartCheck(lineId){
  const l = appState.cart.find(l => l.lineId === lineId);
  if(l) l.checked = !l.checked;
  renderCart();
}
function changeQty(lineId, delta){
  const l = appState.cart.find(l => l.lineId === lineId);
  if(!l) return;
  l.qty += delta;
  if(l.qty <= 0){ appState.cart = appState.cart.filter(x => x.lineId !== lineId); }
  updateCartBadge();
  renderCart();
}
function removeLine(lineId){
  appState.cart = appState.cart.filter(l => l.lineId !== lineId);
  updateCartBadge();
  renderCart();
  showToast("Produk dihapus dari keranjang");
}

function goToCheckout(){
  const checkedLines = appState.cart.filter(l => l.checked);
  if(checkedLines.length === 0) return;
  appState.checkoutItems = checkedLines.map(l => ({...l}));
  renderCheckout();
  goTo('checkout');
}

/* ======================= CHECKOUT LOGIC ======================= */
function renderCheckout(){
  const items = appState.checkoutItems;
  const subtotal = items.reduce((s,l) => s + l.price * l.qty, 0);
  const shipping = 20000;
  const total = subtotal + shipping;

  document.getElementById('view-checkout').innerHTML = `
    <div class="co-block">
      <h4>Ringkasan Produk</h4>
      ${items.map(l => `
        <div class="co-item-row">
          <span>${l.name} (${l.color}, ${l.size}) x${l.qty}</span>
          <span>${formatRp(l.price * l.qty)}</span>
        </div>
      `).join('')}
    </div>

    <div class="co-block">
      <h4>Alamat Pengiriman</h4>
      <textarea class="co-addr-input" id="coAddress">${appState.user.address || ''}</textarea>
    </div>

    <div class="co-block">
      <h4>Metode Pembayaran</h4>
      <div class="pay-option">💵 COD — Bayar di Tempat</div>
    </div>

    <div class="summary-box">
      <div class="summary-row"><span>Subtotal</span><span>${formatRp(subtotal)}</span></div>
      <div class="summary-row"><span>Ongkos Kirim</span><span>${formatRp(shipping)}</span></div>
      <div class="summary-row total"><span>Total Bayar</span><span>${formatRp(total)}</span></div>
      <button class="checkout-btn" onclick="placeOrder()">Buat Pesanan</button>
    </div>
  `;
}

function placeOrder(){
  const address = document.getElementById('coAddress').value.trim();
  if(!address){
    showToast("Alamat pengiriman wajib diisi");
    return;
  }
  appState.user.address = address;
  // simpan alamat terbaru ke akun juga
  const acc = registeredUsers.find(u => u.email === appState.user.email);
  if(acc){ acc.address = address; saveUsersToStorage(); }

  const items = appState.checkoutItems;
  const subtotal = items.reduce((s,l) => s + l.price * l.qty, 0);
  const shipping = 20000;
  const total = subtotal + shipping;
  const orderId = "#GSP-" + Math.random().toString(36).substring(2,8).toUpperCase();
  const now = new Date();

  // Pesanan disimpan ke daftar GLOBAL (allOrders), bukan ke appState,
  // supaya tetap ada & terlihat oleh Admin walau pembeli logout.
  allOrders.unshift({
    id:orderId, owner:appState.user.email, items, subtotal, shipping, total,
    address, payment:"COD - Bayar di Tempat", status:"Menunggu Konfirmasi",
    date:now.toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'}),
    dateObj: now
  });

  const orderedLineIds = items.filter(i => i.lineId).map(i => i.lineId);
  appState.cart = appState.cart.filter(l => !orderedLineIds.includes(l.lineId));
  appState.checkoutItems = [];
  updateCartBadge();
  updateAdminPendingBadge();

  goTo('orders');
  showToast(`Pesanan ${orderId} dibuat! Menunggu konfirmasi penjual ⚡`);
}

/* ======================= ORDERS LOGIC (PEMBELI) ======================= */
function myOrders(){
  // Pembeli hanya melihat pesanan miliknya sendiri, diambil dari allOrders global.
  return allOrders.filter(o => o.owner === appState.user.email);
}

function renderOrders(){
  const el = document.getElementById('ordersList');
  const orders = myOrders();
  if(orders.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="emoji">📦</div>Belum ada pesanan.<br>Yuk mulai belanja gadget dulu!</div>`;
    return;
  }
  el.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-top">
        <div>
          <div class="order-id">${o.id}</div>
          <div class="order-date">${o.date}</div>
        </div>
        <span class="order-status-badge">${o.status}</span>
      </div>
      <div class="order-items-list">
        ${o.items.map(l => `${l.name} — ${l.color}, ${l.size} x${l.qty}`).join('<br>')}
      </div>
      <div class="order-items-list" style="opacity:.75;">📍 ${o.address}</div>
      <div class="order-total-row"><span>${o.payment}</span><span>${formatRp(o.total)}</span></div>
    </div>
  `).join('');
}

/* ======================= PROFILE LOGIC ======================= */
function renderProfile(){
  document.getElementById('profileName').textContent = appState.user.username || "Raka";
  document.getElementById('profileEmail').textContent = appState.user.email || "-";
  document.getElementById('profilePhone').textContent = appState.user.phone || "-";
  document.getElementById('profileAddress').textContent = appState.user.address || "Belum diisi";
  document.getElementById('addressInput').value = appState.user.address || "";

  const orders = myOrders();
  document.getElementById('statOrders').textContent = orders.length;
  const totalSpent = orders.reduce((s,o) => s + o.total, 0);
  document.getElementById('statSpent').textContent = formatRp(totalSpent);
  document.getElementById('statCartCount').textContent = appState.cart.reduce((s,l) => s + l.qty, 0);
}

function saveAddress(){
  const val = document.getElementById('addressInput').value.trim();
  appState.user.address = val;
  const acc = registeredUsers.find(u => u.email === appState.user.email);
  if(acc){ acc.address = val; saveUsersToStorage(); }
  document.getElementById('profileAddress').textContent = val || "Belum diisi";
  showToast("Alamat berhasil disimpan");
}

/* ======================= LOGOUT (PEMBELI) ======================= */
function openLogoutModal(){ document.getElementById('logoutModal').classList.add('open'); }
function closeLogoutModal(){ document.getElementById('logoutModal').classList.remove('open'); }

function confirmLogout(){
  // akun (registeredUsers) & pesanan (allOrders) SENGAJA TIDAK direset saat
  // logout, supaya lain kali bisa login langsung dan pesanan tetap terlihat
  // oleh Admin di menu Pesanan. Yang dihapus hanya sesi aktif (activeUserEmail),
  // supaya setelah "Keluar Akun" pembeli tetap diminta login lagi.
  clearActiveSession();

  appState.loggedIn = false;
  appState.user = {email:"",username:"",password:"",phone:"",address:""};
  appState.cart = [];
  appState.currentProductId = null;
  appState.selectedColor = null;
  appState.selectedSize = null;
  appState.checkoutItems = [];
  appState.activeCat = "semua";

  closeLogoutModal();
  document.getElementById('app').style.display = 'none';

  document.getElementById('obStep1').classList.add('active');
  document.getElementById('obStep2').classList.remove('active');
  document.getElementById('obStep3').classList.remove('active');
  setDot(1);
  document.getElementById('obEmail').value = '';
  document.getElementById('obUsername').value = 'Raka';
  document.getElementById('obPassword').value = '';
  document.getElementById('obPhone').value = '';

  document.getElementById('roleOverlay').style.display = 'flex';
  showToast("Kamu berhasil keluar");
}

/* ======================= ADMIN DASHBOARD LOGIC ======================= */
function adminGoTo(tab){
  document.querySelectorAll('#adminBottomNav .nav-item').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.admin-tabpanel').forEach(p => p.classList.toggle('active', p.id === 'adminPanel-' + tab));
  if(tab === 'ringkasan') renderAdmin();
  if(tab === 'pesanan') renderAdminOrders();
  if(tab === 'barang') renderAdminProducts();
  if(tab === 'supplier') renderSupplierList();
  if(tab === 'tambah') { /* form statis, tidak perlu render ulang */ }
  if(tab === 'laporan') renderReport();
}

function renderAdmin(){
  document.getElementById('adminStatProducts').textContent = products.length;
  document.getElementById('adminStatOrders').textContent = allOrders.length;
  const revenue = allOrders.reduce((s,o) => s + o.total, 0);
  document.getElementById('adminStatRevenue').textContent = formatRp(revenue);
  const pending = allOrders.filter(o => o.status === "Menunggu Konfirmasi").length;
  document.getElementById('adminStatPending').textContent = pending;
  updateAdminPendingBadge();
}

/* ----- TAB: PESANAN + KONFIRMASI (NOTIFIKASI PENJUALAN) ----- */
function renderAdminOrders(){
  const ordersEl = document.getElementById('adminOrdersList');
  if(allOrders.length === 0){
    ordersEl.innerHTML = `<div class="empty-state"><div class="emoji">📭</div>Belum ada pesanan masuk dari pembeli.</div>`;
    updateAdminPendingBadge();
    return;
  }
  const statusOptions = ["Menunggu Konfirmasi","Dikemas","Dikirim","Selesai","Dibatalkan"];
  ordersEl.innerHTML = allOrders.map((o,idx) => `
    <div class="admin-order-card ${o.status==='Menunggu Konfirmasi' ? 'is-pending' : ''}">
      <div class="admin-order-top">
        <b>${o.id} ${o.status==='Menunggu Konfirmasi' ? '<span class="new-order-tag">🔔 Pesanan Baru</span>' : ''}</b>
        <select class="status-select" onchange="updateOrderStatus(${idx}, this.value)">
          ${statusOptions.map(s => `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="order-items-list">${o.items.map(l => `${l.name} x${l.qty}`).join('<br>')}</div>
      <div class="order-items-list" style="opacity:.7;">👤 ${o.owner || '-'}</div>
      <div class="order-total-row"><span>${o.date}</span><span>${formatRp(o.total)}</span></div>
      ${o.status==='Menunggu Konfirmasi' ? `<button class="btn btn-primary" style="width:100%;margin-top:10px;" onclick="confirmOrder(${idx})">✔ Konfirmasi Pesanan</button>` : ''}
    </div>
  `).join('');
  updateAdminPendingBadge();
}

function confirmOrder(idx){
  allOrders[idx].status = "Dikemas";
  showToast(`${allOrders[idx].id} dikonfirmasi, mulai dikemas`);
  renderAdminOrders();
  renderAdmin();
}

function updateOrderStatus(idx, status){
  allOrders[idx].status = status;
  showToast(`Status ${allOrders[idx].id} diubah ke "${status}"`);
  renderAdminOrders();
  renderAdmin();
}

function updateAdminPendingBadge(){
  const pending = allOrders.filter(o => o.status === "Menunggu Konfirmasi").length;
  const badge = document.getElementById('adminPendingBadge');
  if(badge){
    badge.textContent = pending;
    badge.style.display = pending > 0 ? 'flex' : 'none';
  }
}

/* ----- TAB: LIHAT BARANG (+ EDIT) ----- */
function renderAdminProducts(){
  const grid = document.getElementById('adminProductGrid');
  if(!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="admin-prod-card">
      <img src="${p.img}" alt="${p.name}">
      <div class="admin-prod-body">
        <div class="admin-prod-name">${p.name}</div>
        <div class="admin-prod-meta">
          Kategori: ${p.cat}<br>
          Stok: ${p.stock} · Terjual: ${p.sold}<br>
          ★ ${p.rating || 0}
        </div>
        <div class="admin-prod-price">${formatRp(p.price)}</div>
        <button class="btn-edit-prod" onclick="openEditProduct(${p.id})">✎ Edit Barang</button>
      </div>
    </div>
  `).join('');
}

function openEditProduct(productId){
  const p = products.find(p => p.id === productId);
  if(!p) return;
  appState.editingProductId = productId;
  document.getElementById('editName').value = p.name;
  document.getElementById('editPrice').value = p.price;
  document.getElementById('editStock').value = p.stock;
  document.getElementById('editDesc').value = p.desc;
  document.getElementById('editProductModal').classList.add('open');
}
function closeEditProductModal(){
  document.getElementById('editProductModal').classList.remove('open');
  appState.editingProductId = null;
}
function saveEditProduct(){
  const p = products.find(p => p.id === appState.editingProductId);
  if(!p) return;
  const name = document.getElementById('editName').value.trim();
  const price = parseInt(document.getElementById('editPrice').value, 10);
  const stock = parseInt(document.getElementById('editStock').value, 10);
  const desc = document.getElementById('editDesc').value.trim();

  if(!name || isNaN(price) || price < 0 || isNaN(stock) || stock < 0){
    showToast("Isi data barang dengan benar ya");
    return;
  }

  p.name = name; p.price = price; p.stock = stock; p.desc = desc;

  closeEditProductModal();
  renderAdminProducts();
  renderAdmin();
  showToast(`${p.name} berhasil diperbarui`);
}

/* ----- TAB: SUPPLIER ----- */
const CAT_LABEL = {smartphone:"Smartphone", ipad:"iPad", macbook:"MacBook", aksesoris:"Aksesoris"};

function renderSupplierList(){
  const el = document.getElementById('supplierList');
  if(!el) return;
  if(suppliers.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="emoji">🚚</div>Belum ada supplier terdaftar.<br>Tambahkan supplier pertamamu.</div>`;
    return;
  }
  el.innerHTML = suppliers.map(s => `
    <div class="supplier-card">
      <div class="supplier-top">
        <div>
          <div class="supplier-name">${s.name}</div>
          <div class="supplier-cat">${CAT_LABEL[s.cat] || s.cat}</div>
        </div>
        <span class="supplier-status ${s.status==='Aktif' ? 'aktif' : 'nonaktif'}" onclick="toggleSupplierStatus(${s.id})" title="Klik untuk ubah status">${s.status}</span>
      </div>
      <div class="supplier-meta">
        <b>Kontak:</b> ${s.contact || '-'}<br>
        <b>Telepon:</b> ${s.phone || '-'}<br>
        <b>Email:</b> ${s.email || '-'}<br>
        <b>Alamat:</b> ${s.address || '-'}
      </div>
      <div class="supplier-actions">
        <button class="btn-edit-supplier" onclick="openEditSupplierModal(${s.id})">✎ Edit</button>
        <button class="btn-del-supplier" onclick="openDeleteSupplierModal(${s.id})">🗑 Hapus</button>
      </div>
    </div>
  `).join('');
}

function openAddSupplierModal(){
  editingSupplierId = null;
  document.getElementById('supplierModalTitle').textContent = 'Tambah Supplier';
  document.getElementById('supName').value = '';
  document.getElementById('supContact').value = '';
  document.getElementById('supPhone').value = '';
  document.getElementById('supEmail').value = '';
  document.getElementById('supCat').value = 'smartphone';
  document.getElementById('supAddress').value = '';
  document.getElementById('supStatus').value = 'Aktif';
  document.getElementById('errSupName').style.display = 'none';
  document.getElementById('errSupPhone').style.display = 'none';
  document.getElementById('supplierModal').classList.add('open');
}

function openEditSupplierModal(id){
  const s = suppliers.find(s => s.id === id);
  if(!s) return;
  editingSupplierId = id;
  document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
  document.getElementById('supName').value = s.name;
  document.getElementById('supContact').value = s.contact;
  document.getElementById('supPhone').value = s.phone;
  document.getElementById('supEmail').value = s.email;
  document.getElementById('supCat').value = s.cat;
  document.getElementById('supAddress').value = s.address;
  document.getElementById('supStatus').value = s.status;
  document.getElementById('errSupName').style.display = 'none';
  document.getElementById('errSupPhone').style.display = 'none';
  document.getElementById('supplierModal').classList.add('open');
}

function closeSupplierModal(){
  document.getElementById('supplierModal').classList.remove('open');
  editingSupplierId = null;
}

function saveSupplier(){
  const name = document.getElementById('supName').value.trim();
  const contact = document.getElementById('supContact').value.trim();
  const phone = document.getElementById('supPhone').value.trim();
  const email = document.getElementById('supEmail').value.trim();
  const cat = document.getElementById('supCat').value;
  const address = document.getElementById('supAddress').value.trim();
  const status = document.getElementById('supStatus').value;

  let ok = true;
  if(!name){ document.getElementById('errSupName').style.display = 'block'; ok = false; }
  else document.getElementById('errSupName').style.display = 'none';

  const phoneValid = /^[0-9]{9,14}$/.test(phone);
  if(!phoneValid){ document.getElementById('errSupPhone').style.display = 'block'; ok = false; }
  else document.getElementById('errSupPhone').style.display = 'none';

  if(!ok) return;

  if(editingSupplierId){
    const s = suppliers.find(s => s.id === editingSupplierId);
    s.name = name; s.contact = contact; s.phone = phone; s.email = email;
    s.cat = cat; s.address = address; s.status = status;
    showToast(`${name} berhasil diperbarui`);
  } else {
    suppliers.push({id:nextSupplierId++, name, contact, phone, email, cat, address, status});
    showToast(`${name} berhasil ditambahkan sebagai supplier`);
  }

  closeSupplierModal();
  renderSupplierList();
}

function toggleSupplierStatus(id){
  const s = suppliers.find(s => s.id === id);
  if(!s) return;
  s.status = s.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
  renderSupplierList();
  showToast(`Status ${s.name} diubah ke "${s.status}"`);
}

function openDeleteSupplierModal(id){
  const s = suppliers.find(s => s.id === id);
  if(!s) return;
  deletingSupplierId = id;
  document.getElementById('deleteSupplierText').textContent = `"${s.name}" akan dihapus permanen dari daftar supplier.`;
  document.getElementById('deleteSupplierModal').classList.add('open');
}
function closeDeleteSupplierModal(){
  document.getElementById('deleteSupplierModal').classList.remove('open');
  deletingSupplierId = null;
}
function confirmDeleteSupplier(){
  const s = suppliers.find(s => s.id === deletingSupplierId);
  suppliers = suppliers.filter(s => s.id !== deletingSupplierId);
  closeDeleteSupplierModal();
  renderSupplierList();
  if(s) showToast(`${s.name} dihapus dari daftar supplier`);
}

/* ----- TAB: TAMBAH BARANG ----- */
function previewAddImage(e){
  const file = e.target.files[0];
  if(!file) return;
  if(addImageObjectURL) URL.revokeObjectURL(addImageObjectURL);
  addImageObjectURL = URL.createObjectURL(file);
  document.getElementById('addImagePreview').innerHTML = `<img src="${addImageObjectURL}" alt="Preview gambar produk">`;
}
function previewAddVideo(e){
  const file = e.target.files[0];
  if(!file) return;
  if(addVideoObjectURL) URL.revokeObjectURL(addVideoObjectURL);
  addVideoObjectURL = URL.createObjectURL(file);
  document.getElementById('addVideoPreview').innerHTML = `<video src="${addVideoObjectURL}" controls></video>`;
}

function submitNewProduct(){
  const name = document.getElementById('addName').value.trim();
  const price = parseInt(document.getElementById('addPrice').value, 10);
  const cat = document.getElementById('addCat').value;
  const desc = document.getElementById('addDesc').value.trim();
  const stock = parseInt(document.getElementById('addStock').value, 10) || 0;

  if(!name || isNaN(price) || price <= 0 || !desc){
    showToast("Lengkapi nama, harga, dan deskripsi produk dulu ya");
    return;
  }
  if(!addImageObjectURL){
    showToast("Upload gambar produk dulu ya");
    return;
  }

  const newId = Math.max(...products.map(p => p.id)) + 1;
  products.push({
    id:newId, name, price, oldPrice:null, desc, rating:0, sold:0, stock, cat, badge:"Baru",
    img:addImageObjectURL,
    gallery:[addImageObjectURL],
    video: addVideoObjectURL || null,
    colors:[{name:"Default", hex:"#d9829d"}],
    sizes:["Standard"]
  });

  document.getElementById('addName').value = '';
  document.getElementById('addPrice').value = '';
  document.getElementById('addDesc').value = '';
  document.getElementById('addStock').value = '';
  document.getElementById('addImageFile').value = '';
  document.getElementById('addVideoFile').value = '';
  document.getElementById('addImagePreview').innerHTML = '';
  document.getElementById('addVideoPreview').innerHTML = '';
  addImageObjectURL = null;
  addVideoObjectURL = null;

  renderAdminProducts();
  renderAdmin();
  renderHome();
  showToast(`${name} berhasil ditambahkan ke katalog`);
}

/* ----- TAB: LAPORAN KEUANGAN ----- */
function setReportRange(range){
  appState.reportRange = range;
  document.querySelectorAll('.report-toggle button').forEach(b => b.classList.toggle('active', b.dataset.range === range));
  renderReport();
}

function renderReport(){
  const totalRevenue = allOrders.reduce((s,o) => s + o.total, 0);
  document.getElementById('reportSummaryValue').textContent = formatRp(totalRevenue);

  const range = appState.reportRange;
  const groups = {};
  allOrders.forEach(o => {
    const d = o.dateObj || new Date();
    let key, label;
    if(range === 'harian'){
      key = d.toISOString().slice(0,10);
      label = d.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
    } else if(range === 'bulanan'){
      key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
      label = d.toLocaleDateString('id-ID', {month:'long', year:'numeric'});
    } else {
      key = String(d.getFullYear());
      label = key;
    }
    if(!groups[key]) groups[key] = {label, total:0, count:0};
    groups[key].total += o.total;
    groups[key].count += 1;
  });

  const keys = Object.keys(groups).sort().reverse();
  const listEl = document.getElementById('reportList');
  if(keys.length === 0){
    listEl.innerHTML = `<div class="empty-state"><div class="emoji">📊</div>Belum ada transaksi untuk dilaporkan.<br>Laporan akan otomatis muncul saat ada pesanan masuk.</div>`;
    return;
  }
  listEl.innerHTML = keys.map(k => `
    <div class="report-row">
      <div>
        <div class="rlabel">${groups[k].label}</div>
        <div class="rsub">${groups[k].count} pesanan</div>
      </div>
      <div class="ramount">${formatRp(groups[k].total)}</div>
    </div>
  `).join('');
}

/* ======================= TOAST ======================= */
let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2400);
}

/* ======================= JALANKAN SESI SAAT HALAMAN DIBUKA ======================= */
initSession();
