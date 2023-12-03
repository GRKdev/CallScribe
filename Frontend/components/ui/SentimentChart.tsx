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
import { SentimentCounts } from '@/types/conversation';

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
                label: "",
                data: [sentimentCounts.positive, sentimentCounts.negative, sentimentCounts.neutral],
                backgroundColor: [
                    'rgba(53, 235, 162, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(53, 162, 235, 0.5)',
                ],
                borderColor: [
                    'rgba(53, 235, 162, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(53, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (value: number) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    },
                },
            },
        },
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    title: () => '',
                }
            }
        }
    };

    return <Bar data={data} options={options as any} />;
};

export default SentimentChart;