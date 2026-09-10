import { StudentProfile } from '../types';

export interface RawStudent3A {
  id: string;
  nama: string;
  arenaComp: number;
  arenaStars: number;
  arenaScore: number;
  dapurComp: number;
  dapurStars: number;
  dapurScore: number;
  pixelComp: number;
  pixelStars: number;
  pixelScore: number;
  hints: number;
  playTime: number;
}

// Operasi MOVE: Semua data murid 3 Asah telah disalin, disahkan dan dipindahkan ke 5 Piruz.
// Kelas 3 Asah kekal dalam pemilih kelas (class selector) dengan 0 murid.
export const RAW_3ASAH: RawStudent3A[] = [];

export const CLASS_3_ASAH_STUDENTS: StudentProfile[] = [];
