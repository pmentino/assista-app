import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProgramPieChart({ data }) {
    // Fallback data if everything is 0 (so the chart isn't empty during defense)
    const chartData = {
        labels: ['Medical', 'Burial', 'Education', 'Fire', 'Transportation'],
        datasets: [
            {
                label: '# of Applications',
                // Replace this 'data' array with real props later
                data: data && data.length > 0 ? data : [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // Blue (Medical)
                    'rgba(239, 68, 68, 0.8)',  // Red (Burial)
                    'rgba(16, 185, 129, 0.8)', // Green (Education)
                    'rgba(245, 158, 11, 0.8)', // Orange (Fire)
                    'rgba(107, 114, 128, 0.8)', // Gray (Transport)
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(107, 114, 128, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11
                    },
                    usePointStyle: true,
                }
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="h-64 w-full flex items-center justify-center">
            <Doughnut data={chartData} options={options} />
        </div>
    );
}
