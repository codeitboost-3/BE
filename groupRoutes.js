import express from 'express';
import {
    registerGroup,
    getGroupsList,
    updateGroup,
    deleteGroup,
    getGroupDetail,
    verifyPassword,
    likeGroup,
    checkGroupPublicStatus
} from '../controllers/groupController.js';

const router = express.Router();

// 그룹 등록
router.post('/', registerGroup);

// 그룹 목록 조회
router.get('/', getGroupsList);

// 그룹 수정
router.put('/:groupId', updateGroup);

// 그룹 삭제
router.delete('/:groupId', deleteGroup);

// 그룹 상세 조회
router.get('/:groupId', getGroupDetail);

// 그룹 조회 권한 확인
router.post('/:groupId/verify-password', verifyPassword);

// 그룹 공감하기
router.post('/:groupId/like', likeGroup);

// 그룹 공개 여부 확인
router.get('/:groupId/is-public', checkGroupPublicStatus);

export default router;

