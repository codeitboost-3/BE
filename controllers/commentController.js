import Comment from '../models/commentModel.js';

export const registerComment = async (req, res) => {
    try {
        const { nickname, content, password } = req.body;
    
        if (!nickname || !content || !password) {
            return res.status(400).json({ message: '잘못된 요청입니다' });
        }
    
        const newComment = new Comment({ nickname, content, password });
        const savedComment = await newComment.save();
        return res.status(201).json(savedComment);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getCommentsList = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const comments = await Comment.find()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));
        
        const totalItemCount = await Comment.countDocuments();
        return res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalItemCount / pageSize),
            totalItemCount,
            data: comments
        });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { nickname, content, password } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: '존재하지 않습니다' });

        if (comment.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

        comment.nickname = nickname || comment.nickname;
        comment.content = content || comment.content;
        const updatedComment = await comment.save();

        return res.status(200).json(updatedComment);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { password } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: '존재하지 않습니다' });

        if (comment.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

        await Comment.findByIdAndDelete(commentId);
        return res.status(200).json({ message: '댓글 삭제 완료' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};
