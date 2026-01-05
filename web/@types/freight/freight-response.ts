export interface FreightOption {
  type: "ECONOMICAL" | "EXPRESS";
  value: number;
  estimatedDays: number;
}

export interface FreightResponse {
  economical: FreightOption;
  express: FreightOption;
}
