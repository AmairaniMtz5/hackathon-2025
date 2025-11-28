const weeklyReports = [
  {
    weekLabel: 'Semana 1',
    range: '24 - 30 Noviembre 2025',
    summary: 'Colectas ejecutadas puntualmente, enfocadas en residuos PET y orgánicos.',
    metrics: [
      { label: 'Recolecciones', value: '4 completadas' },
      { label: 'Residuos reciclados', value: '78 kg (PET + Cartón)' }
    ],
    sessions: [
      { date: '27 Nov, 09:30 AM', zone: 'Cafetería Central', type: 'PET/Plástico', status: 'Completado', notes: 'Recolección sin incidencias.' },
      { date: '27 Nov, 10:15 AM', zone: 'Edificio B', type: 'Orgánico', status: 'Completado', notes: 'Zona entregada en 20 min.' },
      { date: '26 Nov, 04:40 PM', zone: 'Laboratorios', type: 'Cartón', status: 'Completado', notes: 'Cajas apiladas y securizadas.' },
      { date: '26 Nov, 02:20 PM', zone: 'Estacionamiento', type: 'No Reciclable', status: 'Retraso', notes: 'Vehículo con demora; se resolvió a las 14:50.' }
    ],
    footnote: 'Nivel de cumplimiento: 95 % (el único retraso se resolvió antes de las 5 PM del mismo día).'
  },
  {
    weekLabel: 'Semana 2',
    range: '17 - 23 Noviembre 2025',
    summary: 'Coordinamos recolecciones en zonas externas y reforzamos la separación de cartón.',
    metrics: [
      { label: 'Recolecciones', value: '5 completadas' },
      { label: 'Residuos reciclados', value: '64 kg (Cartón + Orgánico)' }
    ],
    sessions: [
      { date: '23 Nov, 11:00 AM', zone: 'Zona Deportiva', type: 'Cartón', status: 'Completado', notes: 'Se reforzó la separación de cartón.' },
      { date: '22 Nov, 08:45 AM', zone: 'Centro de Copiado', type: 'PET/Plástico', status: 'Completado', notes: 'Lotes preparados listas para reciclaje.' },
      { date: '20 Nov, 03:10 PM', zone: 'Biblioteca', type: 'Orgánico', status: 'Completado', notes: 'Flujo constante durante la mañana.' },
      { date: '19 Nov, 05:10 PM', zone: 'Ágora', type: 'No Reciclable', status: 'Completado', notes: 'Operativo con apoyo nocturno.' }
    ],
    footnote: 'Se detectó aumento en cartón (+12 %) tras entrega de materiales académicos.'
  },
  {
    weekLabel: 'Semana 3',
    range: '10 - 16 Noviembre 2025',
    summary: 'Recolecciones mixtas con foco en contenedores llenos en edificios administrativos.',
    metrics: [
      { label: 'Recolecciones', value: '6 completadas' },
      { label: 'Residuos reciclados', value: '89 kg (PET + Orgánico)' }
    ],
    sessions: [
      { date: '16 Nov, 09:05 AM', zone: 'Edificio Administrativo', type: 'PET/Plástico', status: 'Completado', notes: 'Área atendida por turno matutino.' },
      { date: '15 Nov, 02:40 PM', zone: 'Núcleo de Docencia', type: 'Orgánico', status: 'Completado', notes: 'Se dejó evidencia fotográfica.' },
      { date: '14 Nov, 10:15 AM', zone: 'Auditorio', type: 'Cartón', status: 'Completado', notes: 'Se reportaron 3 grandes paquetes.' },
      { date: '13 Nov, 01:00 PM', zone: 'Laboratorios', type: 'PET/Plástico', status: 'Retraso', notes: 'Revisión de accesos retrasó ruta 30 min.' }
    ],
    footnote: 'Retraso en laboratorio resuelto con apoyo de equipo técnico; se reforzó monitoreo.'
  }
];

const typeClasses = {
  'PET/Plástico': 'type-plastic',
  'Orgánico': 'type-organic',
  'Cartón': 'type-cardboard',
  'No Reciclable': 'type-trash'
};

