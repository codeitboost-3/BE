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
