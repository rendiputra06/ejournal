import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';

export default function VerifyEmail({ status }: { status?: string }) {
    const { flash } = usePage<SharedData>().props;
    const { post, processing } = useForm({});
    const [timer, setTimer] = useState(0);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'), {
            onSuccess: () => setTimer(60),
        });
    };

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    return (
        <AuthLayout
            title="Verifikasi Email"
            description="Langkah terakhir! Silakan periksa kotak masuk email Anda untuk melakukan verifikasi akun. Link verifikasi ini memiliki batas waktu keamanan."
        >
            <Head title="Email Verification" />

            <div className="flex justify-center mb-6">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                    <Mail className="size-8 text-primary" />
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Send className="size-4" />
                    </div>
                    <span>Link verifikasi baru telah dikirim ke alamat email Anda.</span>
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-sm font-medium text-destructive flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="size-4" />
                    </div>
                    <span>{flash.error as string}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-4">
                    <Button
                        disabled={processing || timer > 0}
                        className="w-full h-12 rounded-full shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold"
                    >
                        {processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Mail className="h-4 w-4 mr-2" />
                        )}
                        {timer > 0 ? `Kirim ulang dalam ${timer}d` : 'Kirim Ulang Email Verifikasi'}
                    </Button>

                    <div className="relative pb-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/10" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-muted-foreground/40">
                            <span className="bg-background px-3">Atau</span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        asChild
                        className="w-full h-12 rounded-full text-muted-foreground hover:text-foreground transition-all hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    >
                        <TextLink href={route('logout')} method="post" className="flex items-center justify-center gap-2 pointer-events-auto no-underline w-full h-full">
                            <ArrowLeft className="size-4" />
                            Keluar dari sistem
                        </TextLink>
                    </Button>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20">
                    <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                        Jika Anda tidak menemukan email kami, silakan periksa folder <strong>Spam</strong> atau hubungi bantuan teknis kami.
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
