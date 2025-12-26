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
use App\Http\Controllers\AuthorManuscriptController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EditorialManuscriptController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\IssueController;
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
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Role-specific Dashboards (Holders)
    Route::get('dashboard/manager', [DashboardController::class, 'manager'])->name('dashboard.manager');
    Route::get('dashboard/editor', [DashboardController::class, 'editor'])->name('dashboard.editor');
    Route::get('dashboard/reviewer', [DashboardController::class, 'reviewer'])->name('dashboard.reviewer');
    Route::get('dashboard/author', [DashboardController::class, 'author'])->name('dashboard.author');
    Route::get('dashboard/reader', function () { return Inertia::render('dashboard/reader'); })->name('dashboard.reader');

    // Editorial / Management Routes
    Route::prefix('editorial')->name('editorial.')->group(function () {
        Route::get('submissions', [EditorialManuscriptController::class, 'index'])->name('submissions.index');
        Route::get('submissions/{manuscript}', [EditorialManuscriptController::class, 'show'])->name('submissions.show');
        Route::post('submissions/{manuscript}/screening', [EditorialManuscriptController::class, 'screening'])->name('submissions.screening');
        Route::post('submissions/{manuscript}/assign-editor', [EditorialManuscriptController::class, 'assignEditor'])->name('submissions.assign-editor');
        Route::post('submissions/{manuscript}/invite-reviewer', [EditorialManuscriptController::class, 'inviteReviewer'])->name('submissions.invite-reviewer');

        // Issue Management
        Route::get('issues', [IssueController::class, 'index'])->name('issues.index');
        Route::post('volumes', [IssueController::class, 'storeVolume'])->name('volumes.store');
        Route::post('issues', [IssueController::class, 'storeIssue'])->name('issues.store');
        Route::post('submissions/{manuscript}/publish', [IssueController::class, 'publishManuscript'])->name('submissions.publish');
    });

    // Reviewer Routes
    Route::prefix('reviewer')->name('reviewer.')->group(function () {
        Route::get('assignments', [ReviewerController::class, 'index'])->name('assignments.index');
        Route::get('assignments/{assignment}', [ReviewerController::class, 'show'])->name('assignments.show');
        Route::post('assignments/{assignment}/respond', [ReviewerController::class, 'respond'])->name('assignments.respond');
        Route::post('assignments/{assignment}/submit', [ReviewerController::class, 'store'])->name('assignments.submit');
    });

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

    // Author Submission Routes
    Route::prefix('author')->name('author.')->group(function () {
        Route::get('/submissions', [AuthorManuscriptController::class, 'index'])->name('submissions.index');
        Route::get('/submissions/create', [AuthorManuscriptController::class, 'create'])->name('submissions.create');
        Route::post('/submissions', [AuthorManuscriptController::class, 'store'])->name('submissions.store');
        Route::get('/submissions/{manuscript}', [AuthorManuscriptController::class, 'show'])->name('submissions.show');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
