const form = document.getElementById('contactForm');
const alertEl = document.getElementById('alert');
const submitBtn = document.getElementById('submitBtn');

const errName = document.getElementById('err-name');
const errEmail = document.getElementById('err-email');
const errSubject = document.getElementById('err-subject');
const errMessage = document.getElementById('err-message');

function setAlert(type, text) {
  alertEl.classList.remove('hidden', 'success', 'error');
  alertEl.classList.add(type === 'success' ? 'success' : 'error', 'alert');
  alertEl.textContent = text;
}

function clearAlert() {
  alertEl.classList.add('hidden');
  alertEl.textContent = '';
}

function setErrors(errors) {
  errName.textContent = errors.name || '';
  errEmail.textContent = errors.email || '';
  errSubject.textContent = errors.subject || '';
  errMessage.textContent = errors.message || '';
}

function clearErrors() {
  setErrors({});
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();
  clearErrors();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      if (data && data.errors) setErrors(data.errors);
      setAlert('error', data.message || 'Please fix the errors and try again.');
      return;
    }

    setAlert('success', 'Thanks! Your message has been sent.');
    form.reset();
  } catch (err) {
    setAlert('error', 'Network error. Please try again later.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});



