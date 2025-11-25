// scripts/consentimientos.js

// Lista de consentimientos
const consentimientos = [
  { titulo: 'Audiometría', archivo: 'audiometria.pdf' },
  { titulo: 'Optometría', archivo: 'optometria.pdf' },
  { titulo: 'Espirometría', archivo: 'espirometria.pdf' },
  { titulo: 'Electrocardiograma', archivo: 'electrocardiograma.pdf' },
  { titulo: 'Laboratorio Clínico', archivo: 'laboratorio.pdf' },
  { titulo: 'Manipulación de Alimentos', archivo: 'manipulacion-alimentos.pdf' },
  { titulo: 'Evaluación Médico Ocupacional', archivo: 'examen-medico.pdf' },
  { titulo: 'Prueba de Alcohol', archivo: 'prueba-alcohol.pdf' },
  { titulo: 'Paneles de Drogas', archivo: 'spa.pdf' },
  { titulo: 'Psicología', archivo: 'psicologia.pdf' },
  { titulo: 'Parcial de Orina', archivo: 'parcial-orina.pdf' },
  { titulo: 'Tamizaje de Voz', archivo: 'tamizaje-voz.pdf' },
  { titulo: 'Prueba de Embarazo', archivo: 'embarazo.pdf' }
];

// Renderizar tarjetas dinámicamente
function renderizarConsentimientos() {
  const cont = document.getElementById('lista-consentimientos');

  consentimientos.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'tarjeta-consentimiento';

    card.innerHTML = `<h3 class="tarjeta-titulo">${c.titulo}</h3>`;

    // Acción: abrir PDF directamente en una nueva pestaña
    card.onclick = () => {
      window.open(`pdfs/${c.archivo}`, '_blank');
    };

    cont.appendChild(card);
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', renderizarConsentimientos);
