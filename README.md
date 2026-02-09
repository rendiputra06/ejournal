# Journal Web (Laravel 12 + React Starter Kit)

Aplikasi web modern berbasis **Laravel 12**, **React** (Inertia.js), dan **Tailwind CSS**. Proyek ini menggunakan _starter kit_ yang dilengkapi dengan **ShadCN UI** serta paket-paket esensial dari **Spatie**.

## 🛠 Teknologi Utama

- **Framework:** Laravel 12.x
- **Frontend:** React + Inertia.js + TypeScript
- **UI Component:** ShadCN UI + Tailwind CSS
- **Authentication:** Laravel Auth
- **Utilities:**
  - `spatie/laravel-permission`: Manajemen Role & Permission
  - `spatie/laravel-medialibrary`: Manajemen Upload File/Media
  - `spatie/laravel-activitylog`: Logging Aktivitas User
  - `laravel/pail`: Real-time Logging (Dev)

---

## 📋 Prasyarat Sistem

- **PHP** >= 8.2
- **Composer** (untuk dependensi PHP)
- **Node.js** & **NPM** (untuk aset frontend)
- **Database:** MySQL (Disarankan) atau SQLite
- **Docker** (Opsional, khusus pengguna Laravel Sail)

---

## 🚀 Panduan Instalasi (Metode Standard / Lokal)

Gunakan metode ini jika Anda menjalankan PHP dan MySQL secara langsung di komputer host.

### 1. Instalasi Dependencies

```bash
# Install PHP libs
composer install

# Install JS libs
npm install
```

### 2. Konfigurasi Environment

Salin file `.env` dan sesuaikan dengan database lokal Anda:

```bash
cp .env.example .env
```

Edit file `.env` untuk koneksi database:
```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_anda
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Setup Aplikasi

Generate application key dan jalankan migrasi database:

```bash
php artisan key:generate
php artisan migrate --seed
```

### 4. Menjalankan Aplikasi

Anda dapat menggunakan script `dev` untuk menjalankan semua service (server, queue, logs, vite) secara bersamaan:

```bash
composer dev
```

Atau jalankan secara manual di terminal terpisah:
```bash
# Terminal 1: Laravel Server
php artisan serve

# Terminal 2: Vite Build Watch
npm run dev
```

Akses aplikasi di: `http://localhost:8000`

---

## 🐳 Panduan Instalasi (Metode Laravel Sail)

Gunakan metode ini untuk lingkungan pengembangan terisolasi berbasis Docker.

### 1. Persiapan Awal

Jika file `docker-compose.yml` belum ada (folder `vendor` belum terinstall), gunakan container sementara untuk menginstall dependencies:

```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs
```

### 2. Install Sail (Jika diperlukan)

Jika `docker-compose.yml` belum tersedia:

```bash
php artisan sail:install
# Pilih layanan: mysql, redis, mailpit, dll.
```

### 3. Menjalankan Sail

Jalankan container di background:

```bash
./vendor/bin/sail up -d
```

> **Tip:** Tambahkan alias agar lebih mudah: `alias sail='[ -f sail ] && bash sail || bash vendor/bin/sail'`

### 4. Setup Aplikasi via Sail

Semua perintah harus dijalankan melalui Sail:

```bash
# Setup Env & Key
cp .env.example .env
sail artisan key:generate

# Install Node Dependencies & Build
sail npm install
sail npm run dev

# Migrasi Database
sail artisan migrate --seed
```

Akses aplikasi di: `http://localhost`

---

## 📚 Catatan Tambahan

- **Docker Config Custom:** Jika terdapat folder `docker/` dengan konfigurasi kustom (selain Sail standar), silakan sesuaikan perintah Docker dengan konfigurasi tersebut.
- **Log Real-time:** Gunakan `php artisan pail` untuk melihat log error secara live.
- **Linting:** Gunakan `./vendor/bin/pint` untuk merapikan kode PHP.
