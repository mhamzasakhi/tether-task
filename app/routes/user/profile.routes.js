const { SUPER_ADMIN_ROLE } = require('../../../config/roles');
const profileController = require('../../controllers/user/profile');
const { permission } = require('../../middleware/permission');
const router = require('express').Router();

router.get('/profile/short', permission('*'), profileController.getProfileShort);

router.get('/profile/personal-info', permission('*'), profileController.getProfileFull);

router.post('/profile/personal-info/update', permission('*'), profileController.createUpdateProfile);

router.post(
	'/profile/notifications', 
	permission('*'),
	profileController.getPrivateNotifications
);

router.get(
	'/profile/notifications/:id', 
	permission('*'),
	profileController.getSingleNotifications
);

router.get(
	'/profile/new-notifications', 
	permission('*'),
	profileController.countNewNotifications
);

router.post(
	'/profile/notification/action', 
	permission('*'),
	profileController.notificationAction
);

router.delete(
	'/profile/hard-delete-user/:userId',
	permission('*'),
	profileController.hardDeleteUser
);

module.exports = router;