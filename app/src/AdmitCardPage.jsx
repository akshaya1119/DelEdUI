import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AdmitCard from "./AdmitCard";
import { QRCodeService as QRCode } from './services/QrCodeService';

const AdmitCardPage = () => {
  const componentRef = useRef();
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const qrData = {
      id: 1,
      name: "as",
      serial: "as",
      barcode: "as",
    };

    QRCode.generate(qrData)
      .then(setQrCodeUrl)
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
        setQrCodeUrl('');
      });
  }, []);

  
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
    const canvas = await html2canvas(clone, { scale: 2 });
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

    pdf.save("AdmitCard.pdf");
  };

  return (
    <div>

      {/* Download PDF button */}
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button
          className="download-btn "
          onClick={handleDownload}
        >
          📥 Download Admit Card PDF
        </button>
      </div>
      {/* Admit Card Preview */}
      <div ref={componentRef}>
        <AdmitCard
          qrcode={qrCodeUrl}
          name="Aditya Prasad"
          fname="GOVIND PRASAD"
          gender="Male"
          categ="General"
          dob="05-03-2004"
          address="Almora"
          roll_t1="230101001"
          lang1_1="हिंदी"
          lang1_2="अंग्रेज़ी"
          lang2_1="संस्कृत"
          lang2_2="अंग्रेज़ी"
          subject="गणित"
          photo="/photo.jpg"
          sign="/sign.jpg"
          centre_name="रा0क0इ0का0 ज्वालापुर हरिद्वार (नोडल केन्द्र)"
          city_name="हरिद्वार"
          idtype="आधार"
          idno="4849-3400-6181"
        />
      </div>

      
    </div>
  );
};

export default AdmitCardPage;
