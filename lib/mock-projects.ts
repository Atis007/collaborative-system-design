export interface MockProject {
  id: string
  name: string
  slug: string
  owned: boolean
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    slug: "e-commerce-platform",
    owned: true,
  },
  {
    id: "2",
    name: "Microservices API",
    slug: "microservices-api",
    owned: true,
  },
  {
    id: "3",
    name: "Shared System Design",
    slug: "shared-system-design",
    owned: false,
  },
]
