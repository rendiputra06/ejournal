# Panduan Pengujian SMTP

Panduan ini menyediakan dua metode untuk memverifikasi konfigurasi SMTP Anda di dalam Sistem Jurnal.

## 1. Konfigurasi & Penyimpanan Pengaturan SMTP

Sebelum melakukan pengujian, Anda harus menyimpan pengaturan SMTP ke dalam sistem. Sistem menggunakan database untuk menyimpan konfigurasi ini, bukan file `.env`, sehingga perubahan dapat dilakukan tanpa merestart server.

1.  **Akses Menu Pengaturan**: Masuk sebagai administrator dan navigasikan ke **Settings > App Settings**.
2.  **Temukan Bagian Web & Mail**: Cari tab atau kartu pengaturan yang bertuliskan **SMTP & Mail Server**.
3.  **Isi Detail Kredensial**:
    - **Mail Host**: Alamat server (contoh: `smtp.googlemail.com`).
    - **Mail Port**: `587` untuk TLS atau `465` untuk SSL.
    - **Mail Username**: Email lengkap Anda.
    - **Mail Password**: Password email atau *App Password* (wajib untuk Gmail/Outlook).
    - **Mail Encryption**: Pilih `tls` atau `ssl`.
    - **Mail From Address**: Alamat email yang akan tampil sebagai pengirim.
4.  **SIMPAN PENGATURAN**: Sangat penting untuk menekan tombol **Save Changes (Simpan Perubahan)** di bagian bawah atau atas halaman.
    > **Catatan Penting**: Pengujian di bawah ini akan menggunakan pengaturan yang **saat ini tersimpan di database**. Jika Anda baru saja mengubah isian formulir tetapi belum menyimpannya, tes mungkin akan menggunakan pengaturan yang lama.

## 2. Metode Pengujian: Antarmuka Web (Direkomendasikan)

Cara termudah untuk memvalidasi pengaturan langsung dari halaman panel admin.

1.  Pastikan Anda masih berada di halaman **Settings > App Settings**.
2.  Gulir ke bagian **Connectivity Test** (biasanya di samping atau bawah form SMTP).
3.  Masukkan alamat email tujuan penerima (email pribadi Anda).
4.  Klik tombol **Test Sync**.
5.  **Hasil**:
    - **Sukses**: Akan muncul notifikasi "Email berhasil dikirim" di pojok kanan atas.
    - **Gagal**: Akan muncul notifikasi error berwarna merah dengan kode kesalahan dari server.

## 3. Metode Pengujian: Command Line (CLI)

Gunakan metode ini jika Anda mengalami masalah yang sulit didiagnosa lewat web, atau ingin melihat log error yang lebih detail.

1.  **Buka Terminal** di root direktori proyek.
2.  **Jalankan Perintah**:
    ```bash
    php artisan mail:test email-tujuan@contoh.com
    ```
3.  **Analisa Output**:
    - **Sukses**: Terminal akan menampilkan `Success! Test email sent successfully.`
    - **Gagal**: Terminal akan menampilkan trace error lengkap (misalnya: `Connection could not be established with host...`).

## Pemecahan Masalah Umum (Troubleshooting)

| Masalah | Kemungkinan Penyebab | Solusi |
| :--- | :--- | :--- |
| **Connection Timeout** | Port Salah atau Blokir Firewall | Pastikan port `587` atau `465` tidak diblokir oleh server hosting. |
| **Authentication Failed** | Password Salah | Periksa ulang password. Jika menggunakan Gmail, Anda WAJIB menggunakan **App Password**, bukan password login biasa. |
| **Address Rejected** | Email Pengirim Tidak Valid | Pastikan "Mail From Address" sama dengan "Mail Username" Anda. |
| **Encryption Error** | Protokol Salah | Coba tukar pengaturan antara `tls` dan `ssl`. |

---
**Ingat**: Sistem jurnal ini memuat konfigurasi email secara **dinamis** dari tabel database `app_settings`. Pastikan Anda selalu menekan tombol **Simpan** setiap kali melakukan perubahan pada konfigurasi SMTP.
