export interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  demand_level?: string;
  created_at: string;
}

export interface WorkerSkill {
  id: number;
  skill_id: number;
  skill: Skill;
  proficiency_percentage: number;
  level_tier: string;
  is_verified: boolean;
  verified_at?: string;
  last_assessment_score?: number;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  question_type: string;
  code_snippet?: string;
}

export interface SkillAssessment {
  id: number;
  skill_id: number;
  title: string;
  description?: string;
  time_limit_minutes: number;
  total_questions: number;
  passing_score: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentResult {
  id: number;
  assessment_id: number;
  score: number;
  achieved_level: string;
  passed: boolean;
  completed_at: string;
}

export interface SkillRecommendation {
  skill_id: number;
  skill_name: string;
  current_proficiency: number;
  current_tier: string;
  is_verified: boolean;
  target_tier: string;
  headline: string;
  potential_earnings: string;
  next_action: string;
}
