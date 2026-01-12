"use client";

import { Filter } from "lucide-react";

import { Dropdown } from "@/components/dropdown";
import { StatusFilter } from "@/enums/status-filter";

interface StatusDropdownFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const StatusDropdownFilter = ({
  value,
  onChange,
  className = "w-full lg:w-64",
}: StatusDropdownFilterProps) => {
  const statusOptions = [
    { id: StatusFilter.ALL, name: "Todos os Status" },
    { id: StatusFilter.ACTIVE, name: "Ativos" },
    { id: StatusFilter.DELETED, name: "Removidos" },
  ];

  return (
    <Dropdown
      icon={Filter}
      options={statusOptions}
      value={value}
      onChange={onChange}
      placeholder="Filtrar Status"
      className={className}
    />
  );
};
