/**
 * @cap/model — Shared domain model (model-driven core).
 *
 * The platform stores a SINGLE model per project. Views (C4 diagrams, network
 * diagrams) reference objects from this model; they never duplicate them.
 * This file is the single source of truth for the domain shapes shared between
 * the API and the web client.
 */

// ---------------------------------------------------------------------------
// Cloud providers (MVP targets Azure only; AWS/GCP are post-MVP).
// ---------------------------------------------------------------------------

export type CloudProvider = 'azure' | 'aws' | 'gcp' | 'on-prem';

// ---------------------------------------------------------------------------
// Model objects
// ---------------------------------------------------------------------------

/** Kind of object in the architecture model. */
export type ModelObjectKind =
  | 'actor' // a person or external system (C4 Context)
  | 'system' // a software system (C4 Context)
  | 'container' // an app, service, database or function (C4 Container)
  | 'component' // an internal module (C4 Component)
  | 'network'; // a network resource (VNet, Subnet, NSG, Gateway...)

/** Deployment zone, used to tag on-prem vs cloud elements. */
export type Zone = 'cloud' | 'on-prem' | 'hybrid';

export interface ModelObject {
  id: string;
  projectId: string;
  kind: ModelObjectKind;
  name: string;
  description?: string;
  /** Cloud provider this object belongs to (defaults to the project provider). */
  provider?: CloudProvider;
  /** Azure resource type key, e.g. "azure.app-service", "azure.vnet". */
  resourceType?: string;
  zone?: Zone;
  /** Parent object id, enabling C4 drill-down (system -> container -> component). */
  parentId?: string;
  tags?: string[];
  /** Free-form metadata (owner, environment, cost-center, etc.). */
  metadata?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Relationships
// ---------------------------------------------------------------------------

export interface Relationship {
  id: string;
  projectId: string;
  sourceId: string;
  targetId: string;
  /** Human label, e.g. "sends data to", "peered with". */
  label?: string;
  technology?: string;
  protocol?: string;
}

// ---------------------------------------------------------------------------
// Views (diagrams)
// ---------------------------------------------------------------------------

export type ViewType =
  | 'c4-context'
  | 'c4-container'
  | 'c4-component'
  | 'network';

/** Per-view placement & style for a referenced model object. */
export interface ViewNode {
  objectId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  style?: Record<string, string | number>;
}

export interface View {
  id: string;
  projectId: string;
  type: ViewType;
  name: string;
  /**
   * For drill-down views, the model object this view expands
   * (e.g. a c4-container view scoped to a single system).
   */
  scopeObjectId?: string;
  nodes: ViewNode[];
}

// ---------------------------------------------------------------------------
// Project & workspace
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  provider: CloudProvider;
  createdAt: string;
  updatedAt: string;
}

export type Role = 'owner' | 'editor' | 'viewer';

export interface Organization {
  id: string;
  name: string;
}

export interface Membership {
  userId: string;
  organizationId: string;
  role: Role;
}

// ---------------------------------------------------------------------------
// Diagram-as-code: the full, exportable/importable model document.
// ---------------------------------------------------------------------------

export interface ArchitectureModel {
  project: Project;
  objects: ModelObject[];
  relationships: Relationship[];
  views: View[];
}
