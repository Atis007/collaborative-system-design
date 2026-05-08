"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import type { CanvasNode } from "@/types/canvas"
import { NODE_COLORS } from "@/types/canvas"

export function CanvasNodeRenderer({ data, width, height }: NodeProps<CanvasNode>) {
  const colorPair = NODE_COLORS.find((c) => c.fill === data.color) ?? NODE_COLORS[0]

  return (
    <div
      style={{
        width: width ?? 160,
        height: height ?? 80,
        backgroundColor: colorPair.fill,
        color: colorPair.text,
      }}
      className="relative flex items-center justify-center border border-border-default rounded-xl group"
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <span className="text-sm text-center select-none px-2 max-w-full truncate">
        {data.label}
      </span>
    </div>
  )
}
