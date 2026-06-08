"use client";
import { debounce } from "@/utills/debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export default function useFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [show, setShow] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);

    // Create debounced search function once
    const debouncedSearch = useRef(
        debounce((params: URLSearchParams, pathname: string) => {
            router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
            });
        }, 500)
    ).current;

    const handleChange = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "all" || value === "") {
            params.delete(name);
        } else {
            params.set(name, value);

            if (name !== "page") {
                params.set("page", "1");
                setCurrentPage(1);
            }
        }

        // Use debounce only for search
        if (name === "search") {
            debouncedSearch(params, pathname);
        } else {
            router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
            });
        }
    }, [searchParams, pathname, router, debouncedSearch]);

    const handleMultiChange = useCallback((updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        
        Object.entries(updates).forEach(([name, value]) => {
            if (value === "all" || value === "") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
        });

        setCurrentPage(1);
        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    }, [searchParams, pathname, router]);

    const getParam = (name: string): string | null => {
        return searchParams.get(name);
    };

    const getAllParams = (): Record<string, string> => {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    };

    // Reset function - sob URL params clear kore
    const handleReset = async ({ setLimit, setCurrPage }: { setLimit: (value: string) => void, setCurrPage: (value: number) => void }) => {
        router.push(`${pathname}`, { scroll: false });
        setLimit("10");
        setCurrPage(1);
    };

    return {
        handleChange,
        handleMultiChange,
        getParam,
        getAllParams,
        searchParams,
        handleReset,
        show,
        setShow,
        currentPage,
        setCurrentPage,
    };
}