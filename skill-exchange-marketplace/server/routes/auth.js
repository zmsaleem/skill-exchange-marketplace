import { forgotPassword, resetPassword } from '../controllers/authController.js'

router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)