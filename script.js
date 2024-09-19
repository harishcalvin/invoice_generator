document.getElementById("add-item-btn").addEventListener("click", addItem);

function addItem() {
  const tbody = document.getElementById("invoice-body");
  const tr = document.createElement("tr");
  /*
     delete button show only on hover and Delete the item
    */
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

document
  .getElementById("discount-input")
  .addEventListener("input", calculateTotal);
addItem();

document.getElementById("downloadPdf").addEventListener("click", function () {
  var element = document.querySelector(".invoice-container");

  // Store original styles and content
  const originalStyle = element.style.cssText;
  const originalContent = element.innerHTML;

  // Adjust the container size and styles for PDF
  element.style.width = "210mm";
  element.style.height = "297mm";
  element.style.padding = "10mm";
  element.style.fontSize = "10px";

  // Hide empty editable fields and their placeholders
  const editableFields = element.querySelectorAll(
    '[contenteditable="true"], input[type="date"], #discount-input'
  );
  editableFields.forEach((field) => {
    if (field.tagName === "INPUT") {
      if (!field.value.trim()) {
        field.style.display = "none";
      }
    } else {
      if (!field.innerText.trim()) {
        field.style.display = "none";
      }
    }
  });

  // Hide the last column (delete button column)
  const tableRows = document.querySelectorAll(".invoice-table tr");
  tableRows.forEach((row) => {
    const cells = row.cells;
    if (cells.length > 0) {
      cells[cells.length - 1].style.display = "none";
    }
  });

  var opt = {
    margin: 0,
    filename: "invoice.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1, logging: true, dpi: 300, letterRendering: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(function () {
      // Restore original content and styles
      element.innerHTML = originalContent;
      element.style.cssText = originalStyle;
    });
});
