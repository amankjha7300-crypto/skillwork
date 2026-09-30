-- Demo Workers: Aman Kumar & Rohan Sharma
-- Passwords are hashed bcrypt representations of 'password123'
INSERT INTO users (id, full_name, email, phone_number, hashed_password, is_active, is_verified) VALUES
(1, 'Aman Kumar', 'aman@example.com', '+91 98765 43210', '$2b$12$e8pA8lU7jN3e6g5oPZ4VTe3kKjZtLw5sK8Q9U2nE3fA5bV8eK4eWq', true, true),
(2, 'Rohan Sharma', 'rohan@example.com', '+91 99887 76655', '$2b$12$e8pA8lU7jN3e6g5oPZ4VTe3kKjZtLw5sK8Q9U2nE3fA5bV8eK4eWq', true, true);

INSERT INTO worker_levels (id, level_number, title, min_tasks_required, min_completion_rate, min_rating, daily_limit, badge_name) VALUES
(1, 1, 'Beginner', 0, 0.0, 0.0, 1, 'Level 1 — Beginner'),
(2, 2, 'Verified', 5, 85.0, 4.2, 2, 'Level 2 — Verified'),
(3, 3, 'Skilled', 15, 90.0, 4.5, 2, 'Level 3 — Skilled'),
(4, 4, 'Advanced', 30, 95.0, 4.7, 3, 'Level 4 — Advanced'),
(5, 5, 'Expert', 50, 98.0, 4.9, 4, 'Level 5 — Expert');

INSERT INTO worker_profiles (id, user_id, headline, bio, location, experience_years, current_level_id, daily_task_limit, onboarding_completed, onboarding_step, is_verified_badge) VALUES
(1, 1, 'Backend Developer', 'Passionate backend engineer specializing in high-concurrency FastAPI microservices, PostgreSQL query optimization, and resilient work-allocation systems.', 'Bengaluru, India', 3.5, 3, 2, true, 7, true),
(2, 2, 'Full Stack & Python Developer', 'Experienced Python engineer with focus on automated APIs and modern web applications.', 'Delhi, India', 2.0, 3, 2, true, 7, true);

INSERT INTO worker_availability (worker_id, is_available, available_skills_filter, auto_notify) VALUES
(1, true, '[1, 2, 3]', true),
(2, true, '[1]', true);

INSERT INTO worker_performance (worker_id, tasks_completed, tasks_assigned, tasks_on_time, completion_rate, on_time_delivery_rate, average_rating, quality_score, reliability_score, overall_performance_score) VALUES
(1, 24, 25, 23, 97.0, 96.0, 4.8, 94, 96, 92),
(2, 18, 20, 18, 90.0, 92.0, 4.6, 90, 91, 86);

INSERT INTO earnings (worker_id, total_earned, this_month, pending_clearance, available_balance, withdrawn_total) VALUES
(1, 12450.0, 5820.0, 850.0, 4970.0, 6630.0),
(2, 8400.0, 3800.0, 0.0, 3200.0, 5200.0);
