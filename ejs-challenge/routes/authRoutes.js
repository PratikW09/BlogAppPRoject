const {Router} = require('express');
const router = Router();
const authController = require('../controllers/authController');
const { userprofile_get } = require('../controllers/userController');
const { requireAuth } = require('../midleware/authMiddleware');


router.get('/signup',authController.singup_get);
router.post('/signup',authController.singup_post);
router.get('/signin',authController.singin_get);
router.post('/signin',authController.singin_post);
router.get('/logout',authController.logout_get);

// features routes
router.get('/',authController.get_home);
router.get('/about',authController.get_about);
router.get('/contact',requireAuth,authController.get_contact);
router.get('/compose',requireAuth,authController.get_compose);


router.post('/compose',authController.post_compose);


// user Dashboard Routes
// router.get('/userprofile',userprofile_get)

module.exports = router;
