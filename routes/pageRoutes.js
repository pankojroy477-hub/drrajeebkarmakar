import express from 'express';
import {
  renderAbout,
  renderExpertise,
  renderChambers,
  renderPublications,
  renderContact,
  renderPrivacy
} from '../controllers/pageController.js';

const router = express.Router();

router.get('/about', renderAbout);
router.get('/expertise', renderExpertise);
router.get('/chambers', renderChambers);
router.get('/publications', renderPublications);
router.get('/contact', renderContact);
router.get('/privacy', renderPrivacy);

export default router;
