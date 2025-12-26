import { usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';

export default function AppLogo() {
  const setting = usePage().props.setting as {
    nama_app?: string;
    logo?: string;
  } | null;

  const defaultAppName = 'Journal System';
  const appName = setting?.nama_app || defaultAppName;
  const logo = setting?.logo;

  return (
    <div className="flex items-center gap-3">
      {logo ? (
        <img
          src={`/storage/${logo}`}
          alt="Logo"
          className="h-9 w-9 rounded-md object-contain border bg-white p-1"
        />
      ) : (
        <div className="bg-primary text-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg shadow-sm">
          <BookOpen className="size-5" />
        </div>
      )}
      <div className="flex flex-col text-left">
        <span className="truncate font-serif font-bold text-base tracking-tight text-primary">
          {appName}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          Editorial Panel
        </span>
      </div>
    </div>
  );
}
