import mongoose from 'mongoose';
import { getGroupById, updateGroupById } from './groupModel.js';

// Mongoose 스키마 정의
const postSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    nickname: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    tags: [{ type: String }],
    location: { type: String },
    moment: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: true },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Mongoose 모델 생성
const Post = mongoose.model('Post', postSchema);

// 기존의 in-memory 배열 및 함수들을 유지
let posts = [];
let postIdCounter = 1;

export const createPost = (groupId, data) => {
    const post = {
        id: postIdCounter++,
        groupId,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        ...data
    };
    posts.push(post);

    // 그룹 postCount 추가 
    const group = getGroupById(groupId);
    if (group) {
        updateGroupById(groupId, { postCount: group.postCount + 1 });
    }
    
    return post;
};

export const getPostById = (postId) => {
    return posts.find(post => post.id === parseInt(postId));
};

export const updatePostById = (postId, data) => {
    const index = posts.findIndex(post => post.id === parseInt(postId));
    if (index !== -1) {
        posts[index] = { ...posts[index], ...data };
        return posts[index];
    }
    return null;
};

export const deletePostById = (postId) => {
    const index = posts.findIndex(post => post.id === parseInt(postId));
    if (index !== -1) {
        const post = posts[index];
        posts.splice(index, 1);

        // 그룹 postCount 감소
        const group = getGroupById(post.groupId);
        if (group) {
            updateGroupById(post.groupId, { postCount: group.postCount - 1 });
        }

        return true;
    }
    return false;
};

export const getPostsByGroupId = (groupId, { isPublic, keyword, sortBy, page, pageSize }) => {
    let filteredPosts = posts.filter(post => post.groupId === parseInt(groupId));
    
    if (isPublic !== undefined) {
        filteredPosts = filteredPosts.filter(post => post.isPublic === isPublic);
    }

    if (keyword) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.includes(keyword) || post.tags.some(tag => tag.includes(keyword))
        );
    }

    if (sortBy === 'mostCommented') {
        filteredPosts.sort((a, b) => b.commentCount - a.commentCount);
    } else if (sortBy === 'mostLiked') {
        filteredPosts.sort((a, b) => b.likeCount - a.likeCount);
    } else {
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const startIndex = (page - 1) * pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

    return {
        currentPage: page,
        totalPages: Math.ceil(filteredPosts.length / pageSize),
        totalItemCount: filteredPosts.length,
        data: paginatedPosts
    };
};

export default Post;  // Mongoose 모델도 함께 내보냄
