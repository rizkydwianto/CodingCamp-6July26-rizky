// ==========================
// ELEMENT
// ==========================

const form = document.getElementById("transactionForm");
const itemName = document.getElementById("itemName");
const amount = document.getElementById("amount");
const category = document.getElementById("category");

const transactionList = document.getElementById("transactionList");
const balance = document.getElementById("balance");

// ==========================
// LOCAL STORAGE
// ==========================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let chart = null;

// ==========================
// FORM SUBMIT
// ==========================

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = itemName.value.trim();
    const money = parseFloat(amount.value);
    const cat = category.value;

    if (name === "" || isNaN(money) || cat === "") {
        alert("Please complete all fields!");
        return;
    }

    const transaction = {
        id: Date.now(),
        item: name,
        amount: money,
        category: cat
    };

    transactions.push(transaction);

    saveData();

    form.reset();
});

// ==========================
// SAVE
// ==========================

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    displayTransactions();
}

// ==========================
// DISPLAY
// ==========================

function displayTransactions() {

    transactionList.innerHTML = "";

    let total = 0;

    let food = 0;
    let transport = 0;
    let fun = 0;

    transactions.forEach((transaction) => {

        total += transaction.amount;

        switch (transaction.category) {
            case "Food":
                food += transaction.amount;
                break;

            case "Transport":
                transport += transaction.amount;
                break;

            case "Fun":
                fun += transaction.amount;
                break;
        }

        transactionList.innerHTML += `
            <div class="item">

                <div class="item-info">

                    <h4>${transaction.item}</h4>

                    <div class="amount">
                        $${transaction.amount.toFixed(2)}
                    </div>

                    <span class="category">
                        ${transaction.category}
                    </span>

                </div>

                <button class="delete" onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>

            </div>
        `;
    });

    balance.textContent = "$" + total.toFixed(2);

    updateChart(food, transport, fun);
}

// ==========================
// DELETE
// ==========================

function deleteTransaction(id) {

    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });

    saveData();
}

// ==========================
// PIE CHART
// ==========================

function updateChart(food, transport, fun) {

    const canvas = document.getElementById("expenseChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: ["Food", "Transport", "Fun"],

            datasets: [{
                data: [food, transport, fun],

                backgroundColor: [
                    "#4CAF50",
                    "#2196F3",
                    "#FF9800"
                ]
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });

}

// ==========================
// LOAD
// ==========================

displayTransactions();