import express from 'express';
import { getGroupBadges } from '../controllers/groupController.js';

const router = express.Router();

// 그룹 배지 조회--
router.get('/:groupId/badges', getGroupBadges);

export default router;
