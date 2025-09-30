import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'student' | 'admin' | 'default';
}

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'student':
        return 'border-student-accent bg-gradient-to-br from-student-accent to-white';
      case 'admin':
        return 'border-admin-accent bg-gradient-to-br from-admin-accent to-white';
      default:
        return 'border-accent bg-gradient-card';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'student':
        return 'text-student bg-student-accent';
      case 'admin':
        return 'text-admin bg-admin-accent';
      default:
        return 'text-primary bg-accent';
    }
  };

  return (
    <Card className={`${getVariantStyles()} transition-all duration-300 cursor-pointer`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {trend && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={`${getIconStyles()} p-3 rounded-lg`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;