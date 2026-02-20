import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ArrowRight, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifySuccess() {
    return (
        <AuthLayout
            title="Verifikasi Berhasil!"
            description="Luar biasa! Akun Anda telah berhasil diverifikasi. Sekarang Anda memiliki akses penuh ke semua fitur di dashboard."
        >
            <Head title="Email Verified Successfully" />

            <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
                    <div className="size-20 rounded-full bg-emerald-500" />
                </div>
                <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-emerald-50 relative z-10 shadow-inner">
                    <CheckCircle2 className="size-10 text-emerald-600 animate-in zoom-in duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 animate-bounce">
                    <PartyPopper className="size-6 text-amber-500" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-tight">Akun Aktif</h3>
                    <p className="text-sm text-muted-foreground px-4">
                        Selamat bergabung kembali. Mari mulai kelola manuskrip Anda hari ini.
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                            1
                        </div>
                        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Akses dashboard utama</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                            2
                        </div>
                        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Kelola profil & preferensi</p>
                    </div>
                </div>

                <Button
                    asChild
                    className="w-full h-12 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold"
                >
                    <Link href={route('dashboard')}>
                        Masuk ke Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </AuthLayout>
    );
}
