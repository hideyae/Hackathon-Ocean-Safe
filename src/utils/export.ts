import { ActivityCondition } from '../types';

export const exportToCSV = (condition: ActivityCondition): void => {
  const headers = ['Metric', 'Value', 'Status', 'Recommendation'];

  const rows = [
    ['Activity', condition.activity, '', ''],
    ['Location', condition.location, '', ''],
    ['Date', condition.date, '', ''],
    ['Overall Score', condition.score.toString(), condition.overall, ''],
    ['', '', '', ''],
    ['Ocean Variables', '', '', ''],
    ...condition.variables.map(v => [
      v.name,
      `${v.value} ${v.unit}`,
      v.statusText,
      v.recommendation
    ]),
    ['', '', '', ''],
    ['Safety Tips', '', '', ''],
    ...condition.safety.map(tip => ['', tip, '', ''])
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `ocean-conditions-${condition.activity}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
