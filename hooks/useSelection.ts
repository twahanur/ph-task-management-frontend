import { useState } from "react";

export function useSelection<T>(allItemIds: T[]) {
    const [selectedItems, setSelectedItems] = useState<T[]>([]);
    const toggleSelection = (id: T) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const allSelected = allItemIds.length > 0 &&
            allItemIds.every((id) => selectedItems.includes(id));

        if (allSelected) {
            setSelectedItems((prev) => prev.filter((id) => !allItemIds.includes(id)));
        } else {
            const newSelections = allItemIds.filter((id) => !selectedItems.includes(id));
            setSelectedItems((prev) => [...prev, ...newSelections]);
        }
    };

    const clearSelection = () => setSelectedItems([]);

    const isAllSelected = allItemIds.length > 0 &&
        allItemIds.every((id) => selectedItems.includes(id));

    return {
        selectedItems,
        setSelectedItems,
        toggleSelection,
        toggleSelectAll,
        clearSelection,
        isAllSelected,
        selectedCount: selectedItems.length,
    };
}