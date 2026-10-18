// validacion del formulario de contacto
// usa la validacion nativa de html5 (validity) y muestra los errores en tiempo real
function inicializar_validacion_formulario() {
  const formulario = document.getElementById('formulario_contacto');
  const confirmacion = document.getElementById('mensaje_confirmacion');

  if (!formulario) {
    return;
  }

  // cada campo con su funcion de validacion
  const validadores = {nombre: validar_nombre, correo: validar_correo, telefono: validar_telefono, motivo: validar_motivo, mensaje: validar_mensaje, aceptar: validar_aceptar};
  const ids_campos = Object.keys(validadores);

  // se valida cada vez que el usuario escrive o cambia algo
  Object.entries(validadores).forEach(([id, validar]) => {
    const campo = document.getElementById(id);
    campo.addEventListener('input', validar);
    campo.addEventListener('change', validar);
    campo.setAttribute('aria-describedby', 'error_' + id);
  });

  // al enviar se frena el recargo de la pajina con preventDefault
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // se validan todos los campos para que salgan todos los errores juntos
    const resultados = Object.values(validadores).map((validar) => validar());
    const todo_valido = resultados.every(Boolean);

    if (todo_valido) {
      // primero se limpia y despues se muestra, si no el reset esconde el mensage
      formulario.reset();
      confirmacion.hidden = false;
      mostrar_notificacion('Formulario validado; no se envió ningún correo');

      setTimeout(() => {
        confirmacion.hidden = true;
      }, 4000);
    } else {
      confirmacion.hidden = true;
      mostrar_notificacion('Revisa los campos marcados en rojo');
    }
  });

  // al limpiar tambien se quitan los errores y el aria-invalid
  formulario.addEventListener('reset', () => {
    ids_campos.forEach((id) => limpiar_error(id, document.getElementById(id)));
    confirmacion.hidden = true;
  });

  // revisa un campo con la validacion nativa (validity) y muestra el mensaje
  function revisar_campo(nombre_campo, mensajes, minimo) {
    const campo = document.getElementById(nombre_campo);
    const estado = campo.validity;
    let texto_error = '';

    if (estado.valueMissing) {
      texto_error = mensajes.vacio;
    } else if (estado.typeMismatch || estado.patternMismatch) {
      texto_error = mensajes.formato;
    } else if (estado.tooShort || (minimo && campo.value.trim().length < minimo)) {
      // el trim es para que no valgan solo espacios
      texto_error = mensajes.corto;
    }

    if (texto_error) {
      mostrar_error(nombre_campo, campo, texto_error);
      return false;
    }

    limpiar_error(nombre_campo, campo);
    return true;
  }

  function validar_nombre() {
    return revisar_campo('nombre', {vacio: 'Escribe al menos 3 caracteres.', corto: 'Escribe al menos 3 caracteres.'}, 3);
  }

  function validar_correo() {
    return revisar_campo('correo', {vacio: 'Ingresa tu correo.', formato: 'Ingresa un correo válido.'});
  }

  function validar_telefono() {
    return revisar_campo('telefono', {vacio: 'Ingresa tu teléfono.', formato: 'Ingresa un teléfono válido.'});
  }

  function validar_motivo() {
    return revisar_campo('motivo', {vacio: 'Selecciona un motivo de contacto.'});
  }

  function validar_mensaje() {
    return revisar_campo('mensaje', {vacio: 'Escribe al menos 10 caracteres.', corto: 'Escribe al menos 10 caracteres.'}, 10);
  }

  function validar_aceptar() {
    return revisar_campo('aceptar', {vacio: 'Debes aceptar el tratamiento de datos.'});
  }

  // pone el texto de error y marca el campo como invalido
  function mostrar_error(nombre_campo, campo, texto_error) {
    const casilla_error = document.getElementById('error_' + nombre_campo);
    casilla_error.textContent = texto_error;
    campo.setAttribute('aria-invalid', 'true');
  }

  // quita el error y el aria-invalid del campo
  function limpiar_error(nombre_campo, campo) {
    const casilla_error = document.getElementById('error_' + nombre_campo);
    casilla_error.textContent = '';

    if (campo) {
      campo.removeAttribute('aria-invalid');
    }
  }
}
