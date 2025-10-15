// import React, { useRef, useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import AdmitCard from "./AdmitCard";
// import { QRCodeService as QRCode } from './services/QrCodeService';

// const AdmitCardPage = () => {
//   const componentRef = useRef();
//   const [qrCodeUrl, setQrCodeUrl] = useState('');

//   useEffect(() => {
//     const qrData = {
//       id: 1,
//       name: "as",
//       serial: "as",
//       barcode: "as",
//     };

//     QRCode.generate(qrData)
//       .then(setQrCodeUrl)
//       .catch((err) => {
//         console.error('Failed to generate QR code:', err);
//         setQrCodeUrl('');
//       });
//   }, []);

  
//   const handleDownload = async () => {
//     const element = componentRef.current;

//     // Clone the element to avoid affecting the page layout
//     const clone = element.cloneNode(true);
//     clone.style.width = '1000px';
//     clone.style.position = 'absolute';
//     clone.style.left = '-9999px';
//     clone.style.top = '-9999px';
//     document.body.appendChild(clone);

//     // Convert to canvas
//     const canvas = await html2canvas(clone, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     // Remove the clone
//     document.body.removeChild(clone);

//     // Create PDF (A4 size)
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = 210; // A4 width in mm
//     const pageHeight = 297; // A4 height in mm

//     // Calculate dimensions to fit in one page
//     const canvasAspect = canvas.width / canvas.height;
//     const pageAspect = pageWidth / pageHeight;

//     let imgWidth, imgHeight;
//     if (canvasAspect > pageAspect) {
//       // Canvas is wider, fit to width
//       imgWidth = pageWidth;
//       imgHeight = pageWidth / canvasAspect;
//     } else {
//       // Canvas is taller, fit to height
//       imgHeight = pageHeight;
//       imgWidth = pageHeight * canvasAspect;
//     }

//     // Center the image on the page
//     const x = (pageWidth - imgWidth) / 2;
//     const y = (pageHeight - imgHeight) / 2;

//     // Add image to single page
//     pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

//     pdf.save("AdmitCard.pdf");
//   };

//   return (
//     <div>

//       {/* Download PDF button */}
//       <div style={{ textAlign: "right", marginTop: "10px" }}>
//         <button
//           className="download-btn "
//           onClick={handleDownload}
//         >
//           📥 Download Admit Card PDF
//         </button>
//       </div>
//       {/* Admit Card Preview */}
//       <div ref={componentRef}>
//         <AdmitCard
//           qrcode={qrCodeUrl}
//           name="Aditya Prasad"
//           fname="GOVIND PRASAD"
//           gender="Male"
//           categ="General"
//           dob="05-03-2004"
//           address="Almora"
//           roll_t1="230101001"
//           subject="गणित"
//           photo="/photo.jpg"
//           sign="/sign.jpg"
//           centre_name="रा0क0इ0का0 ज्वालापुर हरिद्वार (नोडल केन्द्र)"
//           city_name="हरिद्वार"
//           idtype="आधार"
//           idno="4849-3400-6181"
//         />
//       </div>

      
//     </div>
//   );
// };

// export default AdmitCardPage;

import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AdmitCard from "./AdmitCard";
import { QRCodeService as QRCode } from './services/QrCodeService';

const AdmitCardPage = () => {
  const componentRef = useRef();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // You might want to fetch registrationNo from some other state or URL params
  const registrationNo = '92100049'; // Example registration number

  useEffect(() => {
    // Fetch registration data based on registrationNo
    const fetchRegistrationDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://localhost:7091/api/Registrations/get-registration-details/${registrationNo}`);
        const data = await response.json();
console.log(data)
        if (response.ok) {
          setRegistrationData(data);

          // Generate QR Code after fetching data
          const qrData = {
            id: data.rollNumber,
            name: data.name,
            serial: data.rollNumber.toString(),
            barcode: data.rollNumber.toString(),
          };

          QRCode.generate(qrData)
            .then(setQrCodeUrl)
            .catch((err) => {
              console.error('Failed to generate QR code:', err);
              setQrCodeUrl(''); // Fallback to an empty string if QR generation fails
            });
        } else {
          setError(data.message || "Failed to fetch data");
        }
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [registrationNo]);

  // Handle PDF download functionality
  const handleDownload = async () => {
    const element = componentRef.current;

    // Clone the element to avoid affecting the page layout
    const clone = element.cloneNode(true);
    clone.style.width = '1000px';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    document.body.appendChild(clone);

    // Convert to canvas
    const canvas = await html2canvas(clone, {useCORS: true,},{ scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Remove the clone
    document.body.removeChild(clone);

    // Create PDF (A4 size)
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm

    // Calculate dimensions to fit in one page
    const canvasAspect = canvas.width / canvas.height;
    const pageAspect = pageWidth / pageHeight;

    let imgWidth, imgHeight;
    if (canvasAspect > pageAspect) {
      // Canvas is wider, fit to width
      imgWidth = pageWidth;
      imgHeight = pageWidth / canvasAspect;
    } else {
      // Canvas is taller, fit to height
      imgHeight = pageHeight;
      imgWidth = pageHeight * canvasAspect;
    }

    // Center the image on the page
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    // Add image to single page
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    // Download the PDF
    pdf.save("AdmitCard.pdf");
  };

  // Show loading message or error if data is not fetched successfully
  if (loading) {
    return (
      <div className="loading">
        <p>Loading registration details...</p>
        {/* You can replace this with a spinner component if needed */}
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


  // Main render when data is available
  return (
    <div>
      {/* Download PDF button */}
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button className="download-btn" onClick={handleDownload}>
          📥 Download Admit Card PDF
        </button>
      </div>

      {/* Admit Card Preview */}
      <div ref={componentRef}>
        {registrationData && (
          <AdmitCard
            qrcode={qrCodeUrl}
            name={registrationData.name}
            fname={registrationData.fName}
            gender={registrationData.gender}
            categ={registrationData.category}
            subCategory = {registrationData.subCategory || "----"}
            phType = {registrationData.phType || "----"}
            dob={formatDate(registrationData.dob)}
            address={registrationData.address}
            roll_t1={registrationData.rollNumber}
            subject={registrationData.subject || "Some Subject"} // Dynamically set subject
            photo={registrationData.imagePath}
            sign={registrationData.signaturePath}
            centre_name={registrationData.assignedCentre ? registrationData.assignedCentre.centreName : ""}
            city_name={registrationData.assignedCentre ? registrationData.assignedCentre.cityName : ""}  // You can dynamically adjust this based on registration data if needed
            idno={registrationData.photoId}
          />
        )}
      </div>
    </div>
  );
};

export default AdmitCardPage;
