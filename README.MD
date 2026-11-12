# Product 1 — Halaman Hardcoded

## Ruang lingkup

README ini hanya menjelaskan halaman **`project-AI/product-1.html`**, halaman detail produk dengan data produk yang ditulis langsung di HTML. Halaman ini tidak mengambil detail produk dari API dan tidak memerlukan backend atau database untuk menjalankan interaksi produknya.

## Isi halaman

- Produk: Kemeja Linen Biru
- Harga: Rp150.000
- Ukuran: S, M, dan L
- Stok total hardcoded: 10 unit
- Gratis ongkir: nilai subtotal dalam keranjang ditambah pilihan yang sedang diperiksa mencapai Rp300.000
- Tiga foto produk lokal di `project-AI/assets/`:
  - `kemeja-linen-biru-01.webp`
  - `kemeja-linen-biru-02.webp`
  - `kemeja-linen-biru-03.webp`

Data nama, harga, ukuran, stok, deskripsi, dan path foto terdapat di HTML. JavaScript mengelola interaksi di browser. Keranjang bersifat lokal di memori halaman; jumlah dan isinya kembali kosong setelah halaman direload.

## File updated

Terdapat 1 file baru dari versi sebelumnya yaitu `dom-interactivity.js`. Untuk perubahan pada file lainnya telah ditandai dengan comment `ASSIGNMENT DAY 22`.

| File | Peran pada halaman product-1 |
|---|---|
| `project-AI/product-1.html` | Halaman berisi data produk hardcoded, pilihan ukuran dan quantity, galeri, pesan status, serta dialog keranjang. Memuat script dengan atribut `defer`. |
| `project-AI/product-interaction.js` | Logika utama: validasi pilihan dan quantity, subtotal, stok total, gratis ongkir, cart lokal, detail/subtotal item, total harga Cart, dan indikator ukuran terpilih. |
| `project-AI/dom-interactivity.js` | Memasang event listener untuk halaman local-cart dan menghubungkan form, tombol Keranjang, serta dialog ke fungsi interaksi produk. |
| `project-AI/styles.css` | Penambahan tampilan popup Cart drawer dari kanan. Pengaturan warna indikator/bulatan (S/M/L), ketika dropdown ukuran di pilih. |

Urutan script pada halaman adalah `static-gallery.js`, `product-interaction.js`, lalu `dom-interactivity.js`. Urutan ini diperlukan karena script penghubung memakai fungsi dan elemen yang disiapkan oleh script sebelumnya.

## Perubahan hari ini dibanding versi sebelumnya

Perubahan berikut ditambahkan pada versi halaman yang sebelumnya sudah mempunyai galeri dan ringkasan pesanan:

1. **Quantity dan validasi stok**
   - Quantity harus bilangan bulat positif.
   - Nilai 0, pecahan, negatif, dan nilai di atas sisa stok ditolak dengan pesan yang jelas.
   - Batas menggunakan stok total 10, dikurangi jumlah unit yang sudah ada dalam keranjang lokal. Tidak ada stok per ukuran yang diasumsikan.

2. **Ringkasan dan aksi keranjang**
   - Perubahan ukuran/quantity memperbarui ringkasan dan subtotal.
   - Aksi tambah yang valid menampilkan feedback sukses berwarna hijau dan memperbarui cart count.
   - Keranjang lokal mengelompokkan item berdasarkan ukuran.

3. **Gratis ongkir**
   - Ambang Rp300.000 dihitung dari total item yang sudah berada dalam keranjang ditambah subtotal pilihan baru.
   - Subtotal pilihan yang sedang diperiksa tetap ditampilkan terpisah dari total cart.

4. **Popup keranjang**
   - Tombol **Keranjang** membuka drawer dari sisi kanan.
   - Drawer menampilkan thumbnail, nama produk, ukuran, jumlah, subtotal setiap ukuran, dan total harga.
   - Drawer dapat ditutup dengan tombol tutup, klik backdrop, atau Escape. Tidak ada checkout atau penyimpanan database.

