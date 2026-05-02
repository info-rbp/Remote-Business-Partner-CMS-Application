import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Megaphone } from 'lucide-react';

const hubs: any[] = [];

export function CampaignsSEO() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns & SEO</h1>
          <p className="text-slate-500 mt-1">Manage marketing banners and SEO meta-tags across all 8 hubs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Megaphone className="w-5 h-5 mr-2 text-blue-500" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <Megaphone className="w-10 h-10 mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">No Active Campaigns</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Global SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Default Meta Title Suffix</label>
              <input type="text" defaultValue=" | RBP Hub" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Global Fallback Image</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                <span className="text-sm text-slate-500">Upload open-graph image</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Hub SEO Overview</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hub Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SEO Score</TableHead>
              <TableHead className="w-[120px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hubs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  No hubs found.
                </TableCell>
              </TableRow>
            ) : (
              hubs.map((hub) => (
                <TableRow key={hub.id}>
                  <TableCell className="font-medium text-slate-900">{hub.name}</TableCell>
                  <TableCell>
                    <Badge variant={hub.status as 'active' | 'draft' | 'published'}>
                      {hub.status.charAt(0).toUpperCase() + hub.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${hub.seoScore > 90 ? 'bg-emerald-500' : hub.seoScore > 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${hub.seoScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{hub.seoScore}/100</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Modify</button>
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
