export interface IReservation {
    id: number;
    roomId: number;
    reservedBy: string;
    to: string;  
    from: string;
    notes: string;
  }
  
  export interface IRoom {
    id: number;
    reservations: IReservation[];
  }
  