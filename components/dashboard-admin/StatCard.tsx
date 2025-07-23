import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  Icon: LucideIcon;
  title: string;
  value: number | string;
  iconColor?: string;
}

export default function StatCard({
  Icon,
  title,
  value,
  iconColor = 'text-red-500',
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6">
      <div className={`p-3 rounded-full bg-red-100 ${iconColor}`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-gray-500 text-lg">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}