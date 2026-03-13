// Admin middleware: ensures the authenticated user has admin privileges.
// By default this checks for `role_id === 1`, but the admin role id
// can be overridden with the `ADMIN_ROLE_ID` env var.
export function requireAdmin(req, res, next) {
	try {
		const user = req.user;
		if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });

		const adminRoleId = process.env.ADMIN_ROLE_ID ? Number(process.env.ADMIN_ROLE_ID) : 1;
		if (typeof user.role_id === 'undefined' || user.role_id === null) {
			return res.status(403).json({ success: false, message: 'Admin access required' });
		}

		if (Number(user.role_id) !== adminRoleId) {
			return res.status(403).json({ success: false, message: 'Admin access required' });
		}

		return next();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('requireAdmin middleware error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

export default { requireAdmin };
