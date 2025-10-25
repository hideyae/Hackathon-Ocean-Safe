import { ActivityType } from '../types';
import { getActivityIcon, getActivityColor } from '../utils/oceanData';
import * as Icons from 'lucide-react';

interface ActivityCardProps {
  activity: ActivityType;
  selected: boolean;
  onClick: () => void;
}

export const ActivityCard = ({ activity, selected, onClick }: ActivityCardProps) => {
  const iconName = getActivityIcon(activity);
  const Icon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1) as keyof typeof Icons] as any;
  const colorClass = getActivityColor(activity);

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl p-6 transition-all duration-300
        ${selected
          ? `bg-gradient-to-br ${colorClass} text-white shadow-lg scale-105`
          : 'bg-white text-gray-700 hover:shadow-md hover:scale-102 border-2 border-gray-200'
        }
      `}
    >
      <div className="flex flex-col items-center gap-3">
        {Icon && <Icon className="w-8 h-8" />}
        <span className="font-semibold capitalize text-sm">
          {activity}
        </span>
      </div>
      {selected && (
        <div className="absolute top-2 right-2">
          <Icons.Check className="w-5 h-5" />
        </div>
      )}
    </button>
  );
};
