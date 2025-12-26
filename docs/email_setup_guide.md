# Panduan Konfigurasi Email (SMTP) - Journal System

Dokumen ini menjelaskan cara mengatur konfigurasi email agar sistem dapat mengirimkan verifikasi akun, notifikasi naskah, dan pemulihan kata sandi.

---

## 1. Persiapan Akun Google (Gmail)

Jika Anda menggunakan Gmail, sangat disarankan untuk menggunakan **App Password** demi keamanan.

### Langkah-langkah di Akun Google:
1. Buka [Google Account](https://myaccount.google.com/).
2. Pilih menu **Keamanan (Security)**.
3. Pastikan **Verifikasi 2 Langkah (2-Step Verification)** sudah aktif.
4. Cari bagian **Sandi Aplikasi (App Passwords)** di bawah Verifikasi 2 Langkah.
5. Buat nama aplikasi baru (misal: "Journal System").
6. Google akan memberikan kode 16 digit. **Simpan kode ini**, karena ini adalah sandi yang akan dimasukkan ke sistem jurnal.

---

## 2. Pengaturan di Sistem Jurnal

Buka menu **Pengaturan Aplikasi** di dashboard admin, lalu cari bagian **SMTP Configuration**.

### Detail Konfigurasi Umum:
- **SMTP Host**: `smtp.gmail.com` (untuk Gmail) atau host server mail Anda.
- **SMTP Port**: `587` (direkomendasikan untuk TLS).
- **Username**: Alamat email lengkap Anda (contoh: `admin@penerbit.com`).
- **Password**: Kode 16 digit App Password Google (tanpa spasi) atau kata sandi email Anda.
- **Encryption**: `tls` (wajib jika menggunakan port 587).
- **From Address**: Alamat email yang tampil sebagai pengirim (biasanya sama dengan Username).
- **From Name**: Nama yang tampil di kotak masuk penerima (contoh: "Admin Jurnal Informatika").

---

## 3. Pengetesan Koneksi

Sebelum menyimpan perubahan:
1. Masukkan alamat email pengetesan pada kotak **Test SMTP Connection**.
2. Klik tombol **Send Test**.
3. Jika berhasil, akan muncul notifikasi sukses dan Anda akan menerima email percobaan di kotak masuk Anda.
4. Jika gagal, periksa kembali host, port, dan sandi aplikasi Anda.

---

## 4. Troubleshooting (Masalah Umum)

- **Connection Timed Out**: Biasanya disebabkan port ditutup oleh penyedia layanan internet atau firewall server. Pastikan port 587 atau 465 dibuka.
- **Authentication Failed**: Periksa kembali username dan password (terutama App Password jika menggunakan Gmail).
- **Encryption Mismatch**: Pastikan port dan enkripsi sesuai (Port 587 -> TLS, Port 465 -> SSL).

---

> [!IMPORTANT]
> Jangan pernah memberikan kode App Password Anda kepada siapapun. Kode ini memberikan akses terbatas untuk mengirim email melalui akun Anda.
