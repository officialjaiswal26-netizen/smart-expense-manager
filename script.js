// ==========================================
// SMART EXPENSE MANAGER
// Personal Finance Coach
// Built by Priyanka Jaiswal
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

// Sidebar

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const sidebarOpen =
    document.getElementById("sidebarOpen");

const sidebarClose =
    document.getElementById("sidebarClose");

const sidebarCloseBottom =
    document.getElementById("sidebarCloseBottom");

const app =
    document.getElementById("app");


// Form

const transactionForm =
    document.getElementById("transactionForm");

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const typeInput =
    document.getElementById("type");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const submitButton =
    document.getElementById("submitButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const formMode =
    document.getElementById("formMode");


// Controls

const exportButton =
    document.getElementById("exportButton");

const clearAllButton =
    document.getElementById("clearAllButton");

const searchInput =
    document.getElementById("searchInput");

const filterType =
    document.getElementById("filterType");

const filterCategory =
    document.getElementById("filterCategory");

const filterMonth =
    document.getElementById("filterMonth");


// Transaction list

const transactionList =
    document.getElementById("transactionList");


// Summary

const totalIncomeElement =
    document.getElementById("totalIncome");

const totalExpenseElement =
    document.getElementById("totalExpense");

const balanceElement =
    document.getElementById("balance");


// Money health

const healthScoreElement =
    document.getElementById("healthScore");

const healthMessageElement =
    document.getElementById("healthMessage");

const savingsRateElement =
    document.getElementById("savingsRate");

const savingsProgressElement =
    document.getElementById("savingsProgress");

const dailySafeSpendElement =
    document.getElementById("dailySafeSpend");


// Insights

const smartInsightElement =
    document.getElementById("smartInsight");


// Analytics

const totalTransactionsElement =
    document.getElementById("totalTransactions");

const highestCategoryElement =
    document.getElementById("highestCategory");

const averageExpenseElement =
    document.getElementById("averageExpense");

const noSpendDaysElement =
    document.getElementById("noSpendDays");

const categoryChart =
    document.getElementById("categoryChart");

const monthlyChart =
    document.getElementById("monthlyChart");


// ==========================================
// STORAGE
// ==========================================

const STORAGE_KEY =
    "priyankaSmartExpenseManager_v3";


// ==========================================
// STATE
// ==========================================

let editId = null;

let transactions =
    loadTransactions();


// ==========================================
// INITIALIZE
// ==========================================

setToday();

renderAll();


// ==========================================
// SIDEBAR
// ==========================================

function openSidebar() {

    sidebar.classList.add("open");

    sidebarOverlay.classList.add("show");


    if (
        window.innerWidth > 980
    ) {

        app.classList.add(
            "sidebar-pushed"
        );

    }

}


function closeSidebar() {

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove("show");

    app.classList.remove(
        "sidebar-pushed"
    );

}


sidebarOpen.addEventListener(
    "click",
    openSidebar
);


sidebarClose.addEventListener(
    "click",
    closeSidebar
);


sidebarCloseBottom.addEventListener(
    "click",
    closeSidebar
);


sidebarOverlay.addEventListener(
    "click",
    closeSidebar
);


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeSidebar();

        }

    }
);


// ==========================================
// FORM SUBMIT
// ==========================================

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const description =
            descriptionInput.value.trim();


        const amount =
            Number(
                amountInput.value
            );


        const type =
            typeInput.value;


        const category =
            categoryInput.value;


        const date =
            dateInput.value;


        if (
            !description ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            !date
        ) {

            alert(
                "Please enter valid transaction details."
            );

            return;

        }


        // ADD

        if (
            editId === null
        ) {

            transactions.push({

                id:
                    createId(),

                description,

                amount,

                type,

                category,

                date

            });

        }


        // UPDATE

        else {

            transactions =
                transactions.map(
                    function (transaction) {

                        if (
                            transaction.id ===
                            editId
                        ) {

                            return {

                                ...transaction,

                                description,

                                amount,

                                type,

                                category,

                                date

                            };

                        }


                        return transaction;

                    }
                );

        }


        saveTransactions();

        resetForm();

        renderAll();

    }
);


