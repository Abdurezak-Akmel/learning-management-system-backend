import { verifyToken } from '../utils/jwt.js';

export function authenticate(req, res, next) {
	try {
		const auth = req.headers && req.headers.authorization;
		if (!auth || !auth.startsWith('Bearer ')) {
			return res.status(401).json({ success: false, message: 'Authentication token missing' });
		}

		const token = auth.split(' ')[1];
		let payload;
		try {
			payload = verifyToken(token);
		} catch (err) {
			return res.status(401).json({ success: false, message: 'Invalid or expired token' });
		}

		req.user = payload;
		return next();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('authenticate middleware error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

export function authorizeRoles(...allowedRoleIds) {
	return (req, res, next) => {
		try {
			const userRoleId = req.user && req.user.role_id;
			if (!userRoleId) return res.status(403).json({ success: false, message: 'Access denied' });

			if (!allowedRoleIds || allowedRoleIds.length === 0) return next();

			if (allowedRoleIds.includes(userRoleId)) return next();

			return res.status(403).json({ success: false, message: 'Forbidden' });
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('authorizeRoles middleware error:', err);
			return res.status(500).json({ success: false, message: 'Internal server error' });
		}
	};
}

export default { authenticate, authorizeRoles };
