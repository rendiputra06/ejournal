import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ExternalLink, Globe, Search, ArrowRight } from 'lucide-react';
import { type SharedData } from '@/types';

interface Journal {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
}

interface PortalProps {
  journals: Journal[];
}

export default function Portal({ journals }: PortalProps) {
  const { props } = usePage<SharedData>();
  const setting = props.setting as any;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Head title="Journal Portal" />
      
      {/* Header / Hero */}
      <header className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <span className="text-xl font-serif font-bold tracking-widest uppercase opacity-80">Academic Press</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Our Research Journals
            </h1>
            <p className="text-xl text-primary-foreground/80 font-light leading-relaxed mb-8">
              Explore high-quality, peer-reviewed research across multiple disciplines. 
              Our publishers provide immediate open access to support global knowledge exchange.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journals.length > 0 ? (
            journals.map((journal) => (
              <Card key={journal.id} className="border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden bg-white flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="p-8 space-y-4 flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        {journal.logo ? (
                            <img src={`/storage/${journal.logo}`} alt={journal.name} className="w-10 h-10 object-contain" />
                        ) : (
                            <BookOpen className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-slate-200">
                        {journal.slug}
                      </Badge>
                    </div>
                    
                    <h2 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                      {journal.name}
                    </h2>
                    
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {journal.description || 'Dedicated to advancing knowledge through scholarly publication and open research dissemination.'}
                    </p>
                  </div>
                  
                  <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <Globe className="size-3" />
                        /{journal.slug}
                    </div>
                    <Button asChild className="rounded-full shadow-lg shadow-primary/20 hover:translate-x-1 transition-transform">
                      <Link href={route('home', { journal: journal.slug })}>
                        Enter Journal <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed">
                <BookOpen className="mx-auto w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No journals found</h3>
                <p className="text-slate-500">The system administrator has not enabled any journals yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="font-serif font-bold text-slate-900">{setting?.nama_app || 'Journal System'}</span>
          </div>
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} All rights reserved. Powered by Antigravity Multi-Journal Core.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="/login" className="hover:text-primary">Admin Login</Link>
            <Link href="/register" className="hover:text-primary">Author Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
            {children}
        </span>
    );
}
