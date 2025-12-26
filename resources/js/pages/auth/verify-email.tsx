// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft, Send } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
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
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Mail className="size-8 text-primary" />
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-sm font-medium text-green-700 flex items-center gap-2">
                    <Send className="size-4" />
                    Link verifikasi baru telah dikirim ke alamat email Anda.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-4">
                    <Button
                        disabled={processing || timer > 0}
                        className="w-full h-11 rounded-full shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Mail className="h-4 w-4 mr-2" />
                        )}
                        {timer > 0 ? `Kirim ulang dalam ${timer}d` : 'Kirim Ulang Email Verifikasi'}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground font-medium">Atau</span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        asChild
                        className="w-full h-11 rounded-full text-muted-foreground hover:text-foreground transition-all"
                    >
                        <TextLink href={route('logout')} method="post" className="flex items-center justify-center gap-2 pointer-events-auto no-underline">
                            <ArrowLeft className="size-4" />
                            Keluar dari sistem
                        </TextLink>
                    </Button>
                </div>

                <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                    Jika Anda tidak menemukan email kami, silakan periksa folder <strong>Spam</strong> atau hubungi bantuan teknis kami.
                </p>
            </form>
        </AuthLayout>
    );
}
