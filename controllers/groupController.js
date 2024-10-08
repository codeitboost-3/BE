import Group from '../models/groupModel.js';
import Post from '../models/postModel.js';

export const registGroup = async (req, res) => {
    try {
        const { name, password, imageUrl, isPublic, introduction } = req.body;

        if (!name || !password || !imageUrl || typeof isPublic !== 'boolean' || !introduction) {
            return res.status(400).json({ message: '잘못된 요청입니다.' });
        }

        const newGroup = new Group({ name, password, imageUrl, isPublic, introduction });
        const savedGroup = await newGroup.save();
        return res.status(201).json(savedGroup);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다.', error: error.message });
    }
};

export const getGroupsList = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

        let query = {};
        if (keyword) {
            query.$or = [{ name: new RegExp(keyword, 'i') }, { introduction: new RegExp(keyword, 'i') }];
        }
        if (isPublic !== undefined) {
            query.isPublic = isPublic === 'true';  // 공개 여부 필터링 추가
        }

        let sortCriteria;
        if (sortBy === 'mostPosted') {
            sortCriteria = { postCount: -1 };
        } else if (sortBy === 'mostLiked') {
            sortCriteria = { likeCount: -1 };
        } else if (sortBy === 'mostBadge') {
            sortCriteria = { badgeCount: -1 };
        } else {
            sortCriteria = { createdAt: -1 };
        }

        const groups = await Group.find(query)
            .sort(sortCriteria)
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        const totalItemCount = await Group.countDocuments(query);

        const result = groups.map(group => ({
            id: group._id,
            name: group.name,
            imageUrl: group.imageUrl,
            introduction: group.introduction,
            isPublic: group.isPublic,
            dDay: Math.floor((new Date() - new Date(group.createdAt)) / (1000 * 60 * 60 * 24)),
            badges: group.badges.length,
            postCount: group.postCount,
            likeCount: group.likeCount
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

export const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, password, imageUrl, isPublic, introduction } = req.body;

        const group = await Group.findById(groupId).select('+password');
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });

        if (group.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

        group.name = name || group.name;
        group.imageUrl = imageUrl || group.imageUrl;
        group.isPublic = isPublic !== undefined ? isPublic : group.isPublic;
        group.introduction = introduction || group.introduction;

        const updatedGroup = await group.save();
        return res.status(200).json(updatedGroup);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { password } = req.body;

        const group = await Group.findById(groupId).select('+password');
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });

        if (group.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

        await Group.findByIdAndDelete(groupId);
        return res.status(200).json({ message: '그룹 삭제 완료' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getGroupDetail = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { password } = req.body;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });

        // 비공개 그룹의 경우 비밀번호 확인
        if (!group.isPublic) {
            if (!password || group.password !== password) {
                return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
            }
        }

        const groupDetail = {
            id: group._id,
            name: group.name,
            imageUrl: group.imageUrl,
            introduction: group.introduction,
            isPublic: group.isPublic,
            dDay: Math.floor((new Date() - new Date(group.createdAt)) / (1000 * 60 * 60 * 24)),
            badges: group.badges,
            postCount: group.postCount,
            likeCount: group.likeCount,
            memories: await Post.find({ groupId: group._id }).select('title nickname isPublic likeCount commentCount')
        };

        return res.status(200).json(groupDetail);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const verifyPassword = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { password } = req.body;

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

export const likeGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });

        group.likeCount += 1;
        await group.save();

        return res.status(200).json({ message: '그룹 공감하기 완료' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const checkGroupPublicStatus = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });

        return res.status(200).json({ id: group.id, isPublic: group.isPublic });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getGroupBadges = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });

        return res.status(200).json({ badges: group.badges });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};
