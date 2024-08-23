import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Typography } from '@mui/material';
import './FloorPlan.css';

const FloorPlan: React.FC = () => {
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const navigate = useNavigate();

  const handleRoomClick = (id: number) => {
    navigate(`/room/${id}`);
  };

  const getFillColor = (reservations: number, isHovered: boolean) => {
    if (isHovered) {
      return '#FFAB91'; 
    }
    return reservations > 0 ? '#FF6B6B' : '#4CAF50';
  };

  const getTextColor = (reservations: number) => {
    return reservations > 0 ? '#FFF' : '#000';
  };

  const roomPositions = [
    { id: 1, x: 50, y: 50, width: 200, height: 150 },
    { id: 2, x: 300, y: 50, width: 150, height: 150 },
    { id: 3, x: 700, y: 240, width: 200, height: 200 },
    { id: 4, x: 50, y: 250, width: 200, height: 150 },
    { id: 5, x: 500, y: 450, width: 400, height: 200 },
    { id: 6, x: 50, y: 450, width: 400, height: 200 },
  ];

  return (
    <div className="floor-plan-container">
      <Typography variant="h4" gutterBottom>
        Room Availability Management
      </Typography>
      <svg viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" className="floor-plan-svg">
        {roomPositions.map(({ id, x, y, width, height }) => {
          const room = rooms.find(room => room.id === id);
          const isHovered = hoveredRoom === id;
          return (
            <g
              key={id}
              onClick={() => handleRoomClick(id)}
              onMouseEnter={() => setHoveredRoom(id)}
              onMouseLeave={() => setHoveredRoom(null)}
              transform={`translate(${x}, ${y})`}
              style={{ transition: 'transform 0.3s ease' }}
            >
              <rect
                width={width}
                height={height}
                fill={getFillColor(room?.reservations.length || 0, isHovered)}
                style={{ transition: 'fill 0.3s ease' }}
              />
              <text
                x={width / 2}
                y={height / 2}
                fontSize="20"
                fontWeight="bold"
                fill={getTextColor(room?.reservations.length || 0)}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                Room {id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FloorPlan;
