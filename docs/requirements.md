# Plataforma de Diagramación de Arquitecturas Cloud — Documento de Requerimientos (MVP)

> **Estado:** Borrador refinado · **Fecha:** 2026-06-20
> **Inspiración / referencia:** [IcePanel](https://icepanel.io)
> **Nombre del producto:** *(pendiente — ver sección "Pendientes / decisiones abiertas")*

---

## 1. Visión

Construir una **aplicación web (SaaS)** para **documentar arquitecturas de cloud híbrido**
(on-premise + nube) mediante diagramas **C4** y **diagramas de red**.

A diferencia de una herramienta de dibujo libre (draw.io, Visio), la plataforma es
**model-driven**: el usuario define **un único modelo** de la arquitectura (sistemas,
contenedores, componentes, recursos de red y sus relaciones) y a partir de ese modelo
se generan **múltiples vistas/diagramas sincronizados**. Cambiar el modelo actualiza
todas las vistas, evitando documentación inconsistente y desactualizada.

El objetivo de largo plazo es soportar **Azure, AWS y GCP**. El **MVP se enfoca
exclusivamente en Azure**.

---

## 2. Objetivos y métricas de éxito

| Objetivo | Métrica |
|---|---|
| Permitir documentar una arquitectura Azure híbrida completa | Un usuario modela un sistema real con VNets, App Services, bases de datos y conexión on-prem sin salirse de la herramienta |
| Mantener consistencia entre vistas | Un cambio en el modelo se refleja automáticamente en todas las vistas C4 y de red |
| Time-to-first-diagram bajo | Un usuario nuevo crea su primer diagrama válido en < 10 minutos |
| Colaboración básica de equipo | Varios usuarios de un mismo equipo acceden y editan los mismos proyectos (no simultáneo) |

---

## 3. Alcance del MVP

### 3.1 Dentro del alcance (MVP)

- **Enfoque cloud:** únicamente **Azure**.
- **Tipos de diagrama (ambos incluidos en el MVP):**
  - **C4:** niveles **Context**, **Container** y **Component**. *(El nivel "Code" queda fuera del MVP.)*
  - **Diagrama de red:** topología de red Azure (VNets, subnets, NSGs, gateways, peering, conexión híbrida on-prem vía VPN/ExpressRoute).
- **Autoría:** **manual (drag & drop)** de elementos sobre el canvas, vinculados al modelo.
- **Modelo único** compartido entre vistas (model-driven).
- **Multiusuario con cuentas:** autenticación, organizaciones/equipos y proyectos guardados en la nube.
  - *No* incluye edición colaborativa en tiempo real (sin cursores simultáneos / CRDT).
- **Exportación:** **PNG/SVG**, **PDF** y **diagram-as-code (JSON/YAML)** versionable.
- **Set de iconos oficial de Azure** para servicios y recursos.

### 3.2 Fuera del alcance (post-MVP)

- AWS y GCP.
- Importación desde IaC (Bicep / Terraform / ARM).
- Auto-discovery vía Azure Resource Manager API (escaneo de suscripciones en vivo).
- Edición colaborativa en tiempo real.
- Nivel C4 "Code".
- Versionado/historial avanzado, comentarios y revisiones.

---

## 4. Usuarios objetivo (personas)

| Persona | Necesidad principal |
|---|---|
| **Arquitecto de soluciones cloud** | Documentar y comunicar arquitecturas Azure híbridas a distintos niveles de detalle |
| **Ingeniero de plataforma / DevOps** | Mantener diagramas de red precisos y sincronizados con la realidad |
| **Líder técnico / stakeholder** | Entender la arquitectura a alto nivel (C4 Context) sin detalle de implementación |

---

## 5. Modelo de datos (model-driven)

El corazón del producto. El modelo es independiente de las vistas que lo representan.

### 5.1 Entidades del modelo

- **Workspace / Organización** → contiene equipos y proyectos.
- **Proyecto (Landscape)** → contiene un modelo de arquitectura y sus vistas.
- **Objeto de modelo (Model Object):**
  - `Actor` (persona o sistema externo)
  - `System` (sistema de software — nivel C4 Context)
  - `Container` (app, servicio, base de datos, función — nivel C4 Container)
  - `Component` (módulo interno — nivel C4 Component)
  - `NetworkObject` (VNet, Subnet, NSG, Gateway, etc. — para vistas de red)
- **Relación (Relationship):** conexión dirigida entre dos objetos (ej. "usa", "envía datos a", "peered con") con etiqueta, protocolo y tecnología opcionales.
- **Tag / Metadato:** clasificación (entorno: prod/dev, zona: on-prem/cloud, owner, etc.).

### 5.2 Vistas (Views/Diagrams)

Una **vista** es una representación visual de un subconjunto del modelo:
- Vistas C4: Context, Container, Component.
- Vistas de red: topología Azure.
- Cada vista guarda **posición, layout y estilo** de los objetos que muestra, pero **no duplica** los objetos del modelo — los referencia.
- Un mismo objeto del modelo puede aparecer en varias vistas; renombrarlo o eliminarlo se propaga.

---

## 6. Requerimientos funcionales

### 6.1 Gestión de cuentas y equipos
- RF-01: Registro e inicio de sesión de usuarios.
- RF-02: Crear/gestionar organizaciones y equipos; invitar miembros.
- RF-03: Roles básicos (owner / editor / viewer) por proyecto.

### 6.2 Modelado
- RF-04: Crear, editar y eliminar objetos del modelo (actores, sistemas, contenedores, componentes, objetos de red).
- RF-05: Crear relaciones entre objetos con etiqueta/tecnología/protocolo.
- RF-06: Asignar tipo de recurso Azure a un objeto (con su icono oficial).
- RF-07: Etiquetar objetos (entorno, zona on-prem/cloud, owner).

### 6.3 Vistas y diagramación
- RF-08: Crear vistas C4 (Context/Container/Component) y vistas de red.
- RF-09: Arrastrar objetos del modelo al canvas (drag & drop); mover, redimensionar y conectar.
- RF-10: Drill-down/navegación entre niveles C4 (de un sistema a sus contenedores, etc.).
- RF-11: Auto-layout opcional como asistencia (el usuario puede reposicionar libremente).
- RF-12: Sincronización automática: cambios en el modelo se reflejan en todas las vistas.

### 6.4 Exportación
- RF-13: Exportar una vista a **PNG** y **SVG**.
- RF-14: Exportar a **PDF**.
- RF-15: Exportar/importar el modelo completo como **JSON/YAML** (diagram-as-code, versionable en git).

### 6.5 Persistencia
- RF-16: Guardar proyectos en la nube por usuario/equipo.
- RF-17: Autoguardado.

---

## 7. Requerimientos no funcionales

- **RNF-01 (Usabilidad):** Curva de aprendizaje baja; primer diagrama en < 10 min.
- **RNF-02 (Rendimiento):** Canvas fluido con al menos ~200 objetos por vista.
- **RNF-03 (Compatibilidad):** Navegadores modernos (Chrome, Edge, Firefox, Safari).
- **RNF-04 (Seguridad):** Autenticación segura, aislamiento de datos por organización.
- **RNF-05 (Escalabilidad):** Arquitectura preparada para añadir AWS/GCP y nuevos tipos de vista sin reescribir el modelo.
- **RNF-06 (Portabilidad de datos):** El modelo siempre exportable a JSON/YAML (evitar lock-in).

---

## 8. Arquitectura técnica propuesta

> Stack recomendado y aprobado: **React + Node**.

### 8.1 Frontend
- **React + TypeScript**.
- **Canvas/diagramación:** [React Flow](https://reactflow.dev) (nodos, aristas, drag & drop, zoom/pan).
- Estado: Zustand o Redux Toolkit.
- Exportación: render a SVG → PNG/PDF (ej. `html-to-image` + `jspdf`).

### 8.2 Backend
- **Node.js + NestJS** (TypeScript), API REST/GraphQL.
- Autenticación (JWT / OAuth — evaluar Azure Entra ID por afinidad con el ecosistema).

### 8.3 Datos
- **PostgreSQL** (modelo, vistas, usuarios, equipos).
- El modelo de arquitectura puede almacenarse como entidades relacionales y/o documento JSON versionable.

### 8.4 Hosting (Azure)
- Frontend: **Azure Static Web Apps**.
- Backend: **Azure App Service** (o Container Apps).
- Base de datos: **Azure Database for PostgreSQL**.
- Almacenamiento de exportaciones/assets: **Azure Blob Storage**.

---

## 9. Roadmap de alto nivel

1. **Fase 0 — Fundaciones:** repo, scaffolding React + NestJS, modelo de datos base, auth.
2. **Fase 1 — Modelado + vista C4 Context/Container:** CRUD de objetos y relaciones, canvas drag & drop.
3. **Fase 2 — Vista de red Azure + C4 Component:** iconos Azure, topología de red, drill-down.
4. **Fase 3 — Exportación:** PNG/SVG, PDF, JSON/YAML.
5. **Fase 4 — Equipos y roles:** organizaciones, invitaciones, permisos.
6. **Post-MVP:** AWS/GCP, import IaC, auto-discovery, colaboración en tiempo real.

---

## 10. Pendientes / decisiones abiertas

- [ ] **Nombre del producto y del repositorio** (el repo actual `BancoAndinoLab` se renombrará — la operación de renombrado se realiza desde Settings de GitHub). Propuestas: `CloudArchitect`, `HybridCanvas`, `ArchiDraw`, `NetC4`, `CloudC4`.
- [ ] Estrategia de autenticación (Azure Entra ID vs Auth propio/OAuth genérico).
- [ ] Set exacto de tipos de recurso Azure a soportar en el MVP (lista priorizada).
- [ ] Definir si el almacenamiento del modelo es puramente relacional o documento JSON.
- [ ] Licenciamiento/uso del set oficial de iconos de Azure Architecture.
