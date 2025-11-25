// scripts/consentimientos.js
// =============================
// Lista de consentimientos
// =============================
const consentimientos = [
  { titulo: 'Audiometría', archivo: 'audiometria.pdf' },
  { titulo: 'Electrocardiograma (EKG)', archivo: 'electrocardiograma.pdf' },
  { titulo: 'Prueba de Embarazo', archivo: 'embarazo.pdf' },
  { titulo: 'Espirometría', archivo: 'espirometria.pdf' },
  { titulo: 'Examen Médico Ocupacional', archivo: 'examen-medico.pdf' },
  { titulo: 'Laboratorio Clínico', archivo: 'laboratorio.pdf' },
  { titulo: 'Manipulación de Alimentos', archivo: 'manipulacion-alimentos.pdf' },
  { titulo: 'Optometría', archivo: 'optometria.pdf' },
  { titulo: 'Parcial de Orina', archivo: 'parcial-orina.pdf' },
  { titulo: 'Prueba de Alcohol', archivo: 'prueba-alcohol.pdf' },
  { titulo: 'Psicología y Psicomotricidad', archivo: 'psicologia.pdf' },
  { titulo: 'Sustancias Psicoactivas (SPA)', archivo: 'spa.pdf' },
  { titulo: 'Tamizaje de Voz', archivo: 'tamizaje-voz.pdf' }
];

// =============================
// ELEMENTOS DEL DOM
// =============================
const modal = document.getElementById('modal-firma');
const visorPDF = document.getElementById('visor-pdf');
const cerrarModal = document.getElementById('cerrar-modal');
const canvas = document.getElementById('canvas-firma');
const ctx = canvas.getContext('2d');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnDescargar = document.getElementById('btn-descargar');

let firmaActiva = false;
let hayFirma = false;
let consentimientoActual = null;

// =============================
// Renderizar tarjetas
// =============================
function renderizarConsentimientos() {
  const contenedor = document.getElementById('lista-consentimientos');

  consentimientos.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'tarjeta-consentimiento';
    card.innerHTML = <h3 class="tarjeta-titulo">${c.titulo}</h3>;
    card.addEventListener('click', () => abrirModal(c));
    contenedor.appendChild(card);
  });
}

// =============================
// Abrir modal
// =============================
function abrirModal(consentimiento) {
  consentimientoActual = consentimiento;
  visorPDF.src = `./pdfs/${consentimiento.archivo}`;
  modal.style.display = 'block';
  limpiarFirma();
}

// =============================
// Cerrar modal
// =============================
cerrarModal.onclick = () => {
  modal.style.display = 'none';
};

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// =============================
// Configurar Canvas de firma
// =============================
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas.addEventListener('mousedown', () => {
  firmaActiva = true;
});

canvas.addEventListener('mouseup', () => {
  firmaActiva = false;
});

canvas.addEventListener('mouseleave', () => {
  firmaActiva = false;
});

canvas.addEventListener('mousemove', dibujar);

canvas.addEventListener('touchstart', (e) => {
  firmaActiva = true;
  dibujarTouch(e.touches[0]);
});

canvas.addEventListener('touchmove', (e) => {
  dibujarTouch(e.touches[0]);
  e.preventDefault();
});

canvas.addEventListener('touchend', () => {
  firmaActiva = false;
});

// =============================
// Dibujar firma
// =============================
function dibujar(e) {
  if (!firmaActiva) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
  hayFirma = true;
}

function dibujarTouch(touch) {
  if (!firmaActiva) return;

  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
  hayFirma = true;
}

// =============================
// Limpiar firma
// =============================
btnLimpiar.onclick = limpiarFirma;

function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hayFirma = false;
}

// =============================
// Confirmar firma
// =============================
btnConfirmar.onclick = () => {
  if (!hayFirma) {
    alert('Por favor, dibuje su firma antes de confirmar.');
    return;
  }
  alert('Firma registrada correctamente.');
};

// =============================
// Descargar PDF firmado
// =============================
btnDescargar.onclick = async () => {
  if (!consentimientoActual) {
    alert('Debe seleccionar un consentimiento primero.');
    return;
  }

  if (!hayFirma) {
    const continuar = confirm(
      'No se ha detectado firma en el recuadro.\n¿Desea descargar el PDF sin firma?'
    );
    if (!continuar) return;
  }

  try {
    await generarPdfFirmado();
  } catch (error) {
    console.error('Error generando PDF firmado:', error);
    alert('Ocurrió un error al generar el PDF firmado.');
  }
};

async function generarPdfFirmado() {
  const { PDFDocument, StandardFonts } = PDFLib;

  const urlPdfOriginal = `./pdfs/${consentimientoActual.archivo}`;
  const pdfBytesOriginal = await fetch(urlPdfOriginal).then((res) => res.arrayBuffer());

  const pdfOriginal = await PDFDocument.load(pdfBytesOriginal);
  const pdfFinal = await PDFDocument.create();

  const paginasOriginales = await pdfFinal.copyPages(pdfOriginal, pdfOriginal.getPageIndices());
  paginasOriginales.forEach((p) => pdfFinal.addPage(p));

  const page = pdfFinal.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const font = await pdfFinal.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfFinal.embedFont(StandardFonts.HelveticaBold);

  const ahora = new Date();
  const fechaHora = ahora.toLocaleString('es-CO');

  const titulo = consentimientoActual.titulo;
  const codigo = generarCodigoUnico();

  page.drawText('CONSTANCIA DE CONSENTIMIENTO FIRMADO', {
    x: 50,
    y: height - 60,
    size: 14,
    font: fontBold,
    color: PDFLib.rgb(0, 0, 0)
  });

  page.drawText(`Consentimiento: ${titulo}`, {
    x: 50,
    y: height - 90,
    size: 11,
    font
  });

  page.drawText(`Fecha y hora de firma: ${fechaHora}`, {
    x: 50,
    y: height - 110,
    size: 11,
    font
  });

  page.drawText(`Código de verificación: ${codigo}`, {
    x: 50,
    y: height - 130,
    size: 11,
    font
  });

  page.drawText('IPS: Evalúa Salud IPS', {
    x: 50,
    y: height - 150,
    size: 11,
    font
  });

  page.drawText('La firma registrada en este documento equivale a manifestación', {
    x: 50,
    y: height - 180,
    size: 10,
    font
  });
  page.drawText('de consentimiento informado por parte del paciente, de acuerdo con', {
    x: 50,
    y: height - 192,
    size: 10,
    font
  });
  page.drawText('la legislación colombiana aplicable en materia de historia clínica,', {
    x: 50,
    y: height - 204,
    size: 10,
    font
  });
  page.drawText('consentimiento informado y firma digital.', {
    x: 50,
    y: height - 216,
    size: 10,
    font
  });

  if (hayFirma) {
    const dataUrl = canvas.toDataURL('image/png');
    const firmaImage = await pdfFinal.embedPng(dataUrl);

    const firmaWidth = 250;
    const escala = firmaWidth / firmaImage.width;
    const firmaHeight = firmaImage.height * escala;

    const xFirma = 50;
    const yFirma = 100;

    page.drawImage(firmaImage, {
      x: xFirma,
      y: yFirma,
      width: firmaWidth,
      height: firmaHeight
    });

    page.drawText('Firma del paciente:', {
      x: xFirma,
      y: yFirma + firmaHeight + 10,
      size: 11,
      font: fontBold
    });
  } else {
    page.drawText('Sin firma registrada en el recuadro al momento de descarga.', {
      x: 50,
      y: 120,
      size: 10,
      font
    });
  }

  const pdfBytesFinal = await pdfFinal.save();
  const blob = new Blob([pdfBytesFinal], { type: 'application/pdf' });

  const link = document.createElement('a');
  const slug = consentimientoActual.archivo.replace('.pdf', '');
  link.href = URL.createObjectURL(blob);
  link.download = `consentimiento-${slug}-firmado.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =============================
// Código de verificación simple
// =============================
function generarCodigoUnico() {
  const ahora = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${ahora}-${random}`.toUpperCase();
}

// =============================
// Inicializar
// =============================
document.addEventListener('DOMContentLoaded', renderizarConsentimientos);
