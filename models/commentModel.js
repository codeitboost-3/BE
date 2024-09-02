import mongoose from 'mongoose';

// Mongoose 스키마 정의
const commentSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    content: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Mongoose 모델 생성
const Comment = mongoose.model('Comment', commentSchema);

// 기존의 in-memory 배열 및 함수들을 유지
const comments = [];

const generateNumericId = () => {
  return Math.floor(Math.random() * 1000000000).toString(); 
};

export const createComment = (data) => {
    const comment = {
        id: generateNumericId(),
        ...data,
        createdAt: new Date().toISOString()
    };
    comments.push(comment);
    return comment;
};

export const getCommentById = (id) => {
    return comments.find(comment => comment.id === id);
};

export const updateCommentById = (id, data) => {
    const index = comments.findIndex(comment => comment.id === id);
    if (index !== -1) {
        comments[index] = { ...comments[index], ...data };
        return comments[index];
    }
    return null;
};

export const deleteCommentById = (id) => {
    const index = comments.findIndex(comment => comment.id === id);
    if (index !== -1) {
        comments.splice(index, 1);
        return true;
    }
    return false;
};

export const getComments = ({ page, pageSize }) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return comments.slice(start, end);
};

export default Comment;  // Mongoose 모델도 함께 내보냄