// ==========================================
// CANCEL EDIT
// ==========================================

cancelEditButton.addEventListener(
    "click",
    resetForm
);


// ==========================================
// SEARCH & FILTER
// ==========================================

searchInput.addEventListener(
    "input",
    renderTransactions
);


filterType.addEventListener(
    "change",
    renderTransactions
);


filterCategory.addEventListener(
    "change",
    renderTransactions
);


filterMonth.addEventListener(
    "change",
    renderAll
);


// ==========================================
// CLEAR ALL DATA
// ==========================================

clearAllButton.addEventListener(
    "click",
    function () {

        if (
            transactions.length === 0
        ) {

            alert(
                "There is no saved transaction data."
            );

            return;

        }


        const confirmed =
            confirm(
                "This will permanently delete all saved transactions. Continue?"
            );


        if (!confirmed) {
            return;
        }


        transactions = [];

        saveTransactions();

        resetForm();

        renderAll();

    }
);


// ==========================================
// CSV EXPORT
// ==========================================

exportButton.addEventListener(
    "click",
    exportCSV
);


// ==========================================
// LOAD DATA
// ==========================================

function loadTransactions() {

    try {

        let saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {

            saved =
                localStorage.getItem(
                    "smartExpenseManager_v2"
                );

        }


        if (!saved) {

            saved =
                localStorage.getItem(
                    "transactions"
                );

        }


        if (!saved) {

            return [];

        }


        const parsed =
            JSON.parse(saved);


        if (
            !Array.isArray(parsed)
        ) {

            return [];

        }


        return parsed.map(
            function (transaction) {

                return {

                    id:
                        transaction.id ||
                        createId(),

                    description:
                        String(
                            transaction.description ||
                            "Untitled"
                        ),

                    amount:
                        Number(
                            transaction.amount
                        ) || 0,

                    type:
                        transaction.type ===
                        "income"
                            ? "income"
                            : "expense",

                    category:
                        String(
                            transaction.category ||
                            "Other"
                        ),

                    date:
                        transaction.date ||
                        getToday()

                };

            }
        );

    }

    catch (error) {

        console.error(
            "Could not load saved transactions:",
            error
        );

        return [];

    }

}


// ==========================================
// SAVE DATA
// ==========================================

function saveTransactions() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(
            transactions
        )

    );

}


// ==========================================
// RENDER ALL
// ==========================================

function renderAll() {

    renderTransactions();

    renderSummary();

    renderMoneyHealth();

    renderAnalytics();

    renderMonthlyPattern();

    renderSmartInsight();

}


// ==========================================
// FILTER
// ==========================================

function getFilteredTransactions() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedType =
        filterType.value;


    const selectedCategory =
        filterCategory.value;


    const selectedMonth =
        filterMonth.value;


    return transactions.filter(
        function (transaction) {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(
                        search
                    );


            const matchesType =
                selectedType === "all" ||
                transaction.type ===
                selectedType;


            const matchesCategory =
                selectedCategory ===
                    "all" ||
                transaction.category ===
                    selectedCategory;


            const matchesMonth =
                !selectedMonth ||
                transaction.date.startsWith(
                    selectedMonth
                );


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory &&
                matchesMonth
            );

        }
    );

}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function renderTransactions() {

    transactionList.innerHTML = "";


    const filtered =
        getFilteredTransactions()
            .sort(
                function (a, b) {

                    return (
                        new Date(b.date) -
                        new Date(a.date)
                    );

                }
            );


    if (
        filtered.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-state";


        empty.textContent =
            transactions.length === 0

                ? "No transactions yet. Add your first transaction."

                : "No transactions match your current filters.";


        transactionList.appendChild(
            empty
        );


        return;

    }


    filtered.forEach(
        function (transaction) {

            transactionList.appendChild(
                createTransactionElement(
                    transaction
                )
            );

        }
    );

}


