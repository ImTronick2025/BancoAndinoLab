import { useCallback, useMemo, type DragEvent } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type NodeChange,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { ViewType } from '@cap/model';
import { PALETTE, type PaletteItem } from './palette';
import { useStore } from './store';

const VIEW_LABELS: Record<ViewType, string> = {
  'c4-context': 'C4 · Context',
  'c4-container': 'C4 · Container',
  'c4-component': 'C4 · Component',
  network: 'Red (Azure)',
};

export function App() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);
  const objects = useStore((s) => s.objects);
  const placements = useStore((s) => s.placements);
  const addObject = useStore((s) => s.addObject);
  const moveObject = useStore((s) => s.moveObject);

  const nodes: Node[] = useMemo(
    () =>
      placements[activeView].map((p) => {
        const obj = objects[p.objectId];
        return {
          id: p.objectId,
          position: { x: p.x, y: p.y },
          data: {
            label: obj.resourceType
              ? `${obj.name}\n(${obj.resourceType})`
              : obj.name,
          },
          style: { whiteSpace: 'pre-line', fontSize: 12 },
        };
      }),
    [placements, activeView, objects],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updated = applyNodeChanges(changes, nodes);
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          moveObject(change.id, change.position.x, change.position.y);
        }
      }
      void updated;
    },
    [nodes, moveObject],
  );

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData('application/cap-item');
      if (!raw) return;
      const item: PaletteItem = JSON.parse(raw);
      const bounds = event.currentTarget.getBoundingClientRect();
      addObject({
        kind: item.kind,
        name: item.label,
        resourceType: item.resourceType,
        x: event.clientX - bounds.left - 75,
        y: event.clientY - bounds.top - 20,
      });
    },
    [addObject],
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>Cloud Architecture Platform</h1>
        <div className="app__view-switch">
          {(Object.keys(VIEW_LABELS) as ViewType[]).map((view) => (
            <button
              key={view}
              data-active={view === activeView}
              onClick={() => setActiveView(view)}
            >
              {VIEW_LABELS[view]}
            </button>
          ))}
        </div>
      </header>

      <div className="app__body">
        <aside className="palette">
          <h2>Paleta</h2>
          {PALETTE[activeView].map((item, i) => (
            <div
              key={i}
              className="palette__item"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  'application/cap-item',
                  JSON.stringify(item),
                )
              }
            >
              {item.label}
            </div>
          ))}
        </aside>

        <div
          className="canvas"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <ReactFlow nodes={nodes} onNodesChange={onNodesChange} fitView>
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
