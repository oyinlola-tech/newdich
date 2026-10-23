import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('[db] DATABASE_URL is not set')
  pool = mysql.createPool(url)
  return pool
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await getPool().query(sql, params ?? [])
  return rows as T[]
}

const MIGRATIONS: Array<{ name: string; up: string }> = [
  {
    name: '001_initial_schema',
    up: `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        role ENUM('superadmin','admin') NOT NULL DEFAULT 'admin',
        is_active TINYINT(1) DEFAULT 1,
        reset_token VARCHAR(255),
        reset_token_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS applications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tracking_number VARCHAR(60) UNIQUE NOT NULL,
        application_type ENUM('standard','siwes') NOT NULL,
        status ENUM('pending','approved','rejected','enrolled') NOT NULL DEFAULT 'pending',
        payment_status ENUM('unpaid','partial','paid') NOT NULL DEFAULT 'unpaid',

        surname VARCHAR(100), first_name VARCHAR(100), middle_name VARCHAR(100),
        date_of_birth DATE, gender ENUM('Male','Female'),
        marital_status ENUM('Single','Married','Other'), nationality VARCHAR(100),
        state_of_origin VARCHAR(100), lga VARCHAR(100), residential_address TEXT,
        city_state_residence VARCHAR(200), primary_phone VARCHAR(50),
        whatsapp_phone VARCHAR(50), email VARCHAR(255),
        id_type ENUM('NIN',"Voter's Card","Int'l Passport",'Driver\'s License'),
        id_number VARCHAR(100),

        next_of_kin_name VARCHAR(200),
        next_of_kin_relationship ENUM('Parent','Spouse','Sibling','Sponsor / Other'),
        next_of_kin_phone VARCHAR(50), next_of_kin_whatsapp_email VARCHAR(255),
        next_of_kin_address TEXT,

        highest_qualification ENUM('SSCE / O-Level','OND / NCE','HND / B.Sc / B.Tech','M.Sc / Post-Grad','Other'),
        institution_attended VARCHAR(200), course_of_study VARCHAR(200),
        year_of_graduation YEAR,
        current_status ENUM('Student','Employed','Self-Employed','NYSC Corps Member','Seeking Opportunities'),
        employer_school VARCHAR(200), current_role VARCHAR(200),

        experience_level ENUM('Absolute Beginner','Basic Computer Literacy','Intermediate','Advanced'),
        owns_laptop TINYINT(1), laptop_specs TEXT,
        track ENUM('Full-Stack Software Engineering','Frontend Application Development','Backend Architecture & Cloud Engineering','Mobile Application Engineering','Artificial Intelligence & Data Systems'),
        study_mode ENUM('On-Campus','Virtual','Hybrid'),
        class_schedule ENUM('Weekday Morning Batch','Weekday Evening Batch','Weekend Batch'),
        heard_from ENUM('Social Media','Friend / Alumni Referral','Google Search / Institute Website','Event / Tech Workshop','Other'),
        heard_from_other VARCHAR(200),

        siwes_institution VARCHAR(200), siwes_department VARCHAR(100),
        siwes_matric_number VARCHAR(50), siwes_level ENUM('200L','300L'),
        siwes_start_date DATE, siwes_end_date DATE, siwes_itf_reference VARCHAR(100),
        siwes_supervisor_name VARCHAR(200), siwes_supervisor_phone VARCHAR(50),
        siwes_supervisor_email VARCHAR(255), siwes_letter_url VARCHAR(500),

        payment_plan ENUM('Outright / Single Payment','Standard Installmental','Corporate Sponsorship / Scholarship'),
        sponsor_name VARCHAR(200), payment_channel ENUM('Direct Bank Transfer','Online Payment Portal / Card','Cheque / POS at Office'),
        amount_paid DECIMAL(12,2),

        terms_accepted TINYINT(1), trainee_signature_url VARCHAR(500),
        sponsor_signature_url VARCHAR(500), signed_date DATE,

        verified_by VARCHAR(200), admission_status ENUM('Approved / Admitted','Pending Review'),
        assigned_batch VARCHAR(100), passport_url VARCHAR(500),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(200) NOT NULL, email VARCHAR(255) NOT NULL,
        phone VARCHAR(50), message TEXT NOT NULL,
        student_ref VARCHAR(60), read_flag TINYINT(1) DEFAULT 0,
        replied TINYINT(1) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `,
  },
  {
    name: '002_session_columns',
    up: `
      ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS session_expires DATETIME;
    `,
  },
]

let migrated = false
export async function ensureMigrated(): Promise<void> {
  if (migrated) return
  migrated = true
  const pool = getPool()
  for (const m of MIGRATIONS) {
    await pool.query(m.up)
  }
  await seedSuperadmin()
}

async function seedSuperadmin(): Promise<void> {
  const existing = await query<{ c: number }>('SELECT COUNT(*) AS c FROM users')
  if ((existing[0]?.c ?? 0) > 0) return
  await query(
    `INSERT INTO users (email, password_hash, role, is_active) VALUES (?, ?, 'superadmin', 1)`,
    [process.env.SUPERADMIN_EMAIL ?? 'superadmin@newdich.tech', '']
  )
}

export async function createSession(userId: number, ttlMs: number): Promise<string> {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + ttlMs).toISOString().slice(0, 19).replace('T', ' ')
  await query(
    `INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)`,
    [userId, token, expiresAt]
  )
  await query(
    `UPDATE users SET session_token = ?, session_expires = ? WHERE id = ?`,
    [token, expiresAt, userId]
  )
  return token
}

export async function validateSession(token: string): Promise<{ id: number; email: string; role: string } | null> {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const rows = await query<{ id: number; email: string; role: string }>(
    `SELECT u.id, u.email, u.role FROM users u
     JOIN sessions s ON s.user_id = u.id
     WHERE s.token = ? AND s.expires_at > ? AND u.is_active = 1`,
    [token, now]
  )
  return rows[0] ?? null
}

export async function destroySession(token: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE token = ?`, [token])
  await query(`UPDATE users SET session_token = NULL, session_expires = NULL WHERE session_token = ?`, [token])
}
