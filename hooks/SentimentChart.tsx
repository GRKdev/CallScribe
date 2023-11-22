// SentimentChart.tsx
'use client'
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { SentimentCounts } from '@/types/conversation'; // Adjust the import path

// Register the components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface SentimentChartProps {
    sentimentCounts: SentimentCounts;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ sentimentCounts }) => {
    const data = {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [
            {
                label: "Sentiment",
                data: [sentimentCounts.positive, sentimentCounts.negative, sentimentCounts.neutral],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    };

    return <Bar data={data} options={options} />;
};

export default SentimentChart;