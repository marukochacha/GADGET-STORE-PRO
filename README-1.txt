CARA MENJALANKAN DI LARAGON
============================

1. Buka folder instalasi Laragon kamu, lalu masuk ke folder "www"
   (biasanya di: C:\laragon\www)

2. Copy SELURUH folder "gadgetstore" ini ke dalam folder "www" tadi.
   Hasilnya harus jadi seperti ini:
   C:\laragon\www\gadgetstore\index.html
   C:\laragon\www\gadgetstore\css\style.css
   C:\laragon\www\gadgetstore\js\app.js
   C:\laragon\www\gadgetstore\assets\ (taruh gambar & video produk di sini)

3. Jalankan Laragon (klik tombol "Start All").

4. Buka browser, akses:
   http://localhost/gadgetstore/

   (atau klik kanan folder gadgetstore di Laragon > "Open with browser")

WAJIB: FOTO & VIDEO PRODUK
============================
File di js/app.js memanggil gambar/video dari folder "assets/", contoh:
  assets/ipad.jpg
  assets/ipad.mp4
  assets/iphone 15.jpg   (ditulis di kode sebagai assets/iphone%2015.jpg)
  assets/iphone.mp4
  assets/case.jpg
  assets/case.mp4
  assets/macbook.jpg
  assets/VID MACBOOK.mp4

Taruh file-file gambar & video kamu PERSIS dengan nama tersebut di dalam
folder "assets". Kalau nama file kamu beda, tinggal ubah nama filenya
di js/app.js pada bagian array "products" (cari "img:" dan "video:").

STRUKTUR FOLDER
============================
gadgetstore/
├── index.html      -> halaman utama (buka ini di browser)
├── css/
│   └── style.css    -> semua styling
├── js/
│   └── app.js        -> semua logic (data produk, cart, admin, dll)
├── assets/           -> taruh gambar & video produk di sini
└── README.txt        -> file ini

CATATAN
============================
- Login Admin demo: username "admin", password "admin123"
- Data akun pembeli & pesanan disimpan di localStorage browser,
  jadi tidak butuh database/PHP sama sekali. Cukup dibuka lewat
  Laragon (Apache) sebagai file statis.
- Kalau mau pakai database beneran (PHP + MySQL) nanti, kabari saja,
  filenya bisa dikembangkan lagi dari struktur ini.
