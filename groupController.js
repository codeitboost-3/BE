import { createGroup, getGroupById, updateGroupById, deleteGroupById, getGroups } from '../models/groupModel.js';

export const registerGroup = (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;
    
    if (!name || !password || !imageUrl || typeof isPublic !== 'boolean' || !introduction) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }
    
    const group = createGroup({ name, password, imageUrl, isPublic, introduction });
    return res.status(201).json(group);
};

export const getGroupsList = (req, res) => {
    const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;
    
    const groups = getGroups({ page, pageSize, sortBy, keyword, isPublic });
    
    return res.status(200).json({
        currentPage: parseInt(page),
        totalPages: Math.ceil(groups.length / pageSize),
        totalItemCount: groups.length,
        data: groups
    });
};

export const updateGroup = (req, res) => {
    const { groupId } = req.params;
    const { name, password, imageUrl, isPublic, introduction } = req.body;
    
    const group = getGroupById(groupId);
    if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
    
    if (group.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    
    const updatedGroup = updateGroupById(groupId, { name, imageUrl, isPublic, introduction });
    return res.status(200).json(updatedGroup);
};

export const deleteGroup = (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;
    
    const group = getGroupById(groupId);
    if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
    
    if (group.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    
    deleteGroupById(groupId);
    return res.status(200).json({ message: '그룹 삭제 완료' });
};

export const getGroupDetail = (req, res) => {
    const { groupId } = req.params;
    
    const group = getGroupById(groupId);
    if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
    
    return res.status(200).json(group);
};

export const verifyPassword = (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;
    
    const group = getGroupById(groupId);
    if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
    
    if (group.password === password) {
        return res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } else {
        return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
    }
};

export const likeGroup = (req, res) => {
    const { groupId } = req.params;
    
    const group = getGroupById(groupId);
    if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
    
    group.likeCount += 1;
    return res.status(200).json({ message: '그룹 공감하기 완료' });
};

export const checkGroupPublicStatus = (req, res) => {
    const { groupId } = req.params;
    
    const group = getGroupById(groupId);
    if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
    
    return res.status(200).json({ id: group.id, isPublic: group.isPublic });
};
