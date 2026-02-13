import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    color: 'blue' | 'indigo' | 'emerald' | 'teal' | 'amber' | 'red' | 'indigo';
    desc?: string;
}

export const StatCard = ({ label, value, icon: Icon, trend, color, desc }: StatCardProps) => {
    return (
        <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden group hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className={cn(
                        "p-3 rounded-2xl ring-1 transition-colors duration-300",
                        color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30" :
                            color === 'indigo' ? "bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-900/30" :
                                color === 'emerald' ? "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-900/30" :
                                    color === 'amber' ? "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-900/30" :
                                        color === 'red' ? "bg-red-50 text-red-600 ring-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-900/30" :
                                            "bg-teal-50 text-teal-600 ring-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:ring-teal-900/30"
                    )}>
                        <Icon className="size-6" />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                            trend === 'Safe' || trend === 'Active' || trend === 'Completed' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" :
                                "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                        )}>
                            {trend === 'Safe' ? <ShieldCheck className="size-3" /> : <Activity className="size-3" />}
                            {trend}
                        </div>
                    )}
                </div>
                <div className="mt-4 space-y-1">
                    <p className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">{value}</p>
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">{label}</p>
                    {desc && <p className="text-[10px] text-neutral-400">{desc}</p>}
                </div>
            </CardContent>
        </Card>
    );
};
