document.getElementById("add-item-btn").addEventListener("click", addItem);

function addItem() {
  const tbody = document.getElementById("invoice-body");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td contenteditable="true">New Service</td>
    <td contenteditable="true" class="rate">0</td>
    <td contenteditable="true" class="hours">0</td>
    <td class="amount">₹0.00</td>
    <td><button class="delete-item-btn">Delete</button></td>
  `;
  tbody.appendChild(tr);

  tr.querySelectorAll(".rate, .hours").forEach((cell) => {
    cell.addEventListener("input", calculateItemTotal);
  });

  tr.querySelector(".delete-item-btn").addEventListener("click", function () {
    this.closest("tr").remove();
    calculateTotal();
  });
}

function calculateItemTotal(event) {
  const tr = event.target.closest("tr");
  const rate = parseFloat(tr.querySelector(".rate").innerText) || 0;
  const hours = parseFloat(tr.querySelector(".hours").innerText) || 0;
  const amount = rate * hours;
  tr.querySelector(".amount").innerText = `₹${amount.toFixed(2)}`;

  calculateTotal();
}
function updateTotalDue() {
  const totalDue = document.getElementById("total").innerText;
  document.getElementById("total-due").innerText = totalDue;
}

function calculateTotal() {
  const amounts = document.querySelectorAll(".amount");
  let subTotal = 0;
  amounts.forEach((amountCell) => {
    subTotal += parseFloat(amountCell.innerText.replace("₹", ""));
  });

  document.getElementById("sub-total").innerText = subTotal.toFixed(2);

  const discountInput = document.getElementById("discount-input");
  const discount = parseFloat(discountInput.value) || 0;
  const total = subTotal - discount;
  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
  updateTotalDue();
}

function finalInvoice() {
  document
    .getElementById("discount-input")
    .addEventListener("input", calculateTotal);
  addItem();
}
finalInvoice();
function handlePrint() {
  // clone invoice container
  const invoiceClone = document
    .querySelector(".invoice-container")
    .cloneNode(true);

  // content-editable elements
  invoiceClone.querySelectorAll(".content-editable").forEach((element) => {
    if (element.textContent.trim() === "") {
      element.classList.add("empty-content");
    }
  });

  //  input elements
  invoiceClone.querySelectorAll("input").forEach((input) => {
    if (input.value.trim() === "") {
      input.classList.add("empty-content");
    } else {
      const span = document.createElement("span");
      span.textContent = input.value;
      input.parentNode.replaceChild(span, input);
    }
  });

  // new window for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write("<html><head><title>Invoice</title>");
  printWindow.document.write(
    '<link rel="stylesheet" type="text/css" href="./styles.css">'
  );
  printWindow.document.write(
    '<link rel="stylesheet" type="text/css" href="./print.css">'
  );
  printWindow.document.write("</head><body>");
  printWindow.document.write(invoiceClone.outerHTML);
  printWindow.document.write("</body></html>");
  printWindow.document.close();

  // Print
  printWindow.print();
}
