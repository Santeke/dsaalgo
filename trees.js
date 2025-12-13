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

const canvas = document.getElementById('canvas');
const svg = document.getElementById('lines');
const output = document.getElementById('output');

function clearAnimationTimers(){
  animationTimers.forEach(id => clearTimeout(id));
  animationTimers = [];
  isAnimating = false;
}
function setOutput(msg){ output.textContent = msg; }

/* ===== BST operations ===== */
function insertRec(node, value){
  if (!node) return new Node(value);
  if (value < node.value) node.left = insertRec(node.left, value);
  else node.right = insertRec(node.right, value);
  return node;
}
function insertValue(value){
  root = insertRec(root, value);
  setOutput(`${value} inserted`);
  render();
}

function deleteRec(node, value){
  if (!node) return null;
  if (value < node.value) node.left = deleteRec(node.left, value);
  else if (value > node.value) node.right = deleteRec(node.right, value);
  else {
    if (!node.left && !node.right) return null;
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    let succ = node.right;
    while (succ.left) succ = succ.left;
    node.value = succ.value;
    node.right = deleteRec(node.right, succ.value);
  }
  return node;
}
function deleteValue(value){
  if (!root) return setOutput("Tree is empty");
  if (!findNode(root,value)) return setOutput(`${value} not found`);
  root = deleteRec(root,value);
  setOutput(`${value} deleted`);
  render();
}
function deleteAll(){
  root = null;
  clearCanvas();
  setOutput('Tree cleared');
}
function findNode(node, value){
  if (!node) return null;
  if (value === node.value) return node;
  return findNode(value < node.value ? node.left : node.right, value);
}


function computePositions(){
  let xIndex=0;
  function inorderAssign(node, depth){
    if (!node) return;
    inorderAssign(node.left, depth+1);
    node._index = xIndex++;
    node._depth = depth;
    inorderAssign(node.right, depth+1);
  }
  inorderAssign(root,0);

  const total = xIndex||1;
  const width = canvas.clientWidth;
  const spacing = Math.max(60, Math.floor(width / Math.max(5,total)));
  const offset = Math.max(40, Math.floor((width - (total-1)*spacing)/2));

  function setPos(n){
    if (!n) return;
    n.x = offset + n._index*spacing;
    n.y = 40 + n._depth*100;
    setPos(n.left); setPos(n.right);
  }
  setPos(root);
}


function clearCanvas(){
  svg.innerHTML = '';
  [...canvas.querySelectorAll('.node')].forEach(n=>n.remove());
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
  if (n.left) drawLine(n,n.left);
  if (n.right) drawLine(n,n.right);
  drawLines(n.left);
  drawLines(n.right);
}
function drawLine(p,c){
  const l=document.createElementNS('http://www.w3.org/2000/svg','line');
  l.setAttribute('x1',p.x);
  l.setAttribute('y1',p.y);
  l.setAttribute('x2',c.x);
  l.setAttribute('y2',c.y);
  l.setAttribute('stroke','#444');
  l.setAttribute('stroke-width','2');
  svg.appendChild(l);
}
function drawNodes(n){
  if(!n) return;
  const el=document.createElement('div');
  el.className='node';
  el.textContent=n.value;
  n.dom=el;
  el.style.left=n.x+'px';
  el.style.top=n.y+'px';
  canvas.appendChild(el);
  drawNodes(n.left);
  drawNodes(n.right);
}


function inorder(n,a){ if(n){ inorder(n.left,a); a.push(n); inorder(n.right,a);} }
function preorder(n,a){ if(n){ a.push(n); preorder(n.left,a); preorder(n.right,a);} }
function postorder(n,a){ if(n){ postorder(n.left,a); postorder(n.right,a); a.push(n);} }


function clearHighlights(){
  document.querySelectorAll('.node').forEach(n => n.classList.remove('highlight','found'));
}
function animateSequence(nodes, finish){
  clearAnimationTimers(); clearHighlights();
  if (!nodes.length) return finish && finish();
  isAnimating=true;
  const delay=parseInt(delayRange.value)||700;
  nodes.forEach((node,i)=>{
    const t=setTimeout(()=>{
      clearHighlights();
      node.dom.classList.add('highlight');
      if (i===nodes.length-1){ isAnimating=false; finish && finish(); }
    }, i*delay);
    animationTimers.push(t);
  });
}
function getSearchPath(v){
  const p=[]; let c=root;
  while(c){ p.push(c); if(v===c.value) break; c=v<c.value?c.left:c.right; }
  return p;
}
function animateSearch(v){
  clearAnimationTimers(); clearHighlights();
  if (!root) return setOutput('Tree is empty');
  const p=getSearchPath(v);
  setOutput(`Searching ${v}...`);
  const d=parseInt(delayRange.value)||700;
  isAnimating=true;
  p.forEach((n,i)=>{
    const t=setTimeout(()=>{
      clearHighlights();
      n.dom.classList.add('highlight');
      if (i===p.length-1){
        if(n.value===v){
          n.dom.classList.remove('highlight');
          n.dom.classList.add('found');
          setOutput(`${v} found`);
        } else setOutput(`${v} not found`);
        isAnimating=false;
      }
    }, i*d);
    animationTimers.push(t);
  });
}
function animateTraversal(t){
  if(!root) return setOutput('Tree is empty');
  clearAnimationTimers(); clearHighlights();
  const nodes=[];
  if(t==='Inorder') inorder(root,nodes);
  if(t==='Preorder') preorder(root,nodes);
  if(t==='Postorder') postorder(root,nodes);
  setOutput(`${t} traversal...`);
  animateSequence(nodes,()=>setOutput(`${t}: ${nodes.map(n=>n.value).join(', ')}`));
}


insertBtn.onclick=()=>{ const v=+valueInput.value; if(isNaN(v))return; if(isAnimating){clearAnimationTimers();} insertValue(v); };
deleteBtn.onclick=()=>{ const v=+valueInput.value; if(isNaN(v))return; if(isAnimating){clearAnimationTimers();} deleteValue(v); };
deleteAllBtn.onclick=()=>{ clearAnimationTimers(); deleteAll(); };
searchBtn.onclick=()=>{ const v=+valueInput.value; if(isNaN(v))return; animateSearch(v); };
inBtn.onclick =()=>{ if(isAnimating)clearAnimationTimers(); animateTraversal('Inorder'); };
preBtn.onclick=()=>{ if(isAnimating)clearAnimationTimers(); animateTraversal('Preorder'); };
postBtn.onclick=()=>{ if(isAnimating)clearAnimationTimers(); animateTraversal('Postorder'); };
stopBtn.onclick=()=>{ clearAnimationTimers(); clearHighlights(); setOutput('Animation stopped'); };
delayRange.oninput=()=> delayVal.textContent=delayRange.value+'ms';
window.onresize=()=>render();



