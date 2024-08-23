import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoom, IReservation } from '../types';

interface RoomState {
  rooms: IRoom[];
}

const initialState: RoomState = {
  rooms: [
    { id: 1, reservations: [] },
    { id: 2, reservations: [] },
    { id: 3, reservations: [] },
    { id: 4, reservations: [] },
    { id: 5, reservations: [] },
    { id: 6, reservations: [] },
  ],
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<IReservation>) => {
      const room = state.rooms.find((room) => room.id === action.payload.roomId);
      if (room) {
        room.reservations.push(action.payload);
      }
    },
    setRooms: (state, action: PayloadAction<IRoom[]>) => {
      state.rooms = action.payload;
    },
  },
});

export const { addReservation, setRooms } = roomSlice.actions;
export default roomSlice.reducer;
