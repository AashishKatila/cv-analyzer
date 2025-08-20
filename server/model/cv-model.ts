import { pool } from '../db/db';

interface CvData {
  userId: number;
  filePath: string;
  originalName: string;
}

export const saveCv = async (data: CvData) => {
  const { userId, filePath, originalName } = data;
  const query = `INSERT INTO cv_submissions (user_id, file_path, original_name) VALUES ($1, $2, $3)`;
  const values = [userId, filePath, originalName];
  const results = await pool.query(query, values);
  return results.rows[0];
};
