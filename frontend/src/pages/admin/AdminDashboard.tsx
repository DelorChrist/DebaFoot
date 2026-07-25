import { Users, FileText, Activity } from 'lucide-react';
import { useAdminStats, useAdminReports } from '../../features/admin/hooks/useAdmin';
import { StatsCard } from '../../features/admin/components/StatsCard';
import { ReportTable } from '../../features/admin/components/ReportTable';
import { Spinner } from '../../components/atoms/Spinner';
import { useResolveReport } from '../../features/admin/hooks/useAdmin';

export function AdminDashboard() {
  const { data: stats, isLoading: isStatsLoading } = useAdminStats();
  const { data: reportsData, isLoading: isReportsLoading } = useAdminReports('PENDING', 1, 5);
  const resolveMutation = useResolveReport();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Tableau de bord</h1>
        <p className="text-text-muted">Aperçu général de l'activité sur DebaFoot.</p>
      </div>

      {isStatsLoading ? (
        <div className="flex justify-center p-8"><Spinner /></div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard 
            title="Utilisateurs totaux" 
            value={stats.totalUsers} 
            icon={<Users size={24} />} 
          />
          <StatsCard 
            title="Débats (Posts)" 
            value={stats.totalPosts} 
            icon={<FileText size={24} />} 
          />
          <StatsCard 
            title="Signalements en attente" 
            value={stats.pendingReports} 
            icon={<Activity size={24} />} 
            isPositive={stats.pendingReports === 0}
          />
        </div>
      ) : null}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Derniers signalements à traiter</h2>
        </div>
        
        {isReportsLoading ? (
          <div className="flex justify-center p-8"><Spinner /></div>
        ) : (
          <ReportTable 
            reports={reportsData?.items || []} 
            onResolve={(id, action) => resolveMutation.mutate({ reportId: id, action })}
            isLoading={resolveMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
