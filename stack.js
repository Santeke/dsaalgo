let stack = [];

function displayStack() {
    const stackDisplay = document.getElementById("stackDisplay");
    stackDisplay.innerHTML = "";
    stack.forEach(val => {
        const box = document.createElement("div");
        box.className = "stack-box";
        box.textContent = val;
        stackDisplay.appendChild(box);
    });
}

function precedence(op) {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    if (op === "^") return 3;
    return 0;
}

function updateOutput(msg) {
    document.getElementById("outputBox").textContent = msg;
}

function toPostfix() {
    let expr = document.getElementById("expr").value.replace(/\s+/g, "");
    stack = [];
    let postfix = "";

    for (let char of expr) {
        if (/[a-zA-Z0-9]/.test(char)) postfix += char;
        else if (char === "(") stack.push(char);
        else if (char === ")") {
            while (stack.length && stack[stack.length - 1] !== "(")
                postfix += stack.pop();
            stack.pop();
        } else {
            while (stack.length && precedence(stack[stack.length - 1]) >= precedence(char))
                postfix += stack.pop();
            stack.push(char);
        }
        displayStack();
    }

    while (stack.length) postfix += stack.pop();
    displayStack();
    updateOutput(`Postfix: ${postfix}`);
}

function reverseString(str) { 
    return str.split("").reverse().join(""); 
}

function swapBrackets(expr) {
    return expr.replace(/\(/g, "#")
               .replace(/\)/g, "(")
               .replace(/#/g, ")");
}

function toPrefix() {
    let expr = document.getElementById("expr").value.replace(/\s+/g, "");
    stack = [];
    let rev = reverseString(expr);
    rev = swapBrackets(rev);

    let postfix = "";
    for (let char of rev) {
        if (/[a-zA-Z0-9]/.test(char)) postfix += char;
        else if (char === "(") stack.push(char);
        else if (char === ")") {
            while (stack.length && stack[stack.length - 1] !== "(")
                postfix += stack.pop();
            stack.pop();
        } else {
            while (stack.length && precedence(stack[stack.length - 1]) > precedence(char))
                postfix += stack.pop();
            stack.push(char);
        }
        displayStack();
    }

    while (stack.length) postfix += stack.pop();
    displayStack();
    updateOutput(`Prefix: ${reverseString(postfix)}`);
}

function postfixToInfix() {
    let expr = document.getElementById("expr").value.replace(/\s+/g, "");
    stack = [];

    for (let char of expr) {
        if (/[a-zA-Z0-9]/.test(char)) {
            stack.push(char);
        } else {
            if (stack.length < 2) return updateOutput("Invalid Postfix!");
            let a = stack.pop();
            let b = stack.pop();
            stack.push("(" + b + char + a + ")");
        }
        displayStack();
    }

    updateOutput(stack.length === 1 ? `Infix: ${stack.pop()}` : "Invalid Postfix!");
    displayStack();
}

function prefixToInfix() {
    let expr = document.getElementById("expr").value.replace(/\s+/g, "");
    stack = [];

    for (let i = expr.length - 1; i >= 0; i--) {
        let char = expr[i];
        if (/[a-zA-Z0-9]/.test(char)) stack.push(char);
        else {
            if (stack.length < 2) return updateOutput("Invalid Prefix!");
            let a = stack.pop();
            let b = stack.pop();
            stack.push("(" + a + char + b + ")");
        }
        displayStack();
    }

    updateOutput(stack.length === 1 ? `Infix: ${stack.pop()}` : "Invalid Prefix!");
    displayStack();
}


function pushElement() {
    const value = document.getElementById("value").value.trim();

    if (value === "") {
        updateOutput("Please enter a value to push!");
        return;
    }

    stack.push(value);
    displayStack();
    updateOutput(`Pushed: ${value}`);
}

function popElement() {
    if (stack.length === 0) {
        updateOutput("Stack is empty! Nothing to pop.");
        return;
    }

    const removed = stack.pop();
    displayStack();
    updateOutput(`Popped: ${removed}`);
}

function peekElement() {
    if (stack.length === 0) {
        updateOutput("Stack is empty! Nothing to peek.");
        return;
    }

    const top = stack[stack.length - 1];
    updateOutput(`Top element: ${top}`);
}
