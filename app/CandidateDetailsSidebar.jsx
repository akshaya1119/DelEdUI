import React, { useState, useEffect } from "react";

const CandidateDetailsSidebar = ({ candidate, onClose, isOpen }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (candidate && candidate.registration_no) {
      fetchCandidateDetails(candidate.registration_no);
    }
  }, [candidate]);

  const fetchCandidateDetails = async (registrationNo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_SEATMATRIX}/api/Registrations/get-registration-details/${registrationNo}`
      );
      const data = await response.json();

      if (response.ok) {
        setDetails(data);
      } else {
        setError("Failed to fetch candidate details");
      }
    } catch (err) {
      setError("Error fetching candidate details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: "350px",
      height: "100vh",
      backgroundColor: "#FFFDE7",
      borderLeft: "3px solid #0A4988",
      boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
      zIndex: 1000,
      transform: isOpen ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.3s ease-in-out",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#0A4988",
        color: "#FFFDD0",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #0070A9"
      }}>
        <h3 style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: "bold"
        }}>
          Candidate Details
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#FFFDD0",
            fontSize: "20px",
            cursor: "pointer",
            padding: "5px",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: "20px",
        height: "calc(100vh - 70px)", // Subtract header height
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        {loading && (
          <div style={{
            textAlign: "center",
            color: "#0070A9",
            fontSize: "16px",
            fontWeight: "bold"
          }}>
            Loading candidate details...
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: "#FFFDE7",
            border: "2px solid #0070A9",
            borderRadius: "6px",
            padding: "15px",
            marginBottom: "20px",
            color: "#0A4988",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        {details && (
          <div>
            {/* Basic Info */}
            <div style={{
              backgroundColor: "#FFFDD0",
              border: "2px solid #0070A9",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px"
            }}>
              <h4 style={{
                color: "#0A4988",
                margin: "0 0 10px 0",
                fontSize: "16px",
                borderBottom: "1px solid #0070A9",
                paddingBottom: "5px"
              }}>
                Basic Information
              </h4>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Name:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9" }}>{details.name}</span>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Father's Name:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9" }}>{details.fName || "N/A"}</span>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Roll Number:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9", fontWeight: "bold" }}>{details.rollNumber || "N/A"}</span>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Gender:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9" }}>{details.gender || "N/A"}</span>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Date of Birth:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9" }}>{formatDate(details.dob)}</span>
              </div>
            </div>

            {/* Category & Reservation */}
            <div style={{
              backgroundColor: "#FFFDD0",
              border: "2px solid #0070A9",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px"
            }}>
              <h4 style={{
                color: "#0A4988",
                margin: "0 0 10px 0",
                fontSize: "16px",
                borderBottom: "1px solid #0070A9",
                paddingBottom: "5px"
              }}>
                Category & Reservation
              </h4>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Category:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9" }}>{details.category || "N/A"}</span>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Sub Category:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9" }}>{details.subCategory || "N/A"}</span>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Physically Handicapped:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9" }}>{details.ph || "N/A"}</span>
              </div>

              {details.phType && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#0A4988" }}>PH Type:</strong>
                  <span style={{ marginLeft: "8px", color: "#0070A9" }}>{details.phType}</span>
                </div>
              )}
            </div>

            {/* Documents */}
            <div style={{
              backgroundColor: "#FFFDD0",
              border: "2px solid #0070A9",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px"
            }}>
              <h4 style={{
                color: "#0A4988",
                margin: "0 0 10px 0",
                fontSize: "16px",
                borderBottom: "1px solid #0070A9",
                paddingBottom: "5px"
              }}>
                Documents
              </h4>

              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#0A4988" }}>Photo ID:</strong>
                <span style={{ marginLeft: "8px", color: "#0070A9" }}>{details.photoId || "N/A"}</span>
              </div>

              {details.imagePath && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#0A4988" }}>Photo:</strong>
                  <span style={{ marginLeft: "8px", color: "#0070A9" }}>Available</span>
                </div>
              )}

              {details.signaturePath && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#0A4988" }}>Signature:</strong>
                  <span style={{ marginLeft: "8px", color: "#0070A9" }}>Available</span>
                </div>
              )}
            </div>

            {/* Seat Information */}
            {candidate && (
              <div style={{
                backgroundColor: "#FFFDD0",
                border: "2px solid #0070A9",
                borderRadius: "8px",
                padding: "15px"
              }}>
                <h4 style={{
                  color: "#0A4988",
                  margin: "0 0 10px 0",
                  fontSize: "16px",
                  borderBottom: "1px solid #0070A9",
                  paddingBottom: "5px"
                }}>
                  Seat Information
                </h4>

                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#0A4988" }}>Room Number:</strong>
                  <span style={{ marginLeft: "8px", color: "#0070A9" }}>{candidate.room_number}</span>
                </div>

                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#0A4988" }}>Seat Row:</strong>
                  <span style={{ marginLeft: "8px", color: "#0070A9" }}>{candidate.seat_row}</span>
                </div>

                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#0A4988" }}>Seat Number:</strong>
                  <span style={{ marginLeft: "8px", color: "#0070A9" }}>{candidate.seat_number}</span>
                </div>

                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#0A4988" }}>Registration No:</strong>
                  <span style={{ marginLeft: "8px", color: "#0070A9", fontWeight: "bold" }}>{candidate.registration_no}</span>
                </div>

                {candidate.allotment_date && (
                  <div style={{ marginBottom: "8px" }}>
                    <strong style={{ color: "#0A4988" }}>Allotment Date:</strong>
                    <span style={{ marginLeft: "8px", color: "#0070A9" }}>{formatDate(candidate.allotment_date)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailsSidebar;