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
  try {
    const response = await fetch("/api/config");
    if (response.ok) {
      const config = await response.json();
      const { googleSheetApi } = config;

      // Replace the fetch URL with the retrieved link and key
      const sheetResponse = await fetch(`${googleSheetApi}`);
      if (sheetResponse.ok) {
        const data = await sheetResponse.json();
        const values = data.values;
        const phoneNumberColumnIndex = 15; // Assuming phone numbers are in the first column (index 0)

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

            if (row[1] === "" && row[1] === "ucak" && row[16] !== "") {
              status = "Siparişiniz alındı. Kontrol için gelmesini bekliyoruz.";
            } else if (row[16] === "habar edildi") {
              status = `Siparişiniz geldi, "${row[14]}" kişisine haber verildi.`;
            } else if (row[16] === "gowşuryldy") {
              status = `Siparişiniz geldi, "${row[14]}" kişisine teslim edildi.`;
            } else if (row[1] === "iade") {
              status = "Maalesef siparişiniz kusurlu geldiği için iade edildi.";
            } else if (
              row[1] === "ucak1" ||
              row[1] === "ucak2" ||
              row[1] === "ucak3" ||
              row[1] === "ucak4"
            ) {
              status =
                "Siparişiniz İstanbul'dan Aşkabata doğru yola çıktı. Tahmini gelme süresi en kısa zamanda burada gözükecektir.";
            } else if (
              row[1] === 1 ||
              row[1] === 2 ||
              row[1] === 3 ||
              (row[1] === 4 &&
                row[16] !== "habar edildi" &&
                row[16] !== "gowşuryldy")
            ) {
              status =
                "Siparişiniz İstanbul'dan Aşkabata doğru yola çıktı. Tahmini gelme süresi en kısa zamanda burada gözükecektir.";
            } else {
              status = `Siparişiniz İstanbul'dan Aşkabata doğru yola çıktı. Siparişiniz tahmini olarak ${row[1]} tarihleri arasında gelecektir.`;
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
        } else {
          telMessage.innerHTML =
            "Maalesef girdiğiniz telefon numarasına ait sipariş bulunamadı.";
        }
      } else {
        throw new Error(
          "Failed to fetch data from Google Sheets. Please try again later."
        );
      }
    } else {
      throw new Error(
        "Failed to fetch API configuration. Please try again later."
      );
    }
  } catch (error) {
    console.error(error);
    telMessage.innerHTML = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }
}
