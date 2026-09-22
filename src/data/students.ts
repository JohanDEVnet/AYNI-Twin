import { calculateRisk } from "@/lib/risk";
import type { Student } from "@/types/student";

type StudentSeed = Omit<
  Student,
  "riskScore" | "riskLevel" | "createdAt" | "updatedAt"
>;

const createdAt = "2026-09-19T09:00:00-05:00";
const updatedAt = "2026-09-19T09:40:00-05:00";

function createStudent(seed: StudentSeed): Student {
  const risk = calculateRisk(seed);
  return { ...seed, riskScore: risk.score, riskLevel: risk.level, createdAt, updatedAt };
}

const seeds: StudentSeed[] = [
  { id: "AT-031", displayName: "Ana Torres", grade: "3.º", section: "A", attendancePercent: 68, currentAverage: 10.5, previousAverage: 12.9, pendingAssignments: 4, totalAssignments: 8, status: "active" },
  { id: "LQ-018", displayName: "Luis Quispe", grade: "3.º", section: "B", attendancePercent: 85, currentAverage: 9.5, previousAverage: 10.1, pendingAssignments: 7, totalAssignments: 9, status: "active" },
  { id: "DR-025", displayName: "Diego Ramos", grade: "4.º", section: "A", attendancePercent: 71, currentAverage: 11.1, previousAverage: 12.8, pendingAssignments: 4, totalAssignments: 8, status: "active" },
  { id: "SJ-022", displayName: "Sofía Jiménez", grade: "2.º", section: "C", attendancePercent: 73, currentAverage: 10.9, previousAverage: 12.2, pendingAssignments: 5, totalAssignments: 9, status: "active" },
  { id: "MV-014", displayName: "Mateo Vargas", grade: "5.º", section: "B", attendancePercent: 76, currentAverage: 10.6, previousAverage: 12.1, pendingAssignments: 4, totalAssignments: 7, status: "watch" },
  { id: "XC-029", displayName: "Ximena Cárdenas", grade: "1.º", section: "A", attendancePercent: 69, currentAverage: 11.8, previousAverage: 12.9, pendingAssignments: 4, totalAssignments: 9, status: "active" },
  { id: "MF-006", displayName: "María Flores", grade: "3.º", section: "A", attendancePercent: 84, currentAverage: 12.1, previousAverage: 13.2, pendingAssignments: 3, totalAssignments: 9, status: "watch" },
  { id: "JP-009", displayName: "José Paredes", grade: "2.º", section: "B", attendancePercent: 86, currentAverage: 12.4, previousAverage: 13.1, pendingAssignments: 3, totalAssignments: 8, status: "watch" },
  { id: "VT-016", displayName: "Valeria Tello", grade: "4.º", section: "C", attendancePercent: 82, currentAverage: 13.2, previousAverage: 13.8, pendingAssignments: 2, totalAssignments: 8, status: "watch" },
  { id: "HG-012", displayName: "Hugo Gamarra", grade: "1.º", section: "B", attendancePercent: 87, currentAverage: 11.8, previousAverage: 12.5, pendingAssignments: 3, totalAssignments: 10, status: "active" },
  { id: "PL-020", displayName: "Paola León", grade: "5.º", section: "A", attendancePercent: 80, currentAverage: 13.5, previousAverage: 13.9, pendingAssignments: 3, totalAssignments: 10, status: "watch" },
  { id: "AR-003", displayName: "Álvaro Rojas", grade: "3.º", section: "C", attendancePercent: 89, currentAverage: 12.0, previousAverage: 12.6, pendingAssignments: 4, totalAssignments: 10, status: "active" },
  { id: "NG-024", displayName: "Natalia García", grade: "2.º", section: "A", attendancePercent: 83, currentAverage: 13.0, previousAverage: 13.5, pendingAssignments: 3, totalAssignments: 9, status: "watch" },
  { id: "EC-027", displayName: "Emilio Castro", grade: "4.º", section: "B", attendancePercent: 85, currentAverage: 12.6, previousAverage: 13.4, pendingAssignments: 2, totalAssignments: 8, status: "watch" },
  { id: "CM-011", displayName: "Claudia Mendoza", grade: "1.º", section: "C", attendancePercent: 88, currentAverage: 12.7, previousAverage: 13.0, pendingAssignments: 3, totalAssignments: 9, status: "improving" },
  { id: "FG-030", displayName: "Fabricio Guevara", grade: "5.º", section: "C", attendancePercent: 81, currentAverage: 13.4, previousAverage: 13.9, pendingAssignments: 2, totalAssignments: 9, status: "watch" },
  { id: "CR-007", displayName: "Camila Rojas", grade: "3.º", section: "C", attendancePercent: 94, currentAverage: 15.8, previousAverage: 14.7, pendingAssignments: 1, totalAssignments: 10, status: "improving" },
  { id: "AS-001", displayName: "Andrea Salazar", grade: "1.º", section: "A", attendancePercent: 97, currentAverage: 16.4, previousAverage: 16.0, pendingAssignments: 0, totalAssignments: 9, status: "improving" },
  { id: "BB-002", displayName: "Bruno Benavides", grade: "2.º", section: "A", attendancePercent: 95, currentAverage: 15.1, previousAverage: 14.8, pendingAssignments: 1, totalAssignments: 10, status: "improving" },
  { id: "CE-004", displayName: "Carla Espinoza", grade: "2.º", section: "B", attendancePercent: 96, currentAverage: 16.8, previousAverage: 16.2, pendingAssignments: 0, totalAssignments: 8, status: "improving" },
  { id: "DO-005", displayName: "Daniel Ochoa", grade: "4.º", section: "A", attendancePercent: 93, currentAverage: 15.7, previousAverage: 15.2, pendingAssignments: 1, totalAssignments: 9, status: "improving" },
  { id: "ER-008", displayName: "Elena Rivera", grade: "5.º", section: "A", attendancePercent: 98, currentAverage: 17.2, previousAverage: 16.8, pendingAssignments: 0, totalAssignments: 10, status: "improving" },
  { id: "GP-010", displayName: "Gabriel Peña", grade: "3.º", section: "B", attendancePercent: 92, currentAverage: 15.5, previousAverage: 15.0, pendingAssignments: 1, totalAssignments: 8, status: "improving" },
  { id: "IR-013", displayName: "Isabel Ríos", grade: "1.º", section: "B", attendancePercent: 96, currentAverage: 16.1, previousAverage: 15.9, pendingAssignments: 1, totalAssignments: 10, status: "improving" },
  { id: "KC-015", displayName: "Kevin Chávez", grade: "4.º", section: "B", attendancePercent: 91, currentAverage: 15.0, previousAverage: 14.8, pendingAssignments: 1, totalAssignments: 10, status: "watch" },
  { id: "LM-017", displayName: "Lucía Morales", grade: "5.º", section: "B", attendancePercent: 97, currentAverage: 17.4, previousAverage: 17.1, pendingAssignments: 0, totalAssignments: 9, status: "improving" },
  { id: "MR-019", displayName: "Martín Ruiz", grade: "2.º", section: "C", attendancePercent: 94, currentAverage: 15.6, previousAverage: 15.2, pendingAssignments: 1, totalAssignments: 9, status: "watch" },
  { id: "QV-021", displayName: "Renata Valdez", grade: "3.º", section: "A", attendancePercent: 96, currentAverage: 16.0, previousAverage: 15.7, pendingAssignments: 0, totalAssignments: 8, status: "improving" },
  { id: "TN-023", displayName: "Thiago Navarro", grade: "4.º", section: "C", attendancePercent: 93, currentAverage: 15.2, previousAverage: 15.0, pendingAssignments: 1, totalAssignments: 10, status: "watch" },
  { id: "YS-026", displayName: "Yessica Soto", grade: "5.º", section: "C", attendancePercent: 95, currentAverage: 16.2, previousAverage: 15.8, pendingAssignments: 1, totalAssignments: 10, status: "improving" },
];

export const students = seeds.map(createStudent).sort(
  (left, right) => right.riskScore - left.riskScore,
);