// ==========================================
// TRANSACTION ELEMENT
// ==========================================

function createTransactionElement(
    transaction
) {

    const wrapper =
        document.createElement(
            "article"
        );


    wrapper.className =
        "transaction";


    const main =
        document.createElement(
            "div"
        );


    main.className =
        "transaction-main";


    const title =
        document.createElement(
            "h3"
        );


    title.className =
        "transaction-title";


    title.textContent =
        transaction.description;


    const meta =
        document.createElement(
            "p"
        );


    meta.className =
        "transaction-meta";


    meta.textContent =
        `${transaction.category} • ` +
        `${formatDate(transaction.date)} • ` +
        `${capitalize(transaction.type)}`;


    main.appendChild(title);

    main.appendChild(meta);


    const right =
        document.createElement(
            "div"
        );


    right.className =
        "transaction-right";


    const amount =
        document.createElement(
            "span"
        );


    amount.className =
        `transaction-amount ${transaction.type}`;


    amount.textContent =
        `${transaction.type === "income"
            ? "+"
            : "-"
        }₹${formatAmount(
            transaction.amount
        )}`;


    const editButton =
        document.createElement(
            "button"
        );


    editButton.className =
        "icon-button";

    editButton.type =
        "button";

    editButton.textContent =
        "Edit";


    editButton.addEventListener(
        "click",
        function () {

            startEdit(
                transaction.id
            );

        }
    );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.className =
        "icon-button";

    deleteButton.type =
        "button";

    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTransaction(
                transaction.id
            );

        }
    );


    right.appendChild(amount);

    right.appendChild(
        editButton
    );

    right.appendChild(
        deleteButton
    );


    wrapper.appendChild(main);

    wrapper.appendChild(right);


    return wrapper;

}


// ==========================================
// SUMMARY
// ==========================================

function calculateTotals() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    transaction.amount;

            }

            else {

                expense +=
                    transaction.amount;

            }

        }
    );


    return {

        income,

        expense,

        balance:
            income - expense

    };

}


function renderSummary() {

    const totals =
        calculateTotals();


    totalIncomeElement.textContent =
        `₹${formatAmount(
            totals.income
        )}`;


    totalExpenseElement.textContent =
        `₹${formatAmount(
            totals.expense
        )}`;


    balanceElement.textContent =
        `₹${formatAmount(
            totals.balance
        )}`;

}


// ==========================================
// MONEY HEALTH
// ==========================================

function renderMoneyHealth() {

    const totals =
        calculateTotals();


    if (
        totals.income <= 0
    ) {

        healthScoreElement.textContent =
            "0";


        healthMessageElement.textContent =
            "Add income and expenses to calculate your financial health.";


        savingsRateElement.textContent =
            "0%";


        savingsProgressElement.style.width =
            "0%";


        dailySafeSpendElement.textContent =
            "₹0";


        return;

    }


    const savingsRate =
        (
            totals.balance /
            totals.income
        ) * 100;


    const expenseRatio =
        (
            totals.expense /
            totals.income
        ) * 100;


    let score =
        100;


    if (
        expenseRatio > 50
    ) {

        score -=
            Math.min(
                30,
                expenseRatio - 50
            );

    }


    if (
        savingsRate < 20
    ) {

        score -=
            Math.min(
                25,
                20 - savingsRate
            );

    }


    if (
        totals.balance < 0
    ) {

        score -=
            30;

    }


    const expenseCount =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.type ===
                    "expense"
                );

            }
        ).length;


    if (
        expenseCount > 20
    ) {

        score -= 5;

    }


    score =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    score
                )
            )
        );


    healthScoreElement.textContent =
        score;


    const safeSavingsRate =
        Math.max(
            0,
            savingsRate
        );


    savingsRateElement.textContent =
        `${Math.round(
            safeSavingsRate
        )}%`;


    savingsProgressElement.style.width =
        `${Math.max(
            0,
            Math.min(
                100,
                safeSavingsRate
            )
        )}%`;


    if (
        score >= 80
    ) {

        healthMessageElement.textContent =
            "Great job! Your spending is under good control.";

    }

    else if (
        score >= 60
    ) {

        healthMessageElement.textContent =
            "You are doing reasonably well, but there is room to improve.";

    }

    else if (
        score >= 40
    ) {

        healthMessageElement.textContent =
            "Keep an eye on your spending. Your expenses are taking a larger share of income.";

    }

    else {

        healthMessageElement.textContent =
            "Your spending needs attention. Focus on essential expenses first.";

    }


    const today =
        new Date();


    const currentBalance =
        Math.max(
            0,
            totals.balance
        );


    const remainingDays =
        Math.max(
            1,
            getDaysInMonth(
                today.getFullYear(),
                today.getMonth()
            ) -
            today.getDate() +
            1
        );


    const dailySafeSpend =
        currentBalance /
        remainingDays;


    dailySafeSpendElement.textContent =
        `₹${formatAmount(
            dailySafeSpend
        )}`;

}


