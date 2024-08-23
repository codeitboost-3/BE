const groups = []; 

const generateNumericId = () => {
  return Math.floor(Math.random() * 1000000000).toString(); 
};

export const createGroup = (data) => {
    const group = {
        id: generateNumericId(),
        ...data,
        createdAt: new Date().toISOString()
    };
    groups.push(group);
    return group;
};

export const getGroupById = (id) => {
    return groups.find(group => group.id === id);
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

export const getGroups = (params) => {
    return groups;
};
