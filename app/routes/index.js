const router = require('express').Router();

// authentication module APIs
router.use(require('./auth/auth'));

// user-profile APIs
router.use(require('./user/profile.routes'));

router.use('/', function (req, res, next) {
	res.statusMessage = "Route don't found";
	res.status(404).end();
});

module.exports = router;