# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 12: Shape Panel

## Current Goal

- Completed. (Phase 12 done)

## Completed

- 01-design-system: shadcn/ui initialized (base-nova style, Tailwind v4 CSS-variable approach), all 7 components added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), lucide-react installed, lib/utils.ts cn() helper created, globals.css updated with project dark theme tokens.
- 02-editor: EditorNavbar and ProjectSidebar shell components created; EditorShell client wrapper and app/editor layout added; dialog pattern ready via existing shadcn Dialog.
- 03-auth: ClerkProvider with dark theme and CSS variable overrides, proxy.ts middleware with public route protection, sign-in/sign-up two-panel pages, / redirect logic, UserButton in editor navbar.
- 04-project-dialogs: Editor home screen with heading/description/New Project button; useProjectDialogs hook (dialog, form, loading state); CreateProjectDialog with live slug preview; RenameProjectDialog (prefilled, autoFocus, Enter submits); DeleteProjectDialog (destructive); EditorActionsContext threading state to sidebar and editor home; sidebar project items with hover rename/delete actions (owned only); mobile backdrop scrim.
- 05-prisma: Project and ProjectCollaborator models in prisma/models/project.prisma; PrismaClient singleton in lib/prisma.ts branching on prisma+postgres:// (accelerateUrl) vs direct (PrismaPg adapter); migration 20260508155628_init applied; client generated to app/generated/prisma.
- 06-project-apis: REST endpoints for projects — GET /api/projects (list by owner), POST /api/projects (create, defaults name to "Untitled Project"), PATCH /api/projects/[projectId] (rename, owner-only), DELETE /api/projects/[projectId] (delete, owner-only); 401 for unauthenticated, 403 for non-owner mutations.
- 07-wire-editor-home: lib/projects.ts (Project type + getProjectsForUser helper); hooks/use-project-actions.ts (create/rename/delete against real API, router.push/refresh); editor layout fetches owned+shared server-side and passes to EditorShell; EditorShell/context/sidebar/dialogs ported from MockProject to Project; POST /api/projects accepts optional roomId to align project ID with Liveblocks room ID.
- 08-editor-workspace-shell: lib/project-access.ts (getCurrentUserIdentity + getProjectWithAccess helpers); components/editor/access-denied.tsx (centered lock icon, message, back link); components/editor/workspace-shell.tsx (client shell with project name navbar, share button, AI sidebar toggle, canvas placeholder, right AI sidebar placeholder); app/editor/[projectId]/page.tsx replaced with server component (auth redirect, access check, renders WorkspaceShell or AccessDenied); project-sidebar.tsx updated with usePathname-based active project highlight and router.push navigation on project click.
- 09-share-dialog: lib/clerk-user.ts (enrichEmailsWithClerkData using Clerk Backend API); GET+POST /api/projects/[projectId]/collaborators (list, invite with owner-only guard + self-invite check + duplicate check); DELETE /api/projects/[projectId]/collaborators/[collaboratorId] (owner-only remove); components/editor/share-dialog.tsx (invite form for owners, collaborator list with Clerk avatars/names, copy-link with Copied! feedback, read-only view for collaborators); Share button in workspace-shell.tsx wired to open dialog.
- 10-liveblocks-setup: @liveblocks/node installed; liveblocks.config.ts typed with Presence (cursor, isThinking) and UserMeta (name, avatar, color); lib/liveblocks.ts (cached Liveblocks node client + deterministic getCursorColor helper from fixed palette); POST /api/liveblocks-auth (Clerk auth required, project access verified via getProjectWithAccess, getOrCreateRoom ensures room exists, access token session with userInfo returned, 403 for unauthorized).
- 11-base-canvas: types/canvas.ts (NodeData with label/color/shape, NodeShape union, CanvasNode/CanvasEdge types, NODE_COLORS palette, NODE_SHAPES list); liveblocks.config.ts updated with optional Storage flow key typed as LiveblocksFlow<CanvasNode, CanvasEdge>; components/editor/canvas.tsx (useLiveblocksFlow with suspense, ReactFlow with ConnectionMode.Loose, fitView, MiniMap, dot-pattern Background); components/editor/canvas-room.tsx (LiveblocksProvider + RoomProvider with initialPresence, ClientSideSuspense, RoomErrorBoundary class component); workspace-shell.tsx replaced placeholder with CanvasRoom.
- 12-shape-panel: components/editor/shape-panel.tsx (ShapeDragPayload type, 6 shape configs with lucide icons and default sizes, floating pill toolbar with draggable buttons, drag payload via application/ghost-shape MIME type); components/editor/canvas-node.tsx (CanvasNodeRenderer — simple bordered rectangle, centered label, NODE_COLORS text lookup, 4 handles hidden by default shown on hover); canvas.tsx refactored to ReactFlowProvider + CanvasCore pattern (useReactFlow for screenToFlowPosition, onDragOver/onDrop handlers, NodeAddChange via onNodesChange, nodeTypes registration, ShapePanel in bottom-center Panel).

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Stack: Next.js 16.2.5, Tailwind v4, React 19. shadcn/ui 4.7.0 with Tailwind v4 CSS-variable approach.
- No build checks — use tsc --noEmit only for type validation when needed.
