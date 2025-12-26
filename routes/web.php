<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\UserFileController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\SettingAppController;
use App\Http\Controllers\MailTestController;
use App\Http\Controllers\MediaFolderController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public Journal Routes
Route::get('/current', function () { return Inertia::render('journal/current'); })->name('journal.current');
Route::get('/archives', function () { return Inertia::render('journal/archives'); })->name('journal.archives');
Route::get('/announcements', function () { return Inertia::render('journal/announcements'); })->name('journal.announcements');
Route::get('/about', function () { return Inertia::render('journal/about'); })->name('journal.about');

Route::middleware(['auth', 'menu.permission'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Role-specific Dashboards (Holders)
    Route::get('dashboard/manager', function () { return Inertia::render('dashboard/manager'); })->name('dashboard.manager');
    Route::get('dashboard/editor', function () { return Inertia::render('dashboard/editor'); })->name('dashboard.editor');
    Route::get('dashboard/reviewer', function () { return Inertia::render('dashboard/reviewer'); })->name('dashboard.reviewer');
    Route::get('dashboard/author', function () { return Inertia::render('dashboard/author'); })->name('dashboard.author');
    Route::get('dashboard/reader', function () { return Inertia::render('dashboard/reader'); })->name('dashboard.reader');

    Route::resource('roles', RoleController::class);
    Route::resource('menus', MenuController::class);
    Route::post('menus/reorder', [MenuController::class, 'reorder'])->name('menus.reorder');
    Route::resource('permissions', PermissionController::class);
    Route::resource('users', UserController::class);
    Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::get('/settingsapp', [SettingAppController::class, 'edit'])->name('setting.edit');
    Route::post('/settingsapp', [SettingAppController::class, 'update'])->name('setting.update');
    Route::post('/settingsapp/test-mail', [MailTestController::class, 'testConnection'])->name('setting.test-mail');
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('/backup', [BackupController::class, 'index'])->name('backup.index');
    Route::post('/backup/run', [BackupController::class, 'run'])->name('backup.run');
    Route::get('/backup/download/{file}', [BackupController::class, 'download'])->name('backup.download');
    Route::delete('/backup/delete/{file}', [BackupController::class, 'delete'])->name('backup.delete');
    Route::get('/files', [UserFileController::class, 'index'])->name('files.index');
    Route::post('/files', [UserFileController::class, 'store'])->name('files.store');
    Route::delete('/files/{id}', [UserFileController::class, 'destroy'])->name('files.destroy');
    Route::resource('media', MediaFolderController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
