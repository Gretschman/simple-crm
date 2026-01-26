-- Seed data for contacts table
-- This will insert 5 sample contacts for testing

INSERT INTO contacts (first_name, last_name, email, phone, company, job_title, address, city, state, postal_code, country, notes, tags) VALUES
(
  'John',
  'Doe',
  'john.doe@acmecorp.com',
  '+1-555-0101',
  'Acme Corporation',
  'Senior Sales Manager',
  '123 Business Ave',
  'San Francisco',
  'CA',
  '94105',
  'United States',
  'Key account manager for enterprise clients. Very responsive to emails.',
  ARRAY['enterprise', 'sales', 'vip']
),
(
  'Jane',
  'Smith',
  'jane.smith@techstart.io',
  '+1-555-0102',
  'TechStart Solutions',
  'Product Manager',
  '456 Startup Lane',
  'Austin',
  'TX',
  '78701',
  'United States',
  'Interested in our enterprise plan. Follow up in Q2.',
  ARRAY['saas', 'product', 'lead']
),
(
  'Michael',
  'Johnson',
  'mjohnson@globalinc.com',
  '+44-20-1234-5678',
  'Global Industries Inc',
  'VP of Operations',
  '789 International Blvd',
  'London',
  'England',
  'EC1A 1BB',
  'United Kingdom',
  'Referral from Jane Smith. Schedule demo for next week.',
  ARRAY['referral', 'enterprise', 'operations']
),
(
  'Emily',
  'Davis',
  'emily.davis@freelance.net',
  '+1-555-0103',
  'Self-Employed',
  'Marketing Consultant',
  '321 Creative St',
  'Portland',
  'OR',
  '97201',
  'United States',
  'Small business owner. Interested in starter plan.',
  ARRAY['freelance', 'marketing', 'small-business']
),
(
  'David',
  'Wilson',
  'dwilson@innovate.co',
  '+1-555-0104',
  'Innovate Labs',
  'CTO',
  '555 Tech Park Dr',
  'Seattle',
  'WA',
  '98101',
  'United States',
  'Technical decision maker. Prefers technical documentation.',
  ARRAY['technical', 'decision-maker', 'enterprise']
);
