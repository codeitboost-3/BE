import express from 'express';
import {
    createNewPost,
    updateExistingPost,
    deletePost,
    getPostDetail,
    getGroupPosts,
    verifyPassword,
    likePost,
    checkPostPublicStatus
} from '../controllers/postController.js';

const router = express.Router();

// 그룹 내 게시글 등록
router.post('/:groupId/posts', createNewPost);

// 특정 게시글 상세 조회
router.get('/:postId', getPostDetail);

// 특정 게시글 수정
router.put('/:postId', updateExistingPost);

// 특정 게시글 삭제
router.delete('/:postId', deletePost);

// 그룹 내 게시글 목록 조회
router.get('/:groupId/posts', getGroupPosts);

// 게시글 조회 권한 확인
router.post('/:postId/verify-password', verifyPassword);

// 특정 게시글 공감 추가
router.post('/:postId/like', likePost);

// 특정 게시글 공개 여부 확인
router.get('/:postId/is-public', checkPostPublicStatus);

export default router;