// ==========================================
// SMART INSIGHTS
// ==========================================

function renderSmartInsight() {

    if (
        transactions.length === 0
    ) {

        smartInsightElement.textContent =
            "Add a few transactions and I will analyze your spending pattern.";

        return;

    }


    const totals =
        calculateTotals();


    const expenses =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.type ===
                    "expense"
                );

            }
        );


    if (
        expenses.length === 0
    ) {

        smartInsightElement.textContent =
            "You have income recorded, but no expenses yet. This is a good time to create a spending plan.";

        return;

    }


    const categoryTotals = {};


    expenses.forEach(
        function (transaction) {

            categoryTotals[
                transaction.category
            ] =
                (
                    categoryTotals[
                        transaction.category
                    ] || 0
                ) +
                transaction.amount;

        }
    );


    const topCategory =
        Object.entries(
            categoryTotals
        )
            .sort(
                function (a, b) {

                    return b[1] - a[1];

                }
            )[0];


    const savingsRate =
        totals.income > 0
            ? (
                totals.balance /
                totals.income
            ) * 100
            : 0;


    const messages = [];


    if (
        topCategory
    ) {

        const percentage =
            (
                topCategory[1] /
                totals.expense
            ) * 100;


        messages.push(
            `Your biggest spending category is <strong>${topCategory[0]}</strong> at ₹${formatAmount(topCategory[1])}, around ${Math.round(percentage)}% of your recorded expenses.`
        );

    }


    if (
        savingsRate >= 30
    ) {

        messages.push(
            "Your savings rate is strong. Keep maintaining this discipline."
        );

    }

    else if (
        savingsRate >= 10
    ) {

        messages.push(
            "You are saving some money, but reducing discretionary expenses could improve your buffer."
        );

    }

    else {

        messages.push(
            "Your savings buffer is currently low. Prioritize essential expenses and monitor discretionary spending."
        );

    }


    smartInsightElement.innerHTML =
        messages.join(" ");

}


// ==========================================
// ANALYTICS
// ==========================================

function renderAnalytics() {

    const expenses =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.type ===
                    "expense"
                );

            }
        );


    totalTransactionsElement.textContent =
        transactions.length;


    if (
        expenses.length === 0
    ) {

        highestCategoryElement.textContent =
            "-";


        averageExpenseElement.textContent =
            "₹0";


        noSpendDaysElement.textContent =
            "0";


        categoryChart.innerHTML =
            `<div class="empty-state">
                Add expenses to see category analytics.
            </div>`;


        return;

    }


    const categoryTotals = {};


    expenses.forEach(
        function (transaction) {

            categoryTotals[
                transaction.category
            ] =
                (
                    categoryTotals[
                        transaction.category
                    ] || 0
                ) +
                transaction.amount;

        }
    );


    const sortedCategories =
        Object.entries(
            categoryTotals
        )
            .sort(
                function (a, b) {

                    return b[1] - a[1];

                }
            );


    const topCategory =
        sortedCategories[0];


    highestCategoryElement.textContent =
        `${topCategory[0]} (₹${formatAmount(
            topCategory[1]
        )})`;


    const totalExpense =
        expenses.reduce(
            function (
                sum,
                transaction
            ) {

                return (
                    sum +
                    transaction.amount
                );

            },
            0
        );


    const averageExpense =
        totalExpense /
        expenses.length;


    averageExpenseElement.textContent =
        `₹${formatAmount(
            averageExpense
        )}`;


    const expenseDays =
        new Set(
            expenses.map(
                function (transaction) {

                    return transaction.date;

                }
            )
        );


    noSpendDaysElement.textContent =
        calculateNoSpendDays(
            expenseDays
        );


    renderCategoryChart(
        categoryTotals
    );

}


