const API_BASE = 'http://127.0.0.1:8000';
let currentUser = null;

// Utility functions
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 3000);
}

function setUserBadge(email) {
  const badge = document.querySelector('#user-badge span');
  badge.textContent = `Usuario: ${email}`;
}

function toggleLogoutButton(show) {
  const btn = document.getElementById('btn-logout');
  btn.style.display = show ? 'block' : 'none';
}

function toggleLockedTabs(locked) {
  const tabs = ['servicios', 'mascotas', 'reporte'];
  tabs.forEach(tab => {
    const link = document.querySelector(`a[data-tab="${tab}"]`);
    if (locked) {
      link.classList.add('locked');
    } else {
      link.classList.remove('locked');
    }
  });
}

// Tab switching
function switchTab(tabName) {
  // Remove active from all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  // Add active to selected section
  const targetSection = document.getElementById(tabName);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Special actions per tab
  if (tabName === 'reporte' && currentUser) {
    document.getElementById('reporte-correo').value = currentUser;
  }
  if (tabName === 'servicios') {
    loadServicios();
  }
}

// API calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Load servicios
async function loadServicios() {
  try {
    const data = await apiCall('/servicios');
    renderServiciosList(data.servicios);
    populateServicioSelect(data.servicios);
  } catch (error) {
    showAlert('Error cargando servicios', 'error');
  }
}

function renderServiciosList(servicios) {
  const list = document.getElementById('servicios-lista');
  list.innerHTML = '';
  servicios.forEach(servicio => {
    const li = document.createElement('li');
    li.textContent = `${servicio.nombre} - $${servicio.precio}`;
    list.appendChild(li);
  });
}

function populateServicioSelect(servicios) {
  const select = document.getElementById('mascota-servicio');
  select.innerHTML = '<option value="">Seleccione</option>';
  servicios.forEach(servicio => {
    const option = document.createElement('option');
    option.value = servicio.nombre;
    option.textContent = servicio.nombre;
    select.appendChild(option);
  });
}

// Form handlers
document.getElementById('form-saludo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre-saludo').value;
  try {
    const data = await apiCall(`/bienvenido/${nombre}`);
    showAlert(data.mensaje);
  } catch (error) {
    showAlert('Error en saludo', 'error');
  }
});

document.getElementById('form-registro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const correo = document.getElementById('registro-email').value;
  const contrasena = document.getElementById('registro-password').value;
  try {
    await apiCall('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });
    showAlert('Registro exitoso');
    switchTab('acceso');
  } catch (error) {
    showAlert('Error en registro', 'error');
  }
});

document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const correo = document.getElementById('login-email').value;
  const contrasena = document.getElementById('login-password').value;
  try {
    await apiCall('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });
    currentUser = correo;
    setUserBadge(correo);
    toggleLogoutButton(true);
    toggleLockedTabs(false);
    showAlert('Login exitoso');
    switchTab('servicios');
  } catch (error) {
    showAlert('Error en login', 'error');
  }
});

document.getElementById('form-agregar-servicio').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return;
  const nombre = document.getElementById('servicio-nombre').value;
  const precio = parseFloat(document.getElementById('servicio-precio').value);
  try {
    await apiCall('/agregar-servicio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio })
    });
    showAlert('Servicio agregado');
    loadServicios();
    e.target.reset();
  } catch (error) {
    showAlert('Error agregando servicio', 'error');
  }
});

document.getElementById('form-registrar-mascota').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return;
  const correo = document.getElementById('mascota-correo').value;
  const nombre = document.getElementById('mascota-nombre').value;
  const tipo_servicio = document.getElementById('mascota-servicio').value;
  const fecha = document.getElementById('mascota-fecha').value;
  try {
    await apiCall('/registrar-mascota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, nombre, tipo_servicio, fecha })
    });
    showAlert('Mascota registrada');
    e.target.reset();
  } catch (error) {
    showAlert('Error registrando mascota', 'error');
  }
});

document.getElementById('form-buscar-mascota').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('buscar-mascota').value;
  try {
    const data = await apiCall(`/mascotas/${query}`);
    renderMascotas(data.mascotas);
  } catch (error) {
    showAlert('Error buscando mascotas', 'error');
  }
});

function renderMascotas(mascotas) {
  const list = document.getElementById('mascotas-lista');
  list.innerHTML = '';
  mascotas.forEach(mascota => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h4>${mascota.nombre}</h4>
      <p>Correo: ${mascota.correo}</p>
      <p>Servicio: ${mascota.tipo_servicio}</p>
      <p>Fecha: ${mascota.fecha}</p>
    `;
    list.appendChild(li);
  });
}

document.getElementById('form-reporte').addEventListener('submit', async (e) => {
  e.preventDefault();
  const correo = document.getElementById('reporte-correo').value;
  try {
    const data = await apiCall(`/reporte/${correo}`);
    renderReporte(data);
  } catch (error) {
    showAlert('Error obteniendo reporte', 'error');
  }
});

function renderReporte(data) {
  const area = document.getElementById('reporte-area');
  area.innerHTML = `
    <div class="stat-box">
      <h4>Cantidad de Servicios</h4>
      <p>${data.cantidad_servicios}</p>
    </div>
    <div class="stat-box">
      <h4>Total Gastado</h4>
      <p>$${data.total_gastado}</p>
    </div>
    <div class="stat-box">
      <h4>Correo</h4>
      <p>${data.correo}</p>
    </div>
    <div>
      <h4>Servicios Usados</h4>
      ${data.servicios.map(s => `<span class="tag">${s}</span>`).join('')}
    </div>
  `;
}

// Navigation
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = link.getAttribute('data-tab');
    if (link.classList.contains('locked')) return;
    switchTab(tab);
  });
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
  currentUser = null;
  setUserBadge('Invitado');
  toggleLogoutButton(false);
  toggleLockedTabs(true);
  switchTab('acceso');
});

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  toggleLockedTabs(true);
  toggleLogoutButton(false);
  switchTab('inicio');
});