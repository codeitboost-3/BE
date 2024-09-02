import express from 'express';
import {
    registerComment,
    getCommentsList,
    updateComment,
    deleteComment
} from '../controllers/commentController.js';

const router = express.Router();

// 댓글 등록
router.post('/', registerComment);

// 댓글 목록 조회
router.get('/', getCommentsList);

// 댓글 수정
router.put('/:commentId', updateComment);

// 댓글 삭제
router.delete('/:commentId', deleteComment);

export default router;
