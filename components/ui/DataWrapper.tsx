import React from 'react';
import EmptyState from './EmptyState';
import { isEmpty } from '@/hooks/useSafeData';

type DataWrapperProps<T> = {
  data: T | null | undefined;
  loading?: boolean;
  error?: string | null;
  children: (data: T) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  emptyAction?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  className?: string;
};

const DataWrapper = <T,>({
  data,
  loading = false,
  error = null,
  children,
  emptyTitle = "No Data Available",
  emptyDescription = "There is no information to display at this time",
  emptyIcon = "📊",
  emptyAction,
  loadingComponent,
  errorComponent,
  className = ""
}: DataWrapperProps<T>) => {
  // Loading state
  if (loading) {
    return (
      <div className={className}>
        {loadingComponent || (
          <div className="space-y-4">
            <div className="h-8 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-1/2 bg-gray-200 animate-pulse rounded" />
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        {errorComponent || (
          <EmptyState
            title="Error Loading Data"
            description={error}
            icon="⚠️"
            className="border-red-200 bg-red-50"
          />
        )}
      </div>
    );
  }

  // Empty state
  if (isEmpty(data)) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon}
          action={emptyAction}
        />
      </div>
    );
  }

  // Render data
  return <div className={className}>{children(data!)}</div>;
};

export default DataWrapper;