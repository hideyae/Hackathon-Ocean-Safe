import { Bar } from 'react-chartjs-2';

export default function ProbabilityChart({ probabilities }: { probabilities: { hot: number; cold: number } }) {
    const data = {
        labels: ['Very Hot', 'Very Cold'],
        datasets: [
            {
                label: 'Probability (%)',
                data: [probabilities.hot, probabilities.cold],
                backgroundColor: ['#f87171', '#60a5fa'],
            },
        ],
    };
    return <Bar data={data} />;
}