const weeksGrid = document.getElementById('weeksGrid');
const weekDetail = document.getElementById('weekDetail');

const createSessionRows = (sessions, includeNote) => sessions.map((session) => {
  const typeClass = typeClasses[session.type] || 'type-plastic';
  const statusClass = session.status === 'Retraso' ? 'delay' : 'completed';
  const statusIcon = session.status === 'Retraso' ? '!' : '✓';
  const noteCell = includeNote ? `<td>${session.notes || '—'}</td>` : '';
  return `
    <tr class="week-row">
      <td>${session.date}</td>
      <td class="zone-col">${session.zone}</td>
      <td class="type-col"><span class="type-chip ${typeClass}">${session.type}</span></td>
      <td class="status-col"><span class="status-dot ${statusClass}">${statusIcon}</span>${session.status}</td>
      ${noteCell}
    </tr>`;
}).join('');

if (weeksGrid) {
  weeklyReports.forEach((weekReport, index) => {
    const metricsHtml = weekReport.metrics.map(metric => `<div><strong>${metric.value}</strong><span>${metric.label}</span></div>`).join('');

    const card = document.createElement('article');
    card.classList.add('week-card');
    card.setAttribute('data-week-label', weekReport.weekLabel);
    card.setAttribute('data-week-index', index);
    card.innerHTML = `
      <header>
        <div>
          <p class="week-meta">
            <strong>${weekReport.weekLabel}</strong>
            ${weekReport.range}
          </p>
          <p class="week-meta">${weekReport.summary}</p>
        </div>
        <button class="download-btn" data-week-index="${index}">Descargar PDF</button>
      </header>
      <div class="week-metrics">${metricsHtml}</div>
      <p class="week-footnote">${weekReport.footnote}</p>
    `;

    weeksGrid.appendChild(card);
  });
}

async function exportWeekAsPDF(card, weekLabel, button) {
  const { jsPDF } = window.jspdf;
  const sanitizedLabel = weekLabel.toLowerCase().replace(/\s+/g, '-');
  if (!card || !button || !jsPDF) return;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = 'Generando PDF...';

  try {
    const canvas = await html2canvas(card, {
      scale: 2,
      backgroundColor: '#ffffff',
      scrollY: -window.scrollY,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 12;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pdfWidth = pageWidth - margin * 2;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
    pdf.save(`historial-${sanitizedLabel}.pdf`);
  } catch (error) {
    console.error('Error generando PDF', error);
    alert('Ocurrió un error al crear el PDF. Por favor intenta de nuevo.');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

const highlightCard = (clickedCard) => {
  document.querySelectorAll('.week-card').forEach(card => card.classList.remove('active'));
  clickedCard?.classList?.add('active');
};

const renderDetailTable = (weekReport) => {
  if (!weekDetail || !weekReport) return;
  const rows = createSessionRows(weekReport.sessions, true);
  const metricsHtml = weekReport.metrics.map(metric => `<div><strong>${metric.value}</strong><span>${metric.label}</span></div>`).join('');
  weekDetail.classList.add('active');
  weekDetail.innerHTML = `
    <div>
      <h2 class="detail-title">${weekReport.weekLabel}</h2>
      <p class="detail-description">${weekReport.summary}</p>
    </div>
    <div class="week-metrics">${metricsHtml}</div>
    <table class="detail-table" aria-label="Reporte detallado ${weekReport.weekLabel}">
      <thead>
        <tr>
          <th>Fecha / Hora</th>
          <th>Zona</th>
          <th>Tipo de residuo</th>
          <th>Estado</th>
          <th>Notas</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="week-footnote">${weekReport.footnote}</p>
  `;
};

weeksGrid.addEventListener('click', (event) => {
  const button = event.target.closest('.download-btn');
  if (button) {
    const card = button.closest('.week-card');
    const weekLabel = card?.dataset?.weekLabel || 'semana';
    exportWeekAsPDF(card, weekLabel, button);
    return;
  }

  const card = event.target.closest('.week-card');
  if (!card) return;
  const index = Number(card.dataset.weekIndex);
  const weekReport = weeklyReports[index];
  highlightCard(card);
  renderDetailTable(weekReport);
});
