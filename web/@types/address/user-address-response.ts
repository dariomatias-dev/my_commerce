export interface UserAddressResponse {
  id: string;
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
