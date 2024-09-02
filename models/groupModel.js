import mongoose from 'mongoose';
import { checkBadges } from './badgeModel.js';

// Mongoose 스키마 정의
const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    isPublic: { type: Boolean, default: true },
    introduction: { type: String },
    likeCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    badgeCount: { type: Number, default: 0 },
    badges: [{ type: String }],
    memories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    createdAt: { type: Date, default: Date.now }
});

// Mongoose 모델 생성
const Group = mongoose.model('Group', groupSchema);

// 기존의 in-memory 배열 및 함수들을 유지
const groups = [];

const getId = () => {
  return Math.floor(Math.random() * 1000000000).toString();
};

export const createGroup = (data) => {
    const group = {
        id: getId(),
        ...data,
        likeCount: 0,
        postCount: 0,
        badgeCount: 0,
        badges: [],
        memories: [],
        createdAt: new Date().toISOString()
    };
    groups.push(group);
    return group;
};

export const getGroupById = (id, includePassword = false) => {
    const group = groups.find(group => group.id === id);
    if (group && !includePassword) {
        const { password, ...groupWithoutPassword } = group;
        return groupWithoutPassword;
    }
    return group;
};

export const updateGroupById = (id, data) => {
    const index = groups.findIndex(group => group.id === id);
    if (index !== -1) {
        groups[index] = { ...groups[index], ...data };

        // 배지 확인 및 추가
        const newBadges = checkBadges(groups[index]);
        groups[index].badges = [...new Set([...groups[index].badges, ...newBadges])];

        // 배지 count 추가
        groups[index].badgeCount = groups[index].badges.length;

        return groups[index];
    }
    return null;
};

export const deleteGroupById = (id) => {
    const index = groups.findIndex(group => group.id === id);
    if (index !== -1) {
        groups.splice(index, 1);
        return true;
    }
    return false;
};

export const getGroups = ({ page, pageSize, sortBy, keyword, isPublic }) => {
  let filteredGroups = groups;

  if (keyword) {
      filteredGroups = filteredGroups.filter(group => 
          group.name.includes(keyword) || group.introduction.includes(keyword)
      );
  }

  if (typeof isPublic === 'boolean') {
      filteredGroups = filteredGroups.filter(group => group.isPublic === isPublic);
  }

  if (sortBy === 'mostPosted') {
      filteredGroups.sort((a, b) => b.postCount - a.postCount);
  } else if (sortBy === 'mostLiked') {
      filteredGroups.sort((a, b) => b.likeCount - a.likeCount);
  } else if (sortBy === 'mostBadge') {
      filteredGroups.sort((a, b) => b.badgeCount - a.badgeCount);
  } else {
      // 기본 정렬
      filteredGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const startIndex = (page - 1) * pageSize;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + pageSize);

  return paginatedGroups.map(group => {
      const { password, ...groupWithoutPassword } = group;
      return groupWithoutPassword;
  });
};

export default Group;  // Mongoose 모델도 함께 내보냄
