import express from 'express';
import {
    createNewPost,
    updateExistingPost,
    deletePost,
    getPostDetail,
    getGroupPosts,
    likePost,
    checkPostPublicStatus
} from '../controllers/postController.js';

const router = express.Router();

// 게시글 등록
router.post('/:groupId/posts', createNewPost);

// 게시글 수정
router.put('/posts/:postId', updateExistingPost);

// 게시글 삭제
router.delete('/posts/:postId', deletePost);

// 게시글 목록 조회
router.get('/:groupId/posts', getGroupPosts);

// 게시글 상세 조회
router.get('/posts/:postId', getPostDetail);

// 게시글 공감하기
router.post('/posts/:postId/like', likePost);

// 게시글 공개 여부 확인
router.get('/posts/:postId/is-public', checkPostPublicStatus);

export default router;
