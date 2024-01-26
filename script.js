const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let toolBtns = document.querySelectorAll('.tool');
let fillColor = document.querySelector('#fill-color');
let sizeSlider = document.querySelector('#size-slider');
let colorBtns = document.querySelectorAll('.colors .option');
let colorPicker = document.querySelector('#color-picker');
let clearCanvas = document.querySelector('.clear-canvas');
let saveImg = document.querySelector('.save-img');

let isDrawing = false;
let brushWidth = 5;
let selectedTool = 'brush';
let prevMouseX;
let prevMouseY;
let snapshot;
let selectedColor = '#000';

const setCanvasBackground = () => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener('load', () => {
  // выставляем высоту и ширину канваса размером с видовой экран канваса
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});
const drawRect = (e) => {
  if (!fillColor.checked) {
    //Возвращаем пустой квадрад ( только бордер )
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
  // Возвращаем залитый квадрат
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
};
const drawCircle = (e) => {
  ctx.beginPath(); //создаем новую точку рисования
  // получааем радиус
  let radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //создаем круг по курсору мыши
  fillColor.checked ? ctx.fill() : ctx.stroke(); // заливаем или не заливаем круг
};
const drawTriangle = (e) => {
  ctx.beginPath(); //создаем новую точку рисования
  ctx.moveTo(prevMouseX, prevMouseY); //передвигаем треугольник к курсору мыши
  ctx.lineTo(e.offsetX, e.offsetY); //создаем первую лилнию
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // создаем основание треугольника
  ctx.closePath(); //замыкаем треугольник
  fillColor.checked ? ctx.fill() : ctx.stroke(); //рисуем
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; // получает координаты начала рисования
  prevMouseY = e.offsetY; // получает координаты начала рисования
  ctx.beginPath(); //создаем новую точку рисования
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor; // передаем цвет для рисования
  ctx.fillStyle = selectedColor; // передаем цвет для заливки
  //копируем данные и передаем в переменную.. позволяет уйти от перересовки квадратов и прочего
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0); //вставляем скопированные данные в canvas (уходим от перерисовок)
  if (selectedTool === 'brush' || selectedTool === 'eraser') {
    //Если стерка, то рисуем белым
    ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
    console.log('brush choosed');
    ctx.lineTo(e.offsetX, e.offsetY); //создаем линию по мыше
    ctx.stroke(); //рисуем
  } else if (selectedTool === 'rectangle') {
    console.log('rectangle choosed');
    drawRect(e);
  } else if (selectedTool === 'circle') {
    console.log('circle choosed');
    drawCircle(e);
  } else if (selectedTool === 'triangle') {
    console.log('triangle choosed');
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector('.options .active').classList.remove('active');
    btn.classList.add('active');
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});
colorBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector('.options .selected').classList.remove('selected');
    btn.classList.add('selected');
    selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
  });
});
sizeSlider.addEventListener('change', () => {
  brushWidth = sizeSlider.value;
}); // передаем размер для толщины
colorPicker.addEventListener('change', () => {
  //назначаем bg цвет
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});
clearCanvas.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground(); // сбрасывает на дефолтные настройки
});
saveImg.addEventListener('click', () => {
  const link = document.createElement('a'); //создаем якорь
  link.download = `${Date.now()}.jpg`; //дата в качестве названия
  link.href = canvas.toDataURL(); //передаем canvas данные в качестве значения якоря
  link.click(); // скачиваем
  setCanvasBackground(); // сбрасывает на дефолтные настройки
});
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => (isDrawing = false));
