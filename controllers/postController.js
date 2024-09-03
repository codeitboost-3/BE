import Post from '../models/postModel.js';
import Group from '../models/groupModel.js';

export const createNewPost = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { nickname, title, content, imageUrl, tags, location, moment, isPublic, password } = req.body;

        if (!nickname || !title || !content || !password) {
            return res.status(400).json({ message: '잘못된 요청입니다' });
        }

        const newPost = new Post({
            groupId,
            nickname,
            title,
            content,
            imageUrl,
            tags,
            location,
            moment,
            isPublic,
            password
        });

        const savedPost = await newPost.save();

        await Group.findByIdAndUpdate(groupId, { $inc: { postCount: 1 } });

        return res.status(201).json(savedPost);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getPostDetail = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const updateExistingPost = async (req, res) => {
    try {
        const { postId } = req.params;
        console.log("Post ID:", postId);  // 로그 추가

        const post = await Post.findById(postId);
        console.log("Post found:", post);  // 로그 추가
        if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });

        const { nickname, title, content, imageUrl, tags, location, moment, isPublic, password } = req.body;

        if (post.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

        post.nickname = nickname || post.nickname;
        post.title = title || post.title;
        post.content = content || post.content;
        post.imageUrl = imageUrl || post.imageUrl;
        post.tags = tags || post.tags;
        post.location = location || post.location;
        post.moment = moment || post.moment;
        post.isPublic = isPublic !== undefined ? isPublic : post.isPublic;

        const updatedPost = await post.save();
        return res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error in updateExistingPost:', error);  // 로그 추가
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { password } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });

        if (post.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

        await Post.findByIdAndDelete(postId);

        await Group.findByIdAndUpdate(post.groupId, { $inc: { postCount: -1 } });

        return res.status(200).json({ message: '게시글 삭제 성공' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getGroupPosts = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

        let query = { groupId };
        if (isPublic !== undefined) {
            query.isPublic = isPublic === 'true';  // 공개 여부 필터링 추가
        }
        if (keyword) {
            query.$or = [{ title: new RegExp(keyword, 'i') }, { tags: new RegExp(keyword, 'i') }];
        }

        const totalItemCount = await Post.countDocuments(query);

        let sortCriteria;
        if (sortBy === 'mostCommented') {
            sortCriteria = { commentCount: -1 };
        } else if (sortBy === 'mostLiked') {
            sortCriteria = { likeCount: -1 };
        } else {
            sortCriteria = { createdAt: -1 };
        }

        const posts = await Post.find(query)
            .sort(sortCriteria)
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        const result = posts.map(post => ({
            id: post._id,
            nickname: post.nickname,
            title: post.title,
            imageUrl: post.imageUrl,
            tags: post.tags,
            location: post.location,
            moment: post.moment,
            isPublic: post.isPublic,
            likeCount: post.likeCount,
            commentCount: post.commentCount
        }));

        return res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalItemCount / pageSize),
            totalItemCount,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });

        post.likeCount += 1;
        await post.save();

        return res.status(200).json({ message: '게시글 공감하기 성공' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const checkPostPublicStatus = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId, 'isPublic');
        if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
        return res.status(200).json({ id: post.id, isPublic: post.isPublic });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const verifyPassword = async (req, res) => {
    try {
        const { groupId, password } = req.body;

        // 그룹 ID와 비밀번호가 요청에 포함되어 있는지 확인
        if (!groupId || !password) {
            return res.status(400).json({ message: '그룹 ID와 비밀번호를 모두 제공해야 합니다.' });
        }

        const group = await Group.findById(groupId).select('+password');
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });

        if (group.password === password) {
            return res.status(200).json({ message: '비밀번호가 확인되었습니다' });
        } else {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
        }
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};
