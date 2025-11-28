// Verificar autenticación similar al Dashboard
const firebaseReady = typeof auth !== 'undefined' && typeof db !== 'undefined' && typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== 'TU_API_KEY_AQUI';

if (!firebaseReady) {
	const localUser = localStorage.getItem('bozaLocalUser');
	if (!localUser) {
		window.location.href = '../../index.html';
	} else {
		const user = JSON.parse(localUser);
		loadUserData(user);
	}
} else {
	auth.onAuthStateChanged((user) => {
		if (!user) {
			window.location.href = '../../index.html';
			return;
		}
		loadUserData(user);
	});
}

function loadUserData(user) {
	const userEmailEl = document.getElementById('userEmail');
	const userAvatarEl = document.getElementById('userAvatar');
	if (userEmailEl) userEmailEl.textContent = user.email || 'Usuario';
	if (userAvatarEl && user.photoURL) {
		userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="Avatar" style="width:100%;border-radius:50%">`;
	} else if (userAvatarEl && user.email) {
		userAvatarEl.textContent = (user.email.charAt(0) || 'U').toUpperCase();
	}
}

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
	if (!firebaseReady) {
		localStorage.removeItem('bozaLocalUser');
		window.location.href = '../../index.html';
		return;
	}
	try {
		await auth.signOut();
		window.location.href = '../../index.html';
	} catch (e) {
		console.error(e);
		alert('No se pudo cerrar sesión.');
	}
});

// Acción de refresco (espacio para futuras métricas en tiempo real)
document.getElementById('refreshBtn')?.addEventListener('click', () => {
	const btn = document.getElementById('refreshBtn');
	if (!btn) return;
	btn.disabled = true;
	btn.textContent = 'Actualizando...';
	setTimeout(() => {
		btn.disabled = false;
		btn.textContent = 'Actualizar';
	}, 600);
});
