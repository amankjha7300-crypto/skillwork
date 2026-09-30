-- Demo Tasks & Requirements
INSERT INTO tasks (id, title, description, category, payment_amount, currency, estimated_time, deadline_hours, total_slots, available_slots, status, urgency, instructions, expected_output) VALUES
(1, 'Backend API Development', 'Build and integrate a clean, async FastAPI endpoint with PostgreSQL database models, JWT validation, and automated test coverage.', 'Backend Development', 900.0, 'INR', '3 hours', 24, 1, 1, 'AVAILABLE', 'HIGH', 'Implement the endpoint schema with full Pydantic validation.', 'Source code in Python with unit tests.'),
(2, 'Responsive Sky-Blue Landing Page', 'Build a high-converting, mobile-responsive landing page showcasing our automated work allocation philosophy with interactive live counters.', 'Frontend Development', 850.0, 'INR', '3–4 hours', 24, 1, 1, 'AVAILABLE', 'NORMAL', 'Create semantic HTML and responsive CSS following the White + Sky Blue theme strictly.', 'HTML, CSS, JS source files.'),
(3, 'PostgreSQL Index & Query Optimization', 'Analyze slow queries on a high-throughput transaction ledger and design B-tree and partial indexes to reduce latency below 10ms.', 'Database', 1400.0, 'INR', '4 hours', 48, 1, 1, 'AVAILABLE', 'NORMAL', 'Provide EXPLAIN ANALYZE benchmarks.', 'SQL migration scripts and analysis.');

INSERT INTO task_requirements (task_id, skill_id, min_proficiency, min_level_tier, is_mandatory) VALUES
(1, 1, 75, 'Skilled', true),
(1, 2, 70, 'Intermediate', true),
(2, 5, 65, 'Intermediate', true),
(3, 3, 75, 'Skilled', true);
