import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Calendar } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AttendanceData {
  months: string[];
  attendance: number[];
}

interface ChartAttendanceProps {
  data: AttendanceData;
  variant?: 'student' | 'admin';
}

const ChartAttendance = ({ data, variant = 'student' }: ChartAttendanceProps) => {
  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Attendance %',
        data: data.attendance,
        borderColor: variant === 'student' ? 'hsl(var(--student-primary))' : 'hsl(var(--admin-primary))',
        backgroundColor: variant === 'student' ? 'hsl(var(--student-primary) / 0.1)' : 'hsl(var(--admin-primary) / 0.1)',
        borderWidth: 3,
        pointBackgroundColor: variant === 'student' ? 'hsl(var(--student-primary))' : 'hsl(var(--admin-primary))',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: variant === 'student' ? 'hsl(var(--student-primary))' : 'hsl(var(--admin-primary))',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Attendance: ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 12,
          },
        },
      },
      y: {
        min: 70,
        max: 100,
        grid: {
          color: 'hsl(var(--border))',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 12,
          },
          callback: (value: any) => `${value}%`,
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: variant === 'student' ? 'hsl(var(--student-secondary))' : 'hsl(var(--admin-secondary))',
      },
    },
  };

  const averageAttendance = Math.round(data.attendance.reduce((a, b) => a + b, 0) / data.attendance.length);
  const trend = data.attendance[data.attendance.length - 1] - data.attendance[0];

  return (
    <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className={`h-5 w-5 ${variant === 'student' ? 'text-student' : 'text-admin'}`} />
            <span>Attendance Trend</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{averageAttendance}%</p>
            <p className="text-sm text-muted-foreground">Average</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <Line data={chartData} options={options} />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
            <span>{trend >= 0 ? '↗' : '↘'}</span>
            <span>{Math.abs(trend)}% {trend >= 0 ? 'improvement' : 'decline'} this period</span>
          </div>
          <div className="text-muted-foreground">
            Last 8 months
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartAttendance;