import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { addReservation } from '../redux/roomSlice';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Snackbar, Alert, Link } from '@mui/material';

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = parseInt(id || '', 10);
  const room = useSelector((state: RootState) => state.rooms.rooms.find((r) => r.id === roomId));
  const dispatch = useDispatch();

  const [reservedBy, setReservedBy] = useState('');
  const [from_, setFrom_] = useState('');
  const [to_, setTo_] = useState('');
  const [notes, setNotes] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddReservation = () => {
    if (room) {
      setError('');

      if (new Date(from_) > new Date(to_)) {
        setError('The "To" date must be after the "From" date.');
        return;
      }

      const overlap = room.reservations.some(
        (reservation) =>
          (new Date(from_) >= new Date(reservation.from) && new Date(from_) <= new Date(reservation.to)) ||
          (new Date(to_) >= new Date(reservation.from) && new Date(to_) <= new Date(reservation.to))
      );

      if (!overlap) {
        const newReservation = {
          id: Date.now(),
          roomId,
          reservedBy,
          from: from_,
          to: to_,
          notes,
        };

        dispatch(addReservation(newReservation));
        setReservedBy('');
        setFrom_('');
        setTo_('');
        setNotes('');
        setSnackbarMessage('Reservation added !');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Selected dates overlap with an existing reservation.');
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Room {roomId} Details
      </Typography>

      <Link component={RouterLink} to="/" color="primary" sx={{ display: 'block', mb: 2 }}>
        Back to Home
      </Link>

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

      <Typography variant="h5" gutterBottom>
        Add New Reservation
      </Typography>
      <form noValidate autoComplete="off">
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
          value={from_}
          onChange={(e) => setFrom_(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!error}
          helperText={error}
        />
        <TextField
          label="To"
          type="date"
          fullWidth
          margin="normal"
          value={to_}
          onChange={(e) => setTo_(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!error}
          helperText={error}
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RoomDetails;
