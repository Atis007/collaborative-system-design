"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react"
import { Component, type ReactNode } from "react"
import { Canvas } from "@/components/editor/canvas"

class RoomErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-sm text-text-muted">
            Could not connect to the collaboration room.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

interface CanvasRoomProps {
  roomId: string
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <RoomErrorBoundary>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{ cursor: null, isThinking: false }}
        >
          <ClientSideSuspense
            fallback={
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-text-muted">Connecting to canvas…</p>
              </div>
            }
          >
            <Canvas />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </RoomErrorBoundary>
  )
}
