"use client"

import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react"
import { useCallback } from "react"
import "@xyflow/react/dist/style.css"
import { CanvasNodeRenderer } from "@/components/editor/canvas-node"
import {
  type ShapeDragPayload,
  ShapePanel,
} from "@/components/editor/shape-panel"
import type { CanvasEdge, CanvasNode, NodeShape } from "@/types/canvas"
import { NODE_COLORS } from "@/types/canvas"

const nodeTypes = { canvasNode: CanvasNodeRenderer }

let nodeCounter = 0

function makeNodeId(shape: NodeShape): string {
  return `${shape}-${Date.now()}-${++nodeCounter}`
}

function CanvasCore() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true })

  const { screenToFlowPosition } = useReactFlow()

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData("application/ghost-shape")
      if (!raw) return

      let payload: ShapeDragPayload
      try {
        payload = JSON.parse(raw) as ShapeDragPayload
      } catch {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX - payload.width / 2,
        y: event.clientY - payload.height / 2,
      })

      const newNode: CanvasNode = {
        id: makeNodeId(payload.shape),
        type: "canvasNode",
        position,
        data: {
          label: "",
          color: NODE_COLORS[0].fill,
          shape: payload.shape,
        },
        width: payload.width,
        height: payload.height,
      }

      onNodesChange([{ type: "add", item: newNode }])
    },
    [screenToFlowPosition, onNodesChange],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      onDragOver={onDragOver}
      onDrop={onDrop}
      fitView
    >
      <Background
        variant={BackgroundVariant.Dots}
        color="#2a2a30"
        gap={24}
        size={1}
      />
      <MiniMap
        style={{ background: "#111114" }}
        nodeColor="#2a2a30"
        nodeStrokeColor="#3a3a42"
        maskColor="rgba(8,8,9,0.6)"
      />
      <Panel position="bottom-center" className="mb-4">
        <ShapePanel />
      </Panel>
    </ReactFlow>
  )
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasCore />
    </ReactFlowProvider>
  )
}
