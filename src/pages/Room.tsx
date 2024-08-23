import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addReservation } from '../redux/roomSlice';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Alert } from '@mui/material';

const Room: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = parseInt(id || '', 10);
  const room = useSelector((state: RootState) => state.rooms.rooms.find(r => r.id === roomId));
  const dispatch = useDispatch();

  const [reservedBy, setReservedBy] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddReservation = () => {
    if (room) {
      const newFrom = new Date(from);
      const newTo = new Date(to);
      const overlap = room.reservations.some(
        (reservation) =>
          (newFrom >= new Date(reservation.from) && newFrom < new Date(reservation.to)) ||
          (newTo > new Date(reservation.from) && newTo <= new Date(reservation.to))
      );

      if (overlap) {
        setError('Selected dates overlap with an existing reservation.');
        setSuccess(null);
        return;
      }

      if (!reservedBy || !from || !to) {
        setError('Please fill in all fields.');
        setSuccess(null);
        return;
      }

      const newReservation = {
        id: Date.now(),
        roomId,
        reservedBy,
        from,
        to,
        notes,
      };

      dispatch(addReservation(newReservation));
      setReservedBy('');
      setFrom('');
      setTo('');
      setNotes('');
      setSuccess('Reservation added successfully.');
      setError(null);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Room {roomId} Details
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reserved By</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {room?.reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.reservedBy}</TableCell>
              <TableCell>{reservation.from}</TableCell>
              <TableCell>{reservation.to}</TableCell>
              <TableCell>{reservation.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h5" component="h2" gutterBottom>
        Add New Reservation
      </Typography>
      <form noValidate autoComplete="off">
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <TextField
          label="Reserved By"
          fullWidth
          margin="normal"
          value={reservedBy}
          onChange={(e) => setReservedBy(e.target.value)}
        />
        <TextField
          label="From"
          type="date"
          fullWidth
          margin="normal"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="To"
          type="date"
          fullWidth
          margin="normal"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Notes"
          fullWidth
          margin="normal"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddReservation}>
          Add Reservation
        </Button>
      </form>
    </Container>
  );
};

export default Room;
