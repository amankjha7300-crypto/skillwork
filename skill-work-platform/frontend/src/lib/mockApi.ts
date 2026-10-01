// Fallback Mock API Engine for SkillWork
// Provides complete interactive functionality on client-side / Vercel demo deployments
// when backend is offline, unreachable, or blocked by Mixed-Content policies.

import { User, WorkerProfile } from "@/types/user";
import { Task, TaskAssignment, GrabWorkResponse } from "@/types/task";
import { Skill, WorkerSkill, SkillAssessment, SkillRecommendation } from "@/types/skill";
import { EarningsSummary, Transaction, Withdrawal } from "@/types/earnings";
import { AppNotification } from "@/types/notification";

const STORAGE_KEY_PREFIX = "skillwork_mock_";

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// Initial seed skills
const INITIAL_SKILLS: Skill[] = [
  { id: 1, name: "Python", category: "Backend Development", description: "Core Python, scripting, async, OOP, and data pipelines.", icon: "python", demand_level: "High", created_at: "2026-01-01T00:00:00Z" },
  { id: 2, name: "FastAPI", category: "Backend Development", description: "High-performance REST API architecture with Pydantic & AsyncIO.", icon: "zap", demand_level: "High", created_at: "2026-01-01T00:00:00Z" },
  { id: 3, name: "PostgreSQL", category: "Database", description: "Relational schema design, query optimization, indexing & transactions.", icon: "database", demand_level: "High", created_at: "2026-01-01T00:00:00Z" },
  { id: 4, name: "Git", category: "DevOps & Tools", description: "Branching workflows, merge conflicts, PRs and version control.", icon: "git-branch", demand_level: "Medium", created_at: "2026-01-01T00:00:00Z" },
  { id: 5, name: "Web Development", category: "Frontend Development", description: "Modern responsive web applications, HTML5, CSS3, DOM.", icon: "globe", demand_level: "High", created_at: "2026-01-01T00:00:00Z" },
  { id: 6, name: "React", category: "Frontend Development", description: "React 18 hooks, component patterns, state management.", icon: "code", demand_level: "High", created_at: "2026-01-01T00:00:00Z" },
  { id: 7, name: "JavaScript", category: "Frontend Development", description: "ES6+, closures, event loop, asynchronous promises.", icon: "file-code", demand_level: "High", created_at: "2026-01-01T00:00:00Z" },
  { id: 8, name: "UI/UX Design", category: "Design", description: "User research, wireframing, Figma design systems & prototypes.", icon: "layout", demand_level: "Medium", created_at: "2026-01-01T00:00:00Z" },
  { id: 9, name: "Video Editing", category: "Media", description: "Premiere Pro, DaVinci Resolve, color grading, pacing & audio.", icon: "video", demand_level: "High", created_at: "2026-01-01T00:00:00Z" },
  { id: 10, name: "Content Writing", category: "Writing", description: "Technical copywriting, SEO articles, documentation.", icon: "edit-3", demand_level: "Medium", created_at: "2026-01-01T00:00:00Z" },
  { id: 11, name: "Data Analysis", category: "Data", description: "Pandas, NumPy, data cleaning, statistical analysis.", icon: "bar-chart-2", demand_level: "High", created_at: "2026-01-01T00:00:00Z" },
];

const INITIAL_DEMO_USER: User = {
  id: 1,
  full_name: "Aman Kumar",
  email: "aman@example.com",
  phone_number: "+91 98765 43210",
  is_verified: true,
  created_at: "2026-01-01T00:00:00Z",
};

