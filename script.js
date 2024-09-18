document.getElementById("add-item-btn").addEventListener("click", addItem);

function addItem() {
  const tbody = document.getElementById("invoice-body");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td contenteditable="true">New Service</td>
    <td contenteditable="true" class="rate">0</td>
    <td contenteditable="true" class="hours">0</td>
    <td class="amount">$0.00</td>
    <td><button class="delete-item-btn">Delete</button></td>
  `;
  tbody.appendChild(tr);

  tr.querySelectorAll(".rate, .hours").forEach((cell) => {
    cell.addEventListener("blur", calculateItemTotal);
  });

  tr.querySelector(".delete-item-btn").addEventListener("click", function () {
    this.closest("tr").remove();
    calculateTotal();
  });
}

function calculateItemTotal(event) {
  const tr = event.target.closest("tr");
  const rate = parseFloat(tr.querySelector(".rate").innerText);
  const hours = parseFloat(tr.querySelector(".hours").innerText);
  const amount = rate * hours;
  tr.querySelector(".amount").innerText = `$${amount.toFixed(2)}`;

  calculateTotal();
}

function calculateTotal() {
  const amounts = document.querySelectorAll(".amount");
  let subTotal = 0;
  amounts.forEach((amountCell) => {
    subTotal += parseFloat(amountCell.innerText.replace("$", ""));
  });

  document.getElementById("sub-total").innerText = subTotal.toFixed(2);
  // Let's say the discount is always 30% for the sake of this example
  const discount = subTotal * 0.3;
  document.getElementById("discount").innerText = discount.toFixed(2);
  const total = subTotal - discount;
  document.getElementById("total").innerText = total.toFixed(2);
}

// Initial item
addItem();

document.getElementById("downloadPdf").addEventListener("click", function () {
  var element = document.querySelector(".invoice-container");
  var opt = {
    margin: 1,
    filename: "invoice.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };
  html2pdf().set(opt).from(element).save();
});
