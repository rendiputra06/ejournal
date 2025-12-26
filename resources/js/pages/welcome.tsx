import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { BookOpen, Newspaper, FileText, Users, ArrowRight, Search, Mail, Twitter, Linkedin, Github, LogIn, UserPlus, Info } from 'lucide-react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Journal System" />
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
                  <span className="text-xl font-serif font-bold tracking-tight text-primary">JournalSystem</span>
                </Link>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                  <Link href="#" className="hover:text-primary transition-colors">Current</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Archives</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Announcements</Link>
                  <Link href="#" className="hover:text-primary transition-colors">About</Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search articles..."
                    className="pl-9 pr-4 py-2 border rounded-full bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 lg:w-64 transition-all"
                  />
                </div>
                {auth.user ? (
                  <Link href="/dashboard">
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

        {/* Hero Section */}
        <header className="bg-primary text-primary-foreground py-16 lg:py-24 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                Advancing Knowledge Through Open Academic Exchange
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 font-light leading-relaxed">
                A premier international journal dedicated to publishing high-quality research,
                fostering innovation, and providing a platform for scholars worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="lg" className="font-semibold text-primary">
                  Make a Submission
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                  Browse Current Issue
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left/Middle Column (Main Content) */}
            <div className="lg:col-span-2 space-y-12">

              {/* Current Issue Section */}
              <section>
                <div className="flex items-center justify-between border-b pb-4 mb-8">
                  <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-secondary" />
                    Current Issue
                  </h2>
                  <span className="text-sm text-muted-foreground font-medium">Vol 12 No 4 (2025)</span>
                </div>

                <div className="bg-card rounded-xl border p-6 flex flex-col md:flex-row gap-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-full md:w-1/3 aspect-[3/4] bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
                    <div className="text-center p-6 space-y-4">
                      <div className="w-12 h-1 bg-secondary mx-auto"></div>
                      <p className="font-serif font-bold text-lg">Journal of Applied Sciences</p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Volume 12 • Issue 4</p>
                    </div>
                  </div>
                  <div className="flex-grow space-y-4">
                    <h3 className="text-xl font-bold hover:text-secondary cursor-pointer transition-colors">
                      Emerging Trends in Sustainable Urban Development
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 italic">
                      This issue explores new paradigms in urban planning, focusing on sustainability,
                      renewable energy integration in smart cities, and the socio-economic impacts
                      of rapid urbanization in developing regions.
                    </p>
                    <div className="pt-4 border-t flex items-center justify-between">
                      <span className="text-sm font-medium">Published: Dec 20, 2025</span>
                      <Button variant="link" className="text-secondary p-0" asChild>
                        <Link href={route('journal.current')}>View Full Issue →</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Announcements Section */}
              <section>
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                    <Newspaper className="w-6 h-6 text-secondary" />
                    Announcements
                  </h2>
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <Link href={route('journal.announcements')}>View All</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="group border-b last:border-0 pb-4">
                      <p className="text-xs text-muted-foreground mb-1">Dec {15 + i}, 2025</p>
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors cursor-pointer capitalize">
                        Call for Papers: Special Issue on Digital Transformation
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        Authors are invited to submit their original research for our upcoming special issue.
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column (Sidebar) */}
            <aside className="space-y-8">
              <section className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  About the Journal
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  The Journal System is a peer-reviewed open access journal. We provide immediate
                  open access to its content on the principle that making research freely available
                  to the public supports a greater global exchange of knowledge.
                </p>
                <Link href="#" className="text-sm font-bold text-primary hover:underline">
                  Learn more about our mission →
                </Link>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Information For</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Authors', 'Reviewers', 'Librarians', 'Readers'].map((role) => (
                    <Button key={role} variant="outline" className="justify-start font-medium bg-white">
                      For {role}
                    </Button>
                  ))}
                </div>
              </section>

              <section className="p-6 border rounded-xl bg-slate-50">
                <h4 className="font-bold mb-2">ISSN Online</h4>
                <p className="text-xl font-mono text-primary tracking-widest">2407-1234</p>
              </section>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center gap-2 text-white">
                  <BookOpen className="w-8 h-8" />
                  <span className="text-2xl font-serif font-bold">JournalSystem</span>
                </div>
                <p className="max-w-md text-sm leading-relaxed">
                  Empowering societies through high-quality research and open knowledge dissemination.
                  An official publication of the Academic Research Institute.
                </p>
              </div>
              <div className="space-y-4">
                <h5 className="text-white font-bold">Quick Links</h5>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-white transition-colors">Editorial Team</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Reviewer Guidelines</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Publication Ethics</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-white font-bold">Connect</h5>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Twitter (X)</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">ResearchGate</a></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
              <p>© 2025 Journal System. All rights reserved.</p>
              <p>Powered by Open Journal System (OJS) Design Principles</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}