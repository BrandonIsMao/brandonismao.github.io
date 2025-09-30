# 🏙️ Centro Ideal de Yopal

## Descripción

**Centro Ideal de Yopal** es una aplicación web interactiva que te permite diseñar y personalizar el centro de la ciudad de Yopal según tu visión ideal. Selecciona diferentes tipos de edificaciones para cada manzana y calle, creando tu propia versión del corazón de la ciudad.

## ✨ Nuevas Características

### 🎨 Diseño Moderno y Atractivo
- **Interfaz completamente renovada** con gradientes modernos y animaciones suaves
- **Tipografía mejorada** usando Google Fonts (Poppins)
- **Iconos FontAwesome** para una mejor experiencia visual
- **Responsive design** que se adapta a cualquier dispositivo

### 🎓 Tutorial Interactivo
- **Tutorial paso a paso** para nuevos usuarios
- **4 pasos guiados** que explican cómo usar la aplicación
- **Navegación intuitiva** con puntos indicadores
- **Se muestra automáticamente** en la primera visita

### 🗺️ Controles de Mapa Mejorados
- **Zoom in/out** con botones dedicados
- **Zoom con rueda del mouse** para mayor comodidad
- **Reset de zoom** para volver a la vista original
- **Tooltips informativos** al pasar el mouse sobre las zonas

### 📊 Panel de Información
- **Estadísticas en tiempo real** de modificaciones
- **Contador de manzanas modificadas**
- **Última zona modificada**
- **Tips y consejos** útiles

### 🔧 Funcionalidades Avanzadas
- **Guardar diseño** como archivo SVG
- **Reiniciar mapa** con confirmación
- **Notificaciones visuales** para todas las acciones
- **Atajos de teclado** (Ctrl+S para guardar, Ctrl+R para reiniciar)
- **Menú mejorado** con opciones adicionales

### 🎯 Experiencia de Usuario
- **Animaciones fluidas** en todas las interacciones
- **Feedback visual** inmediato
- **Carga con splash screen** personalizada
- **Manejo de errores** elegante
- **Accesibilidad mejorada**

## 🚀 Cómo Usar

### 1. Primer Uso
- Al abrir la aplicación por primera vez, se mostrará automáticamente el tutorial
- Sigue los 4 pasos para aprender a usar todas las funciones
- Puedes saltar el tutorial haciendo clic en la "X" o completarlo para una mejor experiencia

### 2. Seleccionar Zonas
- **Haz clic** en cualquier manzana (área blanca) o calle del plano
- Se mostrará un **menú flotante** con las opciones disponibles
- **Pasa el mouse** sobre las zonas para ver su nombre

### 3. Aplicar Diseños
- En el menú de opciones, **haz clic** en la imagen que más te guste
- El diseño se aplicará automáticamente a la zona seleccionada
- Recibirás una **notificación** confirmando la acción

### 4. Controles del Mapa
- Usa los **botones de zoom** (esquina superior izquierda) para acercar/alejar
- **Rueda del mouse** también funciona para hacer zoom
- **Botón de reset** para volver a la vista original

### 5. Guardar tu Trabajo
- Haz clic en **"Guardar"** en el header para descargar tu diseño
- O usa el atajo **Ctrl+S** (Cmd+S en Mac)
- Se descargará un archivo SVG con tu diseño personalizado

### 6. Reiniciar
- Haz clic en **"Reiniciar"** para limpiar todos los cambios
- O usa el atajo **Ctrl+R** (Cmd+R en Mac)
- Se pedirá confirmación antes de eliminar los cambios

## 🎮 Atajos de Teclado

- **Escape**: Cerrar menús/tutorial
- **Ctrl+S** / **Cmd+S**: Guardar diseño
- **Ctrl+R** / **Cmd+R**: Reiniciar mapa

## 📱 Compatibilidad

### Dispositivos Soportados
- ✅ **Desktop** (Windows, Mac, Linux)
- ✅ **Tablet** (iPad, Android tablets)
- ✅ **Móvil** (iOS, Android)

### Navegadores Soportados
- ✅ **Chrome** 80+
- ✅ **Firefox** 75+
- ✅ **Safari** 13+
- ✅ **Edge** 80+

## 🛠️ Instalación y Ejecución

### Opción 1: Servidor Local Simple
```bash
# Navegar al directorio del proyecto
cd proyecto

# Iniciar servidor con Python
python3 -m http.server 8000

# O con Node.js (si tienes npx instalado)
npx serve .

# Abrir en el navegador
# http://localhost:8000
```

### Opción 2: Abrir Directamente
- Simplemente abre el archivo `index.html` en tu navegador
- Todas las funciones trabajarán correctamente

## 📁 Estructura del Proyecto

```
proyecto/
├── index.html          # Archivo principal HTML
├── styles.css          # Estilos CSS mejorados
├── app.js             # Lógica JavaScript avanzada
├── plano.svg          # Plano base de Yopal
└── assets/            # Imágenes de las opciones
    ├── A_1.png
    ├── B_1.png
    ├── C_1.png
    ├── ...
    └── [más imágenes]
```

## 🎨 Personalizaciones Técnicas

### Variables CSS Disponibles
```css
:root {
  --primary-color: #4f46e5;     /* Color principal */
  --secondary-color: #10b981;    /* Color secundario */
  --accent-color: #f59e0b;       /* Color de acento */
  /* ... más variables disponibles */
}
```

### API JavaScript
```javascript
// Mostrar notificación personalizada
Utils.showNotification('Mensaje', 'success', 3000);

// Actualizar estadísticas
Utils.updateStats();

// Mostrar tutorial manualmente
Tutorial.show();
```

## 🐛 Solución de Problemas

### Las imágenes no cargan
- Verifica que los archivos estén en la carpeta `assets/`
- Asegúrate de que los nombres coincidan con el patrón `[ZONA]_[NUMERO].png`

### El tutorial no aparece
- Limpia el localStorage del navegador
- O ejecuta en la consola: `localStorage.removeItem('tutorialCompleted')`

### Problemas de rendimiento
- Usa un navegador moderno actualizado
- Cierra otras pestañas pesadas
- Verifica que tienes suficiente memoria disponible

## 🤝 Contribuciones

Si deseas agregar nuevas funcionalidades:

1. **Nuevas zonas**: Agrega elementos con IDs únicos al SVG
2. **Nuevas imágenes**: Colócalas en `assets/` siguiendo el patrón de nombres
3. **Estilos**: Modifica las variables CSS en `:root`
4. **Funcionalidades**: Extiende los objetos `MapApp`, `Tutorial`, etc.

## 📄 Licencia

Este proyecto está diseñado para uso educativo y de demostración. Siéntete libre de usarlo y modificarlo según tus necesidades.

---

**¡Disfruta creando tu Centro Ideal de Yopal! 🏙️✨**