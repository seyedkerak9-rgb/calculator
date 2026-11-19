const display = document.querySelector("#display");
const expressionDisplay = document.querySelector("#expression");
const keypad = document.querySelector(".keypad");
const historyList = document.querySelector("#history-list");
const clearHistoryButton = document.querySelector("#clear-history");
const languageSelector = document.querySelector("#language-selector");
const decimalButton = document.querySelector('[data-action="decimal"]');

const translations = {
    fa: {
        locale: "fa-IR", direction: "rtl", brand: "محاسبه‌گر", brandLabel: "صفحه اصلی محاسبه‌گر",
        languageLabel: "انتخاب زبان",
        status: "همیشه آماده‌ی محاسبه", eyebrow: "سریع و دقیق", title: "ماشین حساب",
        description: "ماشین حسابی ساده، سریع و واکنش‌گرا برای انجام محاسبات روزمره",
        displayLabel: "نمایشگر ماشین حساب", keypadLabel: "کلیدهای ماشین حساب",
        clearAll: "پاک کردن همه", changeSign: "تغییر علامت", percent: "درصد",
        divide: "تقسیم", multiply: "ضرب", subtract: "تفریق", add: "جمع",
        decimal: "ممیز", equals: "محاسبه نتیجه", historyTitle: "محاسبات اخیر",
        clearHistory: "پاک کردن", historyEmpty: "محاسبات شما اینجا نمایش داده می‌شود.",
        keyboardHint: "می‌توانید از صفحه‌کلید هم استفاده کنید", keyboardResult: "برای نتیجه",
        keyboardClear: "برای پاک کردن", footer: "ساخته‌شده برای محاسبه‌های هر روز",
        credit: "تولید شده توسط Mr.mohammad_fspm_256 با استفاده از روش وایب کدینگ",
        error: "خطا", divideByZero: "تقسیم بر صفر امکان‌پذیر نیست",
        previousResult: "نتیجه‌ی محاسبه‌ی قبلی"
    },
    en: {
        locale: "en-US", direction: "ltr", brand: "Calculator", brandLabel: "Calculator home",
        languageLabel: "Choose language",
        status: "Ready to calculate", eyebrow: "Fast and accurate", title: "Calculator",
        description: "A simple, fast, responsive calculator for everyday calculations",
        displayLabel: "Calculator display", keypadLabel: "Calculator keypad",
        clearAll: "Clear all", changeSign: "Change sign", percent: "Percent",
        divide: "Divide", multiply: "Multiply", subtract: "Subtract", add: "Add",
        decimal: "Decimal point", equals: "Calculate result", historyTitle: "Recent calculations",
        clearHistory: "Clear", historyEmpty: "Your calculations will appear here.",
        keyboardHint: "You can also use your keyboard", keyboardResult: "for the result",
        keyboardClear: "to clear", footer: "Made for everyday calculations",
        credit: "Created by Mr.mohammad_fspm_256 using vibe coding",
        error: "Error", divideByZero: "Cannot divide by zero",
        previousResult: "Previous calculation result"
    },
    it: {
        locale: "it-IT", direction: "ltr", brand: "Calcolatrice", brandLabel: "Pagina iniziale della calcolatrice",
        languageLabel: "Scegli la lingua",
        status: "Pronta per calcolare", eyebrow: "Veloce e precisa", title: "Calcolatrice",
        description: "Una calcolatrice semplice, veloce e reattiva per i calcoli quotidiani",
        displayLabel: "Schermo della calcolatrice", keypadLabel: "Tastierino della calcolatrice",
        clearAll: "Cancella tutto", changeSign: "Cambia segno", percent: "Percentuale",
        divide: "Dividi", multiply: "Moltiplica", subtract: "Sottrai", add: "Somma",
        decimal: "Separatore decimale", equals: "Calcola il risultato", historyTitle: "Calcoli recenti",
        clearHistory: "Cancella", historyEmpty: "I tuoi calcoli appariranno qui.",
        keyboardHint: "Puoi usare anche la tastiera", keyboardResult: "per il risultato",
        keyboardClear: "per cancellare", footer: "Creata per i calcoli di ogni giorno",
        credit: "Creato da Mr.mohammad_fspm_256 con il vibe coding",
        error: "Errore", divideByZero: "Impossibile dividere per zero",
        previousResult: "Risultato del calcolo precedente"
    },
    de: {
        locale: "de-DE", direction: "ltr", brand: "Taschenrechner", brandLabel: "Startseite des Taschenrechners",
        languageLabel: "Sprache auswählen",
        status: "Bereit zum Rechnen", eyebrow: "Schnell und genau", title: "Taschenrechner",
        description: "Ein einfacher, schneller und responsiver Rechner für alltägliche Berechnungen",
        displayLabel: "Rechneranzeige", keypadLabel: "Rechnertasten",
        clearAll: "Alles löschen", changeSign: "Vorzeichen ändern", percent: "Prozent",
        divide: "Dividieren", multiply: "Multiplizieren", subtract: "Subtrahieren", add: "Addieren",
        decimal: "Dezimaltrennzeichen", equals: "Ergebnis berechnen", historyTitle: "Letzte Berechnungen",
        clearHistory: "Löschen", historyEmpty: "Deine Berechnungen erscheinen hier.",
        keyboardHint: "Du kannst auch die Tastatur verwenden", keyboardResult: "für das Ergebnis",
        keyboardClear: "zum Löschen", footer: "Für Berechnungen im Alltag gemacht",
        credit: "Erstellt von Mr.mohammad_fspm_256 mit Vibe-Coding",
        error: "Fehler", divideByZero: "Division durch null ist nicht möglich",
        previousResult: "Ergebnis der vorherigen Berechnung"
    }
};

const operatorSymbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
};

let currentInput = "0";
let previousValue = null;
let currentOperator = null;
let shouldResetInput = false;
let calculationHistory = [];
let currentLanguage = "fa";
let expressionState = null;

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return translations[currentLanguage].error;
    }

    const rounded = Number(value.toPrecision(12));
    return rounded.toLocaleString(translations[currentLanguage].locale, { maximumFractionDigits: 10 });
}

function updateDisplay() {
    display.textContent = currentInput === "ERROR"
        ? translations[currentLanguage].error
        : formatNumber(Number(currentInput));
}

function updateExpression() {
    const text = translations[currentLanguage];

    if (!expressionState) {
        expressionDisplay.textContent = "";
    } else if (expressionState.type === "operator") {
        expressionDisplay.textContent =
            `${formatNumber(expressionState.left)} ${operatorSymbols[expressionState.operator]}`;
    } else if (expressionState.type === "result") {
        expressionDisplay.textContent =
            `${formatNumber(expressionState.left)} ${operatorSymbols[expressionState.operator]} ${formatNumber(expressionState.right)} =`;
    } else if (expressionState.type === "error") {
        expressionDisplay.textContent = text.divideByZero;
    } else {
        expressionDisplay.textContent = text.previousResult;
    }
}

function setLanguage(language) {
    if (!Object.hasOwn(translations, language)) {
        return;
    }

    currentLanguage = language;
    const text = translations[language];
    document.documentElement.lang = language;
    document.documentElement.dir = text.direction;
    document.title = `${text.title} | ${text.brand}`;
    document.querySelector('meta[name="description"]').content = text.description;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = text[element.dataset.i18n];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
        element.setAttribute("aria-label", text[element.dataset.i18nAria]);
    });

    decimalButton.textContent = new Intl.NumberFormat(text.locale)
        .formatToParts(1.1)
        .find((part) => part.type === "decimal").value;
    updateDisplay();
    updateExpression();
    renderHistory();
}

function enterDigit(digit) {
    if (currentInput === "ERROR" || shouldResetInput) {
        currentInput = digit;
        shouldResetInput = false;
    } else if (currentInput === "0") {
        currentInput = digit;
    } else if (currentInput.replace("-", "").replace(".", "").length < 15) {
        currentInput += digit;
    }

    updateDisplay();
}

