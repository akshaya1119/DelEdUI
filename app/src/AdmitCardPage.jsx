import React, { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import AdmitCard from "./AdmitCard";
import { QRCodeService as QRCode } from "./services/QrCodeService";

const AdmitCardPage = () => {
  const componentRef = useRef();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const registrationNo = "92100003"; // Example number — can be dynamic

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch single registration details
  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/Registrations/get-registration-details/${registrationNo}`
        );
        const data = await response.json();

        if (response.ok) {
          setRegistrationData(data);
          const qrData = {
            id: data.rollNumber,
            name: data.name,
            serial: data.rollNumber.toString(),
            barcode: data.rollNumber.toString(),
          };

          QRCode.generate(qrData)
            .then(setQrCodeUrl)
            .catch((err) => {
              console.error("Failed to generate QR code:", err);
              setQrCodeUrl("");
            });
        } else {
          setError(data.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [registrationNo]);

  // ✅ Download single admit card PDF
  const handleDownloadSingle = async (regNo) => {
    const element = componentRef.current;
    const clone = element.cloneNode(true);
    clone.style.width = "1000px";
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "-9999px";
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, { useCORS: true, scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    document.body.removeChild(clone);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const canvasAspect = canvas.width / canvas.height;
    const pageAspect = pageWidth / pageHeight;

    let imgWidth, imgHeight;
    if (canvasAspect > pageAspect) {
      imgWidth = pageWidth;
      imgHeight = pageWidth / canvasAspect;
    } else {
      imgHeight = pageHeight;
      imgWidth = pageHeight * canvasAspect;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save("AdmitCard.pdf");
  };

  // ✅ Download next 10 admit cards as ZIP — same layout logic as single
  // const handleDownloadMultiple = async () => {
  //   const zip = new JSZip();

  //   try {
  //     const next10RegNos = Array.from({ length: 40500 }, (_, i) => {
  //       const num = parseInt(registrationNo, 10) + i;
  //       return num.toString().padStart(8, "0");
  //     });

  //     for (const regNo of next10RegNos) {
  //       const res = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/Registrations/get-registration-details/${regNo}`
  //       );
  //       const data = await res.json();
  //       if (!res.ok) continue;

  //       const qrData = {
  //         id: data.rollNumber,
  //         name: data.name,
  //         serial: data.rollNumber.toString(),
  //         barcode: data.rollNumber.toString(),
  //       };
  //       const qrUrl = await QRCode.generate(qrData);

  //       // Create a temporary div for rendering AdmitCard
  //       const tempDiv = document.createElement("div");
  //       tempDiv.style.width = "1000px";
  //       tempDiv.style.position = "absolute";
  //       tempDiv.style.left = "-9999px";
  //       tempDiv.style.top = "-9999px";
  //       document.body.appendChild(tempDiv);

  //       const admitCard = (
  //         <AdmitCard
  //           qrcode={qrUrl}
  //           name={data.name}
  //           fname={data.fName}
  //           gender={data.gender}
  //           categ={data.category}
  //           subCategory={data.subCategory || "----"}
  //           phType={data.phType || "----"}
  //           dob={formatDate(data.dob)}
  //           address={data.address}
  //           roll_t1={data.rollNumber}
  //           subject={data.subject || "Some Subject"}
  //           photo={data.imagePath}
  //           sign={data.signaturePath}
  //           centre_name={
  //             data.assignedCentre ? data.assignedCentre.centreName : ""
  //           }
  //           city_name={data.assignedCentre ? data.assignedCentre.cityName : ""}
  //           idno={data.photoId}
  //         />
  //       );

  //       // React 18 render
  //       const root = createRoot(tempDiv);
  //       await new Promise((resolve) => {
  //         root.render(admitCard);
  //         setTimeout(resolve, 500); // Wait for render
  //       });

  //       const canvas = await html2canvas(tempDiv, { useCORS: true, scale: 2 });
  //       const imgData = canvas.toDataURL("image/png");
  //       document.body.removeChild(tempDiv);

  //       const pdf = new jsPDF("p", "mm", "a4");
  //       const pageWidth = 210;
  //       const pageHeight = 297;
  //       const canvasAspect = canvas.width / canvas.height;
  //       const pageAspect = pageWidth / pageHeight;

  //       let imgWidth, imgHeight;
  //       if (canvasAspect > pageAspect) {
  //         imgWidth = pageWidth;
  //         imgHeight = pageWidth / canvasAspect;
  //       } else {
  //         imgHeight = pageHeight;
  //         imgWidth = pageHeight * canvasAspect;
  //       }

  //       const x = (pageWidth - imgWidth) / 2;
  //       const y = (pageHeight - imgHeight) / 2;
  //       pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

  //       const pdfBlob = pdf.output("blob");
  //       zip.file(`${regNo}.pdf`, pdfBlob);
  //     }

  //     const zipBlob = await zip.generateAsync({ type: "blob" });
  //     saveAs(zipBlob, "AdmitCards.zip");
  //   } catch (err) {
  //     console.error("Error generating ZIP:", err);
  //   }
  // };

  const handleDownloadMultiple = async () => {
  const batchSize = 800; // number of PDFs per ZIP
  const totalCards = 40500; // total cards you want to generate
  const baseRegNo = parseInt(registrationNo, 10);

  let zip = new JSZip();
  let fileCount = 0;
  let batchStart = baseRegNo;
  let currentBatch = 1;

  try {
    const regNos = Array.from({ length: totalCards }, (_, i) =>
      (baseRegNo + i).toString().padStart(8, "0")
    );

    for (const [index, regNo] of regNos.entries()) {
      // Fetch registration details
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/Registrations/get-registration-details/${regNo}`
      );
      const data = await res.json();
      if (!res.ok || !data) continue;

      // Generate QR code
      const qrData = {
        id: data.rollNumber,
        name: data.name,
        serial: data.rollNumber.toString(),
        barcode: data.rollNumber.toString(),
      };
      const qrUrl = await QRCode.generate(qrData);

      // Create temporary container
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "1000px";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      document.body.appendChild(tempDiv);

      // Render AdmitCard into temp div
      const admitCard = (
        <AdmitCard
          qrcode={qrUrl}
          name={data.name}
          fname={data.fName}
          gender={data.gender}
          categ={data.category}
          subCategory={data.subCategory || "----"}
          phType={data.phType || "----"}
          dob={formatDate(data.dob)}
          address={data.address}
          roll_t1={data.rollNumber}
          subject={data.subject || "Some Subject"}
          photo={data.imagePath}
          sign={data.signaturePath}
          centre_name={
            data.assignedCentre ? data.assignedCentre.centreName : ""
          }
          city_name={data.assignedCentre ? data.assignedCentre.cityName : ""}
          idno={data.photoId}
        />
      );

      const root = createRoot(tempDiv);
      await new Promise((resolve) => {
        root.render(admitCard);
        setTimeout(resolve, 400); // small delay to ensure render
      });

      // Convert to PDF
      const canvas = await html2canvas(tempDiv, { useCORS: true, scale: 2 });
      document.body.removeChild(tempDiv);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const canvasAspect = canvas.width / canvas.height;
      const pageAspect = pageWidth / pageHeight;

      let imgWidth, imgHeight;
      if (canvasAspect > pageAspect) {
        imgWidth = pageWidth;
        imgHeight = pageWidth / canvasAspect;
      } else {
        imgHeight = pageHeight;
        imgWidth = pageHeight * canvasAspect;
      }

      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      const pdfBlob = pdf.output("blob");

      // Add PDF to ZIP
      zip.file(`${regNo}.pdf`, pdfBlob);
      fileCount++;

      // When 800 files reached or it's the last file — finalize ZIP
      if (fileCount === batchSize || index === regNos.length - 1) {
        const batchEnd = baseRegNo + index;
        const zipName = `${batchStart}-${batchEnd}.zip`;

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, zipName);

        console.log(`✅ Downloaded: ${zipName}`);

        // Prepare for next batch
        zip = new JSZip();
        fileCount = 0;
        batchStart = batchEnd + 1;
        currentBatch++;

        // Small pause before next ZIP
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log("🎉 All ZIPs created successfully!");
  } catch (err) {
    console.error("Error generating ZIPs:", err);
  }
};


  if (loading) return <div>Loading registration details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button className="download-btn" onClick={() => handleDownloadSingle(registrationData.regNo)}>
          📥 Download Admit Card PDF
        </button>
        <button
          className="download-btn"
          style={{ marginLeft: "10px" }}
          onClick={handleDownloadMultiple}
        >
          📦 Download Next 10 Admit Cards ZIP
        </button>
      </div>

      <div ref={componentRef}>
        {registrationData && (
          <AdmitCard
            qrcode={qrCodeUrl}
            name={registrationData.name}
            fname={registrationData.fName}
            gender={registrationData.gender}
            categ={registrationData.category}
            subCategory={registrationData.subCategory || "----"}
            phType={registrationData.phType || "----"}
            dob={formatDate(registrationData.dob)}
            address={registrationData.address}
            roll_t1={registrationData.rollNumber}
            subject={registrationData.subject || "Some Subject"}
            photo={registrationData.imagePath}
            sign={registrationData.signaturePath}
            centre_name={
              registrationData.assignedCentre
                ? registrationData.assignedCentre.centreName
                : ""
            }
            city_name={
              registrationData.assignedCentre
                ? registrationData.assignedCentre.cityName
                : ""
            }
            idno={registrationData.photoId}
          />
        )}
      </div>
    </div>
  );
};

export default AdmitCardPage;
