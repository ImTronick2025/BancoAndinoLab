import type { ModelObjectKind, ViewType } from '@cap/model';

export interface PaletteItem {
  label: string;
  kind: ModelObjectKind;
  /** Azure resource type key (network/container palettes). */
  resourceType?: string;
}

/**
 * Palette options offered per view type. The MVP targets Azure only, so the
 * network palette lists Azure network primitives. C4 palettes are
 * provider-agnostic by design.
 */
export const PALETTE: Record<ViewType, PaletteItem[]> = {
  'c4-context': [
    { label: 'Actor / Persona', kind: 'actor' },
    { label: 'Sistema', kind: 'system' },
    { label: 'Sistema externo', kind: 'system' },
  ],
  'c4-container': [
    { label: 'Web App', kind: 'container', resourceType: 'azure.app-service' },
    { label: 'API', kind: 'container', resourceType: 'azure.app-service' },
    { label: 'Function', kind: 'container', resourceType: 'azure.functions' },
    { label: 'SQL Database', kind: 'container', resourceType: 'azure.sql' },
    { label: 'Storage', kind: 'container', resourceType: 'azure.storage' },
  ],
  'c4-component': [
    { label: 'Componente', kind: 'component' },
    { label: 'Módulo', kind: 'component' },
  ],
  network: [
    { label: 'VNet', kind: 'network', resourceType: 'azure.vnet' },
    { label: 'Subnet', kind: 'network', resourceType: 'azure.subnet' },
    { label: 'NSG', kind: 'network', resourceType: 'azure.nsg' },
    { label: 'VPN Gateway', kind: 'network', resourceType: 'azure.vpn-gateway' },
    { label: 'On-prem (DC)', kind: 'network', resourceType: 'on-prem.datacenter' },
  ],
};
