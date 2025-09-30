// ===== ESTADO GLOBAL DE LA APLICACIÓN =====
const AppState = {
  modifiedZones: new Set(),
  currentZoom: 1,
  tutorialCompleted: localStorage.getItem('tutorialCompleted') === 'true',
  selectedZone: null,
  zoomLimits: { min: 0.5, max: 3 }
};

// ===== UTILIDADES =====
const Utils = {
  // Función para mostrar notificaciones
  showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon');
    const text = notification.querySelector('.notification-text');
    
    // Configurar ícono según el tipo
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    
    icon.className = `notification-icon ${icons[type] || icons.info}`;
    text.textContent = message;
    notification.className = `notification ${type}`;
    
    // Mostrar notificación
    notification.classList.remove('hidden');
    
    // Ocultar después del tiempo especificado
    setTimeout(() => {
      notification.classList.add('hidden');
    }, duration);
  },
  
  // Función para actualizar estadísticas
  updateStats() {
    const modifiedCount = document.getElementById('modifiedCount');
    const lastModified = document.getElementById('lastModified');
    
    modifiedCount.textContent = AppState.modifiedZones.size;
    lastModified.textContent = AppState.selectedZone || 'Ninguna';
  },
  
  // Función para formatear nombres de zonas
  formatZoneName(zoneId) {
    const zoneNames = {
      A: 'Manzana A', B: 'Manzana B', C: 'Manzana C', D: 'Manzana D',
      E: 'Manzana E', F: 'Manzana F', G: 'Manzana G', H: 'Manzana H',
      I: 'Manzana I', J: 'Manzana J', K: 'Manzana K', L: 'Manzana L',
      M: 'Manzana M', N: 'Manzana N', O: 'Manzana O', P: 'Manzana P',
      Q: 'Manzana Q', R: 'Manzana R', S: 'Manzana S', T: 'Manzana T',
      calle19: 'Calle 19', calle20: 'Calle 20', calle21: 'Calle 21',
      carrera7: 'Carrera 7', carrera8: 'Carrera 8'
    };
    return zoneNames[zoneId] || `Zona ${zoneId.toUpperCase()}`;
  },
  
  // Función para obtener posición óptima del menú
  getOptimalMenuPosition(event) {
    const menu = document.getElementById('menuOpciones');
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    let x = event.pageX;
    let y = event.pageY;
    
    // Ajustar posición para evitar que el menú se salga de la pantalla
    const menuWidth = 400; // Ancho aproximado del menú
    const menuHeight = 400; // Alto aproximado del menú
    
    if (x + menuWidth > viewport.width) {
      x = viewport.width - menuWidth - 20;
    }
    
    if (y + menuHeight > viewport.height) {
      y = viewport.height - menuHeight - 20;
    }
    
    return { x: Math.max(20, x), y: Math.max(20, y) };
  }
};

// ===== GESTOR DE TUTORIAL =====
const Tutorial = {
  currentStep: 1,
  totalSteps: 4,
  
  init() {
    this.bindEvents();
    if (!AppState.tutorialCompleted) {
      this.show();
    }
  },
  
  bindEvents() {
    const modal = document.getElementById('tutorialModal');
    const closeBtn = document.getElementById('closeTutorial');
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const dots = document.querySelectorAll('.dot');
    
    closeBtn?.addEventListener('click', () => this.close());
    nextBtn?.addEventListener('click', () => this.nextStep());
    prevBtn?.addEventListener('click', () => this.prevStep());
    
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const step = parseInt(e.target.dataset.step);
        this.goToStep(step);
      });
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        this.close();
      }
    });
  },
  
  show() {
    const modal = document.getElementById('tutorialModal');
    modal.classList.remove('hidden');
    this.updateStep();
  },
  
  close() {
    const modal = document.getElementById('tutorialModal');
    modal.classList.add('hidden');
    AppState.tutorialCompleted = true;
    localStorage.setItem('tutorialCompleted', 'true');
    Utils.showNotification('¡Tutorial completado! Ahora puedes diseñar tu centro ideal', 'success');
  },
  
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStep();
    } else {
      this.close();
    }
  },
  
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStep();
    }
  },
  
  goToStep(step) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
      this.updateStep();
    }
  },
  
  updateStep() {
    // Actualizar pasos
    document.querySelectorAll('.tutorial-step').forEach(step => {
      step.classList.remove('active');
    });
    document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');
    
    // Actualizar dots
    document.querySelectorAll('.dot').forEach(dot => {
      dot.classList.remove('active');
    });
    document.querySelector(`.dot[data-step="${this.currentStep}"]`).classList.add('active');
    
    // Actualizar botones
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    prevBtn.disabled = this.currentStep === 1;
    
    if (this.currentStep === this.totalSteps) {
      nextBtn.innerHTML = '¡Empezar! <i class="fas fa-play"></i>';
    } else {
      nextBtn.innerHTML = 'Siguiente <i class="fas fa-chevron-right"></i>';
    }
  }
};

