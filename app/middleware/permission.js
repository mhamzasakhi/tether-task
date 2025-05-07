const UnauthorizedError = require('../errors/UnauthorizedError');
const { USER_STATUSES } = require('../helpers/constants');

exports.permission = function (...allowed) {
	const isAllowed = (role) => allowed.indexOf(role) > -1;
	const forAll = allowed.indexOf('*') > -1;

	return (request, response, next) => {
		if (request.user && forAll) {
			next();
		} else if (!request.user || !isAllowed(request.user.role)) {
			throw new UnauthorizedError('permission_denied', {
				message: 'Permission denied',
			});
		} else if (request.user.status === USER_STATUSES.DEACTIVATED) {
			throw new UnauthorizedError('user_deactivated', {
				message: 'Your account was deactivated by administration',
			});
		} else if (request.user.status === USER_STATUSES.DELETED) {
			throw new UnauthorizedError('user_deleted', {
				message: 'Your account has been deleted, contact with administration',
			});
		} else if (request.user && isAllowed(request.user.role)) {
			next();
		}
	};
};

exports.isAdmin = (user) => user.role === 'super_admin';