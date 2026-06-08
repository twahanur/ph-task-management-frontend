# 🚀 ZenBoard — Smart Project & Task Collaboration System

ZenBoard is a state-of-the-art, high-fidelity project and task collaboration platform designed to streamline team workflows. Built on a modern three-tiered role system, it features visual project management boards, interactive drag-and-drop cards, real-time sync, analytics, and custom theme layouts.

---

## 🎨 Detailed Features & Core Capabilities

### 1. Workspace (Project) Management
Workspaces act as the top-level boundary for project collaboration.
* **Workspace Lifecycle**: Users can create multiple workspaces. The creator is assigned the `owner` role. Within the workspace settings, owners and administrators can modify details, description, and upload/update logos.
* **Workspace Dynamic Summaries**: The dashboard calculates and aggregates metrics for the selected workspace:
  - Total count of active, completed, on-hold, and archived boards.
  - Overall card status distribution (e.g., how many tasks are in `todo`, `in_progress`, or `completed`).
  - Flagged statistics including the count of High Priority tasks and Overdue tasks (tasks where the due date is in the past and the status is not completed).
* **Workspace Members**: Workspace administrators can view the complete member list, monitor their specific workspace roles, promote/demote members, or remove members from the workspace.

### 2. Trello-Style Kanban Boards
Kanban boards allow groups to organize tasks dynamically within parent projects.
* **Board Configuration**: Boards are created inside a workspace. They support cover image URLs (for visual card backgrounds) and customized board background colors.
* **Visibility Levels**:
  - `Private`: Bypasses default workspace access. Only explicitly added board members and workspace admins can view the board.
  - `Workspace`: Inherits parent workspace permissions. Anyone inside the workspace can read, view, and participate.
  - `Public`: Exposed to any authenticated user logged into the application.
* **Board Statuses**: Active boards house running tasks. Boards can be marked as `completed`, `on_hold`, or `archived` to freeze activity or hide them from default listings.
* **Starring Mechanism**: Users can star frequently used boards. Starred boards are highlighted in a dedicated section on the dashboard homepage for quick access.

### 3. Drag-and-Drop Task Cards
Cards represent single units of work (tasks) that move through vertical lists (columns).
* **Kanban Drag-and-Drop**: Users can drag cards within the same column to reorder them or drag cards across different columns to change their progress status (`todo` ➡️ `in_progress` ➡️ `completed`). Column updates persist on the backend.
* **Task Prioritization**: Tasks are categorized by priority tags:
  - 🟥 **High**: Highlights critical bottlenecks.
  - 🟨 **Medium**: Standard operational tasks.
  - 🟦 **Low**: Non-blocking improvements.
* **Card Details & Checklist Progression**:
  - **Checklists**: Users can split tasks into checklists. Each checklist item can have its own assignee. The card displays a dynamic progress bar showing the percentage of completed items.
  - **Comments**: Real-time comment threads allow team members to discuss tasks directly on the card page.
  - **Attachments**: Users can upload files (PDFs, docs, images) to cards. Uploaded media is stored in Cloudinary and displayed as clickable preview items.
  - **Label Tagging**: Custom labels (with unique colors and names) can be attached to cards to classify task categories.
  - **Due Dates**: Deadlines can be assigned to tasks. If a task exceeds its deadline without being marked completed, the UI displays a bright "Overdue" label.

### 4. Custom Fields System
To support flexible task tracking, ZenBoard allows creating custom metadata fields for cards.
* **Field Types**: Teams can define custom fields of three types:
  - `Text`: For short strings, keys, or external links.
  - `Number`: For story points, estimation, or budget limits.
  - `Checkbox`: For simple boolean properties (e.g., "QA Verified").
* **Card Value Input**: When custom fields are defined for a board, fields render inside every card's details modal, allowing members to set specific values that populate on the card preview.