// ==========================================
// NO-SPEND DAYS
// ==========================================

function calculateNoSpendDays(
    expenseDays
) {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        now.getMonth();


    let count =
        0;


    for (
        let day = 1;
        day <= now.getDate();
        day++
    ) {

        const dateKey =
            `${year}-${String(
                month + 1
            ).padStart(
                2,
                "0"
            )}-${String(
                day
            ).padStart(
                2,
                "0"
            )}`;


        if (
            !expenseDays.has(
                dateKey
            )
        ) {

            count++;

        }

    }


    return count;

}


// ==========================================
// CATEGORY CHART
// ==========================================

function renderCategoryChart(
    categoryTotals
) {

    categoryChart.innerHTML =
        "";


    const entries =
        Object.entries(
            categoryTotals
        )
            .sort(
                function (a, b) {

                    return b[1] - a[1];

                }
            );


    const maxAmount =
        Math.max(
            ...entries.map(
                function ([, amount]) {

                    return amount;

                }
            )
        );


    entries.forEach(
        function (
            [category, amount]
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "category-row";


            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "category-header";


            const name =
                document.createElement(
                    "span"
                );


            name.textContent =
                category;


            const value =
                document.createElement(
                    "strong"
                );


            value.textContent =
                `₹${formatAmount(
                    amount
                )}`;


            header.appendChild(name);

            header.appendChild(value);


            const track =
                document.createElement(
                    "div"
                );


            track.className =
                "bar-track";


            const fill =
                document.createElement(
                    "div"
                );


            fill.className =
                "bar-fill";


            fill.style.width =
                `${(
                    amount /
                    maxAmount
                ) * 100}%`;


            track.appendChild(fill);


            row.appendChild(header);

            row.appendChild(track);


            categoryChart.appendChild(row);

        }
    );

}


// ==========================================
// MONTHLY PATTERN
// ==========================================

function renderMonthlyPattern() {

    monthlyChart.innerHTML =
        "";


    if (
        transactions.length === 0
    ) {

        monthlyChart.innerHTML =
            `<div class="empty-state">
                Add transactions to see monthly patterns.
            </div>`;

        return;

    }


    const months = {};


    transactions.forEach(
        function (transaction) {

            const month =
                transaction.date.slice(
                    0,
                    7
                );


            if (
                !months[month]
            ) {

                months[month] = {

                    income: 0,

                    expense: 0

                };

            }


            if (
                transaction.type ===
                "income"
            ) {

                months[month].income +=
                    transaction.amount;

            }

            else {

                months[month].expense +=
                    transaction.amount;

            }

        }
    );


    const entries =
        Object.entries(
            months
        )
            .sort(
                function (a, b) {

                    return b[0]
                        .localeCompare(
                            a[0]
                        );

                }
            )
            .slice(
                0,
                6
            );


    const maxValue =
        Math.max(
            ...entries.map(
                function (
                    [, data]
                ) {

                    return Math.max(
                        data.income,
                        data.expense
                    );

                }
            )
        );


    entries.forEach(
        function (
            [month, data]
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "month-row";


            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "month-header";


            const monthName =
                document.createElement(
                    "span"
                );


            monthName.textContent =
                formatMonth(
                    month
                );


            const net =
                data.income -
                data.expense;


            const netValue =
                document.createElement(
                    "strong"
                );


            netValue.textContent =
                `Net ₹${formatAmount(
                    net
                )}`;


            header.appendChild(
                monthName
            );


            header.appendChild(
                netValue
            );


            const track =
                document.createElement(
                    "div"
                );


            track.className =
                "bar-track";


            const fill =
                document.createElement(
                    "div"
                );


            fill.className =
                "bar-fill";


            fill.style.width =
                `${maxValue === 0
                    ? 0
                    : (
                        Math.max(
                            data.income,
                            data.expense
                        ) /
                        maxValue
                    ) * 100
                }%`;


            track.appendChild(fill);


            const details =
                document.createElement(
                    "small"
                );


            details.className =
                "muted";


            details.textContent =
                `Income ₹${formatAmount(
                    data.income
                )} • Expense ₹${formatAmount(
                    data.expense
                )}`;


            row.appendChild(header);

            row.appendChild(track);

            row.appendChild(details);


            monthlyChart.appendChild(row);

        }
    );

}


