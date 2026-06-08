import React from "react";
import { Card, CardContent } from "./card";

type TNotAvailableProps = {
  title?: string;
  description?: string;
  icon?: string;
};

const NotAvailable = ({ 
  title = "No Data Available", 
  description = "There is no information to display at this time",
  icon = "📊"
}: TNotAvailableProps) => {
  return (
    <Card className="flex items-center justify-center py-12 effect">
      <CardContent className="text-center space-y-3">
        <div className="text-4xl mb-2">{icon}</div>
        <p className="text-lg font-semibold text-muted-foreground">{title}</p>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      </CardContent>
    </Card>
  );
};

export default NotAvailable;
