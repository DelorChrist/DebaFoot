import { formatRelativeTime } from '../../../lib/utils';
import { Button } from '../../../components/atoms/Button';
import { Badge } from '../../../components/atoms/Badge';

interface Report {
  id: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  post: {
    id: string;
    content: string;
  };
  reporter: {
    username: string;
  };
}

interface ReportTableProps {
  reports: Report[];
  onResolve: (id: string, action: 'DISMISS' | 'DELETE_POST' | 'BAN_USER') => void;
  isLoading?: boolean;
}

export function ReportTable({ reports, onResolve, isLoading }: ReportTableProps) {
  if (reports.length === 0) {
    return <div className="p-8 text-center text-text-muted bg-surface-2 rounded-lg border border-border">Aucun signalement.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface-2">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-muted uppercase bg-surface-3 border-b border-border">
          <tr>
            <th className="px-6 py-4 font-medium">Post</th>
            <th className="px-6 py-4 font-medium">Raison</th>
            <th className="px-6 py-4 font-medium">Signalé par</th>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Statut</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-surface-3/50 transition-colors">
              <td className="px-6 py-4 max-w-xs truncate" title={report.post.content}>
                {report.post.content}
              </td>
              <td className="px-6 py-4 text-error font-medium">{report.reason}</td>
              <td className="px-6 py-4">@{report.reporter.username}</td>
              <td className="px-6 py-4">{formatRelativeTime(report.createdAt)}</td>
              <td className="px-6 py-4">
                <Badge variant={report.status === 'PENDING' ? 'error' : 'primary'}>
                  {report.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                {report.status === 'PENDING' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onResolve(report.id, 'DISMISS')}
                      disabled={isLoading}
                    >
                      Ignorer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={() => onResolve(report.id, 'DELETE_POST')}
                      disabled={isLoading}
                    >
                      Supprimer Post
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
