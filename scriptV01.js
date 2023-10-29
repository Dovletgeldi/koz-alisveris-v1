const information = document.getElementById("information");
const telInput = document.getElementById("tel-input");
const telMessage = document.getElementById("tel-message");
const telSubmit = document.getElementById("tel-submit");

// Reset the form
function resetForm() {
  telMessage.innerHTML = "";
  const tableElement = document.querySelector(".order-table");
  if (tableElement) {
    tableElement.remove();
  }
}

// when telSubmit is clicked
telSubmit.addEventListener("click", function () {
  resetForm();

  telMessage.innerHTML = "Aranıyor...";
  const phoneNumber = telInput.value;
  getDataFromSheet(phoneNumber);
});

// Fetch data from Google Sheets
async function getDataFromSheet(phoneNumber) {
  const response1 = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1oj6CSda05eOaSpYyOGl2WrwH-1-3TGQoQJwTO5FLmzU/values/Genel!A:R?key=AIzaSyCVdAOP5Sq6_2TsvgViEvHLC_hrrQJYCTo`
  );
  const response2 = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1c0pAa8lyQWlLwIRcWwxxxcHMjnLJrn_MRcYEhV5U2U8/values/Genel!A:R?key=AIzaSyCVdAOP5Sq6_2TsvgViEvHLC_hrrQJYCTo`
  );

  if (response1.ok && response2.ok) {
    const data1 = await response1.json();
    const data2 = await response2.json();
    const combinedData = {
      values: [...data1.values, ...data2.values],
    };
    const values = combinedData.values;
    const phoneNumberColumnIndex = 15;

    // Find data for the entered phone number
    const foundData = values.filter(
      (row) => row[phoneNumberColumnIndex] === phoneNumber
    );

    if (foundData.length > 0) {
      telMessage.innerHTML = `Değerli müşterimiz ${foundData[0][14]}, siparişleriniz şu şekildedir:`;

      // Create the table
      const tableElement = document.createElement("table");
      tableElement.classList.add("order-table", "fade-in");

      // Create the table header
      const theadElement = document.createElement("thead");
      const headerRow = document.createElement("tr");

      // Dates
      const datesTextElement = document.createElement("th");
      datesTextElement.textContent = "Tarihi";
      headerRow.appendChild(datesTextElement);

      // Product
      const productTextElement = document.createElement("th");
      productTextElement.textContent = "Ürün İsmi";
      headerRow.appendChild(productTextElement);

      // howMany
      const howManyTextElement = document.createElement("th");
      howManyTextElement.textContent = "Adeti";
      headerRow.appendChild(howManyTextElement);

      // Price
      const priceTextElement = document.createElement("th");
      priceTextElement.textContent = "Fiyatı (TL)";
      headerRow.appendChild(priceTextElement);

      // weight
      const weightTextElement = document.createElement("th");
      weightTextElement.textContent = "KG (TMT)";
      headerRow.appendChild(weightTextElement);

      // TotalPrice
      const totalPriceTextElement = document.createElement("th");
      totalPriceTextElement.textContent = "Toplam Fiyatı (TMT)";
      headerRow.appendChild(totalPriceTextElement);

      // Status
      const statusTextElement = document.createElement("th");
      statusTextElement.textContent = "Durumu";
      headerRow.appendChild(statusTextElement);

      // Append the header row to the table header
      theadElement.appendChild(headerRow);

      // Create the table body
      const tbodyElement = document.createElement("tbody");

      // Populate the table body with data
      foundData.forEach((row) => {
        const date = row[3];
        const product = row[7];
        const howMany = row[5];
        const price = row[6];
        const weight = row[11];
        const totalPrice = row[13];
        let status;

        if (row[16] == "habar edildi") {
          status = `Siparişiniz geldi, "${row[14]}" kişisine haber verildi.`;
        } else if (row[16] == "gowşuryldy" || row[16] == "gowushdy") {
          status = `Siparişiniz geldi, "${row[14]}" kişisine teslim edildi.`;
        } else if (row[1] == "iade") {
          status = "Maalesef siparişiniz kusurlu geldiği için iade edildi.";
        } else if (row[1] == "iptal") {
          status = "Siparişiniz iptal edilmiştir.";
        } else if (
          row[1] === "ucak1" ||
          row[1] === "ucak2" ||
          row[1] === "ucak3" ||
          row[1] === "ucak4"
        ) {
          status =
            "Siparişiniz İstanbul'dan Aşkabata doğru yola çıktı. Tahmini gelme süresi en kısa zamanda burada gözükecektir.";
        } else if (row[1] == 1 || row[1] == 2 || row[1] == 3 || row[1] == 4) {
          status =
            "Siparişiniz İstanbul'dan Aşkabata doğru yola çıktı. Tahmini gelme süresi en kısa zamanda burada gözükecektir.";
        } else if (
          row[1] === "" ||
          (row[1] === "ucak" && typeof row[16] === "undefined")
        ) {
          status = "Siparişiniz alındı. Kontrol için gelmesini bekliyoruz.";
        } else if (row[11] != 0) {
          status = "Siparişiniz geldi, hemen arayıp alabilirsiniz.";
        } else {
          function checker() {
            var pattern = /^[0-9\-.]{8}$/;
            let a = row[1];
            return pattern.test(a);
          }
          if (checker() === true) {
            status = `Siparişiniz İstanbul'dan Aşkabata doğru yola çıktı. Tahmini olarak ${row[1]} tarihleri arasında gelecektir.`;
          } else {
            status = "Ürün durumunda sıkıntı var, lütfen bize haber verin.";
          }
        }

        // Create a row in the table body
        const rowElement = document.createElement("tr");

        // Dates
        const dateCell = document.createElement("td");
        dateCell.textContent = date;
        rowElement.appendChild(dateCell);

        // Product
        const productCell = document.createElement("td");
        productCell.textContent = product;
        rowElement.appendChild(productCell);

        // howMany
        const howManyCell = document.createElement("td");
        howManyCell.textContent = howMany;
        rowElement.appendChild(howManyCell);

        // Price
        const priceCell = document.createElement("td");
        priceCell.textContent = price;
        rowElement.appendChild(priceCell);

        // Weight
        const weightCell = document.createElement("td");
        weightCell.textContent = weight;
        rowElement.appendChild(weightCell);

        // Price
        const totalPriceCell = document.createElement("td");
        totalPriceCell.textContent = totalPrice;
        rowElement.appendChild(totalPriceCell);

        // Status
        const statusCell = document.createElement("td");
        statusCell.textContent = status;
        rowElement.appendChild(statusCell);

        // Append the row to the table body
        tbodyElement.appendChild(rowElement);
      });

      // Append the table header and body to the table
      tableElement.appendChild(theadElement);
      tableElement.appendChild(tbodyElement);

      // Append the table to the document body
      document.body.appendChild(tableElement);

      document.body.appendChild(information);

      information.innerHTML =
        "*Değerli müşterimiz siparişleriniz sistemimize sipariş verkdikten 24 saat sonra düşmektedir.";
    } else {
      telMessage.innerHTML =
        'Maalesef girdiğiniz telefon numarasına ait sipariş bulunamadı. Girdiğiniz numaranın doğruluğundan ve başında "8" veya "+993" olmadığından emin olun.<br><br>YA DA<br><br>Hemen sipariş verin:<br>IMO: +90 541 942 0722<br>Link: +90 541 942 0722, ID: kozalisveris<br> Instagram: @koz.tm  <br><br> *Değerli müşterimiz siparişleriniz sistemimize sipariş verkdikten 24 saat sonra düşmektedir. ';
    }
  } else {
    throw new Error(
      "Failed to fetch data from Google Sheets. Please try again later."
    );
  }
}
