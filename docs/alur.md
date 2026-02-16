# Alur Pengiriman Naskah (Manuscript Submission Workflow)

Dokumen ini menjelaskan langkah-langkah naskah dari mulai dikirim oleh Penulis hingga akhirnya diterbitkan.

---

### 1. Pengiriman Naskah (Submission)
*   **Aktor**: **Penulis (Author)**
*   **Proses**: Penulis mengisi data naskah, mengunggah file, dan menentukan daftar penulis lainnya.
*   **Status Data**: `submitted` (Telah Dikirim)

### 2. Pemeriksaan Awal (Initial Screening)
*   **Aktor**: **Manajer Jurnal (Journal Manager) / Editor**
*   **Proses**: Pemeriksaan kesesuaian naskah dengan kriteria jurnal.
    *   *Keputusan*:
        *   **Decline**: Naskah langsung ditolak (`archived`).
        *   **Revision Needed**: Naskah dikembalikan ke penulis untuk diperbaiki (`draft`).
        *   **Accept for Screening**: Naskah lolos ke tahap pembagian editor.
*   **Status Data**: `screening` (Tahap Prasaring)

### 3. Penugasan Editor (Editor Assignment)
*   **Aktor**: **Manajer Jurnal (Journal Manager)**
*   **Proses**: Manajer memilih **Editor Bagian (Section Editor)** yang bertanggung jawab mengawal naskah tersebut ke tahap peer-review.
*   **Status Data**: `reviewing` (Sedang Ditinjau)

### 4. Peninjauan Mitra Bestari (Peer Review)
*   **Aktor**: **Editor Bagian (Section Editor) & Peninjau (Reviewer)**
*   **Proses**: 
    1.  Editor Bagian mengundang minimal 2 orang **Reviewer**.
    2.  Reviewer memberikan evaluasi dan rekomendasi (Terima, Revisi, atau Tolak).
*   **Status Data**: Tetap `reviewing` hingga proses review selesai.

### 5. Keputusan Akhir (Final Decision)
*   **Aktor**: **Editor**
*   **Proses**: Berdasarkan hasil review, Editor memberikan keputusan akhir.
    *   *Keputusan*:
        *   **Reject**: Naskah ditolak (`archived`).
        *   **Revision Needed**: Penulis harus memperbaiki naskah sesuai masukan reviewer.
        *   **Accept for Publication**: Naskah resmi diterima untuk diterbitkan.
*   **Status Data**: `final_decision` (Keputusan Akhir - Diterima)

### 6. Publikasi (Publication)
*   **Aktor**: **Editor / Manajer Jurnal**
*   **Proses**: Editor memasukkan naskah yang diterima ke dalam **Volume** dan **Nomor Issue** yang sedang aktif atau yang akan datang, serta menentukan DOI dan halaman.
*   **Status Data**: `published` (Sudah Terbit) - Naskah muncul di halaman publik jurnal.
