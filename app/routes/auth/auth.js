const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth');
const { permission } = require('../../middleware/permission');

router.post('/auth/login', authController.authLogin);

router.post('/auth/logout', permission('*'), authController.authLogOut);

router.post('/auth/refresh', permission('*'), authController.authRefresh);

router.post('/auth/sign-up', authController.singUp);

// router.post('/auth/resend-activation-link', authController.resendActivationLink);

router.post('/auth/request-password-reset', authController.requestPasswordReset);

router.post('/auth/password-reset/:token', authController.passwordResetByToken);

router.post('/auth/change-password', permission('*'), authController.changePassword);

module.exports = router;