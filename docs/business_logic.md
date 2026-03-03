# Sistem Jurnal: Logika Bisnis & Alur Kerja Arsitektural

Dokumen ini memberikan tinjauan menyeluruh tentang logika bisnis, otomatisasi alur kerja, dan tanggung jawab khusus peran di dalam Sistem Jurnal. Dokumen ini berfungsi sebagai panduan bagi pemangku kepentingan sekaligus peta jalan teknis bagi pengembang.

---

## 1. Alur Kerja Publikasi Global (Pipeline)

Sistem ini dirancang dengan pipeline publikasi yang linier namun rekursif (berulang).

### Tahap 1: Pengajuan & Prasaring (Pre-screening)
- **Pengecekan Pra-pengajuan**: Sistem memvalidasi format file (PDF/DOCX), kelengkapan metadata, dan afiliasi penulis.
- **Prasaring (Desk Review)**: **Manajer Jurnal** atau **Editor-in-Chief** menilai kesesuaian naskah dengan ruang lingkup jurnal.
    - *Keputusan*: Terima untuk ditinjau atau Tolak Langsung (*Desk Reject*).

### Tahap 2: Peninjauan Sejawat (Peer Review)
- **Pemilihan Peninjau (Reviewer)**: Editor mencari peninjau berdasarkan tag keahlian dan ketersediaan.
- **Integritas Double-Blind**: Sistem secara otomatis menyembunyikan identitas penulis dari peninjau dan identitas peninjau dari penulis.
- **Kisi Skor**: Peninjau menggunakan rubrik standar (misal: Metodologi 1-5, Orisinalitas 1-5) untuk memberikan data objektif.

### Tahap 3: Keputusan Editorial & Revisi
- **Konsolidasi**: Editor meninjau semua laporan dan mengeluarkan laporan "Umpan Balik Terkonsolidasi".
- **Revisi Iteratif**: Penulis mengirimkan "Catatan Revisi" bersama dengan naskah yang diperbarui. Sistem melacak riwayat versi (R1, R2, R3).
- **Keputusan Akhir**: Naskah yang diterima akan dikunci dari pengeditan penulis lebih lanjut dan dipindahkan ke fase **Produksi**.

### Tahap 4: Produksi & Pengarsipan
- **Copyediting**: Pemolesan bahasa terakhir oleh editor teknis.
- **Galley Proofs**: Pembuatan tata letak akhir PDF/HTML.
- **Penyusunan Isu**: Artikel dikelompokkan ke dalam Volume dan Nomor (Issue).
- **Indexing & DOI**: Integrasi dengan CrossRef/ORCID untuk menetapkan pengenal persisten.

---

## 2. Logika Bisnis Berdasarkan Peran

### 2.1 Manajer Jurnal (Orkestrator Sistem)
- **Lingkup**: Mengontrol seluruh lingkungan sistem.
- **Logika**:
    - Mengelola daftar Dewan Redaksi (*Editorial Board*).
    - Mengonfigurasi **Panduan Penulisan** dan **Biaya Publikasi**.
    - Memantau kesehatan sistem dan log audit untuk kepatuhan etika.
    - Menangani siklus hidup **Pengumuman** (Draf -> Dijadwalkan -> Terbit).

### 2.2 Editor (Pengambil Keputusan)
- **Lingkup**: Mengelola naskah yang ditugaskan ke bagian mereka.
- **Logika**:
    - Menyaring "Pengajuan Baru" untuk menugaskan peninjau sejawat yang sesuai.
    - Mengesampingkan tenggat waktu peninjau jika perlu untuk menjaga kecepatan publikasi.
    - Mensintesis pendapat peninjau yang bertentangan menjadi satu keputusan yang jelas bagi penulis.

### 2.3 Peninjau/Reviewer (Penjaga Kualitas)
- **Lingkup**: Memberikan penilaian ahli atas tugas tertentu.
- **Logika**:
    - Menyatakan **Konflik Kepentingan** sebelum mengakses naskah lengkap.
    - Mengirimkan dua set komentar: satu untuk **Penulis** dan satu lagi rahasia untuk **Editor**.

### 2.4 Penulis/Author (Kontributor)
- **Lingkup**: Mengelola hasil penelitian mereka sendiri.
- **Logika**:
    - Memilih **Jenis Artikel** yang benar (Penelitian Asli, Studi Kasus, Tinjauan).
    - Melacak "Status Real-time" naskah mereka melalui dashboard.
    - Mengelola kontribusi rekan penulis dan penautan ORCID.

### 2.5 Pembaca/Reader (Konsumen)
- **Lingkup**: Interaksi publik.
- **Logika**:
    - Menggunakan **Pencarian Lanjutan** (berdasarkan DOI, Penulis, ORCID, atau kata kunci).
    - Mengunduh versi PDF dan membuat sitasi dalam berbagai format (APA, MLA, Harvard).

---

## 3. Integritas Data & Kebijakan Etika

### 3.1 Logika Double-Blind
Sistem menegakkan anonimitas dengan:
- Membersihkan metadata dari file yang diunggah.
- Menyamarkan nama pengguna dalam utas diskusi selama fase peninjauan.
- Hanya mengungkapkan identitas setelah keputusan akhir "Terima" tercapai.

### 3.2 Plagiarisme & Kemiripan
- Integrasi dengan API eksternal (Direncanakan: Turnitin/iThenticate).
- Menandai naskah dengan kemiripan >20% untuk tinjauan editorial manual.

---

## 5. Arsitektur Multi-Jurnal (Platform Consortium)

Sistem ini mendukung pengelolaan banyak jurnal secara independen dalam satu instalasi tunggal.

### 5.1 Isolasi Data Otomatis
- **Journal Scoping**: Setiap entitas data (Manuscript, Issue, Announcement, dll.) memiliki `journal_id`. 
- **Global Scope**: Sistem menggunakan `HasJournal` trait untuk menyaring query database secara otomatis. Pengguna di Jurnal A tidak akan pernah melihat data dari Jurnal B.
- **Context Switching**:
    - **Publik**: Konteks ditentukan oleh slug URL (misal: `/jurnal-teknik/...`).
    - **Admin**: Konteks ditentukan oleh sesi pengguna melalui **Journal Switcher**.

### 5.2 Peran dalam Multi-Jurnal
- **Super Admin**: Memiliki akses global untuk membuat dan mengelola seluruh jurnal di platform.
- **Editor/Reviewer/Author**: Beroperasi dalam konteks jurnal yang dipilih. Seorang pengguna dapat beralih peran antar jurnal secara dinamis menggunakan switcher di sidebar tanpa perlu login ulang.

### 5.3 Konfigurasi Terpisah
Setiap jurnal memiliki pengaturan (`SettingApp`) masing-masing, termasuk:
- Nama & Deskripsi Jurnal.
- Branding (Logo, Warna, Favicon).
- SEO & Mail Configuration.
- Tim Redaksi & Daftar Reviewer.
