class Node {
  constructor(value){
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
    this.dom = null;
  }
}

let root = null;
let animationTimers = [];
let isAnimating = false;
let placementQueue = [];
let nextValue = 1; // start numbering from 1


const canvas = document.getElementById('canvas');
const svg = document.getElementById('lines');
const output = document.getElementById('output');
const valueInput = document.getElementById('valueInput');
const delayRange = document.getElementById('delayRange');
const delayVal = document.getElementById('delayVal');
const insertBtn = document.getElementById('insertBtn');
const deleteBtn = document.getElementById('deleteBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const inBtn = document.getElementById('inBtn');
const preBtn = document.getElementById('preBtn');
const postBtn = document.getElementById('postBtn');
const stopBtn = document.getElementById('stopBtn');


function clearAnimationTimers(){
  animationTimers.forEach(id => clearTimeout(id));
  animationTimers = [];
  isAnimating = false;
}

function setOutput(msg){ output.textContent = msg; }

function deleteAll(){
  root = null;
  placementQueue = [];
  nextValue = 1;
  clearCanvas();
  setOutput("Tree cleared");
}

function insertValue(){
  const newNode = new Node(nextValue);

  if (!root) {
    root = newNode;
    placementQueue.push(root);
  } else {
    let placed = false;
    while(!placed && placementQueue.length){
      const parent = placementQueue[0];

      if (!parent.left) {
        parent.left = newNode;
        placed = true;
      } else if (!parent.right) {
        parent.right = newNode;
        placed = true;
      }

      if (parent.left && parent.right) placementQueue.shift();
    }
    placementQueue.push(newNode);
  }

  setOutput(`${nextValue} inserted`);
  nextValue++;
  render();
}


function deleteValue(value){
    if (!root) return setOutput("Tree is empty");

    if (root.value === value) {
        if (!root.left && !root.right) {
            root = null;
            placementQueue = [];
            nextValue = 1;
            setOutput(`${value} deleted`);
            clearCanvas();
            return;
        } else {
            return setOutput("Cannot delete root with children in this layout");
        }
    }

    const queue = [root];
    let parent = null;
    let isLeft = false;
    let nodeToDelete = null;

    while(queue.length){
        const node = queue.shift();
        if (node.left) {
            if (node.left.value === value) {
                parent = node;
                isLeft = true;
                nodeToDelete = node.left;
                break;
            } else queue.push(node.left);
        }
        if (node.right) {
            if (node.right.value === value) {
                parent = node;
                isLeft = false;
                nodeToDelete = node.right;
                break;
            } else queue.push(node.right);
        }
    }

    if (!nodeToDelete) return setOutput(`${value} not found`);

    if (isLeft) parent.left = null;
    else parent.right = null;

    placementQueue = placementQueue.filter(n => n.value !== value);

    setOutput(`${value} deleted`);
    render();
}


function computePositions() {
    if (!root) return;

    const width = canvas.clientWidth;
    const levelHeight = 100;

    const nodesByLevel = [];
    const queue = [{ node: root, level: 0 }];
    
    while (queue.length) {
        const { node, level } = queue.shift();
        if (!nodesByLevel[level]) nodesByLevel[level] = [];
        nodesByLevel[level].push(node);

        if (node.left) queue.push({ node: node.left, level: level + 1 });
        if (node.right) queue.push({ node: node.right, level: level + 1 });
    }

    nodesByLevel.forEach((levelNodes, depth) => {
        const total = levelNodes.length;
        const spacing = Math.max(60, Math.floor(width / (total + 1)));
        levelNodes.forEach((node, i) => {
            node.x = spacing * (i + 1);
            node.y = 40 + depth * levelHeight;
        });
    });
}


function clearCanvas(){
  svg.innerHTML = "";
  [...canvas.querySelectorAll(".node")].forEach(n => n.remove());
}

function render(){
  clearAnimationTimers();
  clearCanvas();
  if (!root) return;

  computePositions();
  drawLines(root);
  drawNodes(root);
}

function drawLines(n){
  if (!n) return;
  if (n.left) drawLine(n, n.left);
  if (n.right) drawLine(n, n.right);
  drawLines(n.left);
  drawLines(n.right);
}

function drawLine(p, c){
  const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", p.x);
  l.setAttribute("y1", p.y);
  l.setAttribute("x2", c.x);
  l.setAttribute("y2", c.y);
  l.setAttribute("stroke", "#444");
  l.setAttribute("stroke-width", "2");
  svg.appendChild(l);
}

function drawNodes(n){
  if (!n) return;

  const el = document.createElement("div");
  el.className = "node";
  el.textContent = n.value;

  n.dom = el;
  el.style.left = n.x + "px";
  el.style.top = n.y + "px";

  canvas.appendChild(el);

  drawNodes(n.left);
  drawNodes(n.right);
}



function inorder(n, a){
    if (!n) return;
    const queue = [n];
    while(queue.length){
        const node = queue.shift();
        a.push(node);
        if(node.left) queue.push(node.left);
        if(node.right) queue.push(node.right);
    }
}


function preorder(n, a){
    if (!n) return;
    const queue = [n];
    while(queue.length){
        const node = queue.shift();
        a.push(node);
        if(node.left) queue.push(node.left);
        if(node.right) queue.push(node.right);
    }
}


function postorder(n, a){
    if (!n) return;
    const queue = [n];
    const allNodes = [];
    while(queue.length){
        const node = queue.shift();
        allNodes.push(node);
        if(node.left) queue.push(node.left);
        if(node.right) queue.push(node.right);
    }
    allNodes.sort((x,y) => y.value - x.value);
    allNodes.forEach(node => a.push(node));
}


function clearHighlights(){
  document.querySelectorAll(".node").forEach(n =>
    n.classList.remove("highlight", "found")
  );
}

function animateSequence(nodes, finish){
  clearAnimationTimers();
  clearHighlights();

  if (!nodes.length) return finish && finish();

  isAnimating = true;
  const delay = parseInt(delayRange.value) || 700;

  nodes.forEach((node, i) => {
    const t = setTimeout(() => {
      clearHighlights();
      node.dom.classList.add("highlight");

      if (i === nodes.length - 1){
        isAnimating = false;
        finish && finish();
      }
    }, i * delay);

    animationTimers.push(t);
  });
}

function animateTraversal(type){
  if (!root) return setOutput("Tree is empty");

  clearAnimationTimers();
  clearHighlights();

  const nodes = [];

  if (type === "Inorder") inorder(root, nodes);
  if (type === "Preorder") preorder(root, nodes);
  if (type === "Postorder") postorder(root, nodes);

  setOutput(`${type} traversal...`);

  setTimeout(() => {
    animateSequence(nodes, () =>
      setOutput(`${type}: ${nodes.map(n => n.value).join(", ")}`)
    );
  }, 50);
}


insertBtn.onclick = () => {
  if (isAnimating) clearAnimationTimers();
  insertValue();
};

deleteBtn.onclick = () => {
  if (isAnimating) clearAnimationTimers();
  const value = +valueInput.value;
  if (!isNaN(value)) deleteValue(value);
};

deleteAllBtn.onclick = () => {
  clearAnimationTimers();
  deleteAll();
};

inBtn.onclick = () => {
  if (isAnimating) clearAnimationTimers();
  animateTraversal("Inorder");
};

preBtn.onclick = () => {
  if (isAnimating) clearAnimationTimers();
  animateTraversal("Preorder");
};

postBtn.onclick = () => {
  if (isAnimating) clearAnimationTimers();
  animateTraversal("Postorder");
};

stopBtn.onclick = () => {
  clearAnimationTimers();
  clearHighlights();
  setOutput("Animation stopped");
};

delayRange.oninput = () =>
  (delayVal.textContent = delayRange.value + "ms");

window.onresize = () => render();