// ===== GESTOR DE ZOOM Y CONTROLES =====
const MapControls = {
  init() {
    this.bindEvents();
  },
  
  bindEvents() {
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');
    
    zoomInBtn?.addEventListener('click', () => this.zoomIn());
    zoomOutBtn?.addEventListener('click', () => this.zoomOut());
    resetZoomBtn?.addEventListener('click', () => this.resetZoom());
    
    // Zoom con rueda del mouse
    const mapa = document.getElementById('mapa');
    mapa?.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.zoomIn(0.1);
      } else {
        this.zoomOut(0.1);
      }
    });
  },
  
  zoomIn(step = 0.2) {
    const newZoom = Math.min(AppState.currentZoom + step, AppState.zoomLimits.max);
    this.setZoom(newZoom);
  },
  
  zoomOut(step = 0.2) {
    const newZoom = Math.max(AppState.currentZoom - step, AppState.zoomLimits.min);
    this.setZoom(newZoom);
  },
  
  resetZoom() {
    this.setZoom(1);
  },
  
  setZoom(zoom) {
    AppState.currentZoom = zoom;
    const svg = document.querySelector('#mapa svg');
    if (svg) {
      svg.style.transform = `scale(${zoom})`;
    }
  }
};

// ===== GESTOR PRINCIPAL DE LA APLICACIÓN =====
const MapApp = {
  init() {
    this.showLoading();
    this.bindEvents();
    this.initializeZones();
    Tutorial.init();
    MapControls.init();
    
    // Simular carga
    setTimeout(() => {
      this.hideLoading();
      Utils.showNotification('¡Centro Ideal cargado correctamente!', 'success');
    }, 2500);
  },
  
  showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
  },
  
  hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('hidden');
  },
  
  bindEvents() {
    // Eventos del header
    const helpBtn = document.getElementById('helpBtn');
    const resetBtn = document.getElementById('resetBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    helpBtn?.addEventListener('click', () => {
      AppState.tutorialCompleted = false;
      Tutorial.currentStep = 1;
      Tutorial.show();
    });
    
    resetBtn?.addEventListener('click', () => this.resetMap());
    saveBtn?.addEventListener('click', () => this.saveMap());
    
    // Panel de información
    const toggleInfo = document.getElementById('toggleInfo');
    const infoPanel = document.getElementById('infoPanel');
    
    toggleInfo?.addEventListener('click', () => {
      infoPanel.classList.toggle('collapsed');
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('menuOpciones');
      if (!menu.contains(e.target) && !e.target.closest('.manzana, .calle')) {
        this.hideMenu();
      }
    });
    
    // Eventos del menú de opciones
    const closeMenuBtn = document.getElementById('closeMenu');
    const removeDesignBtn = document.getElementById('removeDesign');
    
    closeMenuBtn?.addEventListener('click', () => this.hideMenu());
    removeDesignBtn?.addEventListener('click', () => this.removeDesign());
    
    // Teclas de acceso rápido
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideMenu();
      } else if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 's':
            e.preventDefault();
            this.saveMap();
            break;
          case 'r':
            e.preventDefault();
            this.resetMap();
            break;
        }
      }
    });
  },
  
  initializeZones() {
    const zones = document.querySelectorAll('#mapa svg [id]:not(#Capa_1)');
    
    zones.forEach(zone => {
      zone.style.cursor = 'pointer';
      zone.addEventListener('click', (event) => {
        event.stopPropagation();
        this.showOptionsMenu(zone, event);
      });
      
      // Efectos hover mejorados
      zone.addEventListener('mouseenter', () => {
        zone.classList.add('animate-fadeIn');
        
        // Mostrar tooltip con nombre de la zona
        this.showTooltip(zone, Utils.formatZoneName(zone.id));
      });
      
      zone.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  },
  
  showTooltip(element, text) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'tooltip';
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
      `;
      document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.style.opacity = '1';
    
    const updatePosition = (e) => {
      tooltip.style.left = (e.pageX + 10) + 'px';
      tooltip.style.top = (e.pageY - 30) + 'px';
    };
    
    element.addEventListener('mousemove', updatePosition);
    
    // Guardar referencia para limpiar después
    tooltip._updatePosition = updatePosition;
    tooltip._element = element;
  },
  
  hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      if (tooltip._element && tooltip._updatePosition) {
        tooltip._element.removeEventListener('mousemove', tooltip._updatePosition);
      }
    }
  },
  
  showOptionsMenu(zone, event) {
    const menu = document.getElementById('menuOpciones');
    const opciones = document.getElementById('opciones');
    const selectedZoneSpan = document.getElementById('selectedZone');
    
    // Limpiar opciones anteriores
    opciones.innerHTML = '';
    
    // Actualizar estado
    AppState.selectedZone = Utils.formatZoneName(zone.id);
    selectedZoneSpan.textContent = AppState.selectedZone;
    
    // Marcar zona como seleccionada
    document.querySelectorAll('.manzana, .calle').forEach(z => z.classList.remove('selected'));
    zone.classList.add('selected');
    
    // Generar opciones de imágenes
    const opciones_imgs = this.getImageOptions(zone.id);
    
    opciones_imgs.forEach((imgSrc, index) => {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = `Opción ${index + 1} para ${zone.id}`;
      img.loading = 'lazy';
      
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.applyDesign(zone, imgSrc);
        this.hideMenu();
      });
      
      img.addEventListener('error', () => {
        img.style.display = 'none';
      });
      
      opciones.appendChild(img);
    });
    
    // Posicionar y mostrar menú
    const position = Utils.getOptimalMenuPosition(event);
    menu.style.left = position.x + 'px';
    menu.style.top = position.y + 'px';
    menu.classList.remove('oculto');
    
    // Animación de entrada
    menu.classList.add('animate-slideInRight');
    setTimeout(() => menu.classList.remove('animate-slideInRight'), 500);
  },
  
  getImageOptions(zoneId) {
    const baseOptions = [
      `assets/${zoneId}_1.png`,
      `assets/${zoneId}_2.png`,
      `assets/${zoneId}_3.png`
    ];
    
    // Opciones especiales para ciertas zonas
    const specialOptions = {
      'K20': [`assets/K20_1.png`, `assets/K20_EJEMPLO.png`],
      'K21': [`assets/K21_1.png`, `assets/K21_EJEMPLO.png`],
      'C7.1': [`assets/C7.1_1.png`, `assets/C7.1_EJEMPLO.png`],
      'C7.2': [`assets/C7.2_1.png`, `assets/C7.2_EJEMPLO.png`],
      'C7.3': [`assets/C7.3_1.png`, `assets/C7.3_EJEMPLO.png`]
    };
    
    return specialOptions[zoneId] || baseOptions;
  },
  
  applyDesign(zone, imgSrc) {
    const svg = document.querySelector('#mapa svg');
    let defs = svg.querySelector('defs');
    
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }
    
    // Crear clipPath
    const clipId = `clip-${zone.id}`;
    let clipPath = document.getElementById(clipId);
    
    if (!clipPath) {
      clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', clipId);
      
      const shapeClone = zone.cloneNode(true);
      shapeClone.removeAttribute('fill');
      shapeClone.removeAttribute('class');
      clipPath.appendChild(shapeClone);
      
      defs.appendChild(clipPath);
    }
    
    // Crear o actualizar imagen
    let imgElement = svg.querySelector(`#img-${zone.id}`);
    if (!imgElement) {
      imgElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      imgElement.setAttribute('id', `img-${zone.id}`);
      imgElement.setAttribute('clip-path', `url(#${clipId})`);
      svg.appendChild(imgElement);
    }
    
    // Configurar imagen
    imgElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imgSrc);
    imgElement.setAttribute('x', '0');
    imgElement.setAttribute('y', '0');
    imgElement.setAttribute('width', '100%');
    imgElement.setAttribute('height', '100%');
    imgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    
    // Actualizar estado
    AppState.modifiedZones.add(zone.id);
    Utils.updateStats();
    
    // Animación de aplicación
    zone.classList.add('animate-bounce');
    setTimeout(() => zone.classList.remove('animate-bounce'), 1000);
    
    Utils.showNotification(`Diseño aplicado a ${Utils.formatZoneName(zone.id)}`, 'success');
  },
  
  removeDesign() {
    const selectedZone = document.querySelector('.manzana.selected, .calle.selected');
    if (!selectedZone) return;
    
    const svg = document.querySelector('#mapa svg');
    const imgElement = svg.querySelector(`#img-${selectedZone.id}`);
    
    if (imgElement) {
      imgElement.remove();
      AppState.modifiedZones.delete(selectedZone.id);
      Utils.updateStats();
      Utils.showNotification(`Diseño removido de ${Utils.formatZoneName(selectedZone.id)}`, 'info');
    }
    
    this.hideMenu();
  },
  
  hideMenu() {
    const menu = document.getElementById('menuOpciones');
    menu.classList.add('oculto');
    
    // Quitar selección
    document.querySelectorAll('.selected').forEach(zone => {
      zone.classList.remove('selected');
    });
    
    AppState.selectedZone = null;
  },
  
  resetMap() {
    if (AppState.modifiedZones.size === 0) {
      Utils.showNotification('No hay cambios que deshacer', 'info');
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres reiniciar todo el mapa? Se perderán todos los cambios.')) {
      const svg = document.querySelector('#mapa svg');
      
      // Remover todas las imágenes aplicadas
      AppState.modifiedZones.forEach(zoneId => {
        const imgElement = svg.querySelector(`#img-${zoneId}`);
        if (imgElement) {
          imgElement.remove();
        }
      });
      
      // Limpiar estado
      AppState.modifiedZones.clear();
      Utils.updateStats();
      this.hideMenu();
      
      Utils.showNotification('Mapa reiniciado correctamente', 'success');
    }
  },
  
  saveMap() {
    if (AppState.modifiedZones.size === 0) {
      Utils.showNotification('No hay cambios que guardar', 'warning');
      return;
    }
    
    try {
      const svg = document.querySelector('#mapa svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `centro-ideal-yopal-${new Date().toISOString().split('T')[0]}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      Utils.showNotification('¡Centro Ideal guardado correctamente!', 'success');
    } catch (error) {
      console.error('Error al guardar:', error);
      Utils.showNotification('Error al guardar el archivo', 'error');
    }
  }
};

// ===== INICIALIZACIÓN =====
window.addEventListener('DOMContentLoaded', () => {
  MapApp.init();
});

// Manejar errores globales
window.addEventListener('error', (e) => {
  console.error('Error en la aplicación:', e.error);
  Utils.showNotification('Ha ocurrido un error inesperado', 'error');
});

// Exportar para uso externo si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MapApp, Tutorial, MapControls, Utils };
}