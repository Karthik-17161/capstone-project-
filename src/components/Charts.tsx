import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  BarElement,
);

const grid = "rgba(255,255,255,0.06)";
const text = "rgba(255,255,255,0.6)";

export function DetectionsLine({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Detections",
            data: values,
            borderColor: "#7CB342",
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return "rgba(124,179,66,0.2)";
              const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              g.addColorStop(0, "rgba(124,179,66,0.45)");
              g.addColorStop(1, "rgba(124,179,66,0)");
              return g;
            },
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: "#7CB342",
            pointBorderColor: "#081C15",
            pointBorderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: grid }, ticks: { color: text, font: { size: 11 } } },
          y: {
            grid: { color: grid },
            ticks: { color: text, font: { size: 11 } },
            beginAtZero: true,
          },
        },
      }}
    />
  );
}

export function PestPie({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <Doughnut
      data={{
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ["#7CB342", "#2E7D32", "#FF9800", "#4FC3F7", "#e57373"],
            borderColor: "#0f2a1d",
            borderWidth: 3,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: text, font: { size: 11 }, boxWidth: 10, padding: 12 },
          },
        },
      }}
    />
  );
}
