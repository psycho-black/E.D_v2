import { Label, labels } from "./labels";
import { Status, statuses } from "./statuses";
import { User, users } from "./users";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  assignees: User[];
  labels: Label[];
  date?: string;
  comments: number;
  attachments: number;
  links: number;
  progress: { completed: number; total: number };
  priority: "low" | "medium" | "high" | "urgent" | "no-priority";
}

export const tasks: Task[] = [
  // Backlog - 3 tasks
  {
    id: "1",
    title: "Rediseño de la aplicación móvil",
    description: "Rediseño completo de la aplicación móvil para una mejor UX",
    status: statuses[0], // backlog
    assignees: [],
    labels: [labels[0]],
    date: "Feb 10",
    comments: 2,
    attachments: 5,
    links: 3,
    progress: { completed: 0, total: 0 },
    priority: "low",
  },
  {
    id: "2",
    title: "Actualización de la documentación de la API",
    description: "Actualizar la documentación de la API con los últimos endpoints y ejemplos",
    status: statuses[0], // backlog
    assignees: [users[1]],
    labels: [labels[2]],
    date: "Feb 15",
    comments: 0,
    attachments: 0,
    links: 8,
    progress: { completed: 0, total: 0 },
    priority: "low",
  },
  {
    id: "3",
    title: "Mejoras de accesibilidad",
    description:
      "Mejorar la accesibilidad para lectores de pantalla y navegación con teclado",
    status: statuses[0], // backlog
    assignees: [users[2]],
    labels: [labels[0], labels[3]],
    date: "Feb 20",
    comments: 1,
    attachments: 2,
    links: 5,
    progress: { completed: 0, total: 0 },
    priority: "medium",
  },

  // To-do - 4 tasks
  {
    id: "4",
    title: "Actualización del sistema de diseño",
    description: "Mejorar el sistema de diseño para mayor coherencia y usabilidad",
    status: statuses[1], // to-do
    assignees: [users[0], users[1]],
    labels: [labels[0], labels[3]],
    date: "Jan 25",
    comments: 4,
    attachments: 0,
    links: 0,
    progress: { completed: 1, total: 4 },
    priority: "high",
  },
  {
    id: "5",
    title: "Aumentar la tasa de retención en un 23%",
    description: "Mejorar la retención a través de campañas y actualizaciones de funciones",
    status: statuses[1], // to-do
    assignees: [users[0], users[1]],
    labels: [labels[1], labels[2]],
    date: "Jan 25",
    comments: 4,
    attachments: 33,
    links: 12,
    progress: { completed: 0, total: 0 },
    priority: "medium",
  },
  {
    id: "6",
    title: "Sistema de iconos",
    description: "Desarrollar iconos escalables para visuales de plataforma coherentes",
    status: statuses[1], // to-do
    assignees: [users[0], users[2]],
    labels: [labels[0]],
    date: "Jan 25",
    comments: 4,
    attachments: 0,
    links: 0,
    progress: { completed: 1, total: 4 },
    priority: "high",
  },
  {
    id: "7",
    title: "Automatización de tareas",
    description: "Automatizar tareas repetitivas para mejorar la productividad",
    status: statuses[1], // to-do
    assignees: [users[2], users[3]],
    labels: [labels[2]],
    date: "Jan 28",
    comments: 2,
    attachments: 5,
    links: 3,
    progress: { completed: 0, total: 3 },
    priority: "low",
  },

  // In Progress - 2 tasks
  {
    id: "8",
    title: "Funciones de búsqueda",
    description: "Actualizar la búsqueda para obtener resultados de usuario más rápidos y precisos",
    status: statuses[2], // in-progress
    assignees: [users[3]],
    labels: [labels[2]],
    date: "Jan 25",
    comments: 0,
    attachments: 0,
    links: 12,
    progress: { completed: 0, total: 0 },
    priority: "urgent",
  },
  {
    id: "9",
    title: "Diseño del flujo de pago",
    description: "Optimizar el proceso de pago para mejorar las tasas de conversión",
    status: statuses[2], // in-progress
    assignees: [users[0]],
    labels: [labels[0]],
    date: "Jan 25",
    comments: 0,
    attachments: 0,
    links: 12,
    progress: { completed: 2, total: 4 },
    priority: "urgent",
  },

  // Technical Review - 3 tasks
  {
    id: "10",
    title: "Integración de la pasarela de pago",
    description: "Integrar el sistema de pago Stripe para suscripciones",
    status: statuses[3], // technical-review
    assignees: [users[2], users[3]],
    labels: [labels[2]],
    date: "Jan 20",
    comments: 8,
    attachments: 0,
    links: 5,
    progress: { completed: 3, total: 4 },
    priority: "high",
  },
  {
    id: "11",
    title: "Correcciones de la auditoría de seguridad",
    description: "Implementar correcciones del informe de auditoría de seguridad reciente",
    status: statuses[3], // technical-review
    assignees: [users[0]],
    labels: [labels[2]],
    date: "Jan 22",
    comments: 3,
    attachments: 7,
    links: 2,
    progress: { completed: 2, total: 3 },
    priority: "urgent",
  },
  {
    id: "12",
    title: "Optimizaciones de la revisión de código",
    description: "Revisar y optimizar el código base para un mejor rendimiento",
    status: statuses[3], // technical-review
    assignees: [users[1], users[2]],
    labels: [labels[2], labels[3]],
    date: "Jan 21",
    comments: 10,
    attachments: 0,
    links: 7,
    progress: { completed: 1, total: 2 },
    priority: "high",
  },

  // Paused - 5 tasks
  {
    id: "13",
    title: "Actualización de la API de terceros",
    description: "Esperando que el proveedor lance la nueva versión de la API",
    status: statuses[4], // paused
    assignees: [users[1], users[2]],
    labels: [labels[2]],
    date: "Jan 18",
    comments: 6,
    attachments: 3,
    links: 4,
    progress: { completed: 1, total: 4 },
    priority: "medium",
  },
  {
    id: "14",
    title: "Migración de la base de datos",
    description: "Pausado a la espera de la aprobación del equipo de infraestructura",
    status: statuses[4], // paused
    assignees: [users[3]],
    labels: [labels[2], labels[1]],
    date: "Jan 15",
    comments: 12,
    attachments: 15,
    links: 6,
    progress: { completed: 0, total: 5 },
    priority: "high",
  },
  {
    id: "15",
    title: "Actualización del servidor",
    description: "Esperando la aprobación del presupuesto por parte de la dirección",
    status: statuses[4], // paused
    assignees: [users[0], users[3]],
    labels: [labels[2]],
    date: "Jan 12",
    comments: 8,
    attachments: 5,
    links: 2,
    progress: { completed: 0, total: 3 },
    priority: "urgent",
  },
  {
    id: "16",
    title: "Revisión de cumplimiento legal",
    description: "Pausado a la espera de la revisión y aprobación del equipo legal",
    status: statuses[4], // paused
    assignees: [users[1]],
    labels: [labels[1]],
    date: "Jan 10",
    comments: 15,
    attachments: 20,
    links: 8,
    progress: { completed: 2, total: 4 },
    priority: "high",
  },
  {
    id: "17",
    title: "Migración a la nube",
    description: "Esperando que se completen las negociaciones del contrato con el proveedor",
    status: statuses[4], // paused
    assignees: [users[2], users[3]],
    labels: [labels[2], labels[3]],
    date: "Jan 8",
    comments: 10,
    attachments: 12,
    links: 7,
    progress: { completed: 1, total: 6 },
    priority: "medium",
  },

  // Completed - 2 tasks
  {
    id: "18",
    title: "Aumentar la tasa de conversión en un 25%",
    description: "Aumentar las conversiones a través de una mejor incorporación y experiencia",
    status: statuses[5], // completed
    assignees: [users[0], users[3]],
    labels: [labels[1]],
    date: "Jan 25",
    comments: 4,
    attachments: 0,
    links: 0,
    progress: { completed: 4, total: 4 },
    priority: "high",
  },
  {
    id: "19",
    title: "Mejorar la eficiencia del equipo",
    description: "Se lograron mejoras de eficiencia con herramientas y flujos de trabajo",
    status: statuses[5], // completed
    assignees: [users[3], users[1]],
    labels: [],
    date: "Jan 23",
    comments: 0,
    attachments: 33,
    links: 12,
    progress: { completed: 4, total: 4 },
    priority: "medium",
  },
];

export function groupTasksByStatus(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const statusId = task.status.id;

    if (!acc[statusId]) {
      acc[statusId] = [];
    }

    acc[statusId].push(task);

    return acc;
  }, {});
}
