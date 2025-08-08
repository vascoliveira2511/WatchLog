"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressBarProps {
  title: string;
  current: number;
  total: number;
  type: "episodes" | "seasons" | "minutes" | "hours";
  status?: "watching" | "completed" | "dropped" | "planned";
  showPercentage?: boolean;
  showNumbers?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  title,
  current,
  total,
  type,
  status,
  showPercentage = true,
  showNumbers = true,
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isComplete = current >= total;
  
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case "minutes":
        const hours = Math.floor(value / 60);
        const mins = value % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      case "hours":
        return `${value}h`;
      default:
        return value.toString();
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "watching":
        return "bg-blue-500";
      case "dropped":
        return "bg-red-500";
      case "planned":
        return "bg-gray-500";
      default:
        return "bg-primary";
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "watching":
        return "default";
      case "dropped":
        return "destructive";
      case "planned":
        return "secondary";
      default:
        return "default";
    }
  };

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h4 className={cn(
          "font-medium",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-lg"
        )}>
          {title}
        </h4>
        
        <div className="flex items-center space-x-2">
          {status && (
            <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
          
          {showPercentage && (
            <span className={cn(
              "text-gray-600 font-medium",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-base"
            )}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <Progress 
          value={percentage} 
          className={cn(sizeClasses[size])}
          // Custom color based on status
          style={{
            "--progress-background": getStatusColor(status),
          } as React.CSSProperties}
        />
        
        {showNumbers && (
          <div className="flex justify-between items-center">
            <span className={cn(
              "text-gray-500",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-base"
            )}>
              {formatValue(current, type)} of {formatValue(total, type)} {type}
            </span>
            
            {!isComplete && total > current && (
              <span className={cn(
                "text-gray-400",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base"
              )}>
                {formatValue(total - current, type)} remaining
              </span>
            )}
          </div>
        )}
      </div>
      
      {isComplete && (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-600 text-sm font-medium">
            Completed!
          </span>
        </div>
      )}
    </div>
  );
}