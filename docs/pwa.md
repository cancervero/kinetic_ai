# Progressive Web App (PWA)

## Características PWA

Kinetic AI es una PWA completa que ofrece:

- ✅ Instalable en dispositivo
- ✅ Funciona offline
- ✅ App Shell caching
- ✅ Actualizaciones automáticas
- ✅ Ícono en pantalla de inicio
- ✅ Modo standalone (sin barra del navegador)

## Service Worker

### Configuración

Usamos **Vite PWA Plugin** para generación automática:

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  manifest: { /* ... */ },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
    runtimeCaching: [ /* ... */ ]
  }
})
```

### Cache Strategies

**App Shell (Cache First):**
- HTML, CSS, JS principal
- Assets estáticos
- Modelos ML desde CDN

**Runtime Caching:**
```javascript
{
  urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
  handler: 'CacheFirst',
  options: {
    cacheName: 'tf-models-cache',
    expiration: {
      maxEntries: 10,
      maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
    }
  }
}
```

### Ciclo de Vida

```
Install → Activate → Fetch

1. Install: Cachea app shell
2. Activate: Limpia caches viejos
3. Fetch: Intercepta requests, sirve desde cache
```

## Manifest

### Archivo

**Ubicación:** `public/manifest.json`

```json
{
  "name": "Kinetic AI",
  "short_name": "KineticAI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Propiedades Clave

- **name**: Nombre completo de la app
- **short_name**: Nombre corto (debajo del ícono)
- **start_url**: URL inicial al abrir
- **display**: standalone = sin barra del navegador
- **orientation**: portrait = forzar vertical
- **icons**: Íconos para diferentes tamaños

## Instalación en Dispositivos

### iOS (Safari)

**Requisitos:**
- iOS 11.3+
- Safari únicamente (no Chrome/Firefox)
- HTTPS en producción

**Pasos:**
1. Abre la app en Safari
2. Toca botón compartir (ícono cuadrado con flecha)
3. Scroll → "Agregar a pantalla de inicio"
4. Confirma el nombre
5. Toca "Agregar"

**Limitaciones iOS:**
- No muestra banner de instalación
- Service Worker con restricciones
- Cache limitado a 50MB

### Android (Chrome)

**Requisitos:**
- Android 5.0+
- Chrome 40+
- HTTPS en producción

**Pasos:**
1. Abre la app en Chrome
2. Verás banner "Agregar a pantalla de inicio" (automático)
   - O menú (⋮) → "Instalar app"
3. Toca "Instalar"
4. App aparece en launcher

**Ventajas Android:**
- Banner de instalación automático
- Service Worker completo
- Push notifications (futuro)

### Desktop (Chrome, Edge)

**Pasos:**
1. Abre la app
2. Ícono de instalación en barra de direcciones (⊕)
3. Click → "Instalar Kinetic AI"
4. App aparece como ventana separada

## Modo Offline

### Primera Visita (Online)

```
1. Usuario visita app
2. Service Worker se registra
3. Se cachea app shell
4. Se descarga modelo ML (~12MB)
5. Modelo se cachea localmente
```

### Visitas Subsecuentes (Offline)

```
1. Usuario abre app (sin conexión)
2. Service Worker sirve app shell desde cache
3. Modelo ML se carga desde cache
4. App funciona 100% offline
```

### Actualización de la App

Cuando hay nueva versión:

```
1. Service Worker detecta cambio
2. Descarga nueva versión en background
3. Activa automáticamente (autoUpdate)
4. Usuario ve nueva versión en próxima carga
```

## Permisos

### Cámara

La app requiere permiso de cámara:

```javascript
navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'user' }
})
```

**Primera vez:**
- Navegador muestra prompt de permiso
- Usuario debe aceptar
- Permiso se guarda para futuras visitas

**En iOS:**
- Requiere HTTPS (excepto localhost)
- Permiso por sesión (puede expirar)

**En Android:**
- Permiso persistente
- Configurable en ajustes del navegador

## HTTPS

### Desarrollo Local

```bash
npm run dev
# http://localhost:5173 (funciona sin HTTPS)
```

**Excepción:** `localhost` está exento de requisito HTTPS.

### Testing en Móvil Local

**Opción 1: ngrok**
```bash
npm run dev
ngrok http 5173
# Usa URL https://xxx.ngrok.io
```

**Opción 2: Local HTTPS**
```bash
# Generar certificado auto-firmado
mkcert localhost
vite --https
```

### Producción

**Requiere HTTPS obligatorio.**

Opciones de hosting:
- Vercel (HTTPS automático)
- Netlify (HTTPS automático)
- GitHub Pages (HTTPS automático)
- Firebase Hosting (HTTPS automático)

## Debugging

### Chrome DevTools

**Application Tab:**
- Service Workers: Ver estado, update, unregister
- Cache Storage: Inspeccionar contenido de cache
- Manifest: Validar manifest.json

**Lighthouse:**
- Audit → Progressive Web App
- Checklist de requisitos PWA
- Score y recomendaciones

### Safari DevTools (iOS)

**En Mac con dispositivo iOS conectado:**
1. Safari → Develop → [Dispositivo] → [Página]
2. Console para ver errores
3. Storage para ver cache

### Errores Comunes

**Service Worker no registra:**
- Verificar HTTPS en producción
- Verificar que no hay errores de sintaxis
- Check console para errores

**Cache no funciona:**
- Verificar glob patterns en vite.config
- Check que URLs coinciden con urlPattern
- Limpiar cache y hard reload

**App no se instala:**
- Verificar manifest.json válido
- Verificar íconos existen
- Verificar start_url correcto
- Verificar HTTPS

## Optimizaciones

### App Shell

Mantener app shell pequeño:
- HTML/CSS/JS mínimo
- Lazy load componentes
- Code splitting

### Cache Size

Límites por navegador:
- Chrome: ~6% de disco libre
- Safari: ~50MB
- Firefox: ~10% disco libre

**Nuestra app:**
- App shell: ~500KB
- Modelo ML: ~12MB
- Total: ~12.5MB ✓

### Performance

**Métricas objetivo:**
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Score: >90

**Conseguirlas:**
- Preload critical resources
- Lazy load routes
- Optimize images
- Minify JS/CSS (Vite automático)
