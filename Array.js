let arr = [];

function isValidInput(str) {
    return /^[A-Za-z0-9 ]+$/.test(str);
}

function updateDisplay() {
    const display = document.getElementById("arrayDisplay");
    display.innerHTML = "";

    arr.forEach((val) => {
        const box = document.createElement("div");
        box.className = "array-box";
        box.textContent = val; 
        display.appendChild(box);
    });
}

function insertElement() {
    const value = document.getElementById("value").value.trim();

    if (value === "") {
        output("Please enter a value!");
        return;
    }

    if (!isValidInput(value)) {
        output("Invalid input: Only letters, numbers, and spaces allowed.");
        return;
    }

    arr.push(value);
    updateDisplay();
    output(`Inserted: ${value}`);
}

function deleteLast() {
    if (arr.length === 0) {
        output("Array is empty!");
        return;
    }

    const removed = arr.pop();
    updateDisplay();
    output(`Deleted last element: ${removed}`);
}

function deleteAll() {
    arr = [];
    updateDisplay();
    output("All elements deleted.");
}

function searchElement() {
    const value = document.getElementById("value").value.trim();

    if (value === "") {
        output("Enter a value to search.");
        return;
    }

    if (!isValidInput(value)) {
        output("Invalid input: Only letters, numbers, and spaces allowed.");
        return;
    }

    const index = arr.indexOf(value);

    if (index === -1) {
        output(`Value "${value}" not found.`);
    } else {
        output(`Value "${value}" found at position ${index + 1}.`);
    }
}

function deleteIfExists() {
    const value = document.getElementById("value").value.trim();

    if (!isValidInput(value)) {
        output("Invalid input: Only letters, numbers, and spaces allowed.");
        return;
    }

    const index = arr.indexOf(value);
    if (index === -1) {
        output(`Value "${value}" does not exist.`);
        return;
    }

    arr.splice(index, 1);
    updateDisplay();
    output(`Deleted value: ${value}`);
}

function output(message) {
    document.getElementById("outputBox").textContent = message;
}
