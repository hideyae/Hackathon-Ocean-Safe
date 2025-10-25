import { OceanVariable } from '../types';
import * as Icons from 'lucide-react';

interface OceanVariableCardProps {
  variable: OceanVariable;
  onClick: () => void;
}

export const OceanVariableCard = ({ variable, onClick }: OceanVariableCardProps) => {
  const Icon = Icons[variable.icon.charAt(0).toUpperCase() + variable.icon.slice(1) as keyof typeof Icons] as any;

  const statusColors = {
    safe: 'from-emerald-500 to-teal-600',
    moderate: 'from-amber-500 to-orange-600',
    warning: 'from-orange-600 to-red-600',
    danger: 'from-red-600 to-rose-700'
  };

  const statusBgColors = {
    safe: 'bg-emerald-50 border-emerald-200',
    moderate: 'bg-amber-50 border-amber-200',
    warning: 'bg-orange-50 border-orange-200',
    danger: 'bg-red-50 border-red-200'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${statusBgColors[variable.status]} border-2 rounded-xl p-5
        hover:shadow-lg transition-all duration-300 w-full text-left
        hover:scale-102
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${statusColors[variable.status]} text-white`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        <span className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${variable.status === 'safe' ? 'bg-emerald-100 text-emerald-700' : ''}
          ${variable.status === 'moderate' ? 'bg-amber-100 text-amber-700' : ''}
          ${variable.status === 'warning' ? 'bg-orange-100 text-orange-700' : ''}
          ${variable.status === 'danger' ? 'bg-red-100 text-red-700' : ''}
        `}>
          {variable.statusText}
        </span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2 text-sm">
        {variable.name}
      </h3>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-gray-900">
          {variable.value}
        </span>
        <span className="text-sm text-gray-600">
          {variable.unit}
        </span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">
        {variable.recommendation}
      </p>
    </button>
  );
};
