import React from "react";

const AdmitCard = ({
  qrcode,
  name,
  fname,
  gender,
  categ,
  dob,
  address,
  roll_t1,
  subject,
  subCategory,
  phType,
  photo,
  sign,
  centre_name,
  centreCode,
  cityCode,
  city_name,
  idtype,
  idno,
}) => {
  {console.log(centreCode)}
  return (
    <div className="hindi admit-card">
      {/* Header */}
      <table className="header-table" style={{ width: "100%", marginBottom: "5px" }}>
        <tbody>
          <tr>
            <td style={{ width: "17%" }}>
              <img
                src="/ubse_white.jpg"
                style={{ maxWidth: "130px", width: "100%", height: "auto" }}
                alt="Logo"
              />
            </td>

            <td
              style={{
                verticalAlign: "top",
                paddingTop: "20px",
                lineHeight: "35px",
                textAlign: "center",
              }}
            >
              <div className="header-title" style={{ fontSize: "30px", fontWeight: "400" }}>
                उत्तराखण्ड विद्यालयी शिक्षा परिषद्, रामनगर (नैनीताल)
              </div>
              <div className="header-subtitle" style={{ fontSize: "22px", fontWeight: "bold" }}>
                द्विवर्षीय डी. एल. एड. (D.El.Ed.) प्रशिक्षण हेतु प्रवेश परीक्षा 2025
              </div>
              <div className="header-main" style={{ fontSize: "20px", fontWeight: "bold" }}>
                प्रवेश पत्र (Admit Card)
              </div>
            </td>

            <td style={{ width: "17%", textAlign: "right" }}>
              <img
                src={qrcode}
                style={{ maxWidth: "130px", width: "100%", height: "auto" }}
                alt="QR Code"
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Candidate Info */}
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
        border="1"
      >
        <tbody>
          <tr>
            <td style={{ width: "12%" }}>अनुक्रमांक</td>
            <td style={{ width: "28%", fontSize: "28px" }}>
              <b>{roll_t1}</b>
            </td>
            <td style={{ width: "4%", textAlign: "center" }}>लिंग</td>
            <td style={{ width: "10%", textAlign: "center" }}>जन्मतिथि</td>
            <td style={{ width: "4%", textAlign: "center" }}>श्रेणी</td>
            <td style={{ width: "9%", textAlign: "center" }}>क्षैतिज श्रेणी</td>
            <td rowSpan="4" style={{ width: "16%", textAlign: "center", padding: "0px" }}>
              <img src={photo} style={{ maxWidth: "140px", width: "100%", height: "auto" }} alt="Photo" />
              <br />
              <img src={sign} style={{ maxWidth: "160px", width: "100%", height: "auto" }} alt="Signature" />
            </td>
          </tr>

          <tr>
            <td>अभ्यर्थी का नाम</td>
            <td><b>{name}</b></td>
            <td style={{ textAlign: "center" }}><b>{gender}</b></td>
            <td style={{ textAlign: "center" }}><b>{dob}</b></td>
            <td style={{ textAlign: "center" }}><b>{categ}</b></td>
            <td style={{ textAlign: "center" }}><b>{subCategory}</b></td>
          </tr>

          <tr>
            <td>पिता का नाम</td>
            <td><b>{fname}</b></td>
            <td colSpan="3" style={{ textAlign: "center" }}>प्रशिक्षण हेतु आवेदित वर्ग</td>
            <td style={{ textAlign: "center" }}>दिव्यांगता का प्रकार</td>
          </tr>

          <tr>
            <td>फोटो पहचान पत्र</td>
            <td><b>{idtype} ({idno})</b></td>
            <td colSpan="3" style={{ textAlign: "center" }}><b>D.El.Ed.</b></td>
            <td style={{ textAlign: "center" }}><b>{phType}</b></td>
          </tr>

          <tr>
            <td colSpan="5" style={{ padding: "5px" }} className="hind-regular">
              परीक्षा शहर का नाम : <b>({cityCode}) {city_name}</b><br />
              परीक्षा केंद्र का नाम : <b>({centreCode}) {centre_name}</b>
            </td>
            <td colSpan="2" style={{ textAlign: "center", lineHeight: "25px" }}>
              परीक्षा तिथि एवं समय<br />
              <b>22/11/2025 (शनिवार)<br />प्रातः 10:00 बजे से अपरान्ह 12:30 बजे तक</b>
            </td>
          </tr>

          <tr>
            <td>पत्र व्यवहार का पता</td>
            <td colSpan="4">{address}</td>
            <td colSpan="2" style={{ textAlign: "center" }}>
              <img src="/Sign1.jpg" style={{ maxWidth: "100px", width: "100%", height: "auto" }} alt="Authority Sign" />
              <br />
              सचिव<br />
              उत्तराखण्ड विद्यालयी शिक्षा परिषद्<br />
              रामनगर (नैनीताल)
            </td>
          </tr>
        </tbody>
      </table>

      {/* Instructions */}
      <table className="instructions-table" style={{ width: "100%", lineHeight: "32px", marginTop: "20px" }}>
  <tbody>
    <tr>
      <td colSpan="2" style={{ textAlign: "center", padding: "10px", fontSize: "30px" }}>
        :: महत्वपूर्ण निर्देश ::
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>1.</td>
      <td>
        अभ्यर्थी परीक्षा तिथि को परीक्षा प्रारम्भ होने से 1 घंटा पूर्व निर्धारित परीक्षा केंद्र पर उपस्थित हो जायें |
        परीक्षा आरम्भ होने के 30 मिनट पश्चात् किसी भी अभ्यर्थी को परीक्षा कक्ष में प्रवेश करने की अनुमति नहीं दी जायेगी |
        परीक्षा में बैठने के लिए प्रवेश-पत्र अपने साथ लाना अनिवार्य है |
        बिना प्रवेश पत्र किसी भी अभ्यर्थी को परीक्षा में सम्मिलित नहीं किया जायेगा |
        प्रवेश-पत्र को भविष्य में रिकार्ड के लिए सुरक्षित रखें |
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>2.</td>
      <td>
        ओ. एम. आर. उत्तर पत्रक भरने के लिये काली/नीली स्याही के बॉल पॉइंट पेन का ही प्रयोग करें | पेन्सिल का प्रयोग वर्जित है |
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>3.</td>
      <td>
        अभ्यर्थी को परीक्षा हॉल/कक्ष के भीतर प्रवेश-पत्र, परिचय पत्र (आई.डी.) और काले/नीले बॉल प्वाइंट पेन के अतिरिक्त किसी भी प्रकार की पाठ्य सामग्री,
        मोबाइल, पेजर, कैलकुलेटर, डिजिटल घड़ी, इलेक्ट्रानिक उपकरण (गैजेट), मुद्रित/लिखित सामग्री, कागज के टुकड़े आदि को ले जाने की अनुमति नहीं है |
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>4.</td>
      <td>
        कोरोना वायरस <b>(COVID-19)</b> जैसे अन्य संक्रमण की रोकथाम के दृष्टिगत परीक्षा केन्द्र पर दिये गये निर्देशों का अक्षरशः पालन करना अभ्यर्थी को अनिवार्य होगा |
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>5.</td>
      <td>परीक्षार्थी स्वच्छता एवं सफाई का विशेष ध्यान रखें |</td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>6.</td>
      <td>
        परीक्षा कक्ष में किसी भी प्रकार का वार्तालाप, इशारे या व्यवधान को दुर्व्यवहार माना जायेगा |
        यदि कोई अभ्यर्थी अनुचित तरीकों का प्रयोग करता हुआ अथवा किसी अन्य के स्थान पर परीक्षा देता हुआ पाया गया
        तो उसका अभ्यर्थन निरस्त करते हुए उसे अपराध की प्रकृति के अनुरूप स्थायी रूप से अथवा एक निर्दिष्ट अवधि के लिए
        परीक्षा देने से वंचित कर दिया जायेगा |
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>7.</td>
      <td>
        परीक्षा में अभ्यर्थी को उनके द्वारा ऑनलाइन आवेदन में अंकित तथ्यों के आधार पर सम्मिलित कराया जा रहा है
        तथा उनका अभ्यर्थन नितान्त औपबंधिक है |
        अभ्यर्थी द्वारा गलत जानकारी/तथ्यों के आधार पर परीक्षा में सम्मिलित होना/प्रमाण-पत्र प्राप्त करने का संज्ञान होने पर
        उसका अभ्यर्थन/परीक्षाफल निरस्त कर दिया जायेगा और उसके विरुद्ध वैधानिक कार्यवाही की जायेगी |
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>8.</td>
      <td>
        यदि किसी अभ्यर्थी का प्रवेश पत्र बिना फोटो के है तो वह परीक्षा केंद्र पर अपने 2 नवीनतम पासपोर्ट
        साइज फोटो एवं ऑनलाइन आवेदन पत्र की फोटोप्रति एवं प्रवेश पत्र में अंकित फोटोयुक्त पहचान पत्र प्रस्तुत करेगा |
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>9.</td>
      <td>
        <b>प्रत्येक अभ्यर्थी को परीक्षा केंद्र पर अपने साथ अपनी पहचान हेतु प्रवेश-पत्र के साथ प्रवेश पत्र में अंकित फोटोयुक्त पहचान पत्र लाना अनिवार्य है |</b>
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>10.</td>
      <td>
        दिव्यांग आवेदकों को दिव्यांगता संबंधी समस्त प्रमाण पत्र/प्रपत्र अपने साथ लाना अनिवार्य है। 
        प्रमाण पत्र प्रस्तुत करने पर ही प्रतिपूरक समय प्रदान किया जा सकेगा।
      </td>
    </tr>

    <tr>
      <td style={{ width: "5%", minWidth: "25px", verticalAlign: "top" }}>11.</td>
      <td>
        जिन अभ्यर्थियों को माननीय उच्च न्यायालय उत्तराखण्ड, नैनीताल के आदेशानुसार परीक्षा में सम्मिलित कराया जा रहा है,
        उनका परीक्षाफल माननीय उच्च न्यायालय उत्तराखण्ड नैनीताल के अंतिम निर्णय के अधीन रहेगा |
      </td>
    </tr>

    <tr>
      <td colSpan="2">
        <div
          className="signature-div"
          style={{
            width: "200px",
            textAlign: "center",
            fontWeight: "bold",
            lineHeight: "20px",
            float: "right",
          }}
        >
          <img src="/Sign1.jpg" style={{ maxWidth: "100px", width: "100%", height: "auto" }} alt="Final Signature" />
          <br />
          सचिव<br />
          उत्तराखण्ड विद्यालयी शिक्षा परिषद्,<br />
          रामनगर (नैनीताल)
        </div>
      </td>
    </tr>
  </tbody>
</table>

    </div>
  );
};

export default AdmitCard;
