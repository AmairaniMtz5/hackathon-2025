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
  // Simulación de llamada a API
  feedback.textContent = 'Procesando...';
  try {
    await new Promise(r => setTimeout(r, 800));
    // Ejemplo simple: aceptar si password === 'boza123'
    if (passwordInput.value === 'boza123') {
      feedback.textContent = '¡Ingreso exitoso!';
      feedback.classList.add('success');
      form.reset();
    } else {
      feedback.textContent = 'Credenciales inválidas.';
      feedback.classList.add('error');
    }
  } catch (err) {
    feedback.textContent = 'Error inesperado.';
    feedback.classList.add('error');
  }
});

togglePasswordBtn.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
});
