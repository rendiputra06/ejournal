import React, { useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_WARNA = '#181818';

interface SettingApp {
  nama_app: string;
  deskripsi: string;
  warna: string;
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
}

interface Props {
  setting: SettingApp | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Application Settings', href: '/settingsapp' },
];

export default function SettingForm({ setting }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    nama_app: setting?.nama_app || '',
    deskripsi: setting?.deskripsi || '',
    warna: setting?.warna || '#0ea5e9',
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
  });

  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  const logoPreview = useRef<string | null>(setting?.logo ? `/storage/${setting.logo}` : null);
  const faviconPreview = useRef<string | null>(setting?.favicon ? `/storage/${setting.favicon}` : null);

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
          mail_transport: data.mail_transport,
          mail_host: data.mail_host,
          mail_port: data.mail_port,
          mail_username: data.mail_username,
          mail_password: data.mail_password,
          mail_encryption: data.mail_encryption,
          mail_from_address: data.mail_from_address,
          mail_from_name: data.mail_from_name,
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
    <AppLayout breadcrumbs={breadcrumbs} title="Application Settings">
      <Head title="Application Settings" />
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Application Settings</h1>
            <p className="text-muted-foreground">Manage your journal system configuration, appearance, and communication settings.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* General Settings */}
              <div className="md:col-span-2 space-y-6">
                <Card className="shadow-sm border-sidebar-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                      General Configuration
                    </CardTitle>
                    <CardDescription>System identity and aesthetic settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama_app">Application Name</Label>
                        <Input
                          id="nama_app"
                          placeholder="e.g. International Journal of Science"
                          value={data.nama_app}
                          onChange={(e) => setData('nama_app', e.target.value)}
                          className={errors.nama_app ? 'border-destructive' : ''}
                        />
                        {errors.nama_app && <p className="text-xs text-destructive">{errors.nama_app}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deskripsi">Description</Label>
                        <Textarea
                          id="deskripsi"
                          placeholder="Brief description of the journal..."
                          value={data.deskripsi}
                          onChange={(e) => setData('deskripsi', e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="warna">Theme Color</Label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-2 border rounded-md px-3 h-10 bg-background">
                            <Input
                              id="warna"
                              type="color"
                              value={data.warna}
                              onChange={(e) => setData('warna', e.target.value)}
                              className="w-8 h-8 p-0 border-none rounded-full"
                            />
                            <span className="text-sm font-mono uppercase">{data.warna}</span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setData('warna', DEFAULT_WARNA)}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email Configuration */}
                <Card className="shadow-sm border-sidebar-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="size-4 text-primary" />
                      SMTP Configuration
                    </CardTitle>
                    <CardDescription>Set up how the system sends automated emails and notifications.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mail_host">SMTP Host</Label>
                        <Input id="mail_host" placeholder="smtp.gmail.com" value={data.mail_host} onChange={(e) => setData('mail_host', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mail_port">SMTP Port</Label>
                        <Input id="mail_port" placeholder="587" value={data.mail_port} onChange={(e) => setData('mail_port', e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mail_username">Username</Label>
                        <Input id="mail_username" placeholder="your-email@gmail.com" value={data.mail_username} onChange={(e) => setData('mail_username', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mail_password">Password / App Password</Label>
                        <Input id="mail_password" type="password" placeholder="••••••••••••" value={data.mail_password} onChange={(e) => setData('mail_password', e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mail_encryption">Encryption</Label>
                        <Input id="mail_encryption" placeholder="tls / ssl" value={data.mail_encryption} onChange={(e) => setData('mail_encryption', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mail_from_address">From Address</Label>
                        <Input id="mail_from_address" placeholder="noreply@journal.com" value={data.mail_from_address} onChange={(e) => setData('mail_from_address', e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mail_from_name">From Name</Label>
                      <Input id="mail_from_name" placeholder="Journal Notification System" value={data.mail_from_name} onChange={(e) => setData('mail_from_name', e.target.value)} />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4 p-4 rounded-xl border bg-muted/10 border-dashed border-primary/20">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Send className="size-3.5 text-primary" />
                          Test SMTP Connection
                        </h4>
                        <p className="text-[11px] text-muted-foreground">Send a test email to verify your settings before saving.</p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="Recipient email address"
                          className="bg-background flex-1 h-9 text-sm"
                        />
                        <Button
                          type="button"
                          onClick={handleTestMail}
                          disabled={testing || !data.mail_host}
                          className="h-9 gap-1.5 shadow-lg shadow-primary/10"
                        >
                          {testing ? 'Sending...' : 'Send Test'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Settings (Logo, Favicon, SEO) */}
              <div className="space-y-6">
                {/* Asset Upload */}
                <Card className="shadow-sm border-sidebar-border/50">
                  <CardHeader className="bg-muted/30 pb-3">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Visual Assets</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs uppercase font-bold text-muted-foreground/60">System Logo</Label>
                      <div
                        className="relative aspect-video rounded-xl border-2 border-dashed border-muted flex items-center justify-center bg-muted/5 group cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                        onClick={() => document.getElementById('logo')?.click()}
                      >
                        {logoPreview.current ? (
                          <img src={logoPreview.current} alt="Logo" className="max-h-full max-w-full object-contain p-4" />
                        ) : (
                          <span className="text-xs text-muted-foreground">Click to upload logo</span>
                        )}
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-xs font-bold bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">Change Logo</span>
                        </div>
                      </div>
                      <Input id="logo" type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setData('logo', file);
                        if (file) logoPreview.current = URL.createObjectURL(file);
                      }} />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs uppercase font-bold text-muted-foreground/60">Favicon</Label>
                      <div className="flex items-center gap-4">
                        <div
                          className="size-12 rounded-lg border-2 border-dashed border-muted flex items-center justify-center bg-muted/5 cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => document.getElementById('favicon')?.click()}
                        >
                          {faviconPreview.current ? (
                            <img src={faviconPreview.current} alt="Favicon" className="size-8" />
                          ) : (
                            <span className="text-[10px] text-muted-foreground">ICO</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground max-w-[120px]">Upload a square image (32x32px or 64x64px recommended).</p>
                      </div>
                      <Input id="favicon" type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setData('favicon', file);
                        if (file) faviconPreview.current = URL.createObjectURL(file);
                      }} />
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Card */}
                <Card className="shadow-sm border-sidebar-border/50">
                  <CardHeader className="bg-muted/30 pb-3">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">SEO Indexing</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seo_title" className="text-xs">Search Title</Label>
                      <Input id="seo_title" value={data.seo.title} onChange={(e) => setData('seo', { ...data.seo, title: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo_description" className="text-xs">Search Description</Label>
                      <Textarea id="seo_description" value={data.seo.description} onChange={(e) => setData('seo', { ...data.seo, description: e.target.value })} className="min-h-[80px] text-xs" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-sidebar-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                Last updated: {setting ? new Date(setting.logo ? setting.logo === 'logo/dummy' ? Date.now() : Date.now() : Date.now()).toLocaleDateString() : 'Never'}
              </div>
              <Button type="submit" disabled={processing} className="px-10 h-11 rounded-full shadow-xl shadow-primary/20">
                {processing ? 'Saving Changes...' : 'Save All Settings'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}