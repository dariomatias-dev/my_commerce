import { StatusFilter } from "@/enums/status-filter";

export interface StoreFilter {
  userId: string;
  status?: StatusFilter;
}
