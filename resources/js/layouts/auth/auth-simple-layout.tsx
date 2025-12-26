import AppLogoIcon from '@/components/app-logo-icon';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    const { props } = usePage();

    const setting = props?.setting as {
        nama_app: string;
        logo?: string;
        warna?: string;
    };

    return (
        <div className="bg-slate-50 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 font-sans">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-8">
                    {/* Logo and Header Section */}
                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href={route('home')}
                            className="flex items-center gap-3 font-medium transition-opacity hover:opacity-90"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary p-2 shadow-lg">
                                <BookOpen className="size-8 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-serif font-bold tracking-tight text-primary">
                                {setting?.nama_app || 'JournalSystem'}
                            </span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-muted-foreground text-center text-sm leading-relaxed max-w-[280px] mx-auto">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white p-8 sm:p-10 rounded-2xl border shadow-xl shadow-slate-200/50">
                        <div className="space-y-6">
                            {children}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} {setting?.nama_app || 'Journal System'}.
                            <br />
                            Academic Publishing Excellence.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}