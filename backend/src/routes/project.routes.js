const exporess = require('express');
const router = exporess.Router();
const protect = require('../middlewares/auth.middleware');
const projectController = require('../controllers/project.controller');

router.post('/', protect, projectController.createProject);
router.get('/', protect, projectController.getProjects);
router.post('/add-member', protect, projectController.addMember);
module.exports = router;