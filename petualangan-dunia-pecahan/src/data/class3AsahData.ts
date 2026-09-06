import { StudentProfile } from '../types';

interface RawStudent3A {
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

const RAW_3ASAH: RawStudent3A[] = [
  // 1. Adam Hakimi — 27/27
  { id: '3A001', nama: 'Adam Hakimi', arenaComp: 3, arenaStars: 9, arenaScore: 100, dapurComp: 3, dapurStars: 9, dapurScore: 98, pixelComp: 3, pixelStars: 9, pixelScore: 100, hints: 0, playTime: 20 },
  // 2. Aisyah Sofea — 25/27
  { id: '3A002', nama: 'Aisyah Sofea', arenaComp: 3, arenaStars: 9, arenaScore: 92, dapurComp: 3, dapurStars: 8, dapurScore: 90, pixelComp: 3, pixelStars: 8, pixelScore: 91, hints: 2, playTime: 22 },
  // 3. Amir Danish — 26/27
  { id: '3A003', nama: 'Amir Danish', arenaComp: 3, arenaStars: 9, arenaScore: 96, dapurComp: 3, dapurStars: 9, dapurScore: 95, pixelComp: 3, pixelStars: 8, pixelScore: 94, hints: 1, playTime: 24 },
  // 4. Alya Maisarah — 24/27
  { id: '3A004', nama: 'Alya Maisarah', arenaComp: 3, arenaStars: 8, arenaScore: 88, dapurComp: 3, dapurStars: 8, dapurScore: 86, pixelComp: 3, pixelStars: 8, pixelScore: 87, hints: 3, playTime: 25 },
  // 5. Arif Iman — 27/27
  { id: '3A005', nama: 'Arif Iman', arenaComp: 3, arenaStars: 9, arenaScore: 100, dapurComp: 3, dapurStars: 9, dapurScore: 99, pixelComp: 3, pixelStars: 9, pixelScore: 98, hints: 0, playTime: 19 },
  // 6. Balqis Humaira — 26/27
  { id: '3A006', nama: 'Balqis Humaira', arenaComp: 3, arenaStars: 9, arenaScore: 95, dapurComp: 3, dapurStars: 8, dapurScore: 94, pixelComp: 3, pixelStars: 9, pixelScore: 96, hints: 1, playTime: 23 },
  // 7. Danish Irfan — 25/27
  { id: '3A007', nama: 'Danish Irfan', arenaComp: 3, arenaStars: 8, arenaScore: 91, dapurComp: 3, dapurStars: 9, dapurScore: 93, pixelComp: 3, pixelStars: 8, pixelScore: 90, hints: 2, playTime: 26 },
  // 8. Damia Qaisara — 27/27
  { id: '3A008', nama: 'Damia Qaisara', arenaComp: 3, arenaStars: 9, arenaScore: 99, dapurComp: 3, dapurStars: 9, dapurScore: 100, pixelComp: 3, pixelStars: 9, pixelScore: 99, hints: 0, playTime: 18 },
  // 9. Ehsan Hakim — 24/27
  { id: '3A009', nama: 'Ehsan Hakim', arenaComp: 3, arenaStars: 8, arenaScore: 87, dapurComp: 3, dapurStars: 8, dapurScore: 88, pixelComp: 3, pixelStars: 8, pixelScore: 86, hints: 3, playTime: 27 },
  // 10. Faris Zikri — 26/27
  { id: '3A010', nama: 'Faris Zikri', arenaComp: 3, arenaStars: 8, arenaScore: 94, dapurComp: 3, dapurStars: 9, dapurScore: 97, pixelComp: 3, pixelStars: 9, pixelScore: 95, hints: 1, playTime: 22 },
  // 11. Hani Sofea — 25/27
  { id: '3A011', nama: 'Hani Sofea', arenaComp: 3, arenaStars: 9, arenaScore: 93, dapurComp: 3, dapurStars: 8, dapurScore: 90, pixelComp: 3, pixelStars: 8, pixelScore: 92, hints: 2, playTime: 24 },
  // 12. Iman Aqilah — 27/27
  { id: '3A012', nama: 'Iman Aqilah', arenaComp: 3, arenaStars: 9, arenaScore: 100, dapurComp: 3, dapurStars: 9, dapurScore: 98, pixelComp: 3, pixelStars: 9, pixelScore: 99, hints: 0, playTime: 21 },
  // 13. Irfan Hakimi — 24/27
  { id: '3A013', nama: 'Irfan Hakimi', arenaComp: 3, arenaStars: 8, arenaScore: 86, dapurComp: 3, dapurStars: 8, dapurScore: 89, pixelComp: 3, pixelStars: 8, pixelScore: 87, hints: 3, playTime: 28 },
  // 14. Jannah Amani — 26/27
  { id: '3A014', nama: 'Jannah Amani', arenaComp: 3, arenaStars: 9, arenaScore: 97, dapurComp: 3, dapurStars: 9, dapurScore: 95, pixelComp: 3, pixelStars: 8, pixelScore: 94, hints: 1, playTime: 23 },
  // 15. Khairul Aiman — 25/27
  { id: '3A015', nama: 'Khairul Aiman', arenaComp: 3, arenaStars: 8, arenaScore: 90, dapurComp: 3, dapurStars: 8, dapurScore: 92, pixelComp: 3, pixelStars: 9, pixelScore: 93, hints: 2, playTime: 25 },
  // 16. Luqman Harith — 27/27
  { id: '3A016', nama: 'Luqman Harith', arenaComp: 3, arenaStars: 9, arenaScore: 98, dapurComp: 3, dapurStars: 9, dapurScore: 100, pixelComp: 3, pixelStars: 9, pixelScore: 99, hints: 0, playTime: 19 },
  // 17. Maisarah Imani — 26/27
  { id: '3A017', nama: 'Maisarah Imani', arenaComp: 3, arenaStars: 9, arenaScore: 96, dapurComp: 3, dapurStars: 8, dapurScore: 94, pixelComp: 3, pixelStars: 9, pixelScore: 97, hints: 1, playTime: 21 },
  // 18. Muhammad Arman — 24/27
  { id: '3A018', nama: 'Muhammad Arman', arenaComp: 3, arenaStars: 8, arenaScore: 89, dapurComp: 3, dapurStars: 8, dapurScore: 87, pixelComp: 3, pixelStars: 8, pixelScore: 88, hints: 3, playTime: 27 },
  // 19. Naufal Danish — 25/27
  { id: '3A019', nama: 'Naufal Danish', arenaComp: 3, arenaStars: 9, arenaScore: 92, dapurComp: 3, dapurStars: 8, dapurScore: 91, pixelComp: 3, pixelStars: 8, pixelScore: 90, hints: 2, playTime: 24 },
  // 20. Nur Aisyah — 27/27
  { id: '3A020', nama: 'Nur Aisyah', arenaComp: 3, arenaStars: 9, arenaScore: 100, dapurComp: 3, dapurStars: 9, dapurScore: 99, pixelComp: 3, pixelStars: 9, pixelScore: 100, hints: 0, playTime: 18 },
  // 21. Nurin Qistina — 26/27
  { id: '3A021', nama: 'Nurin Qistina', arenaComp: 3, arenaStars: 8, arenaScore: 95, dapurComp: 3, dapurStars: 9, dapurScore: 96, pixelComp: 3, pixelStars: 9, pixelScore: 97, hints: 1, playTime: 22 },
  // 22. Puteri Aleesya — 25/27
  { id: '3A022', nama: 'Puteri Aleesya', arenaComp: 3, arenaStars: 8, arenaScore: 90, dapurComp: 3, dapurStars: 9, dapurScore: 93, pixelComp: 3, pixelStars: 8, pixelScore: 91, hints: 2, playTime: 23 },
  // 23. Qaisara Humaira — 27/27
  { id: '3A023', nama: 'Qaisara Humaira', arenaComp: 3, arenaStars: 9, arenaScore: 99, dapurComp: 3, dapurStars: 9, dapurScore: 98, pixelComp: 3, pixelStars: 9, pixelScore: 100, hints: 0, playTime: 20 },
  // 24. Rayyan Akmal — 24/27
  { id: '3A024', nama: 'Rayyan Akmal', arenaComp: 3, arenaStars: 8, arenaScore: 88, dapurComp: 3, dapurStars: 8, dapurScore: 86, pixelComp: 3, pixelStars: 8, pixelScore: 89, hints: 3, playTime: 26 },
  // 25. Siti Aina — 26/27
  { id: '3A025', nama: 'Siti Aina', arenaComp: 3, arenaStars: 9, arenaScore: 96, dapurComp: 3, dapurStars: 9, dapurScore: 97, pixelComp: 3, pixelStars: 8, pixelScore: 94, hints: 1, playTime: 22 },
  // 26. Sofea Humaira — 25/27
  { id: '3A026', nama: 'Sofea Humaira', arenaComp: 3, arenaStars: 9, arenaScore: 93, dapurComp: 3, dapurStars: 8, dapurScore: 91, pixelComp: 3, pixelStars: 8, pixelScore: 92, hints: 2, playTime: 24 },
  // 27. Syafiq Adam — 27/27
  { id: '3A027', nama: 'Syafiq Adam', arenaComp: 3, arenaStars: 9, arenaScore: 100, dapurComp: 3, dapurStars: 9, dapurScore: 98, pixelComp: 3, pixelStars: 9, pixelScore: 99, hints: 0, playTime: 20 },
  // 28. Umar Faris — 26/27
  { id: '3A028', nama: 'Umar Faris', arenaComp: 3, arenaStars: 9, arenaScore: 95, dapurComp: 3, dapurStars: 8, dapurScore: 94, pixelComp: 3, pixelStars: 9, pixelScore: 96, hints: 1, playTime: 23 },
  // 29. Wafi Hakim — 24/27
  { id: '3A029', nama: 'Wafi Hakim', arenaComp: 3, arenaStars: 8, arenaScore: 87, dapurComp: 3, dapurStars: 8, dapurScore: 88, pixelComp: 3, pixelStars: 8, pixelScore: 86, hints: 3, playTime: 27 },
  // 30. Yasmin Aqilah — 27/27
  { id: '3A030', nama: 'Yasmin Aqilah', arenaComp: 3, arenaStars: 9, arenaScore: 99, dapurComp: 3, dapurStars: 9, dapurScore: 100, pixelComp: 3, pixelStars: 9, pixelScore: 98, hints: 0, playTime: 19 },
  // 31. Zara Qaisara — 25/27
  { id: '3A031', nama: 'Zara Qaisara', arenaComp: 3, arenaStars: 8, arenaScore: 91, dapurComp: 3, dapurStars: 8, dapurScore: 90, pixelComp: 3, pixelStars: 9, pixelScore: 93, hints: 2, playTime: 25 },
  // 32. Zikri Danish — 26/27
  { id: '3A032', nama: 'Zikri Danish', arenaComp: 3, arenaStars: 8, arenaScore: 94, dapurComp: 3, dapurStars: 9, dapurScore: 96, pixelComp: 3, pixelStars: 9, pixelScore: 95, hints: 1, playTime: 22 },
  // 33. Aqil Rayyan — 27/27
  { id: '3A033', nama: 'Aqil Rayyan', arenaComp: 3, arenaStars: 9, arenaScore: 100, dapurComp: 3, dapurStars: 9, dapurScore: 99, pixelComp: 3, pixelStars: 9, pixelScore: 100, hints: 0, playTime: 18 },

  // === 7 MURID BAHARU (STATUS: SELESAI 9/9, 24-27 BINTANG) ===
  // 34. Danish Aiman — 9/9, 24/27, 90%, Tahap: Baik, Sijil: Diperoleh
  { id: '3A034', nama: 'Danish Aiman', arenaComp: 3, arenaStars: 8, arenaScore: 90, dapurComp: 3, dapurStars: 8, dapurScore: 90, pixelComp: 3, pixelStars: 8, pixelScore: 90, hints: 3, playTime: 24 },
  // 35. Hana Sofea — 9/9, 25/27, 93%, Tahap: Baik, Sijil: Diperoleh
  { id: '3A035', nama: 'Hana Sofea', arenaComp: 3, arenaStars: 8, arenaScore: 92, dapurComp: 3, dapurStars: 8, dapurScore: 94, pixelComp: 3, pixelStars: 9, pixelScore: 93, hints: 2, playTime: 23 },
  // 36. Izzat Hakim — 9/9, 26/27, 96%, Tahap: Cemerlang, Sijil: Diperoleh
  { id: '3A036', nama: 'Izzat Hakim', arenaComp: 3, arenaStars: 9, arenaScore: 96, dapurComp: 3, dapurStars: 9, dapurScore: 97, pixelComp: 3, pixelStars: 8, pixelScore: 95, hints: 1, playTime: 22 },
  // 37. Nur Amirah — 9/9, 24/27, 89%, Tahap: Baik, Sijil: Diperoleh
  { id: '3A037', nama: 'Nur Amirah', arenaComp: 3, arenaStars: 8, arenaScore: 88, dapurComp: 3, dapurStars: 8, dapurScore: 89, pixelComp: 3, pixelStars: 8, pixelScore: 90, hints: 4, playTime: 25 },
  // 38. Rayyan Danish — 9/9, 25/27, 92%, Tahap: Baik, Sijil: Diperoleh
  { id: '3A038', nama: 'Rayyan Danish', arenaComp: 3, arenaStars: 9, arenaScore: 93, dapurComp: 3, dapurStars: 8, dapurScore: 91, pixelComp: 3, pixelStars: 8, pixelScore: 92, hints: 3, playTime: 24 },
  // 39. Syaqirah Amani — 9/9, 26/27, 95%, Tahap: Cemerlang, Sijil: Diperoleh
  { id: '3A039', nama: 'Syaqirah Amani', arenaComp: 3, arenaStars: 9, arenaScore: 95, dapurComp: 3, dapurStars: 8, dapurScore: 94, pixelComp: 3, pixelStars: 9, pixelScore: 96, hints: 1, playTime: 21 },
  // 40. Umar Hakimi — 9/9, 27/27, 100%, Tahap: Cemerlang, Sijil: Diperoleh
  { id: '3A040', nama: 'Umar Hakimi', arenaComp: 3, arenaStars: 9, arenaScore: 100, dapurComp: 3, dapurStars: 9, dapurScore: 100, pixelComp: 3, pixelStars: 9, pixelScore: 100, hints: 0, playTime: 19 },
];

export const CLASS_3_ASAH_STUDENTS: StudentProfile[] = RAW_3ASAH.map((r) => {
  const completedChallenges = r.arenaComp + r.dapurComp + r.pixelComp;
  const earnedStars = r.arenaStars + r.dapurStars + r.pixelStars;
  const isCertEarned = completedChallenges >= 9;

  const unlockedWorlds = ['arena'];
  if (r.arenaComp > 0) unlockedWorlds.push('dapur');
  if (r.dapurComp > 0) unlockedWorlds.push('pixel');

  const completedChallengeIds: string[] = [];
  for (let i = 1; i <= r.arenaComp; i++) completedChallengeIds.push(`arena-${i}`);
  for (let i = 1; i <= r.dapurComp; i++) completedChallengeIds.push(`dapur-${i}`);
  for (let i = 1; i <= r.pixelComp; i++) completedChallengeIds.push(`pixel-${i}`);

  const challengeStars: Record<string, number> = {};
  completedChallengeIds.forEach((chId) => {
    challengeStars[chId] = 3;
  });

  return {
    id: `MURID-${r.id}`,
    nama: r.nama,
    kelas: '3 Asah',
    tarikhDaftar: new Date(Date.now() - 86400000 * (1 + (parseInt(r.id.slice(2), 10) % 10))).toISOString(),
    progress: {
      completedChallenges,
      earnedStars,
      unlockedWorlds,
      worldStars: {
        arena: r.arenaStars,
        dapur: r.dapurStars,
        pixel: r.pixelStars,
      },
      completedChallengeIds,
      challengeStars,
      badges: isCertEarned
        ? ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Wira Pecahan']
        : ['Penjelajah Pecahan', 'Sedang Berkembang'],
      certificateEarned: isCertEarned,
      certificateDate: isCertEarned ? new Date(Date.now() - 86400000 * (1 + (r.id.charCodeAt(3) % 4))).toISOString() : undefined,
      totalHintsUsed: r.hints,
      totalPlayTimeMinutes: r.playTime,
      gameDetails: {
        arena_pecahan: {
          completedChallenges: r.arenaComp,
          earnedStars: r.arenaStars,
          scorePercentage: r.arenaScore,
          percubaan: Math.max(r.arenaComp, 1),
          hintUsed: Math.floor(r.hints / 3),
          masaMinit: Math.round(r.playTime * 0.35),
        },
        dapur_pecahan: {
          completedChallenges: r.dapurComp,
          earnedStars: r.dapurStars,
          scorePercentage: r.dapurScore,
          percubaan: Math.max(r.dapurComp, 1),
          hintUsed: Math.floor(r.hints / 3),
          masaMinit: Math.round(r.playTime * 0.35),
        },
        dunia_pixel: {
          completedChallenges: r.pixelComp,
          earnedStars: r.pixelStars,
          scorePercentage: r.pixelScore,
          percubaan: Math.max(r.pixelComp, 1),
          hintUsed: r.hints - 2 * Math.floor(r.hints / 3),
          masaMinit: Math.round(r.playTime * 0.30),
        },
      },
      attemptHistory: [],
    },
  };
});
