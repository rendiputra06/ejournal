import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Mail, Send, PlusCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { LoadingButton } from '@/components/loading-button';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';

const DEFAULT_WARNA = '#181818';

interface SettingApp {
  name: string;
  description: string;
  theme_color: string;
  logo: string;
  favicon: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  mail_transport: string;
  mail_host: string;
  mail_port: string;
  mail_username: string;
  mail_password: string;
  mail_encryption: string;
  mail_from_address: string;
  mail_from_name: string;
  guidelines: string;
}

interface Props {
  setting: SettingApp | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/dashboard' },
  { title: 'Application Settings', href: '/settingsapp' },
];

export default function SettingForm({ setting }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: setting?.name || '',
    description: setting?.description || '',
    theme_color: setting?.theme_color || '#0ea5e9',
    seo: {
      title: setting?.seo?.title || '',
      description: setting?.seo?.description || '',
      keywords: setting?.seo?.keywords || '',
    },
    logo: null as File | null,
    favicon: null as File | null,
    mail_transport: setting?.mail_transport || 'smtp',
    mail_host: setting?.mail_host || '',
    mail_port: setting?.mail_port || '587',
    mail_username: setting?.mail_username || '',
    mail_password: setting?.mail_password || '',
    mail_encryption: setting?.mail_encryption || 'tls',
    mail_from_address: setting?.mail_from_address || '',
    mail_from_name: setting?.mail_from_name || '',
    guidelines: setting?.guidelines || '',
  });

  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string | null>(setting?.logo ? `/storage/${setting.logo}` : null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(setting?.favicon ? `/storage/${setting.favicon}` : null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/settingsapp', {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => toast.success('Settings saved successfully'),
    });
  };

  const handleTestMail = async () => {
    if (!testEmail) {
      toast.error('Please enter a recipient email address');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('/settingsapp/test-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify({
          email: testEmail,
          ...data
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setTesting(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Application Settings" />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <PageHeader
            title="System Configuration"
            description="Manage your journal identity, visual assets, and communication channels."
            className="mb-8"
          />

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-8 space-y-8">
                {/* General Settings */}
                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
                  <div className="px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
                    <h3 className="font-bold tracking-tight text-neutral-900 dark:text-neutral-50 uppercase text-xs">General Identity</h3>
                  </div>
                  <CardContent className="pt-6 space-y-6 px-6 pb-8">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Journal Title</Label>
                        <Input
                          id="name"
                          placeholder="International Journal of Computing"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          className={cn("h-11", errors.name && "border-red-500")}
                        />
                        <InputError message={errors.name} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Tagline / Brief Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Exploring the future of technology and human interaction..."
                          value={data.description}
                          onChange={(e) => setData('description', e.target.value)}
                          className="min-h-[100px] resize-none"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="theme_color" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Primary Brand Color</Label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-3 border rounded-xl px-4 h-11 bg-background hover:ring-2 hover:ring-primary/10 transition-all cursor-pointer group">
                            <Input
                              id="theme_color"
                              type="color"
                              value={data.theme_color}
                              onChange={(e) => setData('theme_color', e.target.value)}
                              className="w-7 h-7 p-0 border-none rounded-full cursor-pointer shadow-sm"
                            />
                            <span className="text-sm font-mono font-medium uppercase tracking-tight text-neutral-600">{data.theme_color}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setData('theme_color', DEFAULT_WARNA)}
                            className="text-xs text-neutral-500"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email Configuration */}
                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
                  <div className="px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                    <Mail className="size-3.5 text-primary" />
                    <h3 className="font-bold tracking-tight text-neutral-900 dark:text-neutral-50 uppercase text-xs">SMTP & Mail Server</h3>
                  </div>
                  <CardContent className="pt-6 space-y-6 px-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="mail_host" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">SMTP Host</Label>
                        <Input id="mail_host" placeholder="smtp.journal.com" value={data.mail_host} onChange={(e) => setData('mail_host', e.target.value)} className="h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="mail_port" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Port</Label>
                        <Input id="mail_port" placeholder="587" value={data.mail_port} onChange={(e) => setData('mail_port', e.target.value)} className="h-11" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="mail_username" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Username</Label>
                        <Input id="mail_username" placeholder="notifications@journal.com" value={data.mail_username} onChange={(e) => setData('mail_username', e.target.value)} className="h-11" />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="mail_password" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">App Password</Label>
                          {setting?.mail_password && (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">ALREADY SET</span>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            id="mail_password"
                            type={showPassword ? "text" : "password"}
                            placeholder={setting?.mail_password ? "••••••••••••" : "Enter SMTP password"}
                            value={data.mail_password}
                            onChange={(e) => setData('mail_password', e.target.value)}
                            className="h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-400 italic">Leave blank to keep existing password.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="mail_from_address" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Sender Address</Label>
                        <Input id="mail_from_address" placeholder="noreply@journal.com" value={data.mail_from_address} onChange={(e) => setData('mail_from_address', e.target.value)} className="h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="mail_from_name" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Sender Name</Label>
                        <Input id="mail_from_name" placeholder="Journal Notifications" value={data.mail_from_name} onChange={(e) => setData('mail_from_name', e.target.value)} className="h-11" />
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 space-y-4">
                        <div className="flex flex-col gap-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            <Send className="size-3" />
                            Connectivity Test
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">Verify your mail settings by sending a test message.</p>
                        </div>
                        <div className="flex gap-3">
                          <Input
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="recipient@example.com"
                            className="bg-background flex-1 h-10 rounded-xl text-sm"
                          />
                          <Button
                            type="button"
                            onClick={handleTestMail}
                            disabled={testing || !data.mail_host}
                            className="h-10 px-6 gap-2 rounded-xl transition-all shadow-lg shadow-primary/10"
                          >
                            {testing ? 'Sending...' : 'Test Sync'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Editorial Guidelines */}
                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
                  <div className="px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                    <PlusCircle className="size-3.5 text-primary" />
                    <h3 className="font-bold tracking-tight text-neutral-900 dark:text-neutral-50 uppercase text-xs">Editorial Guidelines</h3>
                  </div>
                  <CardContent className="pt-6 space-y-6 px-6 pb-8">
                    <div className="grid gap-2">
                      <Label htmlFor="guidelines" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Submission & Author Guidelines</Label>
                      <Textarea
                        id="guidelines"
                        placeholder="Detail the requirements for authors, formatting styles, and submission processes..."
                        value={data.guidelines}
                        onChange={(e) => setData('guidelines', e.target.value)}
                        className="min-h-[300px] resize-none leading-relaxed"
                      />
                      <p className="text-[10px] text-neutral-400 italic">These guidelines will be displayed to authors during the submission process and on the public 'About' page.</p>
                      <InputError message={errors.guidelines} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Area */}
              <div className="lg:col-span-4 space-y-8">
                {/* Visual Assets */}
                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
                  <div className="px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
                    <h3 className="font-bold tracking-tight text-neutral-900 dark:text-neutral-50 uppercase text-xs">Visual Branding</h3>
                  </div>
                  <CardContent className="pt-6 space-y-8 px-6 pb-8">
                    <div className="space-y-4">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-1">Application Logo</Label>
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => document.getElementById('logo')?.click()}
                      >
                        <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center bg-neutral-50/50 dark:bg-neutral-900/30 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-900/50 group-hover:border-primary/30 transition-all overflow-hidden p-6">
                          {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain drop-shadow-sm" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-neutral-400">
                              <PlusCircle className="size-8 opacity-20" />
                              <span className="text-[10px] font-medium">Click to upload</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      </div>
                      <Input id="logo" type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setData('logo', file);
                        if (file) setLogoUrl(URL.createObjectURL(file));
                      }} />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-neutral-50 dark:border-neutral-900">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-1">Favicon (Browser Icon)</Label>
                      <div className="flex items-center gap-6">
                        <div
                          className="size-16 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center bg-neutral-50/50 dark:bg-neutral-900/30 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900/50 group transition-all"
                          onClick={() => document.getElementById('favicon')?.click()}
                        >
                          {faviconUrl ? (
                            <img src={faviconUrl} alt="Favicon" className="size-10 object-contain shadow-sm" />
                          ) : (
                            <AlertCircle className="size-6 text-neutral-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400">Upload a 32x32px .ico or .png file.</p>
                          <p className="text-[10px] font-light text-neutral-400">Used for browser tabs and favorites.</p>
                        </div>
                      </div>
                      <Input id="favicon" type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setData('favicon', file);
                        if (file) setFaviconUrl(URL.createObjectURL(file));
                      }} />
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Configuration */}
                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
                  <div className="px-6 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
                    <h3 className="font-bold tracking-tight text-neutral-900 dark:text-neutral-50 uppercase text-xs">Search Engine Optimization</h3>
                  </div>
                  <CardContent className="pt-6 space-y-4 px-6 pb-8">
                    <div className="grid gap-2">
                      <Label htmlFor="seo_title" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Meta Title</Label>
                      <Input id="seo_title" value={data.seo.title} onChange={(e) => setData('seo', { ...data.seo, title: e.target.value })} className="h-10 text-sm" />
                    </div>
                    <div className="grid gap-2 pt-2">
                      <Label htmlFor="seo_description" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Meta Description</Label>
                      <Textarea id="seo_description" value={data.seo.description} onChange={(e) => setData('seo', { ...data.seo, description: e.target.value })} className="min-h-[100px] text-xs resize-none" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="sticky bottom-8 z-10 p-4 rounded-3xl bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 pl-4">
                <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10" />
                <span className="text-xs font-medium text-neutral-500">All configurations are currently up to date</span>
              </div>
              <LoadingButton
                type="submit"
                loading={processing}
                className="px-12 h-12 rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all font-bold tracking-tight"
              >
                Save Global Settings
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}