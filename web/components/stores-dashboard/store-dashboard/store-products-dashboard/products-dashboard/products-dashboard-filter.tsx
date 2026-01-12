"use client";

import { AlertTriangle, DollarSign } from "lucide-react";
import { KeyboardEvent, useState } from "react";

import { ProductFilters } from "@/@types/product/product-filters";
import { FilterBooleanCard } from "@/components/filters/filter-boolean-card";
import { FilterInput } from "@/components/filters/filter-input";
import { FilterSearch } from "@/components/filters/filter-search";
import { StatusDropdownFilter } from "@/components/filters/status-dropdown-filter";

type LocalFilters = Omit<ProductFilters, "storeId">;

interface ProductsDashboardFilterProps {
  currentFilters: LocalFilters;
  onApply: (filters: LocalFilters) => void;
}

export const ProductsDashboardFilter = ({
  currentFilters,
  onApply,
}: ProductsDashboardFilterProps) => {
  const [localFilters, setLocalFilters] =
    useState<LocalFilters>(currentFilters);

  const triggerApply = (updated: LocalFilters) => {
    onApply({ ...updated, name: updated.name || undefined });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") triggerApply(localFilters);
  };

  const blockInvalidChars = (e: KeyboardEvent) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  const updateField = <K extends keyof LocalFilters>(
    field: K,
    value: LocalFilters[K]
  ) => {
    const updated = { ...localFilters, [field]: value };

    setLocalFilters(updated);
  };

  return (
    <section className="mb-10 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <FilterSearch
          value={localFilters.name || ""}
          onChange={(val) => updateField("name", val)}
          onKeyDown={handleKeyDown}
          onClear={() => {
            const updated: LocalFilters = { ...localFilters, name: "" };

            setLocalFilters(updated);

            triggerApply(updated);
          }}
        />

        <StatusDropdownFilter
          value={localFilters.status || ""}
          onChange={(val) => {
            const updated: LocalFilters = {
              ...localFilters,
              status: val as ProductFilters["status"],
            };

            setLocalFilters(updated);

            triggerApply(updated);
          }}
          className="w-full lg:w-72"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FilterBooleanCard
          icon={AlertTriangle}
          title="Estoque"
          subtitle="Nível Crítico"
          isActive={!!localFilters.lowStockThreshold}
          onClick={() => {
            const val = localFilters.lowStockThreshold ? undefined : 5;
            const updated: LocalFilters = {
              ...localFilters,
              lowStockThreshold: val,
            };

            setLocalFilters(updated);

            triggerApply(updated);
          }}
        />

        <FilterInput
          icon={DollarSign}
          label="Preço Mínimo"
          type="number"
          value={localFilters.minPrice ?? ""}
          placeholder="0.00"
          onKeyDown={(e) => {
            blockInvalidChars(e);

            handleKeyDown(e);
          }}
          onChange={(val) =>
            updateField("minPrice", val ? Number(val) : undefined)
          }
          onClear={() => {
            const updated: LocalFilters = {
              ...localFilters,
              minPrice: undefined,
            };

            setLocalFilters(updated);

            triggerApply(updated);
          }}
        />

        <FilterInput
          icon={DollarSign}
          label="Preço Máximo"
          type="number"
          value={localFilters.maxPrice ?? ""}
          placeholder="10000.00"
          onKeyDown={(e) => {
            blockInvalidChars(e);

            handleKeyDown(e);
          }}
          onChange={(val) =>
            updateField("maxPrice", val ? Number(val) : undefined)
          }
          onClear={() => {
            const updated: LocalFilters = {
              ...localFilters,
              maxPrice: undefined,
            };

            setLocalFilters(updated);

            triggerApply(updated);
          }}
        />
      </div>
    </section>
  );
};