5. **Indikator ukuran**
   - Bulatan ukuran yang cocok dengan pilihan dropdown berubah menjadi hijau dengan tulisan putih.
   - Ukuran lain kembali ke tampilan awal.

6. **Gambar lokal**
   - Tiga gambar utama/thumbnail diganti dari URL gambar online menjadi file WebP lokal.

## Cara menjalankan

1. Buka folder proyek di Visual Studio Code.
2. Buka `project-AI/product-1.html`.
3. Jalankan melalui extension **Live Server** dengan memilih **Open with Live Server**. Jika extension itu tidak tersedia, halaman juga dapat dibuka langsung di browser melalui File Explorer; referensi script dan gambar pada halaman ini menggunakan path relatif.
4. Tidak perlu menjalankan `npm run dev`, backend produk, Docker, atau PostgreSQL untuk halaman hardcoded ini.

## Cara menguji secara manual di browser

Test Scenario dapat dilihat secara detail pada file `TEST-SCENARIO.docx`, yang antara lain berisi:

| Langkah / input | Hasil yang diharapkan |
|---|---|
| Muat `product-1.html` | Kemeja Linen Biru, Rp150.000, stok 10, pilihan S/M/L, dan cart count 0 terlihat. Tidak ada respons produk yang diambil dari API. |
| Periksa galeri dan klik tiap thumbnail | Gambar utama berubah. Network menampilkan file WebP dari `assets/`, bukan request gambar Unsplash. |
| Pilih ukuran S, masukkan quantity 2 | Ringkasan berubah ke ukuran S dan jumlah 2; subtotal Rp300.000; status gratis ongkir tampil. Cart belum berubah sebelum tombol tambah diklik. |
| Ganti ukuran ke M atau quantity ke 1 | Ringkasan/subtotal segera berubah sesuai pilihan tanpa reload; subtotal pilihan menjadi Rp150.000. |
| Uji quantity 0, 1.5, dan -1 satu per satu | Setiap nilai ditolak dengan pesan bahwa jumlah harus berupa bilangan bulat positif; tidak ada tambahan ke cart. |
| Keranjang kosong, coba quantity 11 | Pilihan ditolak; pesan menunjukkan sisa stok 10. |
| Tambahkan ukuran S x2, lalu coba tambah quantity 9 | Pilihan ditolak karena cart sudah berisi 2; pesan menunjukkan sisa stok 8. Mengulangi pemeriksaan setelah cart penuh harus menunjukkan sisa 0. |
| Pilih ukuran S x2, lalu klik **Tambah ke Keranjang** | Feedback sukses berwarna hijau dan cart count menjadi 2. Halaman tidak reload. |
| Tambahkan ukuran M x1 setelah S x2 | Cart count menjadi 3. S dan M tersimpan sebagai baris variasi terpisah. |
| Klik tombol **Keranjang** | Drawer dari kanan menampilkan thumbnail, nama produk, ukuran, jumlah, subtotal per ukuran, dan total Rp450.000 untuk S x2 + M x1. |
| Keranjang sudah terisi ukuran S sejumlah 5 unit. Klik Keranjang; Tutup popup lewat tombol ×; Klik keranjang Kembali. | Isi Keranjang tidak hilang setelah pop up di tutup. |
| Pilih S, M, dan L secara bergantian | Bulatan yang terpilih hijau dengan huruf putih; bulatan sebelumnya tidak lagi aktif. |
| Reload setelah ada item dalam cart | Cart kembali 0 dan drawer kembali kosong. Ini menegaskan cart hanya disimpan di memori halaman. |

## Batasan

- Data produk dan stok pada halaman ini hardcoded dan hanya untuk demonstrasi.
- Stok hanya tersedia sebagai stok total, bukan per ukuran.
- Cart hanya bertahan selama dokumen halaman terbuka; reload akan mengosongkannya.
- Tidak ada endpoint API yang dipanggil oleh halaman ini untuk memuat detail produk.
- Tidak ada checkout, pemrosesan pembayaran, sinkronisasi lintas halaman, atau penyimpanan cart ke database.