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
  const [cities, setCities] = useState([]);
  const [centres, setCentres] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [centresLoading, setCentresLoading] = useState(false);

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

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchCentres(selectedCity.cityCode);
    } else {
      setCentres([]);
      setSelectedCentre(null);
      setCenterCode("");
    }
    setSelectedRoom(null); // Reset room selection when city changes
  }, [selectedCity]);

  useEffect(() => {
    setSelectedRoom(null); // Reset room selection when centre changes
  }, [selectedCentre]);

  const fetchSeatData = async () => {
    setLoading(true);
    setError(null);
    setAnimateGrid(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_SEATMATRIX}/api/Centres/by-room?cityCode=${cityCode}&centerCode=${centerCode}&roomNumber=${selectedRoom}`
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

  const fetchCities = async () => {
    setCitiesLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_SEATMATRIX}/api/Centres/get-cities?session=2025-26`);
      const data = await response.json();
      if (response.ok) {
        setCities(data);
      } else {
        setError("Failed to fetch cities");
      }
    } catch (err) {
      setError("Error fetching cities");
    } finally {
      setCitiesLoading(false);
    }
  };

  const fetchCentres = async (cityCode) => {
    setCentresLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_SEATMATRIX}/api/Centres?citycode=${cityCode}&session=2025-26`);
      const data = await response.json();
      if (response.ok) {
        setCentres(data);
      } else {
        setError("Failed to fetch centres");
      }
    } catch (err) {
      setError("Error fetching centres");
    } finally {
      setCentresLoading(false);
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
    const seatSize = 'clamp(80px, 12vw, 130px)';
    const seats = [];

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        // For transpose: if we're in 6x4 mode, map (row,col) to (col,row) from original 4x6
        const originalRow = is4x6 ? row : col;
        const originalCol = is4x6 ? col : row;
        const name = getSeatName(originalRow, originalCol);
        const seat = getSeatData(originalRow, originalCol);

        seats.push(
          <div
            key={`${row}-${col}`}
            className={`p-2 text-center rounded-lg transition-all duration-300 ease-in-out flex flex-col items-center justify-center w-full h-full break-words overflow-hidden relative ${
              name
                ? 'border-2 border-blue-600 bg-blue-600 text-white font-semibold cursor-pointer shadow-md hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-700 hover:bg-blue-700'
                : 'border-2 border-slate-300 bg-white text-slate-600 font-medium cursor-default shadow-sm hover:bg-slate-50 hover:border-blue-400'
            }`}
            style={{
              fontSize: "clamp(10px, 2vw, 14px)",
              transform: animateGrid ? "scale(1)" : "scale(0.8)",
              opacity: animateGrid ? 1 : 0
            }}
            onClick={() => handleSeatClick(originalRow, originalCol)}
          >
            <div className="text-[clamp(9px,1.5vw,12px)] leading-[1.2] max-w-full overflow-hidden text-ellipsis">
              {seat?.roll_no }
            </div>
            <div className="text-[clamp(9px,1.5vw,12px)] leading-[1.2] max-w-full overflow-hidden text-ellipsis">
              {name || "Empty"}
            </div>
           
          </div>
        );
      }
    }

    const gap = 16; // gap-4 is 16px
    const totalWidth = `calc(${cols} * ${seatSize} + ${(cols - 1)} * ${gap}px)`;
    const totalHeight = `calc(${rows} * ${seatSize} + ${(rows - 1)} * ${gap}px)`;

    return (
      <div className="overflow-x-auto">
        <div
          className="grid gap-4 mx-auto transition-all duration-300 ease-in-out"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${seatSize})`,
            gridTemplateRows: `repeat(${rows}, ${seatSize})`,
            width: totalWidth,
            height: totalHeight,
            transform: animateGrid ? "translateY(0)" : "translateY(20px)",
            opacity: animateGrid ? 1 : 0,
            minWidth: 'fit-content'
          }}
        >
          {seats}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] overflow-hidden">
      {/* Modern Navigation Header */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl border-b border-blue-300/20">
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold tracking-tight">🎓 SeatMatrix</h1>
              </div>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg backdrop-blur-sm border border-white/20"
              >
                📄 Admit Card
              </Link>
              <Link
                to="/seat-matrix"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                🪑 Seat Matrix
              </Link>
            </div> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Seat Matrix System
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find your seat and view candidate information with our modern, intuitive interface
          </p>
        </div>

        {/* Selection Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Location Selection Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Select Location
              </h3>
              <p className="text-slate-600">
                Enter your city and center codes to get started
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🏙️</span>
                  City
                </label>
                <select
                  value={selectedCity ? selectedCity.cityCode : ""}
                  onChange={(e) => {
                    const city = cities.find(c => c.cityCode == e.target.value);
                    setSelectedCity(city);
                    setCityCode(city ? city.cityCode : "");
                  }}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-center font-medium bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-lg"
                  disabled={citiesLoading}
                >
                  <option value="">{citiesLoading ? "Loading..." : "Select City"}</option>
                  {cities.map(city => (
                    <option key={city.cityCode} value={city.cityCode}>{city.cityCode} - {city.cityNameHindi}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🏢</span>
                  Centre
                </label>
                <select
                  value={selectedCentre ? selectedCentre.centreCode : ""}
                  onChange={(e) => {
                    const centre = centres.find(c => c.centreCode == e.target.value);
                    setSelectedCentre(centre);
                    setCenterCode(centre ? centre.centreCode : "");
                  }}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-center font-medium bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-lg"
                  disabled={!selectedCity || centresLoading}
                >
                  <option value="">{centresLoading ? "Loading..." : "Select Centre"}</option>
                  {centres.map(centre => (
                    <option key={centre.id} value={centre.centreCode}>{centre.centreCode} - {centre.centreNameHindi}</option>
                  ))}
                </select>
              </div>

              {(selectedCity || selectedCentre) && (
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">
                    {selectedCity && selectedCentre ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-emerald-600">✅</span>
                        Ready to select a room!
                      </span>
                    ) : (
                      "Select both city and centre to continue"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Room Selector Card */}
          {selectedCity && selectedCentre && (
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-4 shadow-lg">
                  <span className="text-2xl">🏫</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Select Room
                </h3>
                <p className="text-slate-600">
                  Choose your examination room
                </p>
              </div>

              <div className="flex items-center justify-center min-h-[200px]">
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

        {/* Seat Matrix Section */}
        {selectedCity && selectedCentre && (
          <div className="space-y-8">
            {/* Seat Matrix Area */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Loading Seat Data
                </h3>
                <p className="text-slate-600 text-lg">
                  Please wait while we fetch the information
                </p>
              </div>
            )}

            {error && (
              <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Error Loading Data
                </h3>
                <p className="text-slate-600 text-lg mb-6">
                  {error}
                </p>
                <button
                  onClick={() => selectedRoom && fetchSeatData()}
                  className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <span className="mr-2">🔄</span>
                  Try Again
                </button>
              </div>
            )}

            {/* Seat Matrix Display */}
            {selectedRoom && seats.length > 0 && (
              <div
                className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
                style={{
                  opacity: animateGrid ? 1 : 0,
                  transform: animateGrid ? "translateY(0)" : "translateY(30px)",
                  transition: "all 0.5s ease-in-out"
                }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1 flex items-center gap-3">
                        <span className="text-3xl">🏫</span>
                        Room {selectedRoom} - Seat Matrix
                      </h3>
                      <p className="text-blue-100">
                        Click on any seat to view candidate details
                      </p>
                    </div>

                    {/* Layout Toggle */}
                    <div className="flex items-center gap-3">
                      <span className="text-blue-100 font-medium">Layout:</span>
                      <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                        <button
                          onClick={() => setMatrixOrientation("4x6")}
                          className={`w-20 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            matrixOrientation === "4x6"
                              ? 'bg-white text-blue-600 shadow-lg'
                              : 'text-blue-100 hover:bg-white/20'
                          }`}
                        >
                          <span>📐</span>
                          4×6
                        </button>
                        <button
                          onClick={() => setMatrixOrientation("6x4")}
                          className={`w-20 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            matrixOrientation === "6x4"
                              ? 'bg-white text-blue-600 shadow-lg'
                              : 'text-blue-100 hover:bg-white/20'
                          }`}
                        >
                          <span>📏</span>
                          6×4
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">

                  {/* Stats and Legend */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Room Stats */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        Room Statistics
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {seats.filter(s => s.name).length}
                          </div>
                          <div className="text-sm text-slate-600 font-medium">
                            Occupied
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                          <div className="text-2xl font-bold text-emerald-600 mb-1">
                            {seats.length - seats.filter(s => s.name).length}
                          </div>
                          <div className="text-sm text-slate-600 font-medium">
                            Available
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                          <div className="text-2xl font-bold text-slate-600 mb-1">
                            {seats.length}
                          </div>
                          <div className="text-sm text-slate-600 font-medium">
                            Total Seats
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🗺️</span>
                        Legend
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-white border-2 border-slate-400 rounded-lg shadow-sm"></div>
                          <span className="text-sm font-medium text-slate-700">Available Seat</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-blue-500 border-2 border-blue-600 rounded-lg shadow-sm"></div>
                          <span className="text-sm font-medium text-slate-700">Occupied Seat</span>
                        </div>
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                          <span className="text-lg">👆</span>
                          <span className="text-sm font-medium text-slate-700">Click seats for details</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seat Grid */}
                  <div className="flex justify-center">
                    {renderSeatGrid()}
                  </div>
                </div>
              </div>
            )}

            {/* Empty Room State */}
            {selectedRoom && seats.length === 0 && !loading && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full mb-6">
                  <span className="text-3xl">🪑</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Room {selectedRoom} is Empty
                </h3>
                <p className="text-slate-600 text-lg mb-4">
                  No candidates have been assigned to this room yet.
                </p>
                <p className="text-slate-500 text-sm">
                  Try selecting a different room or check back later.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out"
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
    </div>
  );
};

export default SeatMatrix;