import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Newspaper, Info, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { type SharedData } from '@/types';
import dayjs from 'dayjs';

interface Journal {
  id: number;
  name: string;
  slug: string;
  description: string;
  theme_color: string | null;
  logo: string | null;
}

interface WelcomeProps {
  journals?: Journal[];
  currentIssue?: any;
  announcements?: any[];
  stats?: any;
}

export default function Welcome({ journals, currentIssue, announcements = [], stats }: WelcomeProps) {
  const { props } = usePage<SharedData>();
  const journal = props.journal;

  // Portal View (List of Journals)
  if (journals) {
    return (
      <PublicLayout>
        <Head title="Journal Portal" />
        <header className="bg-primary text-primary-foreground py-16 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Academic Journal Portal</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl font-light">
              Explore our collection of peer-reviewed journals across various disciplines of science and technology.
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journals.map((j) => (
              <Card key={j.id} className="group hover:shadow-xl transition-all duration-300 border-none ring-1 ring-neutral-200 dark:ring-neutral-800">
                <CardHeader className="pb-4">
                  <div
                    className="w-12 h-1 mb-4 rounded-full"
                    style={{ backgroundColor: j.theme_color || '#0ea5e9' }}
                  />
                  <CardTitle className="text-2xl font-serif group-hover:text-primary transition-colors">{j.name}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">{j.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/j/${j.slug}`}>
                    <Button className="w-full justify-between group-hover:bg-primary transition-colors">
                      Enter Journal
                      <ChevronRight className="size-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </PublicLayout>
    );
  }

  // Journal Specific Welcome View
  return (
    <PublicLayout>
      <Head title={journal?.name || 'Journal'} />
      <header className="bg-primary text-primary-foreground py-16 lg:py-24 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              {journal?.name || 'Advancing Knowledge'}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 font-light leading-relaxed">
              {journal?.description || 'A premier international journal dedicated to publishing high-quality research.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/j/${journal?.slug}/author/submissions/create`}>
                <Button variant="secondary" size="lg" className="font-semibold text-primary">
                  Make a Submission
                </Button>
              </Link>
              <Link href={`/j/${journal?.slug}/current`}>
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                  Browse Current Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between border-b pb-4 mb-8">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-secondary" />
                  Current Issue
                </h2>
              </div>
              {currentIssue ? (
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                   {/* ... Simplified for brevity ... */}
                   <h3 className="text-xl font-bold">{currentIssue.title}</h3>
                   <Link href={`/j/${journal?.slug}/current`} className="text-primary mt-4 block">View Issue →</Link>
                </div>
              ) : (
                <div className="p-12 text-center border rounded-xl bg-muted/20">
                  <p className="text-muted-foreground">No current issue available.</p>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-8">
             <section className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                About
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{journal?.description}</p>
              <Link href={`/j/${journal?.slug}/about`} className="text-sm font-bold text-primary hover:underline">
                Learn more →
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </PublicLayout>
  );
}
