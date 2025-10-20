# Url Shorter - The simple and modern way to shorten your links using n8n.

Aplikasi penyingkat URL yang cepat, bersih, dan modern. Proyek ini berfungsi sebagai antarmuka (frontend) yang dibangun menggunakan React, Vite, dan TypeScript, yang terhubung ke backend yang ditenagai oleh n8n.

## Fitur Utama

* **Penyingkat URL:** Mengubah URL yang panjang menjadi tautan pendek yang mudah dibagikan.
* **Validasi URL:** Memastikan bahwa input yang dimasukkan adalah URL yang valid (harus dimulai dengan `http://` atau `https://`).
* **Salin ke Clipboard:** Tombol sekali klik untuk menyalin URL yang sudah diperpendek ke clipboard pengguna.
* **Halaman Pengalihan (Redirect):** Halaman `/:hash` secara dinamis mengambil URL asli dari backend dan mengalihkan pengguna ke tujuan.
* **Penanganan Status:** Menampilkan status *loading*, *error* (misalnya link tidak ditemukan), dan *success* yang jelas kepada pengguna.

## Teknologi yang Digunakan

* **Frontend:** React, Vite, TypeScript
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS (dimuat via CDN)
* **Ikon:** Font Awesome (dimuat via CDN)

## Prasyarat Backend

Aplikasi frontend ini **memerlukan backend n8n** yang sudah ada dan sedang berjalan agar dapat berfungsi.

Berdasarkan `services/api.ts`, aplikasi ini dikonfigurasi untuk membuat permintaan ke endpoint berikut:

* **Base URL:** `https://api.cbm-publisher.com`
* **Shorten Endpoint (POST):** `/webhook/domain`
* **Redirect Endpoint (GET):** `/webhook/redirect`

Pastikan layanan di atas dapat diakses agar aplikasi ini dapat berfungsi dengan baik.

## Cara Menjalankan Secara Lokal

1.  **Clone repositori:**
    ```bash
    git clone [[URL_REPOSITORI_ANDA]](https://github.com/Adytm404/url-shorter-using-n8n-as-backend)
    cd url-shorter-using-n8n-as-backend
    ```

2.  **Instal dependensi:**
    Gunakan npm untuk menginstal paket-paket yang diperlukan dari `package.json`.
    ```bash
    npm install
    ```

3.  **Jalankan server pengembangan:**
    Perintah ini akan menjalankan aplikasi dalam mode pengembangan menggunakan Vite.
    ```bash
    npm run dev
    ```

    Aplikasi akan tersedia di `http://localhost:3000` (sesuai konfigurasi di `vite.config.ts`).

## Skrip yang Tersedia

Skrip berikut didefinisikan dalam `package.json`:

* `npm run dev`: Menjalankan aplikasi dalam mode pengembangan.
* `npm run build`: Mem-build aplikasi untuk produksi ke dalam folder `dist`.
* `npm run preview`: Menjalankan server lokal untuk meninjau hasil build produksi.
