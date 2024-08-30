// postController.js
import {
    createPost,
    getPostById,
    updatePostById,
    deletePostById,
    getPostsByGroupId
} from '../models/postModel.js';

export const createNewPost = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { nickname, title, content, imageUrl, tags, location, moment, isPublic, password } = req.body;
        
        if (!nickname || !title || !content || !imageUrl || !tags || !location || !moment || typeof isPublic !== 'boolean' || !password) {
            return res.status(400).json({ message: '잘못된 요청입니다' });
        }

        const post = createPost(groupId, { nickname, title, content, imageUrl, tags, location, moment, isPublic, password });
        return res.status(201).json(post);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const updateExistingPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { nickname, title, content, imageUrl, tags, location, moment, isPublic, password } = req.body;

        const post = getPostById(postId);
        if (!post) return res.status(404).json({ message: '존재하지 않습니다' });
        
        if (post.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

        const updatedPost = updatePostById(postId, { nickname, title, content, imageUrl, tags, location, moment, isPublic });
        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { password } = req.body;

        const post = getPostById(postId);
        if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

        if (post.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

        deletePostById(postId);
        return res.status(200).json({ message: '게시글 삭제 성공' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getPostDetail = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = getPostById(postId);
        if (!post) return res.status(404).json({ message: '존재하지 않습니다' });
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getGroupPosts = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

        const posts = getPostsByGroupId(groupId, { page: parseInt(page), pageSize: parseInt(pageSize), sortBy, keyword, isPublic });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = getPostById(postId);
        if (!post) return res.status(404).json({ message: '존재하지 않습니다' });

        post.likeCount += 1;
        updatePostById(postId, { likeCount: post.likeCount });

        return res.status(200).json({ message: '게시글 공감하기 성공' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const checkPostPublicStatus = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = getPostById(postId);
        if (!post) return res.status(404).json({ message: '존재하지 않습니다' });
        return res.status(200).json({ id: post.id, isPublic: post.isPublic });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};
