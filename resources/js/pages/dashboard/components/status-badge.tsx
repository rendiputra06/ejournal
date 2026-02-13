import React from 'react';
import { Badge } from '@/components/ui/badge';

export const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'draft': return <Badge variant="secondary" className="bg-neutral-100 text-neutral-600">Draft</Badge>;
        case 'submitted': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Pending</Badge>;
        case 'screening': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Screening</Badge>;
        case 'reviewing': return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none">In Review</Badge>;
        case 'final_decision': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Published</Badge>;
        case 'published': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Published</Badge>;
        case 'rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Rejected</Badge>;
        case 'accepted': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Accepted</Badge>;
        case 'pending': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Pending</Badge>;
        case 'declined': return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Declined</Badge>;
        case 'completed': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Completed</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};
