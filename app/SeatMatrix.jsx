import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CandidateDetailsSidebar from "./CandidateDetailsSidebar";
import RoomSelector from "./RoomSelector";

const SeatMatrix = () => {
  const [cityCode, setCityCode] = useState("");
  const [centerCode, setCenterCode] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animateGrid, setAnimateGrid] = useState(false);
  const [matrixOrientation, setMatrixOrientation] = useState("4x6"); // "4x6" or "6x4"
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (cityCode && centerCode && selectedRoom) {
      fetchSeatData();
    } else {
      setSeats([]);
      setAnimateGrid(false);
    }
  }, [cityCode, centerCode, selectedRoom]);

  useEffect(() => {
    // Reset animation when orientation changes
    if (seats.length > 0) {
      setAnimateGrid(false);
      setTimeout(() => setAnimateGrid(true), 100);
    }
  }, [matrixOrientation]);

  const fetchSeatData = async () => {
    setLoading(true);
    setError(null);
    setAnimateGrid(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/Centres/by-room?cityCode=${cityCode}&centerCode=${centerCode}&roomNumber=${selectedRoom}`
      );
      const data = await response.json();

      if (response.ok) {
        setSeats(data);
        setTimeout(() => setAnimateGrid(true), 100);
      } else {
        setError("Failed to fetch seat data");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const getSeatName = (row, col) => {
    const seat = seats.find(s => s.seat_row === row && s.seat_number === col);
    return seat ? seat.name : "";
  };

  const getSeatData = (row, col) => {
    return seats.find(s => s.seat_row === row && s.seat_number === col);
  };

  const handleSeatClick = (row, col) => {
    const candidate = getSeatData(row, col);
    if (candidate) {
      setSelectedCandidate(candidate);
      setSidebarOpen(true);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedCandidate(null);
  };

  const handleRoomSelect = (roomNumber) => {
    setSelectedRoom(roomNumber);
  };

  const renderSeatGrid = () => {
    const is4x6 = matrixOrientation === "4x6";
    const rows = is4x6 ? 4 : 6;
    const cols = is4x6 ? 6 : 4;
    const seats = [];

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        // For transpose: if we're in 6x4 mode, map (row,col) to (col,row) from original 4x6
        const originalRow = is4x6 ? row : col;
        const originalCol = is4x6 ? col : row;
        const name = getSeatName(originalRow, originalCol);

        seats.push(
          <div
            key={`${row}-${col}`}
            className="seat"
            style={{
              border: `2px solid #${name ? '0070A9' : '0A4988'}`,
              padding: "6px",
              backgroundColor: name ? "#0089BB" : "#FFF",
              color: name ? "#FFFDD0" : "#0A4988",
              fontSize: "clamp(10px, 2.5vw, 14px)",
              textAlign: "center",
              fontWeight: name ? "600" : "500",
              borderRadius: "8px",
              transition: "all 0.3s ease-in-out",
              transform: animateGrid ? "scale(1)" : "scale(0.8)",
              opacity: animateGrid ? 1 : 0,
              cursor: name ? "pointer" : "default",
              boxShadow: name ? "0 3px 6px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              aspectRatio: "1",
              width: "100%",
              height: "100%",
              wordWrap: "break-word",
              overflow: "hidden",
              position: "relative"
            }}
            onClick={() => handleSeatClick(originalRow, originalCol)}
            onMouseEnter={(e) => {
              if (name) {
                e.target.style.transform = "scale(1.08) translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.25)";
                e.target.style.borderColor = "#005A87";
              } else {
                e.target.style.backgroundColor = "#F8F9FA";
                e.target.style.borderColor = "#0070A9";
              }
            }}
            onMouseLeave={(e) => {
              if (name) {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 3px 6px rgba(0,0,0,0.15)";
                e.target.style.borderColor = "#0070A9";
              } else {
                e.target.style.backgroundColor = "#FFF";
                e.target.style.borderColor = "#0A4988";
              }
            }}
          >
            <div style={{
              fontSize: "clamp(8px, 1.5vw, 10px)",
              opacity: 0.8,
              marginBottom: "2px",
              fontWeight: "400"
            }}>
              {originalRow}-{originalCol}
            </div>
            <div style={{
              fontSize: "clamp(9px, 2vw, 12px)",
              lineHeight: "1.2",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {name || "Empty"}
            </div>
          </div>
        );
      }
    }

    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: "12px",
        width: "100%",
        maxWidth: "min(90vw, 90vh)",
        aspectRatio: is4x6 ? "6/4" : "4/6",
        margin: "0 auto",
        transition: "all 0.3s ease-in-out",
        transform: animateGrid ? "translateY(0)" : "translateY(20px)",
        opacity: animateGrid ? 1 : 0
      }}>
        {seats}
      </div>
    );
  };

  return (
    <div style={{
      padding: "clamp(8px, 3vw, 16px)",
      backgroundColor: "#FFFDD0",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: "100%",
      boxSizing: "border-box",
      overflowY: "auto",
      lineHeight: "1.5"
    }}>
      {/* <nav style={{
        backgroundColor: "#0A4988",
        padding: "clamp(10px, 3vw, 16px)",
        marginBottom: "clamp(12px, 4vw, 20px)",
        borderRadius: "clamp(6px, 2vw, 10px)",
        display: "flex",
        flexWrap: "wrap",
        gap: "clamp(8px, 3vw, 16px)",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <Link
          to="/"
          style={{
            color: "#FFFDD0",
            textDecoration: "none",
            fontWeight: "600",
            padding: "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)",
            borderRadius: "clamp(4px, 1vw, 8px)",
            backgroundColor: "#0070A9",
            transition: "all 0.3s ease",
            fontSize: "clamp(12px, 3vw, 16px)",
            border: "2px solid transparent",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0089BB";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#0070A9";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          📄 Admit Card
        </Link>
        <Link
          to="/seat-matrix"
          style={{
            color: "#FFFDD0",
            textDecoration: "none",
            fontWeight: "600",
            padding: "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)",
            borderRadius: "clamp(4px, 1vw, 8px)",
            backgroundColor: "#0089BB",
            transition: "all 0.3s ease",
            fontSize: "clamp(12px, 3vw, 16px)",
            border: "2px solid #FFFDD0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
          }}
        >
          🪑 Seat Matrix
        </Link>
      </nav> */}
      <div style={{
        textAlign: "center",
        marginBottom: "32px",
        padding: "20px",
        backgroundColor: "#FFFDE7",
        borderRadius: "12px",
        border: "2px solid #0070A9",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{
          color: "#0A4988",
          fontSize: "clamp(2em, 6vw, 2.5em)",
          fontWeight: "700",
          margin: "0 0 8px 0",
          textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
          letterSpacing: "-0.5px"
        }}>
          🎓 Seat Matrix System
        </h1>
        <p style={{
          color: "#666",
          fontSize: "clamp(14px, 3vw, 18px)",
          margin: 0,
          fontWeight: "400",
          lineHeight: "1.4"
        }}>
          Find seat and view candidate information
        </p>
      </div>

      {/* Location Selection and Room Selector Row */}
      <div style={{
        marginBottom: "24px",
        display: "flex",
        gap: "24px",
        //maxWidth: "900px",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        flexWrap: "wrap",
        alignItems: "stretch"
      }}>
        {/* Location Selection Column */}
        <div style={{
          flex: "1",
          minWidth: "300px",
          backgroundColor: "#FFFDE7",
          padding: "24px",
          borderRadius: "12px",
          border: "2px solid #0070A9",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          height: "fit-content"
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: "16px"
          }}>
            <h3 style={{
              color: "#0A4988",
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 4px 0"
            }}>
              📍 Select Your Location
            </h3>
            <p style={{
              color: "#666",
              fontSize: "14px",
              margin: 0,
              fontWeight: "400"
            }}>
              Enter your city and center codes
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            flex: "1"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <label style={{
                color: "#0A4988",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                🏙️ City Code
              </label>
              <input
                type="number"
                value={cityCode}
                onChange={(e) => setCityCode(e.target.value)}
                placeholder="e.g., 101"
                min="1"
                style={{
                  padding: "12px 16px",
                  border: "2px solid #0089BB",
                  borderRadius: "8px",
                  fontSize: "16px",
                  width: "100%",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  fontWeight: "500",
                  backgroundColor: "#FFF"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0070A9";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0,112,169,0.1)";
                  e.target.style.transform = "scale(1.02)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#0089BB";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "scale(1)";
                }}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <label style={{
                color: "#0A4988",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                🏢 Center Code
              </label>
              <input
                type="number"
                value={centerCode}
                onChange={(e) => setCenterCode(e.target.value)}
                placeholder="e.g., 201"
                min="1"
                style={{
                  padding: "12px 16px",
                  border: "2px solid #0089BB",
                  borderRadius: "8px",
                  fontSize: "16px",
                  width: "100%",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  fontWeight: "500",
                  backgroundColor: "#FFF"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0070A9";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0,112,169,0.1)";
                  e.target.style.transform = "scale(1.02)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#0089BB";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "scale(1)";
                }}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>

          {(cityCode || centerCode) && (
            <div style={{
              fontSize: "14px",
              color: "#666",
              fontStyle: "italic",
              textAlign: "center",
              marginTop: "16px"
            }}>
              {cityCode && centerCode ? "✅ Ready to select a room!" : "Enter both codes to continue"}
            </div>
          )}
        </div>

        {/* Room Selector Column */}
        {cityCode && centerCode && (
          <div style={{
            flex: "1",
            minWidth: "300px",
            backgroundColor: "#FFFDE7",
            padding: "24px",
            borderRadius: "12px",
            border: "2px solid #0070A9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            height: "fit-content"
          }}>
            <div style={{
              textAlign: "center",
              marginBottom: "16px"
            }}>
              <h3 style={{
                color: "#0A4988",
                fontSize: "18px",
                fontWeight: "600",
                margin: "0 0 4px 0"
              }}>
                🏫 Available Room
              </h3>
              <p style={{
                color: "#666",
                fontSize: "14px",
                margin: 0,
                fontWeight: "400"
              }}>
                Choose your examination room
              </p>
            </div>

            <div style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <RoomSelector
                cityCode={cityCode}
                centerCode={centerCode}
                onRoomSelect={handleRoomSelect}
                selectedRoom={selectedRoom}
              />
            </div>
          </div>
        )}
      </div>

      {cityCode && centerCode && (
        <div style={{
          width: "100%",
         // maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          {/* Seat Matrix Area */}
          {loading && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              backgroundColor: "#FFFDE7",
              borderRadius: "12px",
              border: "2px solid #0070A9",
              minHeight: "200px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "4px solid #E3F2FD",
                borderTop: "4px solid #0070A9",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "16px"
              }}></div>
              <p style={{
                color: "#0070A9",
                fontSize: "18px",
                fontWeight: "600",
                margin: 0,
                textAlign: "center"
              }}>
                🔄 Loading seat data...
              </p>
              <p style={{
                color: "#666",
                fontSize: "14px",
                margin: "8px 0 0 0",
                textAlign: "center"
              }}>
                Please wait while we fetch the information
              </p>
            </div>
          )}
          {error && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px",
              backgroundColor: "#FFF5F5",
              borderRadius: "12px",
              border: "2px solid #DC3545",
              minHeight: "200px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "48px",
                marginBottom: "16px"
              }}>
                ⚠️
              </div>
              <h4 style={{
                color: "#DC3545",
                fontSize: "18px",
                fontWeight: "600",
                margin: "0 0 8px 0"
              }}>
                Error Loading Data
              </h4>
              <p style={{
                color: "#666",
                fontSize: "16px",
                margin: 0,
                lineHeight: "1.5"
              }}>
                {error}
              </p>
              <button
                onClick={() => selectedRoom && fetchSeatData()}
                style={{
                  marginTop: "16px",
                  padding: "10px 20px",
                  backgroundColor: "#0070A9",
                  color: "#FFFDD0",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#0089BB"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#0070A9"}
              >
                🔄 Try Again
              </button>
            </div>
          )}

          {selectedRoom && seats.length > 0 && (
            <div style={{
              transition: "all 0.5s ease-in-out",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? "translateY(0)" : "translateY(30px)"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px"
              }}>
                <h3 style={{
                  color: "#0A4988",
                  fontSize: "clamp(1.4em, 4vw, 1.8em)",
                  fontWeight: "600",
                  margin: 0,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  🏫 Room {selectedRoom} - Seat Matrix
                </h3>

                <div style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <span style={{
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>
                    Layout:
                  </span>
                  <button
                    onClick={() => setMatrixOrientation("4x6")}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: matrixOrientation === "4x6" ? "#0070A9" : "#FFF",
                      color: matrixOrientation === "4x6" ? "#FFFDD0" : "#0A4988",
                      border: `2px solid ${matrixOrientation === "4x6" ? "#0070A9" : "#0089BB"}`,
                      borderRadius: "8px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: matrixOrientation === "4x6" ? "0 4px 8px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onMouseEnter={(e) => {
                      if (matrixOrientation !== "4x6") {
                        e.target.style.backgroundColor = "#E3F2FD";
                        e.target.style.borderColor = "#0070A9";
                        e.target.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (matrixOrientation !== "4x6") {
                        e.target.style.backgroundColor = "#FFF";
                        e.target.style.borderColor = "#0089BB";
                        e.target.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    📐 4 × 6
                  </button>

                  <button
                    onClick={() => setMatrixOrientation("6x4")}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: matrixOrientation === "6x4" ? "#0070A9" : "#FFF",
                      color: matrixOrientation === "6x4" ? "#FFFDD0" : "#0A4988",
                      border: `2px solid ${matrixOrientation === "6x4" ? "#0070A9" : "#0089BB"}`,
                      borderRadius: "8px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: matrixOrientation === "6x4" ? "0 4px 8px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onMouseEnter={(e) => {
                      if (matrixOrientation !== "6x4") {
                        e.target.style.backgroundColor = "#E3F2FD";
                        e.target.style.borderColor = "#0070A9";
                        e.target.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (matrixOrientation !== "6x4") {
                        e.target.style.backgroundColor = "#FFF";
                        e.target.style.borderColor = "#0089BB";
                        e.target.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    📏 6 × 4
                  </button>
                </div>
              </div>

              {/* Stats and Legend */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "20px"
              }}>
                {/* Room Stats */}
                <div style={{
                  backgroundColor: "#E3F2FD",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "2px solid #0070A9",
                  flex: "1",
                  minWidth: "200px"
                }}>
                  <h4 style={{
                    color: "#0A4988",
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    📊 Room Statistics
                  </h4>
                  <div style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap"
                  }}>
                    <div style={{
                      textAlign: "center"
                    }}>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#0070A9"
                      }}>
                        {seats.filter(s => s.name).length}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#666",
                        fontWeight: "500"
                      }}>
                        Occupied
                      </div>
                    </div>
                    <div style={{
                      textAlign: "center"
                    }}>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#0A4988"
                      }}>
                        {seats.length - seats.filter(s => s.name).length}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#666",
                        fontWeight: "500"
                      }}>
                        Available
                      </div>
                    </div>
                    <div style={{
                      textAlign: "center"
                    }}>
                      <div style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#666"
                      }}>
                        {seats.length}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#666",
                        fontWeight: "500"
                      }}>
                        Total Seats
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  backgroundColor: "#F8F9FA",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "2px solid #E9ECEF",
                  flex: "1",
                  minWidth: "250px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#0A4988"
                  }}>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#FFF",
                      border: "2px solid #0A4988",
                      borderRadius: "3px"
                    }}></div>
                    <span>Available</span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#0A4988"
                  }}>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#0089BB",
                      border: "2px solid #0070A9",
                      borderRadius: "3px"
                    }}></div>
                    <span>Occupied</span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#666"
                  }}>
                    <span>👆 Click for details</span>
                  </div>
                </div>
              </div>

              <div style={{
                border: "3px solid #0A4988",
                padding: "24px",
                backgroundColor: "#FFFDE7",
                borderRadius: "12px",
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                width: "100%",
                maxWidth: "min(95vw, 1200px)",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px"
              }}>
                {renderSeatGrid()}
              </div>
            </div>
          )}

          {selectedRoom && seats.length === 0 && !loading && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              backgroundColor: "#FFFDE7",
              borderRadius: "12px",
              border: "2px solid #0070A9",
              minHeight: "200px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "48px",
                marginBottom: "16px",
                opacity: 0.7
              }}>
                🪑
              </div>
              <h4 style={{
                color: "#0A4988",
                fontSize: "18px",
                fontWeight: "600",
                margin: "0 0 8px 0"
              }}>
                Room {selectedRoom} is Empty
              </h4>
              <p style={{
                color: "#666",
                fontSize: "16px",
                margin: 0,
                lineHeight: "1.5"
              }}>
                No candidates have been assigned to this room yet.
              </p>
              <p style={{
                color: "#888",
                fontSize: "14px",
                margin: "8px 0 0 0",
                fontStyle: "italic"
              }}>
                Try selecting a different room or check back later.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            transition: "opacity 0.3s ease-in-out"
          }}
          onClick={closeSidebar}
        />
      )}

      {/* Candidate Details Sidebar */}
      <CandidateDetailsSidebar
        candidate={selectedCandidate}
        onClose={closeSidebar}
        isOpen={sidebarOpen}
      />
    </div>
  );
};

export default SeatMatrix;