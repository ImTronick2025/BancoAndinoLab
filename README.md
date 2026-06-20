# Cloud Architecture Platform

Plataforma **model-driven** para documentar arquitecturas de cloud híbrido
(on-premise + nube) mediante diagramas **C4** y **diagramas de red**. El MVP se
enfoca en **Azure**. Inspirada en [IcePanel](https://icepanel.io).

> 📄 Requerimientos y alcance del MVP: [`docs/requirements.md`](docs/requirements.md)

## Arquitectura del repositorio

Monorepo con **npm workspaces**:

```
packages/
  model/   @cap/model — dominio compartido (objetos, relaciones, vistas)
apps/
  api/     @cap/api   — NestJS + TypeORM + PostgreSQL (REST API)
  web/     @cap/web   — React + Vite + React Flow (canvas drag & drop)
```

El **modelo es único** por proyecto; las vistas (C4 y red) referencian los
objetos del modelo y guardan su posición/estilo, sin duplicarlos.

## Requisitos

- Node.js >= 20
- Docker (para PostgreSQL en local)

## Puesta en marcha

```bash
# 1. Instalar dependencias (todos los workspaces)
npm install

# 2. Compilar el paquete de dominio compartido
npm run build --workspace @cap/model

# 3. Levantar PostgreSQL
docker compose up -d db

# 4. Configurar variables del API
cp apps/api/.env.example apps/api/.env

# 5. Arrancar API (http://localhost:3000/api) y web (http://localhost:5173)
npm run dev:api      # en una terminal
npm run dev:web      # en otra terminal
```

### Endpoints iniciales del API

| Método | Ruta | Descripción |
|---|---|---|
| GET  | `/api/health` | Healthcheck |
| GET  | `/api/projects` | Lista de proyectos |
| POST | `/api/projects` | Crear proyecto |
| GET  | `/api/projects/:id` | Proyecto con su modelo |
| GET  | `/api/projects/:id/model` | Exportar modelo (diagram-as-code, JSON) |
| DELETE | `/api/projects/:id` | Eliminar proyecto |

## Estado

Fase 0 — Fundaciones (scaffolding). Ver roadmap en
[`docs/requirements.md`](docs/requirements.md).