function enterDecimal() {
    if (currentInput === "ERROR" || shouldResetInput) {
        currentInput = "0";
        shouldResetInput = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function calculate(left, right, operator) {
    switch (operator) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            return right === 0 ? NaN : left / right;
        default:
            return right;
    }
}

function chooseOperator(operator) {
    if (currentInput === "ERROR") {
        resetCalculator();
    }

    const inputValue = Number(currentInput);

    if (currentOperator && !shouldResetInput) {
        const result = calculate(previousValue, inputValue, currentOperator);
        if (!Number.isFinite(result)) {
            showError();
            return;
        }
        currentInput = String(Number(result.toPrecision(12)));
        previousValue = Number(currentInput);
        updateDisplay();
    } else {
        previousValue = inputValue;
    }

    currentOperator = operator;
    shouldResetInput = true;
    expressionState = { type: "operator", left: previousValue, operator };
    updateExpression();
}

function calculateResult() {
    if (!currentOperator || previousValue === null || currentInput === "ERROR") {
        return;
    }

    const rightValue = Number(currentInput);
    const leftValue = previousValue;
    const operator = currentOperator;
    const result = calculate(leftValue, rightValue, operator);

    if (!Number.isFinite(result)) {
        showError();
        return;
    }

    expressionState = { type: "result", left: leftValue, right: rightValue, operator };
    currentInput = String(Number(result.toPrecision(12)));
    previousValue = null;
    currentOperator = null;
    shouldResetInput = true;
    updateDisplay();
    addHistory(leftValue, rightValue, operator, currentInput);
}

function showError() {
    currentInput = "ERROR";
    previousValue = null;
    currentOperator = null;
    shouldResetInput = true;
    expressionState = { type: "error" };
    updateDisplay();
    updateExpression();
}

function resetCalculator() {
    currentInput = "0";
    previousValue = null;
    currentOperator = null;
    shouldResetInput = false;
    expressionState = null;
    updateDisplay();
    updateExpression();
}

function toggleSign() {
    if (currentInput === "ERROR" || Number(currentInput) === 0) {
        return;
    }

    currentInput = String(Number(currentInput) * -1);
    shouldResetInput = false;
    updateDisplay();
}

function applyPercent() {
    if (currentInput === "ERROR") {
        return;
    }

    currentInput = String(Number(currentInput) / 100);
    shouldResetInput = false;
    updateDisplay();
}

function deleteLastDigit() {
    if (currentInput === "ERROR") {
        resetCalculator();
        return;
    }

    if (shouldResetInput) {
        return;
    }

    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    if (currentInput === "-") {
        currentInput = "0";
    }
    updateDisplay();
}

function addHistory(left, right, operator, rawResult) {
    calculationHistory.unshift({ left, right, operator, rawResult });
    calculationHistory = calculationHistory.slice(0, 4);
    renderHistory();
}

function renderHistory() {
    historyList.replaceChildren();

    if (calculationHistory.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "history-empty";
        emptyMessage.textContent = translations[currentLanguage].historyEmpty;
        historyList.append(emptyMessage);
        return;
    }

    for (const item of calculationHistory) {
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        const expression = document.createElement("span");
        const result = document.createElement("span");

        button.className = "history-item";
        button.type = "button";
        button.dataset.result = item.rawResult;
        expression.textContent =
            `${formatNumber(item.left)} ${operatorSymbols[item.operator]} ${formatNumber(item.right)}`;
        result.className = "history-result";
        result.textContent = formatNumber(Number(item.rawResult));
        button.append(expression, result);
        listItem.append(button);
        historyList.append(listItem);
    }
}

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }

    if (button.dataset.digit !== undefined) {
        enterDigit(button.dataset.digit);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else {
        switch (button.dataset.action) {
            case "clear":
                resetCalculator();
                break;
            case "sign":
                toggleSign();
                break;
            case "percent":
                applyPercent();
                break;
            case "decimal":
                enterDecimal();
                break;
            case "equals":
                calculateResult();
                break;
            default:
                break;
        }
    }
});

historyList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-result]");
    if (!button) {
        return;
    }

    currentInput = button.dataset.result;
    previousValue = null;
    currentOperator = null;
    shouldResetInput = true;
    expressionState = { type: "previousResult" };
    updateDisplay();
    updateExpression();
});

clearHistoryButton.addEventListener("click", () => {
    calculationHistory = [];
    renderHistory();
});

languageSelector.addEventListener("change", () => {
    setLanguage(languageSelector.value);
});

document.addEventListener("keydown", (event) => {
    if (/^\d$/.test(event.key)) {
        enterDigit(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "." || event.key === ",") {
        enterDecimal();
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculateResult();
    } else if (event.key === "Backspace") {
        event.preventDefault();
        deleteLastDigit();
    } else if (event.key === "Escape") {
        resetCalculator();
    } else if (event.key === "%") {
        applyPercent();
    }
});

setLanguage(languageSelector.value);
