"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrg } from "@/providers/org-provider";
import { ProcessEditor } from "@/components/processes/process-editor";
import type { Node, Edge } from "@xyflow/react";

// Mock data for existing process
const MOCK_NODES: Node[] = [
  {
    id: "step-1",
    type: "step",
    position: { x: 250, y: 0 },
    data: {
      label: "Receber documentos",
      stepType: "TASK",
      description: "Coletar todos os documentos necessários do novo funcionário",
      isRequired: true,
      estimatedMinutes: 60,
    },
  },
  {
    id: "step-2",
    type: "step",
    position: { x: 250, y: 150 },
    data: {
      label: "Aprovar cadastro",
      stepType: "APPROVAL",
      description: "RH aprova o cadastro do funcionário",
      isRequired: true,
      estimatedMinutes: 30,
    },
  },
  {
    id: "step-3",
    type: "step",
    position: { x: 250, y: 300 },
    data: {
      label: "Tipo de contrato",
      stepType: "CONDITION",
      description: "Verificar se é CLT ou PJ",
      isRequired: true,
    },
  },
  {
    id: "step-4",
    type: "step",
    position: { x: 50, y: 450 },
    data: {
      label: "Configurar benefícios CLT",
      stepType: "TASK",
      description: "VR, VT, plano de saúde",
      isRequired: true,
      estimatedMinutes: 45,
    },
  },
  {
    id: "step-5",
    type: "step",
    position: { x: 450, y: 450 },
    data: {
      label: "Emitir contrato PJ",
      stepType: "TASK",
      description: "Gerar contrato de prestação de serviço",
      isRequired: true,
      estimatedMinutes: 30,
    },
  },
  {
    id: "step-6",
    type: "step",
    position: { x: 250, y: 600 },
    data: {
      label: "Notificar equipe",
      stepType: "NOTIFICATION",
      description: "Avisar a equipe sobre o novo membro",
      isRequired: false,
      estimatedMinutes: 5,
    },
  },
];

const MOCK_EDGES: Edge[] = [
  { id: "e1-2", source: "step-1", target: "step-2", animated: true, style: { strokeWidth: 2, stroke: "#94A3B8" } },
  { id: "e2-3", source: "step-2", target: "step-3", animated: true, style: { strokeWidth: 2, stroke: "#94A3B8" } },
  { id: "e3-4", source: "step-3", target: "step-4", sourceHandle: "no", animated: true, style: { strokeWidth: 2, stroke: "#EF4444" } },
  { id: "e3-5", source: "step-3", target: "step-5", sourceHandle: "yes", animated: true, style: { strokeWidth: 2, stroke: "#10B981" } },
  { id: "e4-6", source: "step-4", target: "step-6", animated: true, style: { strokeWidth: 2, stroke: "#94A3B8" } },
  { id: "e5-6", source: "step-5", target: "step-6", animated: true, style: { strokeWidth: 2, stroke: "#94A3B8" } },
];

export default function ProcessDetailPage() {
  const params = useParams();
  const org = useOrg();
  const router = useRouter();

  return (
    <div className="-m-6 h-[calc(100vh-4rem)]">
      <ProcessEditor
        processId={params.processId as string}
        processName="Onboarding de Funcionário"
        initialNodes={MOCK_NODES}
        initialEdges={MOCK_EDGES}
        onSave={(nodes, edges) => {
          console.log("Saving:", { nodes, edges });
        }}
        onActivate={() => {
          console.log("Activating process");
          router.push(`/${org.slug}/processes`);
        }}
      />
    </div>
  );
}
