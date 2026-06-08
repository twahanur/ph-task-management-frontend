'use client';
import useFilters from "@/hooks/useFilters";
import ButtonComponent from "./ButtonComponent";
import { ListRestart } from "lucide-react";

export default function ResetButton({ setLimit, setCurrPage }: { setLimit: (value: string) => void, setCurrPage: (value: number) => void }) {
    const { handleReset } = useFilters();

    return (
        <div>
            <ButtonComponent
                buttonName="Reset filters"
                icon={ListRestart}
                handleSubmit={() => handleReset({ setLimit, setCurrPage })}
            />
        </div>
    );
}