const INITIAL_DEMO_PROFILE: WorkerProfile = {
  id: 1,
  user_id: 1,
  user: INITIAL_DEMO_USER,
  headline: "Backend Developer",
  bio: "Passionate backend engineer specializing in high-concurrency FastAPI microservices, PostgreSQL query optimization, and resilient work-allocation systems.",
  location: "Bengaluru, India",
  experience_years: 3.5,
  daily_task_limit: 2,
  onboarding_completed: true,
  onboarding_step: 7,
  is_verified_badge: true,
  github_url: "https://github.com/amankumar",
  linkedin_url: "https://linkedin.com/in/amankumar",
  portfolio_url: "https://amankumar.dev",
  today_tasks_count: 1,
  level: {
    id: 3,
    level_number: 3,
    title: "Skilled",
    min_tasks_required: 15,
    min_completion_rate: 90.0,
    min_rating: 4.5,
    daily_limit: 2,
    badge_name: "Level 3 — Skilled",
  },
  availability: {
    is_available: true,
    available_skills_filter: "[1,2,3]",
    auto_notify: true,
    updated_at: new Date().toISOString(),
  },
  performance: {
    tasks_completed: 24,
    tasks_assigned: 25,
    completion_rate: 97.0,
    on_time_delivery_rate: 96.0,
    average_rating: 4.8,
    quality_score: 94,
    reliability_score: 96,
    overall_performance_score: 92,
  },
  skills: [
    { id: 1, skill_id: 1, skill: INITIAL_SKILLS[0], proficiency_percentage: 91, level_tier: "Expert", is_verified: true, last_assessment_score: 92 },
    { id: 2, skill_id: 2, skill: INITIAL_SKILLS[1], proficiency_percentage: 82, level_tier: "Advanced", is_verified: true, last_assessment_score: 84 },
    { id: 3, skill_id: 3, skill: INITIAL_SKILLS[2], proficiency_percentage: 76, level_tier: "Skilled", is_verified: true, last_assessment_score: 78 },
    { id: 4, skill_id: 4, skill: INITIAL_SKILLS[3], proficiency_percentage: 88, level_tier: "Advanced", is_verified: true, last_assessment_score: 88 },
  ],
  portfolio_items: [
    {
      id: 1,
      title: "Async Task Allocation Engine",
      description: "High-throughput distributed task scheduler with atomic grab logic, concurrency locking, and Postgres.",
      project_url: "https://github.com/amankumar/task-allocator",
      skills_used: "Python, FastAPI, PostgreSQL, Redis",
      created_at: "2026-01-15T00:00:00Z",
    },
    {
      id: 2,
      title: "Real-time Notification Service",
      description: "WebSocket-based instant notification pipeline delivering alerts under 50ms latency.",
      project_url: "https://github.com/amankumar/push-pipeline",
      skills_used: "Python, AsyncIO, WebSockets",
      created_at: "2026-02-10T00:00:00Z",
    },
  ],
  work_history: [
    {
      id: 1,
      company_or_client: "NexGen Tech Labs",
      role: "Backend Engineer",
      duration: "Jan 2025 – Present",
      description: "Architected core REST microservices and database migrations for high-traffic platforms.",
      created_at: "2026-01-01T00:00:00Z",
    },
  ],
};

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Backend API Development",
    description: "Build and integrate a clean, async FastAPI endpoint with PostgreSQL database models, JWT validation, and automated test coverage.",
    category: "Backend Development",
    payment_amount: 900.0,
    currency: "INR",
    estimated_time: "3 hours",
    deadline_hours: 24,
    total_slots: 1,
    available_slots: 1,
    status: "AVAILABLE",
    urgency: "HIGH",
    expires_at: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    current_notification_tier: 1,
    instructions: "Implement the provided endpoint schema. Ensure all input params are strictly validated using Pydantic. Use async/await for database session queries.",
    expected_output: "Python files containing router, service function, Pydantic schemas, and a test file demonstrating 100% test pass.",
    submission_rules: "Upload clean code in a ZIP file or provide GitHub repo link. No mock credentials in code.",
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    is_eligible: true,
    requirements: [
      { id: 1, skill_id: 1, skill: INITIAL_SKILLS[0], min_proficiency: 75, min_level_tier: "Skilled", is_mandatory: true },
      { id: 2, skill_id: 2, skill: INITIAL_SKILLS[1], min_proficiency: 70, min_level_tier: "Intermediate", is_mandatory: true },
    ],
  },
  {
    id: 2,
    title: "Responsive Sky-Blue Landing Page",
    description: "Build a high-converting, mobile-responsive landing page showcasing our automated work allocation philosophy with interactive live counters.",
    category: "Frontend Development",
    payment_amount: 850.0,
    currency: "INR",
    estimated_time: "3–4 hours",
    deadline_hours: 24,
    total_slots: 1,
    available_slots: 1,
    status: "AVAILABLE",
    urgency: "NORMAL",
    expires_at: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
    current_notification_tier: 1,
    instructions: "Create semantic HTML and responsive Vanilla CSS. Follow the White + Sky Blue theme strictly.",
    expected_output: "HTML, CSS, JS source files zipped or hosted demo link.",
    submission_rules: "Must look pristine on mobile viewports (<640px) as well as desktop.",
    created_at: new Date(Date.now() - 7200 * 1000).toISOString(),
    is_eligible: true,
    requirements: [
      { id: 3, skill_id: 5, skill: INITIAL_SKILLS[4], min_proficiency: 65, min_level_tier: "Intermediate", is_mandatory: true },
    ],
  },
  {
    id: 3,
    title: "PostgreSQL Index & Query Optimization",
    description: "Analyze slow queries on a high-throughput transaction ledger and design B-tree and partial indexes to reduce latency below 10ms.",
    category: "Database",
    payment_amount: 1400.0,
    currency: "INR",
    estimated_time: "4 hours",
    deadline_hours: 48,
    total_slots: 1,
    available_slots: 1,
    status: "AVAILABLE",
    urgency: "NORMAL",
    expires_at: new Date(Date.now() + 240 * 60 * 1000).toISOString(),
    current_notification_tier: 1,
    instructions: "Provide EXPLAIN ANALYZE benchmarks before and after index migration.",
    expected_output: "SQL migration script and execution plan diff analysis.",
    submission_rules: "Ensure queries do not cause full table scans under load.",
    created_at: new Date(Date.now() - 10800 * 1000).toISOString(),
    is_eligible: true,
    requirements: [
      { id: 4, skill_id: 3, skill: INITIAL_SKILLS[2], min_proficiency: 75, min_level_tier: "Skilled", is_mandatory: true },
    ],
  },
];

