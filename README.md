# CV interactivo - Andy Jorge Burgoa Callejas

Examen práctico 2 de Tecnologías Web I (SIS-214), Universidad Católica Boliviana "San Pablo"

- Repositorio: https://github.com/AndyCTT/SIS214_ExamenPractico2_BurgoaAndy
- Sitio publicado: https://andyctt.github.io/SIS214_ExamenPractico2_BurgoaAndy/

## Estructura del proyecto

```
index.html
css/
  styles.css        importa los demás archivos
  variables.css     tokens de diseño y tema claro/oscuro
  base.css          reset universal y estilos globales
  layout.css        estructura y media queries
  components.css    botones, tarjetas, formulario, tablas
  animations.css    animaciones de entrada
js/
  main.js                    tema, menú, buscador y consumo de la API
  validacion_formulario.js   validación del formulario de contacto
assets/
  images/                    fotografias y capturas de los proyectos
  documents/                 CV en PDF
```

## Como esta construido

- **HTML5 semántico:** `header`, `nav`, `main`, `section`, `article`, `aside` y `footer`, con atributos ARIA (`aria-expanded`, `aria-controls`, `aria-label`, `aria-live`, `role="status"`)
- **CSS3:** diseño mobile-first con tres rangos (móvil menor a 768px, tablet de 768px a 1024px y escritorio desde 1025px). Se usa Flexbox para componentes y Grid para las rejillas de tarjetas y la cabecera. Los colores, tipografías y espaciados están como variables CSS en `:root`
- **JavaScript ES6+:**
  1. Cambio de tema claro/oscuro guardado en `localStorage` con `JSON.stringify` y `JSON.parse`
  2. Menú hamburguesa que alterna una clase y actualiza `aria-expanded`
  3. Buscador de proyectos en tiempo real con `.filter()` y `.map()`, sin modificar los datos originales
  4. Formulario de contacto con `preventDefault()` y validación en cada evento `input`
  5. Lista de repositorios de GitHub con `fetch`, `async/await`, `try...catch`, `response.ok` y mensajes para los estados cargando, éxito y error (400, 403, 404 y 500)

## Ejecutar en local

Abrir la carpeta con Visual Studio Code y usar la extensión Live Server, o desde una terminal en la carpeta del proyecto:

```
python -m http.server 8000
```

y abrir `http://localhost:8000`

## Despliegue

El sitio se publica con GitHub Pages desde la rama `main`, carpeta raíz (Settings > Pages)

## Notas

- El formulario solo valida los datos en el navegador; no envía correos porque no hay servidor
- La API de GitHub limita las peticiones sin autenticar, por eso a veces puede aparecer el error 403

## Verificacion antes de entregar

- Probar en 375px, 768px y 1280px
- Comprobar menú, tema persistente, búsqueda, formulario y respuesta de GitHub
- Revisar consola del navegador y validar HTML
- Subir el repositorio a GitHub y activar Pages desde main
- Comprovar las dos URL públicas antes de enviarlas a Moodle

> el formulario valida pero no manda mensajes porque no tiene backend

## Menús desplegables

El menú principal se abre con el botón y actualiza `aria-expanded`. Los repositorios de GitHub estan dentro de un elemento semántico `details` con `summary` y se siguen cargando mediante la API REST
