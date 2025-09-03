async function loadManifest(){
  const res = await fetch('manifest.json');
  return await res.json();
}
function slugify(name){
  return name.replace(/\.html$/i,'').replace(/[^\w\-\.]+/g,'-');
}
function createSectionCard(idx, fname){
  const id = slugify(fname);
  const section = document.createElement('section');
  section.className = 'section';
  section.id = id;

  const header = document.createElement('header');
  const h3 = document.createElement('h3');
  h3.textContent = `${idx+1}. ${fname}`;
  header.appendChild(h3);

  const controls = document.createElement('div');

  const btn = document.createElement('button');
  btn.textContent = 'Cargar contenido';
  btn.addEventListener('click', () => loadInto(section, fname, btn));

  const link = document.createElement('a');
  link.href = `content/${fname}`;
  link.textContent = 'Abrir archivo';
  link.style.marginLeft = '8px';
  link.target = '_blank';
  controls.appendChild(btn);
  controls.appendChild(link);
  header.appendChild(controls);

  const content = document.createElement('div');
  content.className = 'content';
  section.appendChild(header);
  section.appendChild(content);
  return section;
}
function loadInto(section, fname, btn){
  const container = section.querySelector('.content');
  if(container.dataset.loaded === '1'){
    container.querySelector('iframe').contentWindow.location.reload();
    return;
  }
  container.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.className = 'iframe';
  iframe.loading = 'lazy';
  iframe.src = 'content/'+fname;
  container.appendChild(iframe);
  container.dataset.loaded='1';
  if(btn) btn.textContent = 'Recargar contenido';
}
function buildTOC(manifest){
  const topicTitles = [
    "Conceptos básicos de automatización industrial",
    "Historia y evolución de los PLC",
    "Familia de PLC Allen Bradley y sus características",
    "Aplicaciones en la industria",
    "Estructura del hardware del PLC",
    "Tipos de módulos de entrada y salida (I/O)",
    "Comunicación y protocolos industriales",
    "Configuración de una estación de trabajo",
    "Introducción al software RSLogix 5000",
    "Lenguaje de programación Ladder (LD)",
    "Creación de proyectos y configuración de tags",
    "Simulación y pruebas de programas",
    "Instrucciones de bit (XIC, XIO, OTE, OTL, OTU)",
    "Instrucciones de temporización y conteo",
    "Instrucciones de comparación y transición",
    "Control de flujo del programa",
    "Configuración de redes industriales (Ethernet/IP, RS232)",
    "Diagnóstico y solución de problemas en PLC",
    "Métodos de respaldo y recuperación de programas",
    "Seguridad en sistemas automatizados",
    "Integración del PLC en procesos industriales",
    "Control de motores y actuadores",
    "Monitoreo y adquisición de datos / Casos de estudio y proyectos aplicados"
  ];
  const list = document.querySelector('#toc');
  list.innerHTML = '';
  manifest.toc_pages.forEach((fname, i) => {
    const a = document.createElement('a');
    a.href = 'content/' + fname;
    a.textContent = topicTitles[i] || fname;
    a.target = '_blank';
    const li = document.createElement('li');
    li.appendChild(a);
    list.appendChild(li);
  });
}
function markGlossary(manifest){
  if(!manifest.glossary_page) return;
  const note = document.querySelector('#glossary-note');
  note.textContent = `Glosario y cierre al final: ${manifest.glossary_page}`;
}
(async () => {
  const manifest = await loadManifest();
  buildTOC(manifest);
  markGlossary(manifest);
  const mount = document.querySelector('#sections');
  manifest.toc_pages.forEach((fname, i) => {
    const s = createSectionCard(i, fname);
    mount.appendChild(s);
  });
})();
