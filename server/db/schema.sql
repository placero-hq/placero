-- PlaceRo job database schema
-- Run via: npm run migrate  (see scripts/migrate.js)

CREATE TABLE IF NOT EXISTS admins (
  id             SERIAL PRIMARY KEY,
  username       TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id                SERIAL PRIMARY KEY,
  company           TEXT NOT NULL,
  company_logo      TEXT,
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  location          TEXT,
  work_mode         TEXT,
  experience        TEXT,
  salary            TEXT,
  job_type          TEXT,
  category          TEXT,
  skills            TEXT[] NOT NULL DEFAULT '{}',
  description       TEXT,
  responsibilities  TEXT[] NOT NULL DEFAULT '{}',
  requirements      TEXT[] NOT NULL DEFAULT '{}',
  eligibility       TEXT[] NOT NULL DEFAULT '{}',
  benefits          TEXT[] NOT NULL DEFAULT '{}',
  application_url   TEXT,
  source_url        TEXT,
  posted_at         DATE,
  deadline          DATE,
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'expired', 'archived')),
  featured          BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_slug ON jobs (slug);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs (posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs (featured);

-- Keep updated_at current automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_jobs_updated_at ON jobs;
CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_admins_updated_at ON admins;
CREATE TRIGGER trg_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
