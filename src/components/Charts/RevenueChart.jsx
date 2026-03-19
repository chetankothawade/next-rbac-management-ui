import React from "react";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

const RevenueChart = ({ months = [], values = [] }) => {
    const data = {
        labels: months,
        datasets: [
            {
                label: "Revenue",
                data: values,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                borderWidth: 2,
                borderColor: "rgba(0, 123, 255, 0.9)",
                backgroundColor: "rgba(0, 123, 255, 0.25)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        animation: {
            duration: 1500, // total animation duration (in ms)
            easing: "easeInOutQuart", // smooth easing
        },

        // Animate line drawing effect
        animations: {
            tension: {
                duration: 1500,
                easing: "easeInOutQuad",
                from: 0.1,
                to: 0.4,
                loop: false,
            },
            y: {
                duration: 1200,
                easing: "easeOutBounce",
            },
        },

        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },

        scales: {
            x: {
                ticks: { color: "#666" },
                grid: { display: false },
            },
            y: {
                ticks: { color: "#666" },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default RevenueChart;