// ==========================================
// EDIT
// ==========================================

function startEdit(id) {

    const transaction =
        transactions.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!transaction) {
        return;
    }


    editId =
        id;


    descriptionInput.value =
        transaction.description;


    amountInput.value =
        transaction.amount;


    typeInput.value =
        transaction.type;


    categoryInput.value =
        transaction.category;


    dateInput.value =
        transaction.date;


    submitButton.textContent =
        "Update Transaction";


    cancelEditButton.classList.remove(
        "hidden"
    );


    formMode.textContent =
        "Editing";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// DELETE
// ==========================================

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!transaction) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${transaction.description}"?`
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            function (item) {

                return (
                    item.id !== id
                );

            }
        );


    if (
        editId === id
    ) {

        resetForm();

    }


    saveTransactions();

    renderAll();

}


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    editId =
        null;


    transactionForm.reset();


    dateInput.value =
        getToday();


    typeInput.value =
        "income";


    categoryInput.value =
        "Food";


    submitButton.textContent =
        "Add Transaction";


    cancelEditButton.classList.add(
        "hidden"
    );


    formMode.textContent =
        "Adding";

}


// ==========================================
// DATE HELPERS
// ==========================================

function setToday() {

    dateInput.value =
        getToday();

}


function getToday() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}`
    );

}


function getDaysInMonth(
    year,
    month
) {

    return new Date(
        year,
        month + 1,
        0
    ).getDate();

}


// ==========================================
// FORMATTERS
// ==========================================

function formatDate(value) {

    const date =
        new Date(
            `${value}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}


function formatMonth(value) {

    const date =
        new Date(
            `${value}-01T00:00:00`
        );


    return date.toLocaleDateString(
        "en-IN",
        {

            month: "long",

            year: "numeric"

        }
    );

}


function formatAmount(value) {

    return Number(
        value
    ).toLocaleString(
        "en-IN",
        {

            minimumFractionDigits: 0,

            maximumFractionDigits: 2

        }
    );

}


function capitalize(value) {

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


// ==========================================
// ID
// ==========================================

function createId() {

    return (
        Date.now() +
        "-" +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


// ==========================================
// CSV
// ==========================================

function escapeCSV(value) {

    const text =
        String(
            value ?? ""
        );


    return (
        `"${text.replaceAll(
            '"',
            '""'
        )}"`
    );

}


function exportCSV() {

    if (
        transactions.length === 0
    ) {

        alert(
            "There are no transactions to export."
        );

        return;

    }


    const headers = [

        "Description",

        "Amount",

        "Type",

        "Category",

        "Date"

    ];


    const rows =
        transactions.map(
            function (transaction) {

                return [

                    transaction.description,

                    transaction.amount,

                    transaction.type,

                    transaction.category,

                    transaction.date

                ]
                    .map(
                        escapeCSV
                    )
                    .join(",");

            }
        );


    const csv = [

        headers
            .map(escapeCSV)
            .join(","),

        ...rows

    ].join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `priyanka-expense-report-${getToday()}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}