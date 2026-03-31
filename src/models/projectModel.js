import { query } from '../config/db.js';

/**
 * Create a new project.
 * @param {{title:string,description?:string,category?:string,level?:string}} project
 * @returns {Promise<object>} inserted project row
 */
export async function createProject(project) {
    const text = `INSERT INTO projects (title, description, category, level) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [
        project.title,
        project.description || null,
        project.category || null,
        project.level || null,
    ];
    const res = await query(text, values);
    return res.rows[0];
}

/**
 * Get a project by id.
 * @param {number} project_id
 * @returns {Promise<object|null>}
 */
export async function getProjectById(project_id) {
    const text = `SELECT * FROM projects WHERE project_id = $1`;
    const res = await query(text, [project_id]);
    return res.rows[0] || null;
}

/**
 * Get all projects.
 * @returns {Promise<Array>} array of projects
 */
export async function getAllProjects() {
    const text = `SELECT * FROM projects ORDER BY project_id`;
    const res = await query(text);
    return res.rows;
}

/**
 * Get projects by category.
 * @param {string} category
 * @returns {Promise<Array>} array of projects
 */
export async function getProjectsByCategory(category) {
    const text = `SELECT * FROM projects WHERE category = $1 ORDER BY project_id`;
    const res = await query(text, [category]);
    return res.rows;
}

/**
 * Get projects by level.
 * @param {string} level
 * @returns {Promise<Array>} array of projects
 */
export async function getProjectsByLevel(level) {
    const text = `SELECT * FROM projects WHERE level = $1 ORDER BY project_id`;
    const res = await query(text, [level]);
    return res.rows;
}

/**
 * Update a project by id. Only fields present in `updates` are changed.
 * @param {number} project_id
 * @param {object} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateProjectById(project_id, updates) {
    const set = [];
    const values = [];
    let idx = 1;
    const allowed = ['title', 'description', 'category', 'level'];

    for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
            set.push(`${key} = $${idx++}`);
            values.push(updates[key]);
        }
    }

    if (set.length === 0) return getProjectById(project_id);

    const text = `UPDATE projects SET ${set.join(', ')} WHERE project_id = $${idx} RETURNING *`;
    values.push(project_id);
    const res = await query(text, values);
    return res.rows[0] || null;
}

/**
 * Delete a project by id.
 * @param {number} project_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteProjectById(project_id) {
    const text = `DELETE FROM projects WHERE project_id = $1`;
    const res = await query(text, [project_id]);
    return res.rowCount > 0;
}

export default {
    createProject,
    getProjectById,
    getAllProjects,
    getProjectsByCategory,
    getProjectsByLevel,
    updateProjectById,
    deleteProjectById,
};
