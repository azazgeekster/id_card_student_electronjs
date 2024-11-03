document.body.zoom=1.2; 
var qrcodeContainer = document.getElementById("qrcode");
var qrcode = new QRCode(qrcodeContainer, {
  text: $('.card_cne').text(), // URL or any other text you want to encode
  width: 50, // Width and Height of the QR code
  height: 50,
  correctLevel : QRCode.CorrectLevel.L
});
function preview_pdf() {
  const content = document.getElementById("print-this");
  html2canvas(content,{scale:3}).then((canvas) => {
    console.log(canvas.height);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF('l','mm', [244, 154]);
    const imgWidth = 86;
    const pageHeight = 123.8;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    window.open(pdf.output("bloburl", { filename: "myFileName.pdf" }));
  });
}


function make_image() {
  html2canvas(document.getElementsByClassName("container-card")[0], {
    useCORS: true,
    scale:2
  }).then(function (canvas) {
    var imgBase64 = canvas.toDataURL();
    console.log("imgBase64:", imgBase64);
    var imgURL = "data:image/" + imgBase64;
    var triggerDownload = $("<a>")
      .attr("href", imgURL)
      .attr("download", `card_${document.getElementsByClassName('card_cne')[0].innerHTML}.jpeg`)
      .appendTo("body");
    triggerDownload[0].click();
    triggerDownload.remove();
  });
}
