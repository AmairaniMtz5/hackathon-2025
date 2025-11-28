const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const feedback = document.getElementById('formFeedback');
const togglePasswordBtn = document.getElementById('togglePassword');
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
  
  try {
    // Autenticación con Firebase
    const userCredential = await auth.signInWithEmailAndPassword(
      emailInput.value.trim(),
      passwordInput.value
    );
    
    const user = userCredential.user;
    
    // Guardar información del usuario en Firestore (opcional)
    await db.collection('usuarios').doc(user.uid).set({
      email: user.email,
      ultimoAcceso: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    feedback.textContent = '¡Ingreso exitoso!';
    feedback.classList.add('success');
    
    // Redirigir al dashboard después de 1 segundo
    setTimeout(() => {
      window.location.href = 'Administrador/Pantallas/Dashboard.html';
    }, 1000);
    
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    let mensaje = 'Error al iniciar sesión.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        mensaje = 'Usuario no encontrado.';
        break;
      case 'auth/wrong-password':
        mensaje = 'Contraseña incorrecta.';
        break;
      case 'auth/invalid-email':
        mensaje = 'Correo inválido.';
        break;
      case 'auth/user-disabled':
        mensaje = 'Usuario deshabilitado.';
        break;
      case 'auth/too-many-requests':
        mensaje = 'Demasiados intentos. Intenta más tarde.';
        break;
      default:
        mensaje = `Error: ${error.message}`;
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
