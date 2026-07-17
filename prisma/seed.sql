
-- Seed Demo Accounts
INSERT INTO users (id, role, full_name, preferred_language, created_at, updated_at) VALUES 
('00000000-0000-0000-0000-000000000001', 'ops_manager', 'Demo Ops Manager', 'en', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET full_name = 'Demo Ops Manager', role = 'ops_manager';

INSERT INTO users (id, role, full_name, preferred_language, created_at, updated_at) VALUES 
('00000000-0000-0000-0000-000000000002', 'security', 'Demo Security Officer', 'en', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET full_name = 'Demo Security Officer', role = 'security';

INSERT INTO users (id, role, full_name, preferred_language, created_at, updated_at) VALUES 
('00000000-0000-0000-0000-000000000003', 'volunteer', 'Demo Volunteer', 'en', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET full_name = 'Demo Volunteer', role = 'volunteer';