const INITIAL_ASSIGNMENTS: TaskAssignment[] = [
  {
    id: 1,
    task_id: 99,
    worker_id: 1,
    status: "COMPLETED",
    assigned_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    started_at: new Date(Date.now() - 23 * 3600 * 1000).toISOString(),
    due_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 21 * 3600 * 1000).toISOString(),
    earnings_processed: true,
    task: {
      id: 99,
      title: "FastAPI Health Check & Metrics Middleware",
      description: "Implement Prometheus metrics middleware and health check probing.",
      category: "Backend Development",
      payment_amount: 750.0,
      currency: "INR",
      estimated_time: "2 hours",
      deadline_hours: 12,
      total_slots: 1,
      available_slots: 0,
      status: "COMPLETED",
      urgency: "NORMAL",
      current_notification_tier: 1,
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      requirements: [],
    },
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    user_id: 1,
    type: "WORK_ALLOCATED",
    title: "⚡ New Work Matched Your Skills",
    message: "Backend API Development has been allocated to you. Grab it before the 45-minute window expires!",
    priority: "HIGH",
    is_read: false,
    action_url: "/work/1",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    type: "PAYMENT_RECEIVED",
    title: "💰 Payout Credited: ₹750.00",
    message: "Your submission for 'FastAPI Health Check & Metrics Middleware' has been approved and credited.",
    priority: "NORMAL",
    is_read: true,
    action_url: "/earnings",
    created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    type: "LEVEL_UP",
    title: "🎖️ Level 3 Skilled Status Verified",
    message: "Congratulations! Your rating of 4.8 and 97% completion rate qualified you for Level 3 Skilled tier.",
    priority: "NORMAL",
    is_read: true,
    action_url: "/profile",
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, amount: 850.0, type: "TASK_PAYMENT", title: "Backend API Development", status: "PAID", reference_id: "TXN-984210", created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
  { id: 2, amount: 600.0, type: "TASK_PAYMENT", title: "PostgreSQL Schema Optimization", status: "PAID", reference_id: "TXN-873112", created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
  { id: 3, amount: -2000.0, type: "WITHDRAWAL", title: "Withdrawal to UPI (aman@okaxis)", status: "PAID", reference_id: "WTH-441029", created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString() },
  { id: 4, amount: 1200.0, type: "TASK_PAYMENT", title: "FastAPI Async Ingestion Microservice", status: "PAID", reference_id: "TXN-654921", created_at: new Date(Date.now() - 144 * 3600 * 1000).toISOString() },
];

export const mockStore = {
  getUsers(): Record<string, { user: User; passwordHash: string; profile: WorkerProfile }> {
    const defaultUsers = {
      "aman@example.com": {
        user: INITIAL_DEMO_USER,
        passwordHash: "password123",
        profile: INITIAL_DEMO_PROFILE,
      },
    };
    return getStorage("users", defaultUsers);
  },

  saveUsers(users: any) {
    setStorage("users", users);
  },

  getCurrentUser(): User {
    const users = this.getUsers();
    // Check if active email is set
    const activeEmail = getStorage("active_email", "aman@example.com");
    if (users[activeEmail]) {
      return users[activeEmail].user;
    }
    return INITIAL_DEMO_USER;
  },

  getCurrentProfile(): WorkerProfile {
    const users = this.getUsers();
    const activeEmail = getStorage("active_email", "aman@example.com");
    if (users[activeEmail]) {
      return users[activeEmail].profile;
    }
    return INITIAL_DEMO_PROFILE;
  },

  updateCurrentProfile(updates: Partial<WorkerProfile>): WorkerProfile {
    const users = this.getUsers();
    const activeEmail = getStorage("active_email", "aman@example.com");
    const current = users[activeEmail]?.profile || INITIAL_DEMO_PROFILE;
    const updated = { ...current, ...updates };
    if (!users[activeEmail]) {
      users[activeEmail] = {
        user: updated.user || INITIAL_DEMO_USER,
        passwordHash: "password123",
        profile: updated,
      };
    } else {
      users[activeEmail].profile = updated;
    }
    this.saveUsers(users);
    return updated;
  },

  getTasks(): Task[] {
    return getStorage("tasks", INITIAL_TASKS);
  },

  saveTasks(tasks: Task[]) {
    setStorage("tasks", tasks);
  },

  getAssignments(): TaskAssignment[] {
    return getStorage("assignments", INITIAL_ASSIGNMENTS);
  },

  saveAssignments(assignments: TaskAssignment[]) {
    setStorage("assignments", assignments);
  },

  getNotifications(): AppNotification[] {
    return getStorage("notifications", INITIAL_NOTIFICATIONS);
  },

  saveNotifications(notes: AppNotification[]) {
    setStorage("notifications", notes);
  },

  getTransactions(): Transaction[] {
    return getStorage("transactions", INITIAL_TRANSACTIONS);
  },

  saveTransactions(txs: Transaction[]) {
    setStorage("transactions", txs);
  },

  getEarnings(): EarningsSummary {
    return getStorage("earnings", {
      total_earned: 12450.0,
      this_month: 5820.0,
      pending_clearance: 850.0,
      available_balance: 4970.0,
      withdrawn_total: 6630.0,
      tasks_completed_count: 24,
      average_per_task: 518.75,
      this_week: 2350.0,
    });
  },

  saveEarnings(earnings: EarningsSummary) {
    setStorage("earnings", earnings);
  },
};

// Router for dispatching mock API calls
export async function handleMockApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // Artificial short delay to feel authentic
  await new Promise((r) => setTimeout(r, 120));

  // --- AUTH ---
  if (endpoint === "/auth/register" && method === "POST") {
    const users = mockStore.getUsers();
    const email = body.email?.toLowerCase().trim();
    if (users[email]) {
      // If already registered, still allow login for demo convenience or throw
    }
    const newUser: User = {
      id: Math.floor(Math.random() * 90000) + 1000,
      full_name: body.full_name || "SkillWork Worker",
      email: email,
      phone_number: body.phone_number || "",
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    const newProfile: WorkerProfile = {
      id: newUser.id,
      user_id: newUser.id,
      user: newUser,
      headline: "SkillWork Professional",
      bio: "Ready to take on suitable work allocations.",
      location: "India",
      experience_years: 1,
      daily_task_limit: 2,
      onboarding_completed: false,
      onboarding_step: 1,
      is_verified_badge: false,
      today_tasks_count: 0,
      level: {
        id: 1,
        level_number: 1,
        title: "Beginner",
        min_tasks_required: 0,
        min_completion_rate: 0.0,
        min_rating: 0.0,
        daily_limit: 1,
        badge_name: "Level 1 — Beginner",
      },
      availability: {
        is_available: true,
        available_skills_filter: "[]",
        auto_notify: true,
        updated_at: new Date().toISOString(),
      },
      performance: {
        tasks_completed: 0,
        tasks_assigned: 0,
        completion_rate: 100.0,
        on_time_delivery_rate: 100.0,
        average_rating: 5.0,
        quality_score: 90,
        reliability_score: 95,
        overall_performance_score: 92,
      },
      skills: [],
      portfolio_items: [],
      work_history: [],
    };

    users[email] = {
      user: newUser,
      passwordHash: body.password || "password123",
      profile: newProfile,
    };
    mockStore.saveUsers(users);
    setStorage("active_email", email);

    return {
      access_token: `mock_jwt_token_${newUser.id}_${Date.now()}`,
      token_type: "bearer",
      user: newUser,
    };
  }

  if (endpoint === "/auth/login" && method === "POST") {
    const users = mockStore.getUsers();
    const email = body.email?.toLowerCase().trim();

    // Support demo login or any registered account
    let matched = users[email];
    if (!matched) {
      if (email === "aman@example.com") {
        matched = {
          user: INITIAL_DEMO_USER,
          passwordHash: "password123",
          profile: INITIAL_DEMO_PROFILE,
        };
      } else {
        // Automatically create session for smooth onboarding if not found
        const autoUser: User = {
          id: Math.floor(Math.random() * 90000) + 1000,
          full_name: email.split("@")[0].replace(".", " "),
          email: email,
          is_verified: true,
          created_at: new Date().toISOString(),
        };
        const autoProfile: WorkerProfile = {
          ...INITIAL_DEMO_PROFILE,
          id: autoUser.id,
          user_id: autoUser.id,
          user: autoUser,
          onboarding_completed: true,
        };
        matched = {
          user: autoUser,
          passwordHash: body.password,
          profile: autoProfile,
        };
        users[email] = matched;
        mockStore.saveUsers(users);
      }
    }

    setStorage("active_email", email);

    return {
      access_token: `mock_jwt_token_${matched.user.id}_${Date.now()}`,
      token_type: "bearer",
      user: matched.user,
    };
  }

  if (endpoint === "/auth/me" && method === "GET") {
    return mockStore.getCurrentUser();
  }

  // --- WORKER PROFILE ---
  if (endpoint === "/worker/profile" && method === "GET") {
    return mockStore.getCurrentProfile();
  }

  if (endpoint === "/worker/profile" && method === "PATCH") {
    const updated = mockStore.updateCurrentProfile(body);
    return updated;
  }

  if (endpoint === "/worker/availability" && method === "PATCH") {
    const current = mockStore.getCurrentProfile();
    const avail = {
      is_available: body.is_available ?? current.availability?.is_available ?? true,
      available_skills_filter: body.available_skills_filter ? JSON.stringify(body.available_skills_filter) : current.availability?.available_skills_filter,
      auto_notify: body.auto_notify ?? current.availability?.auto_notify ?? true,
      updated_at: new Date().toISOString(),
    };
    mockStore.updateCurrentProfile({ availability: avail });
    return avail;
  }

  if (endpoint === "/worker/portfolio" && method === "POST") {
    const current = mockStore.getCurrentProfile();
    const newItem = {
      id: (current.portfolio_items?.length || 0) + 1,
      title: body.title,
      description: body.description,
      project_url: body.project_url,
      skills_used: body.skills_used,
      created_at: new Date().toISOString(),
    };
    const items = [...(current.portfolio_items || []), newItem];
    mockStore.updateCurrentProfile({ portfolio_items: items });
    return newItem;
  }

  if (endpoint === "/worker/history" && method === "POST") {
    const current = mockStore.getCurrentProfile();
    const newHist = {
      id: (current.work_history?.length || 0) + 1,
      company_or_client: body.company_or_client,
      role: body.role,
      duration: body.duration,
      description: body.description,
      created_at: new Date().toISOString(),
    };
    const hist = [...(current.work_history || []), newHist];
    mockStore.updateCurrentProfile({ work_history: hist });
    return newHist;
  }

  // --- SKILLS ---
  if (endpoint.startsWith("/skills") && method === "GET") {
    if (endpoint === "/skills/worker") {
      const current = mockStore.getCurrentProfile();
      return current.skills || [];
    }

    if (endpoint === "/skills/recommendations") {
      const recs: SkillRecommendation[] = [
        {
          skill_id: 3,
          skill_name: "PostgreSQL",
          current_proficiency: 76,
          current_tier: "Skilled",
          is_verified: true,
          target_tier: "Advanced",
          headline: "Advance to Level 4 Tier",
          potential_earnings: "+₹2,800/week",
          next_action: "Take query tuning assessment",
        },
        {
          skill_id: 6,
          skill_name: "React & Next.js",
          current_proficiency: 0,
          current_tier: "Unverified",
          is_verified: false,
          target_tier: "Intermediate",
          headline: "Unlock Frontend Fullstack Tasks",
          potential_earnings: "+₹3,500/week",
          next_action: "Take React onboarding quiz",
        },
      ];
      return recs;
    }

    if (endpoint.includes("/assessment")) {
      const match = endpoint.match(/\/skills\/(\d+)\/assessment/);
      const skillId = match ? parseInt(match[1]) : 1;
      return {
        id: 1,
        skill_id: skillId,
        title: "Proficiency Verification Assessment",
        description: "Assess your engineering precision, best practices, and runtime architecture.",
        time_limit_minutes: 15,
        total_questions: 3,
        passing_score: 70,
        questions: [
          {
            id: 1,
            question: "What is the primary benefit of asynchronous non-blocking I/O in backend engineering?",
            options: [
              "It runs raw CPU cycles 10x faster",
              "It handles thousands of concurrent I/O operations without thread starvation",
              "It automatically backs up database schemas",
              "It compiles Python bytecode to native binary",
            ],
            question_type: "mcq",
          },
          {
            id: 2,
            question: "How should sensitive database credentials be supplied to production services?",
            options: [
              "Hardcoded as plain strings in repository files",
              "Stored in browser localStorage",
              "Injected securely via environment variables or secret vaults",
              "Appended to URL query params",
            ],
            question_type: "mcq",
          },
          {
            id: 3,
            question: "What prevents race conditions in high-throughput task grab allocations?",
            options: [
              "Atomic database transactions with row-level locking (SELECT ... FOR UPDATE)",
              "Adding setTimeout delays in frontend",
              "Sending multiple duplicate requests",
              "Disabling CORS completely",
            ],
            question_type: "mcq",
          },
        ],
      };
    }

    return INITIAL_SKILLS;
  }

  if (endpoint === "/skills/worker" && method === "POST") {
    const current = mockStore.getCurrentProfile();
    const skillObj = INITIAL_SKILLS.find((s) => s.id === body.skill_id) || INITIAL_SKILLS[0];
    const newWs: WorkerSkill = {
      id: Math.floor(Math.random() * 1000) + 1,
      skill_id: body.skill_id,
      skill: skillObj,
      proficiency_percentage: body.proficiency_percentage || 85,
      level_tier: body.level_tier || "Advanced",
      is_verified: true,
      last_assessment_score: 90,
      verified_at: new Date().toISOString(),
    };
    const existing = (current.skills || []).filter((s) => s.skill_id !== body.skill_id);
    const updatedSkills = [...existing, newWs];
    mockStore.updateCurrentProfile({ skills: updatedSkills });
    return newWs;
  }

  if (endpoint === "/skills/assessment" && method === "POST") {
    return {
      id: 1,
      assessment_id: body.assessment_id,
      score: 95,
      achieved_level: "Advanced",
      passed: true,
      completed_at: new Date().toISOString(),
    };
  }

  // --- WORK & GRAB WORK ---
  if (endpoint === "/work" && method === "GET") {
    return mockStore.getTasks().filter((t) => t.status === "AVAILABLE" && t.available_slots > 0);
  }

  if (endpoint.startsWith("/work/") && method === "GET") {
    const taskId = parseInt(endpoint.replace("/work/", ""));
    const task = mockStore.getTasks().find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");
    return task;
  }

  if (endpoint.endsWith("/grab") && method === "POST") {
    const taskId = parseInt(endpoint.split("/")[2]);
    const tasks = mockStore.getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    const task = tasks[taskIndex];
    if (task.available_slots <= 0) {
      throw new Error("This work has already been claimed by another worker.");
    }

    // Decrement available slots
    task.available_slots -= 1;
    if (task.available_slots === 0) {
      task.status = "ASSIGNED";
    }
    mockStore.saveTasks(tasks);

    // Create assignment
    const currentProfile = mockStore.getCurrentProfile();
    const assignments = mockStore.getAssignments();
    const newAssignment: TaskAssignment = {
      id: assignments.length + 1,
      task_id: task.id,
      task: task,
      worker_id: currentProfile.id,
      status: "ASSIGNED",
      assigned_at: new Date().toISOString(),
      due_at: new Date(Date.now() + (task.deadline_hours || 24) * 3600 * 1000).toISOString(),
      earnings_processed: false,
    };
    assignments.unshift(newAssignment);
    mockStore.saveAssignments(assignments);

    // Increment today tasks count
    const newTodayCount = (currentProfile.today_tasks_count || 0) + 1;
    mockStore.updateCurrentProfile({ today_tasks_count: newTodayCount });

    // Add alert notification
    const notes = mockStore.getNotifications();
    notes.unshift({
      id: notes.length + 1,
      user_id: currentProfile.user_id,
      task_id: task.id,
      type: "WORK_GRABBED",
      title: `⚡ Work Grabbed: ${task.title}`,
      message: `You successfully grabbed '${task.title}'. Complete and submit before deadline!`,
      priority: "HIGH",
      is_read: false,
      action_url: `/tasks/${newAssignment.id}`,
      created_at: new Date().toISOString(),
    });
    mockStore.saveNotifications(notes);

    const res: GrabWorkResponse = {
      success: true,
      message: "Work claimed successfully! Allocation locked to your profile.",
      assignment_id: newAssignment.id,
      task: task,
      today_tasks_count: newTodayCount,
      daily_limit: currentProfile.daily_task_limit,
    };
    return res;
  }

  // --- MY TASKS ---
  if (endpoint.startsWith("/tasks") && method === "GET") {
    if (endpoint === "/tasks" || endpoint.startsWith("/tasks?")) {
      const assignments = mockStore.getAssignments();
      const url = new URL(`http://dummy${endpoint}`);
      const statusFilter = url.searchParams.get("status");
      if (statusFilter && statusFilter !== "ALL") {
        return assignments.filter((a) => a.status === statusFilter);
      }
      return assignments;
    }

    const assignmentId = parseInt(endpoint.replace("/tasks/", ""));
    const assignment = mockStore.getAssignments().find((a) => a.id === assignmentId);
    if (!assignment) throw new Error("Task assignment not found");
    return assignment;
  }

  if (endpoint.endsWith("/start") && method === "POST") {
    const assignmentId = parseInt(endpoint.split("/")[2]);
    const assignments = mockStore.getAssignments();
    const a = assignments.find((item) => item.id === assignmentId);
    if (a) {
      a.status = "IN_PROGRESS";
      a.started_at = new Date().toISOString();
      mockStore.saveAssignments(assignments);
      return a;
    }
    throw new Error("Assignment not found");
  }

  if (endpoint.endsWith("/submit") && method === "POST") {
    const assignmentId = parseInt(endpoint.split("/")[2]);
    const assignments = mockStore.getAssignments();
    const a = assignments.find((item) => item.id === assignmentId);
    if (a) {
      a.status = "COMPLETED";
      a.completed_at = new Date().toISOString();
      a.earnings_processed = true;
      mockStore.saveAssignments(assignments);

      // Credit earnings
      const earnings = mockStore.getEarnings();
      const payout = a.task.payment_amount || 850;
      earnings.total_earned += payout;
      earnings.this_month += payout;
      earnings.available_balance += payout;
      earnings.tasks_completed_count += 1;
      mockStore.saveEarnings(earnings);

      // Add transaction
      const txs = mockStore.getTransactions();
      txs.unshift({
        id: txs.length + 1,
        task_id: a.task.id,
        amount: payout,
        type: "TASK_PAYMENT",
        title: a.task.title,
        status: "PAID",
        reference_id: `TXN-${Math.floor(Math.random() * 900000) + 100000}`,
        created_at: new Date().toISOString(),
      });
      mockStore.saveTransactions(txs);

      // Notification
      const notes = mockStore.getNotifications();
      notes.unshift({
        id: notes.length + 1,
        user_id: a.worker_id,
        task_id: a.task.id,
        type: "PAYMENT_RECEIVED",
        title: `💰 ₹${payout} Credited for ${a.task.title}`,
        message: "Your submission has been reviewed and earnings are now in your available balance.",
        priority: "NORMAL",
        is_read: false,
        action_url: "/earnings",
        created_at: new Date().toISOString(),
      });
      mockStore.saveNotifications(notes);

      return {
        id: 1,
        assignment_id: a.id,
        status: "APPROVED",
        submission_notes: body.submission_notes,
      };
    }
    throw new Error("Assignment not found");
  }

  // --- EARNINGS & WITHDRAWALS ---
  if (endpoint === "/earnings" && method === "GET") {
    return mockStore.getEarnings();
  }

  if (endpoint === "/earnings/transactions" && method === "GET") {
    return mockStore.getTransactions();
  }

  if (endpoint === "/earnings/withdraw" && method === "POST") {
    const earnings = mockStore.getEarnings();
    const amount = Number(body.amount);
    if (amount > earnings.available_balance) {
      throw new Error(`Insufficient funds. Your available balance is ₹${earnings.available_balance.toFixed(2)}`);
    }

    earnings.available_balance -= amount;
    earnings.withdrawn_total += amount;
    mockStore.saveEarnings(earnings);

    const txs = mockStore.getTransactions();
    const ref = `WTH-${Math.floor(Math.random() * 900000) + 100000}`;
    txs.unshift({
      id: txs.length + 1,
      amount: -amount,
      type: "WITHDRAWAL",
      title: `Withdrawal to ${body.method} (${body.payout_details})`,
      status: "PAID",
      reference_id: ref,
      created_at: new Date().toISOString(),
    });
    mockStore.saveTransactions(txs);

    const withdrawal: Withdrawal = {
      id: txs.length,
      amount,
      method: body.method,
      payout_details: body.payout_details,
      status: "PAID",
      reference_id: ref,
      requested_at: new Date().toISOString(),
      processed_at: new Date().toISOString(),
    };
    return withdrawal;
  }

  if (endpoint === "/earnings/withdrawals" && method === "GET") {
    const txs = mockStore.getTransactions();
    return txs.filter((t) => t.type === "WITHDRAWAL");
  }

  // --- PERFORMANCE & LEVEL ---
  if (endpoint === "/performance" && method === "GET") {
    return mockStore.getCurrentProfile().performance;
  }

  if (endpoint === "/performance/level" && method === "GET") {
    return mockStore.getCurrentProfile().level;
  }

  // --- NOTIFICATIONS ---
  if (endpoint === "/notifications" && method === "GET") {
    return mockStore.getNotifications();
  }

  if (endpoint.endsWith("/read") && method === "POST") {
    const id = parseInt(endpoint.split("/")[2]);
    const notes = mockStore.getNotifications();
    const target = notes.find((n) => n.id === id);
    if (target) {
      target.is_read = true;
      mockStore.saveNotifications(notes);
      return target;
    }
    return { success: true };
  }

  if (endpoint === "/notifications/read-all" && method === "POST") {
    const notes = mockStore.getNotifications();
    notes.forEach((n) => (n.is_read = true));
    mockStore.saveNotifications(notes);
    return { success: true, count: notes.length };
  }

  // Fallback default
  return {};
}
