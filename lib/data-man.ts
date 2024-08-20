import { createClient } from '@/lib/supabase/client';
import { Tier } from './types/supabase';

enum tier {
  'd' = 1,
  'c' = 3,
  'b' = 5,
  'a' = 8,
  's' = 10,
}

const getDegreeScore = async (degrees: string[]): Promise<number> => {
  const supabase = createClient();

  const fetchDegreeScores = degrees.map(async (degree): Promise<number> => {
    const { data, error } = await supabase
      .from('medical_degrees')
      .select('category')
      .eq('degree', degree)
      .single();

    if (error) {
      console.error(error);
      return 0;
    }
    return data ? Number(tier[data.category]) || 0 : 0;
  });
  const scores = await Promise.all(fetchDegreeScores);
  const totalScore = scores.reduce((acc, score) => acc + score, 0);
  return totalScore / degrees.length;
};

const getExperienceScore = (experience: number) => {
  if (experience < 1) return 1;
  if (experience < 3) return 4;
  if (experience < 5) return 7;
  if (experience < 10) return 10;
  return 12;
};

const getSpecialCountScore = (count: number) => {
  if (count < 1) return 1;
  if (count < 3) return 4;
  if (count < 5) return 7;
  if (count < 7) return 10;
  return 12;
};

const getProfessionScore = (profession: string) => {
  switch (profession) {
    case 'assistant proffesor':
      return 2;
    case 'associate proffesor':
      return 7;
    case 'professor':
      return 10;
    case 'consultant':
      return 3;
    case 'specialist':
      return 6;
    case 'senior specialist':
      return 9;
    default:
      return 1;
  }
};

const getGrade = (score: number): Tier => {
  if (score < 15) return 'd';
  if (score < 20) return 'c';
  if (score < 30) return 'b';
  if (score < 35) return 'a';
  return 's';
};

export async function getDoctorGrade(
  subSpecialtiesCount: number,
  degree: string[] | null,
  profession: string,
  experience: number,
) {
  //   const subSpecialtiesCount = 5;
  //   const degree = ['fellow-iaea', 'phd', 'mbbs', 'dhms', 'msc', 'mph'];
  //   const profession: Profession = 'professor';
  //   const experience = 30;

  let score = 0;
  score += getExperienceScore(experience);
  score += getSpecialCountScore(subSpecialtiesCount);
  score += getProfessionScore(profession);
  if (degree) {
    score += await getDegreeScore(degree);
  }
  console.log('DocScore: ' + score);
  const grade = getGrade(score);
  console.log('DocGrade: ' + grade);
  return grade;
}
