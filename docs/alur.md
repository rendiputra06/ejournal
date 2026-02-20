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

---

## Audit Notifikasi Email

Berikut adalah daftar proses yang mengirimkan (atau seharusnya mengirimkan) notifikasi email:

| Tahap | Proses | Pengirim Notifikasi | Penerima | Status Saat Ini |
| :--- | :--- | :--- | :--- | :--- |
| **Submission** | Author mengirim naskah baru | `AuthorManuscriptController@store` | Penulis | [x] Sudah (`journal_submission_ack`) |
| **Submission** | Alert naskah baru masuk | `AuthorManuscriptController@store` | Editor/Manager | [x] Sudah (`journal_new_submission`) |
| **Initial Screening** | Editor menyetujui screening (`proceed`) | `EditorialManuscriptController@screening` | Penulis | [x] Sudah (`journal_screening_proceed`) |
| **Initial Screening** | Editor mengirim revisi awal (`revision`) | `EditorialManuscriptController@screening` | Penulis | [x] Sudah (`journal_decision_screening_revise`) |
| **Initial Screening** | Editor menolak di awal (`reject`) | `EditorialManuscriptController@screening` | Penulis | [x] Sudah (`journal_decision_screening_reject`) |
| **Assignment** | Manager menunjuk Section Editor | `EditorialManuscriptController@assignEditor` | Editor | [ ] Belum Ada (Akan Ditambahkan) |
| **Peer Review** | Editor mengundang Reviewer | `EditorialManuscriptController@inviteReviewer` | Reviewer | [x] Sudah (`journal_review_invitation`) |
| **Peer Review** | Reviewer mengirim hasil review | `ReviewerController@store` | Editor | [x] Sudah (`journal_review_completed`) |
| **Final Decision** | Editor memberikan keputusan akhir (Terima) | `EditorialManuscriptController@screening` | Penulis | [x] Sudah (`journal_decision_accept`) |
| **Final Decision** | Editor memberikan keputusan akhir (Tolak) | `EditorialManuscriptController@screening` | Penulis | [x] Sudah (`journal_decision_screening_reject`) |
| **Publication** | Manuscript diterbitkan | `IssueController@publishManuscript` | Penulis | [x] Sudah (`journal_published`) |
