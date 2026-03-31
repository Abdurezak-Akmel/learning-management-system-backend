import { query } from '../config/db.js';

/**
 * Create a new landing video.
 * @param {{title?:string, description?:string, youtube_url:string, order_index?:number, duration?:number}} video
 * @returns {Promise<object>} inserted landing video row
 */
export async function createLandingVideo(video) {
  const text = `INSERT INTO landing_videos (title, description, youtube_url, order_index, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [
    video.title || null,
    video.description || null,
    video.youtube_url,
    video.order_index || 0,
    video.duration || null,
  ];
  const res = await query(text, values);
  return res.rows[0];
}

/**
 * Get a landing video by id.
 * @param {number} land_video_id
 * @returns {Promise<object|null>}
 */
export async function getLandingVideoById(land_video_id) {
  const text = `SELECT * FROM landing_videos WHERE land_video_id = $1`;
  const res = await query(text, [land_video_id]);
  return res.rows[0] || null;
}

/**
 * Get all landing videos.
 * @returns {Promise<Array>} array of landing videos
 */
export async function getAllLandingVideos() {
  const text = `SELECT * FROM landing_videos ORDER BY order_index ASC, land_video_id ASC`;
  const res = await query(text);
  return res.rows;
}

/**
 * Update a landing video by id.
 * @param {number} land_video_id
 * @param {object} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateLandingVideoById(land_video_id, updates) {
  const set = [];
  const values = [];
  let idx = 1;
  const allowed = ['title', 'description', 'youtube_url', 'order_index', 'duration'];

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      set.push(`${key} = $${idx++}`);
      values.push(updates[key]);
    }
  }

  if (set.length === 0) return getLandingVideoById(land_video_id);

  const text = `UPDATE landing_videos SET ${set.join(', ')} WHERE land_video_id = $${idx} RETURNING *`;
  values.push(land_video_id);
  const res = await query(text, values);
  return res.rows[0] || null;
}

/**
 * Delete a landing video by id.
 * @param {number} land_video_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteLandingVideoById(land_video_id) {
  const text = `DELETE FROM landing_videos WHERE land_video_id = $1`;
  const res = await query(text, [land_video_id]);
  return res.rowCount > 0;
}

export default {
  createLandingVideo,
  getLandingVideoById,
  getAllLandingVideos,
  updateLandingVideoById,
  deleteLandingVideoById,
};
