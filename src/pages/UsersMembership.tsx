import { Card } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

const users: any[] = [];

export function UsersMembership() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users & Membership</h1>
          <p className="text-slate-500 mt-1">Manage global user identities and their hub access rights.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          Invite User
        </button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by email or UID..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none"
            />
          </div>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email / UID</TableHead>
              <TableHead>Membership Tier</TableHead>
              <TableHead>Cross-App Awareness</TableHead>
              <TableHead>Service Credits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{user.email}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">{user.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.tier === 'Ultimate' ? 'active' : user.tier === 'Pro' ? 'published' : 'default'}>
                      {user.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-slate-900">{user.hubs}</span>
                      <span className="text-slate-500 ml-1">/ 8 Hubs</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-600"><span className="font-medium text-slate-900">{user.tailored}</span> Tailored</span>
                      <span className="text-slate-600"><span className="font-medium text-slate-900">{user.strategy}</span> Strategy</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="active">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
