let queue = [];

// Update display
function updateQueueDisplay() {
    const display = document.getElementById("queueDisplay");
    display.innerHTML = "";

    queue.forEach(item => {
        const box = document.createElement("div");
        box.className = "queue-box";
        box.textContent = item;
        display.appendChild(box);
    });

    if (queue.length === 0) {
        display.innerHTML = "<p>(Queue is empty)</p>";
    }
}

// Enqueue
function enqueue() {
    const value = document.getElementById("value").value;

    if (value === "") {
        output("Please enter a number.");
        return;
    }

    queue.push(Number(value));
    updateQueueDisplay();
    output(`Enqueued: ${value}`);
    document.getElementById("value").value = "";
}

// Dequeue
function dequeue() {
    if (queue.length === 0) {
        output("Queue is empty. Nothing to dequeue.");
        return;
    }

    const removed = queue.shift();
    updateQueueDisplay();
    output(`Dequeued: ${removed}`);
}

// Delete All
function clearQueue() {
    queue = [];
    updateQueueDisplay();
    output("Queue cleared.");
}

// Search element
function searchQueue() {
    const value = Number(document.getElementById("value").value);

    if (isNaN(value)) {
        output("Please enter a number to search.");
        return;
    }

    const index = queue.indexOf(value);

    if (index !== -1) {
        output(`Value ${value} found at position ${index + 1} in queue.`);
    } else {
        output(`Value ${value} not found.`);
    }
}

// Output function
function output(msg) {
    document.getElementById("outputBox").textContent = msg;
}
