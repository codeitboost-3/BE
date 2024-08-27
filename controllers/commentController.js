import { createComment, getComments, getCommentById, updateCommentById, deleteCommentById } from '../models/commentModel.js';

export const registerComment = (req, res) => {
    const { nickname, content, password } = req.body;
    
    if (!nickname || !content || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }
    
    const comment = createComment({ nickname, content, password });
    return res.status(201).json(comment);
};

export const getCommentsList = (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    
    const comments = getComments({ page, pageSize });
    
    return res.status(200).json({
        currentPage: parseInt(page),
        totalPages: Math.ceil(comments.length / pageSize),
        totalItemCount: comments.length,
        data: comments
    });
};

export const updateComment = (req, res) => {
    const { commentId } = req.params;
    const { nickname, content, password } = req.body;
    
    const comment = getCommentById(commentId);
    if (!comment) return res.status(404).json({ message: '존재하지 않습니다' });
    
    if (comment.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    
    const updatedComment = updateCommentById(commentId, { nickname, content });
    return res.status(200).json(updatedComment);
};

export const deleteComment = (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;
    
    const comment = getCommentById(commentId);
    if (!comment) return res.status(404).json({ message: '존재하지 않습니다' });
    
    if (comment.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    
    deleteCommentById(commentId);
    return res.status(200).json({ message: '댓글 삭제 완료' });
};
