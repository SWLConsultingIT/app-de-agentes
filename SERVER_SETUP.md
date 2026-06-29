# GrowthAI Server Setup

La app necesita correr desde un servidor HTTP para inyectar el token de Metricool desde `.env`.

## Quick Start

### 1. Instala Node.js (si no lo tienes)
Descarga desde https://nodejs.org/

### 2. Instala dependencias
```bash
npm install dotenv
```

### 3. Verifica tu `.env` tiene METRICOOL_TOKEN
```
METRICOOL_TOKEN=tu_token_aqui
```

### 4. Corre el servidor
```bash
node server.js
```

### 5. Abre en navegador
```
http://localhost:3000
```

---

## Qué hace el servidor

- Sirve todos los archivos estáticos (JS, CSS, HTML, etc)
- **Reemplaza `{{METRICOOL_TOKEN}}` en index.html con el valor de `.env`**
- Permite CORS para llamadas a Metricool API

## Si no tienes Node.js

Alternativa: usa Python
```bash
python -m http.server 3000
```

Pero esto NO inyectará el token - tendrías que pasarlo manualmente en el código.
