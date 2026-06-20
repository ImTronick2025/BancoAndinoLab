import { create } from 'zustand';
import type {
  ModelObject,
  ModelObjectKind,
  Relationship,
  ViewType,
} from '@cap/model';

/**
 * Client-side model-driven store. A single model (objects + relationships) is
 * shared across all views; each view keeps its own placement of referenced
 * objects. This mirrors the server domain in @cap/model.
 */

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${++counter}`;

export interface Placement {
  objectId: string;
  x: number;
  y: number;
}

interface AppState {
  objects: Record<string, ModelObject>;
  relationships: Relationship[];
  /** Placement of objects per view type. */
  placements: Record<ViewType, Placement[]>;
  activeView: ViewType;

  setActiveView: (view: ViewType) => void;
  addObject: (input: {
    kind: ModelObjectKind;
    name: string;
    resourceType?: string;
    x: number;
    y: number;
  }) => void;
  moveObject: (objectId: string, x: number, y: number) => void;
}

const emptyPlacements = (): Record<ViewType, Placement[]> => ({
  'c4-context': [],
  'c4-container': [],
  'c4-component': [],
  network: [],
});

export const useStore = create<AppState>((set) => ({
  objects: {},
  relationships: [],
  placements: emptyPlacements(),
  activeView: 'c4-context',

  setActiveView: (view) => set({ activeView: view }),

  addObject: ({ kind, name, resourceType, x, y }) =>
    set((state) => {
      const id = nextId('obj');
      const object: ModelObject = {
        id,
        projectId: 'local',
        kind,
        name,
        resourceType,
      };
      return {
        objects: { ...state.objects, [id]: object },
        placements: {
          ...state.placements,
          [state.activeView]: [
            ...state.placements[state.activeView],
            { objectId: id, x, y },
          ],
        },
      };
    }),

  moveObject: (objectId, x, y) =>
    set((state) => ({
      placements: {
        ...state.placements,
        [state.activeView]: state.placements[state.activeView].map((p) =>
          p.objectId === objectId ? { ...p, x, y } : p,
        ),
      },
    })),
}));
