export interface UserAddressRequest {
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
}
