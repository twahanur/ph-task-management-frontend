import { Button } from "@/components/ui/button";

type Props = {
  pagination: { page: number; totalPages: number; total: number };
  onPrev: () => void;
  onNext: () => void;
};

export default function PaginationControls({
  pagination,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex justify-between items-center mt-4 px-4">
      <p className="text-sm text-gray-600">
        Page {pagination?.page} of {pagination?.totalPages} ( Total:{" "}
        {pagination?.total} )
      </p>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pagination?.page === 1}
          onClick={onPrev}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pagination?.page === pagination?.totalPages}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