### 5. Real-Time Sync & Notifications
* **Socket.io Integration**: Every task movement, comment submission, status update, or board star event triggers a WebSocket emission. All other collaborators viewing the board see updates instantly without reloading.
* **Notification Engine**: Triggered by user actions:
  - When assigned to a card, the user receives an instant notification.
  - When a deadline approaches, automated due-soon alerts are sent.
  - Mentions in comments or workspace invites raise notification banners.

### 6. Three-Tier Role-Based Access Control (RBAC)
A highly consistent permission system restricts actions depending on a user's workspace role.

| Permission / Action | Owner | Admin | Project Manager | Team Member |
| :--- | :---: | :---: | :---: | :---: |
| **Workspace Deletion** | ✅ | ❌ | ❌ | ❌ |
| **Workspace Settings** | ✅ | ✅ | ❌ | ❌ |
| **Workspace Member Management** (Add/Remove) | ✅ | ✅ | ✅ | ❌ |
| **Member Role Change** | ✅ | ✅ | ❌ | ❌ |
| **Board / Project Creation & Editing** | ✅ | ✅ | ✅ | ❌ |
| **Task / Card Creation & Deletion** | ✅ | ✅ | ✅ | ❌ |
| **Task / Card Assignment** | ✅ | ✅ | ✅ | ❌ |
| **Update Own Task Status** | ✅ | ✅ | ✅ | ✅ |
| **File Uploads & Comments** | ✅ | ✅ | ✅ | ✅ |
| **Full Workspace Analytics** | ✅ | ✅ | ✅ | ❌ |

* **Client-side Enforcement**: The `useRole` hook evaluates the current user's permissions and disables/hides action buttons (like "+ Create Board" or "+ Invite Member") if their role is unauthorized.
* **Server-side Enforcement**: REST endpoints are protected by Express middlewares (`workspaceAccess.ts`, `workspaceAdmin`, `boardAccess.ts`, and `boardAdmin`) that reject incoming requests with a `403 Forbidden` error if the caller's role is insufficient.

### 7. Rich Dashboard Analytics
Provides administrators and managers visual graphs of workspace health.
* **Task Status Distribution**: A Recharts pie chart showing the percentage of tasks in Todo, In Progress, and Completed states.
* **Member Workload Chart**: A Recharts bar chart mapping the number of tasks assigned to each member, highlighting resource allocation issues.
* **Activity Logs Feed**: A running timeline feed showcasing the latest activities in chronological order (e.g., "Jeba completed task Refactor Auth", "Admin added Project Manager Kabir").

### 8. Custom Theme Engine
A high-performance theme engine leverages CSS custom properties and `next-themes` for class-based toggling:
* **Themes Available**:
  - **Sapphire Blue** (Light and Dark variants)
  - **Amber Gold** (Light and Dark variants)
* **Tokens**: Colors are defined using OKLCH color spaces, ensuring highly vibrant and accessible colors across both modes.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js (App Router, v16)
- **Styling**: Tailwind CSS (v4) with OKLCH variables
- **State Management**: Redux Toolkit & React Context
- **UI Components**: Radix UI primitives, Lucide Icons, Framer Motion (for micro-animations), Recharts, Sonner (Toasts)
- **File Uploads**: Cloudinary integration

### Backend API
- **Framework**: Node.js & Express.js
- **Database ORM**: Prisma (v5)
- **Database**: PostgreSQL (Neon Serverless)
- **Real-Time**: Socket.io
- **Validation**: Zod Schemas
- **Authentication**: JWT & Cookie-parser with custom server proxying

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- pnpm or npm package manager

### 2. Environment Setup
Create a `.env` file in the **frontend root**:
```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

Create a `.env` file in the **backend root**:
```env
PORT=5000
DATABASE_URL=your-postgresql-database-connection-url
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Installation & Run

#### Run the Backend
```bash
cd ProjectManagement
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

#### Run the Frontend
```bash
cd ph-task-management-frontend
pnpm install
pnpm dev
```
