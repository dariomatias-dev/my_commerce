import { StatusFilter } from "@/enums/status-filter";

export interface StoreFilterDTO {
  userId: string;
  status?: StatusFilter;
}
