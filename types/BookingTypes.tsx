export interface MapCoordinates {
    latitude: number;
    longitude: number;
    address: string;
  }
  
  export interface Booking {
    id: string;
    sourceCoordinates: MapCoordinates;
    destinationCoordinates: MapCoordinates;
    driverName: string;
    tripRating: number;
    cost: number;
    date: string;
  }
  
  
export type User = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string
} | null;
