// Proteger ruta: verificar autenticación
const firebaseReady = typeof auth !== 'undefined' && typeof db !== 'undefined' && typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== 'TU_API_KEY_AQUI';

if (!firebaseReady) {
  // Modo local: verificar sesión con localStorage
  const localUser = localStorage.getItem('bozaLocalUser');
  if (!localUser) {
    window.location.href = '../../index.html';
  } else {
    const user = JSON.parse(localUser);
    loadUserData(user);
    loadDashboardStats();
    loadRecentActivity();
    updateLastUpdate();
  }
} else {
  // Modo Firebase
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = '../../index.html';
      return;
    }
    loadUserData(user);
    loadDashboardStats();
    loadRecentActivity();
    updateLastUpdate();
  });
}

// Cargar información del usuario
function loadUserData(user) {
  const userEmailEl = document.getElementById('userEmail');
  const userAvatarEl = document.getElementById('userAvatar');
  
  if (userEmailEl) {
    userEmailEl.textContent = user.email;
  }
  
  if (userAvatarEl && user.photoURL) {
    userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="Avatar" style="width:100%;border-radius:50%;">`;
  } else if (userAvatarEl) {
    const initial = user.email.charAt(0).toUpperCase();
    userAvatarEl.textContent = initial;
  }
}

// Cargar estadísticas del dashboard
async function loadDashboardStats() {
  try {
    // Ejemplo: obtener estadísticas desde Firestore
    const statsRef = db.collection('statistics').doc('current');
    const statsDoc = await statsRef.get();
    
    if (statsDoc.exists) {
      const data = statsDoc.data();
      
      document.getElementById('activeUsers').textContent = data.activeUsers || 0;
      document.getElementById('collectionsToday').textContent = data.collectionsToday || 0;
      document.getElementById('recycledMaterial').textContent = `${data.recycledKg || 0} kg`;
      document.getElementById('co2Saved').textContent = `${data.co2SavedKg || 0} kg`;
    } else {
      // Valores por defecto si no hay datos
      setDefaultStats();
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    setDefaultStats();
  }
}

function setDefaultStats() {
  document.getElementById('activeUsers').textContent = '0';
  document.getElementById('collectionsToday').textContent = '0';
  document.getElementById('recycledMaterial').textContent = '0 kg';
  document.getElementById('co2Saved').textContent = '0 kg';
}

// Actualizar etiqueta de última actualización
function updateLastUpdate() {
  const el = document.getElementById('lastUpdate');
  if (!el) return;
  const now = new Date();
  const fmt = now.toLocaleString('es-MX', { hour12: false });
  el.textContent = fmt;
}

// Botón de refresco manual
document.getElementById('refreshBtn')?.addEventListener('click', async () => {
  const btn = document.getElementById('refreshBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Actualizando...';
  }
  try {
    await Promise.all([
      loadDashboardStats(),
      loadRecentActivity()
    ]);
    updateLastUpdate();
  } catch (e) {
    console.error('Error actualizando panel:', e);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Actualizar';
    }
  }
});

// Animaciones simples al cargar valores
function animateValue(el, newText) {
  if (!el) return;
  el.style.transition = 'transform .18s, opacity .18s';
  el.style.transform = 'scale(0.98)';
  el.style.opacity = '0.7';
  setTimeout(() => {
    el.textContent = newText;
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';
  }, 120);
}

// Cargar actividad reciente
async function loadRecentActivity() {
  const activityContainer = document.getElementById('recentActivity');
  
  try {
    // Obtener últimas 10 actividades
    const activitiesRef = db.collection('activities')
      .orderBy('timestamp', 'desc')
      .limit(10);
    
    const snapshot = await activitiesRef.get();
    
    if (snapshot.empty) {
      activityContainer.innerHTML = '<p class="no-data">No hay actividad reciente.</p>';
      return;
    }
    
    let html = '<ul class="activity-items">';
    snapshot.forEach(doc => {
      const activity = doc.data();
      const date = activity.timestamp?.toDate().toLocaleString('es-MX') || 'Fecha desconocida';
      html += `
        <li class="activity-item">
          <span class="activity-icon">${getActivityIcon(activity.type)}</span>
          <div class="activity-details">
            <strong>${activity.description || 'Actividad'}</strong>
            <small>${date}</small>
          </div>
        </li>
      `;
    });
    html += '</ul>';
    
    activityContainer.innerHTML = html;
    
  } catch (error) {
    console.error('Error cargando actividad:', error);
    activityContainer.innerHTML = '<p class="error-msg">Error al cargar actividad.</p>';
  }
}

function getActivityIcon(type) {
  const icons = {
    'collection': '♻️',
    'user': '👤',
    'report': '📊',
    'alert': '⚠️',
    'success': '✅'
  };
  return icons[type] || '📌';
}

// Cerrar sesión
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  const firebaseReady = typeof auth !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== 'TU_API_KEY_AQUI';
  
  if (!firebaseReady) {
    // Modo local: borrar sesión de localStorage
    localStorage.removeItem('bozaLocalUser');
    window.location.href = '../../index.html';
    return;
  }
  
  try {
    await auth.signOut();
    window.location.href = '../../index.html';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    alert('Error al cerrar sesión. Intenta nuevamente.');
  }
});

// Escuchar cambios en tiempo real (opcional)
function setupRealtimeListeners() {
  // Escuchar cambios en estadísticas
  db.collection('statistics').doc('current')
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        animateValue(document.getElementById('activeUsers'), String(data.activeUsers || 0));
        animateValue(document.getElementById('collectionsToday'), String(data.collectionsToday || 0));
        animateValue(document.getElementById('recycledMaterial'), `${data.recycledKg || 0} kg`);
        animateValue(document.getElementById('co2Saved'), `${data.co2SavedKg || 0} kg`);
      }
    }, (error) => {
      console.error('Error en listener:', error);
    });
}

// Activar listeners en tiempo real (opcional)
// setupRealtimeListeners();
