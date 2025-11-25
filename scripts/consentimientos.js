// Lista de consentimientos (personaliza nombres y PDFs reales)
const consentimientos = [
  { titulo: 'Consentimiento General', archivo: 'consentimiento-general.pdf' },
  { titulo: 'Audiometría', archivo: 'audiometria.pdf' },
  { titulo: 'Espirometría', archivo: 'espirometria.pdf' },
  { titulo: 'Optometría', archivo: 'optometria.pdf' },
  { titulo: 'Laboratorio Clínico', archivo: 'laboratorio.pdf' },
  { titulo: 'Imágenes Diagnósticas', archivo: 'imagenes-diagnosticas.pdf' },
  { titulo: 'Prueba de Esfuerzo', archivo: 'pruebas-esfuerzo.pdf' },
  { titulo: 'Osteomuscular', archivo: 'osteomuscular.pdf' },
  { titulo: 'Psicología', archivo: 'psicologia.pdf' },
  { titulo: 'Vacunación', archivo: 'vacunacion.pdf' },
  { titulo: 'Tratamiento de Datos', archivo: 'datos-personales.pdf' },
  { titulo: 'Seguimiento', archivo: 'seguimiento.pdf' }
];

// ELEMENTOS
const modal = document.getElementById('modal-firma');
const visorPDF = document.getElementById('visor-pdf');
const cerrarModal = document.getElementById('cerrar-modal');
const canvas = document.getElementById('canvas-firma');
const ctx = canvas.getContext('2d');

let firmaActiva = false;

// Renderizado de tarjetas
function renderizar() {
  const cont = document.getElementById('lista-consentimientos');

  consentimientos.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'tarjeta-consentimiento';

    card.innerHTML = `
      <h3 class="tarjeta-titulo">${c.titulo}</h3>
    `;

    card.addEventListener('click', () => abrirModal(c.archivo));

    cont.appendChild(card);
  });
}

// Abrir modal y cargar PDF
function abrirModal(pdf) {
  visorPDF.src = `./pdfs/${pdf}`;
  modal.style.display = 'block';
  limpiarFirma();
}

// Cerrar modal
cerrarModal.onclick = () => (modal.style.display = 'none');

// Canvas de firma
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas.addEventListener('mousedown', () => (firmaActiva = true));
canvas.addEventListener('mouseup', () => (firmaActiva = false));
canvas.addEventListener('mousemove', dibujar);

function dibujar(e) {
  if (!firmaActiva) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}

// Limpiar firma
document.getElementById('btn-limpiar').onclick = limpiarFirma;
function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Confirmar firma
document.getElementById('btn-confirmar').onclick = () => {
  const imagen = canvas.toDataURL('image/png');
  alert('Firma capturada correctamente.');
  console.log('Firma en Base64:', imagen);
};

document.addEventListener('DOMContentLoaded', renderizar);
