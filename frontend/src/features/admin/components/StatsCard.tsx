import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  isPositive?: boolean;
}

export function StatsCard({ title, value, icon, trend, isPositive }: StatsCardProps) {
  return (
    <div className="card p-6 bg-surface-2 border-border shadow-sm flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <h3 className="text-3xl font-bold text-text-primary mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-surface-3 rounded-xl text-primary">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${isPositive ? 'text-primary' : 'text-error'}`}>
            {trend}
          </span>
          <span className="text-text-muted ml-2">depuis le mois dernier</span>
        </div>
      )}
    </div>
  );
}
