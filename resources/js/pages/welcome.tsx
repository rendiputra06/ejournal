import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BookOpen, Newspaper, Info } from 'lucide-react';
import dayjs from 'dayjs';
import PublicLayout from '@/layouts/public-layout';
import { type SharedData } from '@/types';

interface Issue {
  id: number;
  volume_id: number;
  number: number;
  title: string;
  year: number;
  month: string;
  status: string;
  manuscripts?: {
    id: number;
    title: string;
    abstract: string;
    authors: { name: string }[];
  }[];
}

interface Announcement {
  id: number;
  title: string;
  slug: string;
  content: string;
  published_at: string;
}

interface WelcomeProps {
  currentIssue?: Issue;
  announcements: Announcement[];
  stats?: {
    totalArticles: number;
    totalAuthors: number;
    totalVisitors: number;
  };
}

export default function Welcome({ currentIssue, announcements, stats }: WelcomeProps) {
  const { props } = usePage<SharedData>();
  const setting = props.setting as any;

  return (
    <PublicLayout>
      <Head>
        <title>{setting?.nama_app || 'Journal System'}</title>
        {setting?.seo?.description && <meta name="description" content={setting.seo.description} />}
        {setting?.seo?.keywords && <meta name="keywords" content={setting.seo.keywords} />}
      </Head>

      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground py-16 lg:py-24 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              {setting?.nama_app || 'Advancing Knowledge Through Open Academic Exchange'}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 font-light leading-relaxed">
              {setting?.deskripsi || 'A premier international journal dedicated to publishing high-quality research, fostering innovation, and providing a platform for scholars worldwide.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={route('author.submissions.create')}>
                <Button variant="secondary" size="lg" className="font-semibold text-primary">
                  Make a Submission
                </Button>
              </Link>
              <Link href={route('journal.current')}>
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                  Browse Current Issue
                </Button>
              </Link>
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
                {currentIssue && (
                  <span className="text-sm text-muted-foreground font-medium">
                    Vol {currentIssue.volume_id} No {currentIssue.number} ({currentIssue.year})
                  </span>
                )}
              </div>

              {currentIssue ? (
                <div className="bg-card rounded-xl border p-6 flex flex-col md:flex-row gap-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-full md:w-1/3 aspect-[3/4] bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
                    <div className="text-center p-6 space-y-4">
                      <div className="w-12 h-1 bg-secondary mx-auto"></div>
                      <p className="font-serif font-bold text-lg">{setting?.nama_app || 'Journal of Applied Sciences'}</p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Volume {currentIssue.volume_id} • Issue {currentIssue.number}</p>
                    </div>
                  </div>
                  <div className="flex-grow space-y-4">
                    {currentIssue.manuscripts && currentIssue.manuscripts.length > 0 ? (
                      <>
                        <h3 className="text-xl font-bold hover:text-secondary cursor-pointer transition-colors">
                          {currentIssue.manuscripts[0].title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 italic">
                          {currentIssue.manuscripts[0].abstract}
                        </p>
                        <div className="pt-4 border-t flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Authors: {currentIssue.manuscripts[0].authors.map(a => a.name).join(', ')}
                          </span>
                          <Button variant="link" className="text-secondary p-0" asChild>
                            <Link href={route('journal.current')}>View Full Issue →</Link>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col h-full justify-center">
                        <p className="text-muted-foreground italic">No articles in this issue yet.</p>
                        <Button variant="link" className="text-secondary p-0 mt-4 justify-start" asChild>
                          <Link href={route('journal.current')}>View Details →</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center border rounded-xl bg-muted/20">
                  <p className="text-muted-foreground">No current issue available.</p>
                </div>
              )}
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
                {announcements.length > 0 ? (
                  announcements.map((item) => (
                    <div key={item.id} className="group border-b last:border-0 pb-4">
                      <p className="text-xs text-muted-foreground mb-1">{dayjs(item.published_at).format('MMM D, YYYY')}</p>
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors cursor-pointer capitalize">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No announcements at this time.</p>
                )}
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
                {setting?.deskripsi || `${setting?.nama_app || 'The Journal System'} is a peer-reviewed open access journal. We provide immediate open access to its content on the principle that making research freely available to the public supports a greater global exchange of knowledge.`}
              </p>
              <Link href={route('journal.about')} className="text-sm font-bold text-primary hover:underline">
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
              <h4 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-widest">Statistics</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-serif font-bold text-primary">{stats?.totalArticles ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Articles Published</p>
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-primary">{stats?.totalAuthors ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Registered Authors</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-2xl font-serif font-bold text-primary">{stats?.totalVisitors ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Visitors</p>
                </div>
              </div>
            </section>

            <section className="p-6 border rounded-xl bg-slate-50">
              <h4 className="font-bold mb-2">ISSN Online</h4>
              <p className="text-xl font-mono text-primary tracking-widest">2407-1234</p>
            </section>
          </aside>
        </div>
      </main>
    </PublicLayout>
  );
}