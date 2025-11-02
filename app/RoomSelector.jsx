import React, { useState, useEffect } from "react";

const RoomSelector = ({ cityCode, centerCode, onRoomSelect, selectedRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cityCode && centerCode) {
      fetchRooms();
    } else {
      setRooms([]);
    }
  }, [cityCode, centerCode]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/Centres/get-rooms-by-city&centre?cityCode=${cityCode}&centreCode=${centerCode}`
      );
      const data = await response.json();

      if (response.ok) {
        setRooms(data);
      } else {
        setError("Failed to fetch rooms");
      }
    } catch (err) {
      setError("Error fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  if (!cityCode || !centerCode) {
    return (
      <div style={{
        width: "100%",
        backgroundColor: "#FFFDE7",
        border: "2px solid #0070A9",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        color: "#0A4988",
        fontSize: "14px"
      }}>
        Enter City Code and Center Code to view available rooms
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      backgroundColor: "#FFFDE7",
      border: "2px solid #0070A9",
      borderRadius: "8px",
      padding: "20px"
    }}>
      {/* <h3 style={{
        color: "#0A4988",
        margin: "0 0 15px 0",
        fontSize: "16px",
        textAlign: "center",
        borderBottom: "2px solid #0070A9",
        paddingBottom: "8px"
      }}>
        Available Rooms : <strong>{rooms.length}</strong> room{rooms.length !== 1 ? 's' : ''} available
      </h3> */}

      {loading && (
        <div style={{
          textAlign: "center",
          color: "#0070A9",
          fontSize: "14px",
          padding: "20px"
        }}>
          Loading rooms...
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: "#FFFDD0",
          border: "2px solid #0070A9",
          borderRadius: "6px",
          padding: "15px",
          marginBottom: "15px",
          color: "#0A4988",
          textAlign: "center",
          fontSize: "14px"
        }}>
          {error}
        </div>
      )}

      {!loading && !error && rooms.length === 0 && (
        <div style={{
          textAlign: "center",
          color: "#0A4988",
          fontSize: "14px",
          padding: "20px"
        }}>
          No rooms found
        </div>
      )}

      <div style={{
        overflowX: "auto",
        paddingBottom: "10px"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
          gap: "10px",
          minWidth: "fit-content"
        }}>
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room.roomNo)}
            style={{
              backgroundColor: selectedRoom === room.roomNo ? "#0089BB" : "#FFFDD0",
              color: selectedRoom === room.roomNo ? "#FFFDD0" : "#0A4988",
              border: `2px solid ${selectedRoom === room.roomNo ? "#0070A9" : "#0089BB"}`,
              borderRadius: "8px",
              padding: "15px 10px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: selectedRoom === room.roomNo ? "0 4px 8px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60px"
            }}
            onMouseEnter={(e) => {
              if (selectedRoom !== room.roomNo) {
                e.target.style.backgroundColor = "#0089BB";
                e.target.style.color = "#FFFDD0";
                e.target.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedRoom !== room.roomNo) {
                e.target.style.backgroundColor = "#FFFDD0";
                e.target.style.color = "#0A4988";
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            <div style={{ fontSize: "18px", marginBottom: "2px" }}>
              {room.roomNo}
            </div>
            <div style={{
              fontSize: "10px",
              fontWeight: "normal",
              opacity: 0.8
            }}>
              {room.roomCapacity}
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* {rooms.length > 0 && (
        <div style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#FFFDD0",
          borderRadius: "6px",
          border: "1px solid #0070A9",
          fontSize: "12px",
          color: "#0A4988",
          textAlign: "center"
        }}>
          
        </div>
      )} */}
    </div>
  );
};

export default RoomSelector;