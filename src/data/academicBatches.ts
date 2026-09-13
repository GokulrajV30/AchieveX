// ─────────────────────────────────────────────────────────────
// AchieveX — Academic Batches Configuration
// ─────────────────────────────────────────────────────────────

export interface AcademicBatch {
  startYear: number;
  endYear: number;
  label: string;
}

export const ACADEMIC_BATCHES: AcademicBatch[] = [
  { startYear: 2022, endYear: 2026, label: '2022 - 2026' },
  { startYear: 2023, endYear: 2027, label: '2023 - 2027' },
  { startYear: 2024, endYear: 2028, label: '2024 - 2028' },
  { startYear: 2025, endYear: 2029, label: '2025 - 2029' },
  { startYear: 2026, endYear: 2030, label: '2026 - 2030' },
];
