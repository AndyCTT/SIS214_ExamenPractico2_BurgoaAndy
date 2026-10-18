// cuando carga la pajina se inician las funsiones
document.addEventListener('DOMContentLoaded', () => {
  inicializar_tema();
  inicializar_menu();
  inicializar_buscador();
  cargar_repositorios();
  document.getElementById("recargar_github").addEventListener("click", cargar_repositorios);
  inicializar_foto_respaldo();
  inicializar_imagenes_proyecto();

  if (typeof inicializar_validacion_formulario === 'function') {
    inicializar_validacion_formulario();
  }
});

// tema claro y oscuro, se gaurda en localstorage
function inicializar_tema() {
  const raiz = document.documentElement;
  const boton = document.getElementById('boton_tema');
  const icono = document.getElementById('icono_tema');
  const texto = document.getElementById('texto_tema');
  let tema_guardado;
  try { tema_guardado = JSON.parse(localStorage.getItem('cv_tema')); } catch (error) { tema_guardado = null; }

  // si no ay tema guardado usa el oscuro
  if (tema_guardado === null) {
    tema_guardado = 'oscuro';
  }

  aplicar_tema(tema_guardado);

  // al dar click cambia el tema
  boton.addEventListener('click', () => {
    const tema_actual = raiz.getAttribute('data-tema');
    const tema_nuevo = tema_actual === 'oscuro' ? 'claro' : 'oscuro';

    aplicar_tema(tema_nuevo);
    try { localStorage.setItem('cv_tema', JSON.stringify(tema_nuevo)); } catch (error) { console.warn('No se pudo guardar el tema', error); }

    if (tema_nuevo === 'oscuro') {
      mostrar_notificacion('Modo oscuro activado');
    } else {
      mostrar_notificacion('Modo claro activado');
    }
  });

  function aplicar_tema(tema) {
    raiz.setAttribute('data-tema', tema);

    if (tema === 'oscuro') {
      icono.textContent = '🌙';
      texto.textContent = 'Modo claro';
      boton.setAttribute('aria-pressed', 'false');
    } else {
      icono.textContent = '☀️';
      texto.textContent = 'Modo oscuro';
      boton.setAttribute('aria-pressed', 'true');
    }
  }
}

// si la foto no carga muestra las iniciales
function inicializar_foto_respaldo() {
  const foto = document.getElementById('foto_perfil');
  const iniciales = document.getElementById('foto_iniciales');

  const mostrar_iniciales = () => {
    foto.hidden = true;
    iniciales.hidden = false;
  };

  foto.addEventListener('error', mostrar_iniciales);
  if (foto.complete && foto.naturalWidth === 0) {
    mostrar_iniciales();
  }
}

// esconde la imagen si no se pudo cargar
function inicializar_imagenes_proyecto() {
  const imagenes = document.querySelectorAll('.proyecto_imagen');

  imagenes.forEach((imagen) => {
    imagen.addEventListener('error', () => {
      imagen.closest('.proyecto_imagen_marco').hidden = true;
    });
  });
}

// muestra un mensage abajo a la derecha
function mostrar_notificacion(mensaje) {
  const notificacion = document.getElementById('notificacion');
  notificacion.textContent = mensaje;
  notificacion.classList.add('visible');

  clearTimeout(mostrar_notificacion.temporizador);
  mostrar_notificacion.temporizador = setTimeout(() => {
    notificacion.classList.remove('visible');
  }, 2500);
}

// menu hamburgesa, cambia el aria-expanded
function inicializar_menu() {
  const boton = document.getElementById('boton_menu');
  const enlaces = document.getElementById('enlaces_navegacion');
  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    boton.setAttribute('aria-label', abierto ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
    enlaces.classList.toggle('abierto', !abierto);
  });
  enlaces.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) {
      enlaces.classList.remove('abierto');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú de navegación');
    }
  });
}

// buscador en tiempo real, no modifica los datos orijinales
function inicializar_buscador() {
  const campo = document.getElementById('buscar_proyectos');
  const lista = document.getElementById('lista_proyectos');
  const resultado = document.getElementById('resultado_busqueda');
  const originales = [...lista.querySelectorAll(':scope > article')];
  // se sacan los textos con map
  const datos = originales.map((elemento, indice) => ({indice, texto: elemento.textContent.toLocaleLowerCase('es')}));
  campo.addEventListener('input', () => {
    const termino = campo.value.trim().toLocaleLowerCase('es');
    // filter deja solo los que coinciden
    const indices = datos.filter(item => item.texto.includes(termino)).map(item => item.indice);
    originales.forEach((elemento, indice) => { elemento.hidden = !indices.includes(indice); });
    resultado.textContent = `${indices.length} resultado(s) encontrado(s).`;
  });
}

// pide los repositorios a la api de github
async function cargar_repositorios() {
  const estado = document.getElementById('estado_github');
  const lista = document.getElementById('repositorios_github');
  // estado cargando
  estado.textContent = 'Cargando repositorios…';
  estado.dataset.estado = 'cargando';
  lista.replaceChildren();
  try {
    // fetch con await
    const respuesta = await fetch('https://api.github.com/users/AndyCTT/repos?sort=updated&per_page=5', {headers: {Accept: 'application/vnd.github+json'}});
    // si la respuesta no es ok lanza un eror segun el codigo
    if (!respuesta.ok) {
      const errores = {400: 'Solicitud incorrecta (400)', 403: 'Límite de solicitudes alcanzado (403)', 404: 'Usuario no encontrado (404)', 500: 'Error del servidor (500)'};
      throw new Error(errores[respuesta.status] || `Error HTTP ${respuesta.status}`);
    }
    const repositorios = await respuesta.json();
    if (!Array.isArray(repositorios)) throw new Error('Respuesta inesperada de la API');
    repositorios.forEach(repo => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = repo.html_url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = repo.name;
      li.append(a);
      lista.append(li);
    });
    // estado de exito
    estado.textContent = repositorios.length ? 'Repositorios cargados correctamente' : 'No se encontraron repositorios públicos';
    estado.dataset.estado = 'exito';
  // si algo falla se muestra el error
  } catch (error) {
    estado.textContent = `No se pudieron cargar los repositorios: ${error.message}`;
    estado.dataset.estado = 'error';
  }
}
