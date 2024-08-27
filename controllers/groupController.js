import { createGroup, getGroupById, updateGroupById, deleteGroupById, getGroups } from '../models/groupModel.js';

export const registGroup = async (req, res) => {
    try {
        const { name, password, imageUrl, isPublic, introduction } = req.body;
        
        if (!name || !password || !imageUrl || typeof isPublic !== 'boolean' || !introduction) {
            return res.status(400).json({ message: '잘못된 요청입니다' });
        }
        
        const group = await createGroup({ name, password, imageUrl, isPublic, introduction });
        return res.status(201).json(group);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getGroupsList = async (req, res) => {
  try {
      const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

      const groups = await getGroups({ page, pageSize, sortBy, keyword, isPublic });

      const totalItemCount = groups.length;
      const totalPages = Math.ceil(totalItemCount / pageSize);

      return res.status(200).json({
          currentPage: parseInt(page),
          totalPages,
          totalItemCount,
          data: groups
      });
  } catch (error) {
      return res.status(500).json({ message: '서버 오류입니다', error: error.message });
  }
};



export const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, password, imageUrl, isPublic, introduction } = req.body;
        
        const group = await getGroupById(groupId, true);
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
        
        if (group.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        
        const updatedGroup = await updateGroupById(groupId, { name, imageUrl, isPublic, introduction });
        return res.status(200).json(updatedGroup);
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { password } = req.body;
        
        const group = await getGroupById(groupId, true);
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
        
        if (group.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        
        await deleteGroupById(groupId);
        return res.status(200).json({ message: '그룹 삭제 완료' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const getGroupDetail = async (req, res) => {
  try {
      const { groupId } = req.params;
      
      const group = await getGroupById(groupId);
      if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
      
      return res.status(200).json({
          ...group,
          memories: group.memories 
      });
  } catch (error) {
      return res.status(500).json({ message: '서버 오류입니다', error: error.message });
  }
};
export const verifyPassword = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { password } = req.body;
        
        const group = await getGroupById(groupId, true);
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
        
        const group = await getGroupById(groupId);
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
        
        group.likeCount += 1;
        await updateGroupById(groupId, { likeCount: group.likeCount });
        
        return res.status(200).json({ message: '그룹 공감하기 완료' });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};

export const checkGroupPublicStatus = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const group = await getGroupById(groupId, true);
        if (!group) return res.status(404).json({ message: '존재하지 않습니다' });
        
        return res.status(200).json({ id: group.id, isPublic: group.isPublic });
    } catch (error) {
        return res.status(500).json({ message: '서버 오류입니다', error: error.message });
    }
};
