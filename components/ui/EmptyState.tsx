import React from "react";
import { Card, CardContent } from "./card";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
  className?: string;
};

const EmptyState = ({ 
  title = "No Data Available", 
  description = "There is no information to display at this time",
  icon = "📊",
  action,
  className = ""
}: EmptyStateProps) => {
  return (
    <Card className={`flex items-center justify-center py-12 effect ${className}`}>
      <CardContent className="text-center space-y-4">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
        </div>
        {action && (
          <div className="pt-2">
            {action}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;