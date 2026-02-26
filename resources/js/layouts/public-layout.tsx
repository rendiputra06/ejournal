import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, LogIn, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { props } = usePage<SharedData>();
    const journal = props.journal;
    const setting = props.setting as any;
    const { auth } = props;
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() && journal) {
            router.get(route('journal.search', { journal_slug: journal.slug }), { q: searchQuery });
        }
    };

    const appName = journal?.name || setting?.nama_app || 'JournalSystem';

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            {/* Navigation Bar */}
            <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-serif font-bold tracking-tight text-primary">{appName}</span>
                            </Link>
                            {journal && (
                                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                                    <Link href={route('journal.current', { journal_slug: journal.slug })} className="hover:text-primary transition-colors">Current</Link>
                                    <Link href={route('journal.archives', { journal_slug: journal.slug })} className="hover:text-primary transition-colors">Archives</Link>
                                    <Link href={route('journal.announcements', { journal_slug: journal.slug })} className="hover:text-primary transition-colors">Announcements</Link>
                                    <Link href={route('journal.about', { journal_slug: journal.slug })} className="hover:text-primary transition-colors">About</Link>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {journal && (
                                <form onSubmit={handleSearch} className="relative hidden sm:block">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="search"
                                        placeholder="Search articles..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-2 border rounded-full bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 lg:w-64 transition-all"
                                    />
                                </form>
                            )}
                            {auth.user ? (
                                <Link href={journal ? `/j/${journal.slug}/dashboard` : "/dashboard"}>
                                    <Button variant="default" size="sm">Dashboard</Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="outline" size="sm">
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {children}

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="flex items-center gap-2 text-white">
                                <BookOpen className="w-8 h-8" />
                                <span className="text-2xl font-serif font-bold">{appName}</span>
                            </div>
                            <p className="max-w-md text-sm leading-relaxed">
                                {journal?.description || setting?.deskripsi || 'Empowering societies through high-quality research.'}
                            </p>
                        </div>
                        {journal && (
                            <div className="space-y-4">
                                <h5 className="text-white font-bold">Quick Links</h5>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href={route('journal.about', { journal_slug: journal.slug })} className="hover:text-white transition-colors">Editorial Team</Link></li>
                                    <li><Link href={route('journal.about', { journal_slug: journal.slug })} className="hover:text-white transition-colors">Reviewer Guidelines</Link></li>
                                    <li><Link href={route('journal.about', { journal_slug: journal.slug })} className="hover:text-white transition-colors">Publication Ethics</Link></li>
                                </ul>
                            </div>
                        )}
                        <div className="space-y-4">
                            <h5 className="text-white font-bold">Connect</h5>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Twitter (X)</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>© {new Date().getFullYear()} {appName}. All rights reserved.</p>
                        <p>Powered by Multi-Journal Transformation System</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
