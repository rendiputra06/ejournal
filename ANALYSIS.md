# Analisis & Review Transformasi Multi-Journal

## 1. Pendahuluan
Proyek ini saat ini dirancang sebagai sistem jurnal tunggal (Single Journal System). Fokus utamanya adalah pengelolaan naskah (manuscript), peninjauan (peer-review), dan publikasi untuk satu entitas jurnal.

## 2. Arsitektur Saat Ini
*   **Framework**: Laravel 11 dengan Inertia.js (React + TypeScript).
*   **Basis Data**: Menggunakan tabel `settingapp` sebagai penyimpan konfigurasi global jurnal (nama, logo, deskripsi).
*   **Entitas Utama**: `Volume`, `Issue`, `Manuscript`, `Announcement`, dan `Visitor` bersifat global.
*   **Autentikasi & Otorisasi**: Menggunakan Spatie Laravel-Permission dengan peran (roles) global seperti `admin`, `journal-manager`, `editor`, `reviewer`, dan `author`.

## 3. Titik Hardcoding Jurnal Tunggal
Berdasarkan analisis kode, ditemukan beberapa titik yang membatasi sistem hanya untuk satu jurnal:
*   **Konfigurasi**: Penggunaan `SettingApp::first()` di hampir semua controller dan middleware untuk mengambil identitas jurnal.
*   **Query Data**: Pemanggilan `Issue::all()`, `Announcement::all()`, dsb., dilakukan tanpa filter konteks jurnal.
*   **Routing**: Route publik seperti `/archives`, `/article/{id}`, dan `/announcements` tidak memiliki prefix atau identifier jurnal.
*   **Peran Pengguna**: Pengguna memiliki peran yang berlaku di seluruh sistem. Dalam sistem multi-jurnal, seorang pengguna seharusnya bisa memiliki peran berbeda di jurnal yang berbeda (misal: Editor di Jurnal A, namun Author di Jurnal B).

## 4. Analisis Transformasi ke Multi-Journal
**Apakah bisa ditransformasikan?**
**YA**, sistem ini sangat memungkinkan untuk ditransformasikan menjadi Multi-Journal System. Laravel menyediakan fondasi yang kuat untuk implementasi multi-tenancy.

### Strategi Transformasi (Roadmap):

#### Tahap 1: Restrukturisasi Database
1.  **Buat Tabel `journals`**: Berisi kolom `id`, `name`, `slug`, `description`, `logo`, `favicon`, dsb.
2.  **Migrasi `settingapp`**: Pindahkan data dari `settingapp` ke tabel `journals`.
3.  **Relasi**: Tambahkan kolom `journal_id` pada tabel berikut:
    *   `volumes`
    *   `announcements`
    *   `email_templates`
    *   `menus`
    *   `visitors`
    *   `manuscripts` (untuk optimasi akses langsung)

#### Tahap 2: Identifikasi & Konteks Jurnal
1.  **Routing**: Gunakan slug jurnal di URL, misalnya:
    *   Laman Utama: `/` (Portal Jurnal)
    *   Jurnal Spesifik: `/j/{journal_slug}/`
    *   Arsip Jurnal: `/j/{journal_slug}/archives`
2.  **Middleware**: Buat middleware (misal: `IdentifyJournal`) yang mendeteksi jurnal berdasarkan slug di URL dan menyimpannya di context aplikasi (`app()->instance('current_journal', ...)`).

#### Tahap 3: Implementasi Scoping (Multi-tenancy)
1.  **Global Scopes**: Gunakan Laravel Global Scopes pada model agar secara otomatis menambahkan `WHERE journal_id = ?` pada setiap query.
2.  **Trait Reusable**: Buat trait `BelongsToJournal` untuk memudahkan implementasi scoping pada banyak model.

#### Tahap 4: Manajemen Peran (Scoped Roles)
1.  Aktifkan fitur **Teams** pada Spatie Laravel-Permission. Setiap Jurnal akan dianggap sebagai satu "Team".
2.  Ubah logika pengecekan role agar memeriksa role dalam konteks jurnal yang sedang diakses.

#### Tahap 5: Dashboard Admin (Super Admin)
1.  Tambahkan modul manajemen jurnal untuk Super Admin (membuat jurnal baru, mengaktifkan/menonaktifkan jurnal).
2.  Sesuaikan dashboard Journal Manager agar hanya menampilkan data milik jurnal mereka.

## 5. Kesimpulan & Rekomendasi
Sistem ini memiliki struktur yang bersih, sehingga transformasi ke multi-journal bukanlah hal yang mustahil namun memerlukan perubahan signifikan pada struktur database dan logika routing.

**Rekomendasi**: Jika proyek ini direncanakan berkembang menjadi platform jurnal (seperti OJS), transformasi ke multi-journal sebaiknya dilakukan di tahap awal sebelum volume data naskah membengkak, untuk menghindari kompleksitas migrasi data di masa depan.

## 6. Contoh Teknis Transformasi (Contoh Model Volume)

### Sebelum (Single Journal)
```php
class Volume extends Model {
    protected $fillable = ['number', 'year', 'is_active'];
}
```

### Sesudah (Multi Journal)
```php
class Volume extends Model {
    use BelongsToJournal; // Trait untuk scoping otomatis

    protected $fillable = ['journal_id', 'number', 'year', 'is_active'];

    public function journal() {
        return $this->belongsTo(Journal::class);
    }
}
```

### Trait BelongsToJournal
```php
trait BelongsToJournal {
    protected static function booted() {
        static::addGlobalScope('journal', function (Builder $builder) {
            if (app()->bound('current_journal')) {
                $builder->where('journal_id', app('current_journal')->id);
            }
        });

        static::creating(function ($model) {
            if (app()->bound('current_journal')) {
                $model->journal_id = app('current_journal')->id;
            }
        });
    }
}
```
