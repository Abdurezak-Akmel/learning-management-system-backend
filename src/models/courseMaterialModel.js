import { query } from '../config/db.js';

/**
 * Create a new course material.
 * @param {{course_id:number,title:string,description?:string,file_name:string,file_type?:string,file_size?:number,file_url:string}} material
 * @returns {Promise<object>} inserted material row
 */
export async function createMaterial(material) {
	const text = `INSERT INTO course_material (course_id, title, description, file_name, file_type, file_size, file_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
	const values = [
		material.course_id,
		material.title,
		material.description || null,
		material.file_name,
		material.file_type || null,
		material.file_size || null,
		material.file_url,
	];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Get material by id.
 * @param {number} material_id
 * @returns {Promise<object|null>}
 */
export async function getMaterialById(material_id) {
	const text = `SELECT * FROM course_material WHERE material_id = $1`;
	const res = await query(text, [material_id]);
	return res.rows[0] || null;
}

/**
 * Get materials for a course.
 * @param {number} course_id
 * @returns {Promise<Array>} array of materials
 */
export async function getMaterialsByCourseId(course_id) {
	const text = `SELECT * FROM course_material WHERE course_id = $1 ORDER BY material_id`;
	const res = await query(text, [course_id]);
	return res.rows;
}

/**
 * Get materials by exact title.
 * @param {string} title
 * @returns {Promise<Array>} array of materials
 */
export async function getMaterialsByTitle(title) {
  const text = `SELECT * FROM course_material WHERE title = $1 ORDER BY material_id`;
  const res = await query(text, [title]);
  return res.rows;
}

/**
 * Get materials by file name.
 * @param {string} fileName
 * @returns {Promise<Array>} array of materials
 */
export async function getMaterialsByFilename(fileName) {
	const text = `SELECT * FROM course_material WHERE file_name = $1 ORDER BY material_id`;
	const res = await query(text, [fileName]);
	return res.rows;
}

/**
 * Get materials by file type.
 * @param {string} file_type
 * @returns {Promise<Array>} array of materials
 */
export async function getMaterialsByFileType(file_type) {
	const text = `SELECT * FROM course_material WHERE file_type = $1 ORDER BY material_id`;
	const res = await query(text, [file_type]);
	return res.rows;
}

/**
 * Get all materials.
 * @returns {Promise<Array>} array of materials
 */
export async function getAllMaterials() {
	const text = `SELECT * FROM course_material ORDER BY material_id`;
	const res = await query(text);
	return res.rows;
}

/**
 * Update material by id. Only provided fields will be updated.
 */
export async function updateMaterialById(material_id, updates) {
	const allowed = ['course_id', 'title', 'description', 'file_name', 'file_type', 'file_size', 'file_url', 'updated_at'];
	const set = [];
	const values = [];
	let idx = 1;
	for (const key of allowed) {
		if (Object.prototype.hasOwnProperty.call(updates, key)) {
			set.push(`${key} = $${idx++}`);
			values.push(updates[key]);
		}
	}
	if (set.length === 0) return getMaterialById(material_id);

	const text = `UPDATE course_material SET ${set.join(', ')} WHERE material_id = $${idx} RETURNING *`;
	values.push(material_id);
	const res = await query(text, values);
	return res.rows[0] || null;
}

/**
 * Delete material by id.
 * @param {number} material_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteMaterialById(material_id) {
	const text = `DELETE FROM course_material WHERE material_id = $1`;
	const res = await query(text, [material_id]);
	return res.rowCount > 0;
}

export default {
	createMaterial,
	getMaterialById,
	getMaterialsByCourseId,
	getMaterialsByTitle,
	getMaterialsByFilename,
	getMaterialsByFileType,
	getAllMaterials,
	updateMaterialById,
	deleteMaterialById,
};

