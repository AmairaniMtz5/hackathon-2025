const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const feedback = document.getElementById('formFeedback');
const togglePasswordBtn = document.getElementById('togglePassword');
const registerBtn = document.getElementById('registerBtn');
const forgotBtn = document.getElementById('forgotBtn');
const yearSpan = document.getElementById('year');

yearSpan.textContent = new Date().getFullYear();

function validateEmail() {
  const value = emailInput.value.trim();
  if (!value) {
    emailError.textContent = 'Ingresa tu correo.';
    return false;
  }
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) {
    emailError.textContent = 'Formato de correo inválido.';
    return false;
  }
  emailError.textContent = '';
  return true;
}
function validatePassword() {
  const value = passwordInput.value;
  if (!value) {
    passwordError.textContent = 'Ingresa tu contraseña.';
    return false;
  }
  if (value.length < 6) {
    passwordError.textContent = 'Mínimo 6 caracteres.';
    return false;
  }
  passwordError.textContent = '';
  return true;
}

emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.className = 'feedback';
  feedback.textContent = '';

  const okEmail = validateEmail();
  const okPass = validatePassword();
  if (!okEmail || !okPass) {
    feedback.textContent = 'Revisa los campos marcados.';
    feedback.classList.add('error');
    return;
  }

  feedback.textContent = 'Iniciando sesión...';

  // Fallback local si Firebase no está configurado
  const firebaseReady = typeof auth !== 'undefined' && typeof db !== 'undefined' && typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== 'TU_API_KEY_AQUI';

  if (!firebaseReady) {
    // Credenciales locales de prueba
    const LOCAL_USERS = [
      { email: 'admin@boza.com', password: 'Boza2025!' },
      { email: 'user@boza.com', password: 'BozaUser123!' }
    ];
    const found = LOCAL_USERS.find(u => u.email === emailInput.value.trim() && u.password === passwordInput.value);
    if (found) {
      // Guardar sesión en localStorage
      localStorage.setItem('bozaLocalUser', JSON.stringify({ email: found.email }));
      feedback.textContent = '¡Ingreso exitoso (local)!';
      feedback.classList.add('success');
      setTimeout(() => {
        window.location.href = 'Administrador/Pantallas/Dashboard.html';
      }, 700);
    } else {
      feedback.textContent = 'Credenciales inválidas (modo local).';
      feedback.classList.add('error');
    }
    return;
  }

  try {
    // Autenticación con Firebase
    const userCredential = await auth.signInWithEmailAndPassword(
      emailInput.value.trim(),
      passwordInput.value
    );
    const user = userCredential.user;
    await db.collection('usuarios').doc(user.uid).set({
      email: user.email,
      ultimoAcceso: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    feedback.textContent = '¡Ingreso exitoso!';
    feedback.classList.add('success');
    setTimeout(() => {
      window.location.href = 'Administrador/Pantallas/Dashboard.html';
    }, 1000);
  } catch (error) {
    console.error('Error de autenticación:', error);
    let mensaje = 'Error al iniciar sesión.';
    switch (error.code) {
      case 'auth/user-not-found': mensaje = 'Usuario no encontrado.'; break;
      case 'auth/wrong-password': mensaje = 'Contraseña incorrecta.'; break;
      case 'auth/invalid-email': mensaje = 'Correo inválido.'; break;
      case 'auth/user-disabled': mensaje = 'Usuario deshabilitado.'; break;
      case 'auth/too-many-requests': mensaje = 'Demasiados intentos. Intenta más tarde.'; break;
      default: mensaje = `Error: ${error.message}`;
    }
    feedback.textContent = mensaje;
    feedback.classList.add('error');
  }
});

togglePasswordBtn.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});

// Crear cuenta
registerBtn?.addEventListener('click', async () => {
  feedback.className = 'feedback';
  feedback.textContent = '';
  const okEmail = validateEmail();
  const okPass = validatePassword();
  if (!okEmail || !okPass) {
    feedback.textContent = 'Revisa correo y contraseña (mín. 6).';
    feedback.classList.add('error');
    return;
  }
  const firebaseReady = typeof auth !== 'undefined' && typeof db !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== 'TU_API_KEY_AQUI';
  if (!firebaseReady) {
    feedback.textContent = 'Modo local: crea usuarios directamente en Firebase más tarde.';
    feedback.classList.add('success');
    return;
  }
  feedback.textContent = 'Creando cuenta...';
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      emailInput.value.trim(),
      passwordInput.value
    );
    const user = userCredential.user;
    await db.collection('usuarios').doc(user.uid).set({
      email: user.email,
      creadoEn: firebase.firestore.FieldValue.serverTimestamp(),
      rol: 'usuario'
    }, { merge: true });
    feedback.textContent = 'Cuenta creada. Iniciando sesión...';
    feedback.classList.add('success');
    setTimeout(() => {
      window.location.href = 'Administrador/Pantallas/Dashboard.html';
    }, 900);
  } catch (error) {
    console.error('Error creando cuenta:', error);
    let mensaje = 'No se pudo crear la cuenta.';
    if (error.code === 'auth/email-already-in-use') mensaje = 'El correo ya está en uso.';
    if (error.code === 'auth/invalid-email') mensaje = 'Correo inválido.';
    if (error.code === 'auth/weak-password') mensaje = 'Contraseña muy débil.';
    feedback.textContent = mensaje;
    feedback.classList.add('error');
  }
});

// Olvidé contraseña
forgotBtn?.addEventListener('click', async () => {
  feedback.className = 'feedback';
  const email = emailInput.value.trim();
  if (!email) {
    emailError.textContent = 'Ingresa tu correo para recuperar.';
    return;
  }
  const firebaseReady = typeof auth !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== 'TU_API_KEY_AQUI';
  if (!firebaseReady) {
    feedback.textContent = 'Modo local: recuperación de contraseña no disponible.';
    feedback.classList.add('error');
    return;
  }
  try {
    await auth.sendPasswordResetEmail(email);
    feedback.textContent = 'Te enviamos un correo para recuperar la contraseña.';
    feedback.classList.add('success');
  } catch (error) {
    console.error('Error enviando reset:', error);
    feedback.textContent = 'No se pudo enviar el correo de recuperación.';
    feedback.classList.add('error');
  }
});
