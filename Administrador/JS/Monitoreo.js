(function () {
  function fmtTime(d) {
    return d.toLocaleString(undefined, {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      day: '2-digit', month: '2-digit'
    });
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateKPIs(sample) {
    setText('kpiContainers', String(sample.full));
    setText('kpiEvents', String(sample.empty));
    setText('kpiLast', sample.last);
  }

  function sampleKPIs() {
    const full = randomInt(3, 10);
    const empty = randomInt(3, 8);
    return {
      full: full,
      empty: empty,
      last: fmtTime(new Date())
    };
  }

  function updateLastUpdate() {
    setText('lastUpdate', fmtTime(new Date()));
  }

  function tryFirebaseSignOut() {
    try {
      if (window.firebase && firebase.auth) {
        return firebase.auth().signOut();
      }
    } catch (e) { /* ignore */ }
    return Promise.resolve();
  }

  function initMap() {
    try {
      if (typeof L === 'undefined') {
        console.error('Leaflet no está cargado');
        return;
      }

      const mapContainer = document.getElementById('mapContainer');
      if (!mapContainer) return;

      const map = L.map('mapContainer').setView([20.13528, -98.38056], 18);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const campusGeoJSON = {
        "type":"FeatureCollection",
        "features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-98.38082,20.13562],[-98.38096,20.13560],[-98.38117,20.13557],[-98.38134,20.13555],[-98.38141,20.13554],[-98.38148,20.13528],[-98.38152,20.13517],[-98.38145,20.13509],[-98.38145,20.13503],[-98.38150,20.13497],[-98.38167,20.13497],[-98.38174,20.13497],[-98.38175,20.13476],[-98.38051,20.13482],[-98.38031,20.13483],[-98.38006,20.13484],[-98.37996,20.13484],[-98.37989,20.13495],[-98.37987,20.13504],[-98.37986,20.13512],[-98.37986,20.13519],[-98.37986,20.13526],[-98.37987,20.13536],[-98.37989,20.13543],[-98.37992,20.13548],[-98.37997,20.13552],[-98.38006,20.13556],[-98.38018,20.13559],[-98.38034,20.13561],[-98.38051,20.13563],[-98.38067,20.13563],[-98.38082,20.13562]]]}}]
      };

      L.geoJSON(campusGeoJSON, {
        style: {
          color: '#7e917e',
          weight: 3,
          opacity: 0.8,
          fillColor: '#cfe8cf',
          fillOpacity: 0.3
        }
      }).addTo(map).bindPopup('Campus UPT');

      const markers = [
        [20.13545, -98.38070, 'Entrada Principal'],
        [20.13530, -98.38090, 'Edificio A'],
        [20.13515, -98.38110, 'Cafetería'],
        [20.13505, -98.38080, 'Biblioteca'],
        [20.13520, -98.38050, 'Laboratorios'],
        [20.13540, -98.38100, 'Auditorio'],
        [20.13510, -98.38060, 'Gimnasio'],
        [20.13525, -98.38130, 'Estacionamiento'],
        [20.13535, -98.38040, 'Jardín Central'],
        [20.13500, -98.38100, 'Canchas'],
        [20.13550, -98.38090, 'Rectoría'],
        [20.13515, -98.38070, 'Centro de Cómputo'],
        [20.13505, -98.38050, 'Área de Descanso']
      ];

      markers.forEach(([lat, lng, name]) => {
        L.circleMarker([lat, lng], {
          radius: 6,
          fillColor: '#7e917e',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map).bindPopup(name);
      });

      // Fix para que Leaflet se redimensione correctamente
      setTimeout(() => map.invalidateSize(), 100);
    } catch (e) {
      console.error('Error inicializando mapa:', e);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateLastUpdate();
    updateKPIs(sampleKPIs());
    initMap();

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        updateLastUpdate();
        updateKPIs(sampleKPIs());
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await tryFirebaseSignOut();
        // Simple UX: go to root or login if exists
        window.location.href = '../../index.html';
      });
    }

    // Set a minimal notification count if present
    const notify = document.getElementById('notifyCount');
    if (notify && !notify.textContent.trim()) {
      notify.textContent = '1';
    }
  });
})();
