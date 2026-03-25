"use client";

import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Plus,
  Save,
  Play,
  CheckSquare,
  ThumbsUp,
  Bell,
  GitBranch,
  Clock,
  Layers,
  Trash2,
} from "lucide-react";
import { FlowNode } from "./flow-node";
import { StepConfigPanel } from "./step-config-panel";
import { cn } from "@aguia/ui";

const nodeTypes = { step: FlowNode };

const STEP_TYPES = [
  { type: "TASK", label: "Tarefa", icon: CheckSquare, color: "#3B82F6" },
  { type: "APPROVAL", label: "Aprovação", icon: ThumbsUp, color: "#8B5CF6" },
  { type: "NOTIFICATION", label: "Notificação", icon: Bell, color: "#F59E0B" },
  { type: "CONDITION", label: "Condição", icon: GitBranch, color: "#F97316" },
  { type: "SUBPROCESS", label: "Subprocesso", icon: Layers, color: "#14B8A6" },
  { type: "WAIT", label: "Espera", icon: Clock, color: "#6B7280" },
];

interface ProcessEditorProps {
  processId?: string;
  processName: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onActivate?: () => void;
}

export function ProcessEditor({
  processId,
  processName,
  initialNodes = [],
  initialEdges = [],
  onSave,
  onActivate,
}: ProcessEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showToolbar, setShowToolbar] = useState(true);
  const idCounter = useRef(initialNodes.length + 1);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { strokeWidth: 2, stroke: "#94A3B8" },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addNode = useCallback(
    (stepType: string) => {
      const id = `step-${idCounter.current++}`;
      const newNode: Node = {
        id,
        type: "step",
        position: {
          x: 250 + Math.random() * 100,
          y: nodes.length * 120 + 50,
        },
        data: {
          label: `Nova ${STEP_TYPES.find((s) => s.type === stepType)?.label || "Etapa"}`,
          stepType,
          description: "",
          isRequired: true,
          estimatedMinutes: 30,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes.length, setNodes]
  );

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
        )
      );
      setSelectedNode((prev) =>
        prev && prev.id === nodeId
          ? { ...prev, data: { ...prev.data, ...data } }
          : prev
      );
    },
    [setNodes]
  );

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNode(node)}
          onPaneClick={() => setSelectedNode(null)}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              const type = (n.data as Record<string, unknown>).stepType as string;
              return (
                STEP_TYPES.find((s) => s.type === type)?.color || "#6B7280"
              );
            }}
            className="!rounded-lg !border !shadow-sm"
          />

          {/* Top Toolbar */}
          <Panel position="top-left">
            <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-md border">
              <span className="px-2 text-sm font-semibold text-gray-700">
                {processName}
              </span>
              <div className="h-5 w-px bg-gray-200" />
              <button
                onClick={() => onSave?.(nodes, edges)}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                <Save className="h-4 w-4" />
                Salvar
              </button>
              <button
                onClick={onActivate}
                className="flex items-center gap-1.5 rounded-md bg-aguia-primary px-3 py-1.5 text-sm text-white hover:opacity-90"
              >
                <Play className="h-4 w-4" />
                Ativar
              </button>
              {selectedNode && (
                <button
                  onClick={deleteSelectedNode}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </button>
              )}
            </div>
          </Panel>

          {/* Add Step Toolbar */}
          <Panel position="top-right">
            <div className="rounded-lg bg-white p-2 shadow-md border">
              <p className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Adicionar Etapa
              </p>
              <div className="space-y-1">
                {STEP_TYPES.map((step) => (
                  <button
                    key={step.type}
                    onClick={() => addNode(step.type)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <step.icon
                      className="h-4 w-4"
                      style={{ color: step.color }}
                    />
                    {step.label}
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Config Panel */}
      {selectedNode && (
        <StepConfigPanel
          node={selectedNode}
          onUpdate={(data) => updateNodeData(selectedNode.id, data)}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
