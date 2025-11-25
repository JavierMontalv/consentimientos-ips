// scripts/consentimientos.js

// Lista de consentimientos
const consentimientos = [
  { titulo: 'Audiometría', archivo: 'audiometria.pdf' },
  { titulo: 'Optometría', archivo: 'optometria.pdf' },
  { titulo: 'Espirometría', archivo: 'espirometria.pdf' },
  { titulo: 'Electrocardiograma', archivo: 'electrocardiograma.pdf' },
  { titulo: 'Laboratorio Clínico', archivo: 'laboratorio.pdf' },
  { titulo: 'Manipulación de Alimentos', archivo: 'manipulacion-alimentos.pdf' },
  { titulo: 'Examen Médico Ocupacional', archivo: 'examen-medico.pdf' },
  { titulo: 'Prueba de Alcohol', archivo: 'prueba-alcohol.pdf' },
  { titulo: 'SPA', archivo: 'spa.pdf' },
  { titulo: 'Parcial de Orina', archivo: 'parcial-orina.pdf' },
  { titulo: 'Tamizaje de Voz', archivo: 'tamizaje-voz.pdf' }
];

// ELEMENTOS
const modal = document.getElementById('modal-firma');
const visorPDF = document.getElementById('visor-pdf');
const cerrarModal = document.getElementById('cerrar-modal');
const canvas = document.getElementById('canvas-firma');
const ctx = canvas.getContext('2d');

let firmaActiva = false;

// Cargar tarjetas
function renderizarConsentimientos() {
  const cont = document.getElementById('lista-consentimientos');

  consentimientos.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'tarjeta-consentimiento';

    card.innerHTML = `<h3 class="tarjeta-titulo">${c.titulo}</h3>`;

    card.onclick = () => abrirModal(c.archivo);
    cont.appendChild(card);
  });
}

// Abrir modal
function abrirModal(pdf) {
  visorPDF.src = `pdfs/${pdf}`;
  modal.style.display = 'block';
  limpiarFirma();
}

// Cerrar modal
cerrarModal.onclick = () => (modal.style.display = 'none');

// Canvas
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas.addEventListener('mousedown', () => (firmaActiva = true));
canvas.addEventListener('mouseup', () => (firmaActiva = false));
canvas.addEventListener('mousemove', dibujar);

canvas.addEventListener('touchstart', (e) => {
  firmaActiva = true;
  dibujarTouch(e.touches[0]);
});

canvas.addEventListener('touchmove', (e) => {
  dibujarTouch(e.touches[0]);
  e.preventDefault();
});

canvas.addEventListener('touchend', () => (firmaActiva = false));

function dibujar(e) {
  if (!firmaActiva) return;
  const rect = canvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 2, 0, Math.PI * 2);
  ctx.fill();
}

function dibujarTouch(touch) {
  if (!firmaActiva) return;
  const rect = canvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.arc(touch.clientX - rect.left, touch.clientY - rect.top, 2, 0, Math.PI * 2);
  ctx.fill();
}

document.getElementById('btn-limpiar').onclick = limpiarFirma;
function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('btn-confirmar').onclick = () => {
  const firmaBase64 = canvas.toDataURL('image/png');
  alert('Firma registrada correctamente.');
  console.log('Firma:', firmaBase64);
};

// Inicializar
document.addEventListener('DOMContentLoaded', renderizarConsentimientos);
