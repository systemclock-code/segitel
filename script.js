const DEFAULT_FOODS = [
  '치킨', '피자', '짜장면', '짬뽕', '떡볶이',
  '삼겹살', '초밥', '버거', '족발', '마라탕'
];

const COLORS = [
  '#FF6B6B', '#FF8E53', '#FFC107', '#4CAF50',
  '#2196F3', '#9C27B0', '#E91E63', '#00BCD4',
  '#FF5722', '#607D8B'
];

let foods = [...DEFAULT_FOODS];
let isSpinning = false;
let currentAngle = 0;

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultEl = document.getElementById('result');
const resultText = document.getElementById('resultText');
const foodInput = document.getElementById('foodInput');
const addBtn = document.getElementById('addBtn');
const foodListEl = document.getElementById('foodList');

function drawWheel(angle) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = cx - 4;
  const slice = (2 * Math.PI) / foods.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  foods.forEach((food, i) => {
    const start = angle + i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${foods.length > 8 ? 13 : 15}px sans-serif`;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 3;
    ctx.fillText(food, r - 12, 5);
    ctx.restore();
  });

  // 중앙 원
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function spin() {
  if (isSpinning || foods.length < 2) return;

  isSpinning = true;
  spinBtn.disabled = true;
  resultEl.classList.add('hidden');

  const extraSpins = (5 + Math.floor(Math.random() * 5)) * 2 * Math.PI;
  const targetOffset = Math.random() * 2 * Math.PI;
  const totalRotation = extraSpins + targetOffset;
  const duration = 3000 + Math.random() * 1000;
  const startAngle = currentAngle;
  const startTime = performance.now();

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    currentAngle = startAngle + totalRotation * easeOut(progress);
    drawWheel(currentAngle);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = false;
      showResult();
    }
  }

  requestAnimationFrame(animate);
}

function showResult() {
  const slice = (2 * Math.PI) / foods.length;
  // 화살표는 위쪽(−π/2)을 가리킴
  const normalizedAngle = (((-currentAngle - Math.PI / 2) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const index = Math.floor(normalizedAngle / slice) % foods.length;

  resultText.textContent = foods[index];
  resultEl.classList.remove('hidden');
}

function renderFoodList() {
  foodListEl.innerHTML = '';
  foods.forEach((food, i) => {
    const li = document.createElement('li');
    li.textContent = food;
    const btn = document.createElement('button');
    btn.textContent = '✕';
    btn.title = '삭제';
    btn.addEventListener('click', () => removeFood(i));
    li.appendChild(btn);
    foodListEl.appendChild(li);
  });
  drawWheel(currentAngle);
}

function addFood() {
  const name = foodInput.value.trim();
  if (!name || foods.includes(name)) {
    foodInput.focus();
    return;
  }
  foods.push(name);
  foodInput.value = '';
  renderFoodList();
}

function removeFood(index) {
  if (foods.length <= 2) {
    alert('최소 2개 이상 필요합니다.');
    return;
  }
  foods.splice(index, 1);
  renderFoodList();
}

spinBtn.addEventListener('click', spin);
addBtn.addEventListener('click', addFood);
foodInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addFood();
});

renderFoodList();
