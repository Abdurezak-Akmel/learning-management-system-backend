import { query } from '../config/db.js';

/**
 * Create a new video.
 * @param {{course_id:number,title?:string,youtube_url:string,order_index?:number,duration?:number}} video
 * @returns {Promise<object>} inserted video row
 */
export async function createVideo(video) {
	const text = `INSERT INTO Video (course_id, title, youtube_url, order_index, duration) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
	const values = [video.course_id, video.title || null, video.youtube_url, video.order_index || null, video.duration || null];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Get a video by id.
 * @param {number} video_id
 * @returns {Promise<object|null>}
 */
export async function getVideoById(video_id) {
	const text = `SELECT * FROM Video WHERE video_id = $1`;
	const res = await query(text, [video_id]);
	return res.rows[0] || null;
}

/**
 * Get videos by course id.
 * @param {number} course_id
 * @returns {Promise<Array>} array of videos
 */
export async function getVideosByCourseId(course_id) {
	const text = `SELECT * FROM Video WHERE course_id = $1 ORDER BY order_index NULLS LAST, video_id`;
	const res = await query(text, [course_id]);
	return res.rows;
}

/**
 * Get videos by exact title.
 * @param {string} title
 * @returns {Promise<Array>} array of videos
 */
export async function getVideosByTitle(title) {
	const text = `SELECT * FROM Video WHERE title = $1 ORDER BY video_id`;
	const res = await query(text, [title]);
	return res.rows;
}

/**
 * Get all videos.
 * @returns {Promise<Array>} array of videos
 */
export async function getAllVideos() {
	const text = `SELECT * FROM Video ORDER BY video_id`;
	const res = await query(text);
	return res.rows;
}

/**
 * Update a video by id. Only fields present in `updates` are changed.
 * @param {number} video_id
 * @param {object} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateVideoById(video_id, updates) {
	const set = [];
	const values = [];
	let idx = 1;
	const allowed = ['course_id', 'title', 'youtube_url', 'order_index', 'duration'];
	for (const key of allowed) {
		if (Object.prototype.hasOwnProperty.call(updates, key)) {
			set.push(`${key} = $${idx++}`);
			values.push(updates[key]);
		}
	}
	if (set.length === 0) return getVideoById(video_id);

	const text = `UPDATE Video SET ${set.join(', ')} WHERE video_id = $${idx} RETURNING *`;
	values.push(video_id);
	const res = await query(text, values);
	return res.rows[0] || null;
}

/**
 * Delete a video by id.
 * @param {number} video_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteVideoById(video_id) {
	const text = `DELETE FROM Video WHERE video_id = $1`;
	const res = await query(text, [video_id]);
	return res.rowCount > 0;
}

export default {
	createVideo,
	getVideoById,
	getVideosByCourseId,
	getVideosByTitle,
	getAllVideos,
	updateVideoById,
	deleteVideoById,
};


