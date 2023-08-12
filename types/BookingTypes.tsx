export interface MapCoordinates {
    latitude: number;
    longitude: number;
    address: string;
  }
  
  export interface Booking {
    id: string;
    sourceCoordinates: MapCoordinates;
    destinationCoordinates: MapCoordinates;
    preferredDriver: string | null;
    driverName: string | null;
    tripRating: number | null;
    tripTier: string | null;
    cost: number | null;
    date: string;
  }
  
export type Driver = {
  online: boolean,
  approved: boolean
} | null;

export type User = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  driver: Driver,
  isDriving: boolean
} | null;
