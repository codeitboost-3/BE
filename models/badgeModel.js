export const badges = [
    { id: 'badge_7days_memory', name: '7일 연속 추억 등록' },
    { id: 'badge_20_memories', name: '추억 수 20개 이상 등록' },
    { id: 'badge_1year_group', name: '그룹 생성 후 1년 달성' },
    { id: 'badge_10k_space', name: '그룹 공간 1만 개 이상 받기' },
    { id: 'badge_10k_likes', name: '추억 공감 1만 개 이상 받기' }
];

export const checkBadges = (group) => {
    const newBadges = [];
    const currentDate = new Date();
    const groupCreationDate = new Date(group.createdAt);

    // 7일 연속 추억 등록 체크
    const memoryDates = group.memories.map(memory => new Date(memory.moment));
    memoryDates.sort((a, b) => a - b);

    let streak = 1;
    for (let i = 1; i < memoryDates.length; i++) {
        if ((memoryDates[i] - memoryDates[i - 1]) / (1000 * 60 * 60 * 24) === 1) {
            streak += 1;
            if (streak >= 7) {
                newBadges.push(badges[0].id);
                break;
            }
        } else {
            streak = 1;
        }
    }

    // 추억 수 20개 이상 등록
    if (group.memories.length >= 20) {
        newBadges.push(badges[1].id);
    }

    // 그룹 생성 후 1년 달성
    if ((currentDate - groupCreationDate) / (1000 * 60 * 60 * 24 * 365) >= 1) {
        newBadges.push(badges[2].id);
    }

    // 그룹 공간 1만 개 이상 받기
    if (group.postCount >= 10000) {
        newBadges.push(badges[3].id);
    }

    // 추억 공감 1만 개 이상 받기
    const totalLikes = group.memories.reduce((sum, memory) => sum + memory.likeCount, 0);
    if (totalLikes >= 10000 || group.memories.some(memory => memory.likeCount >= 10000)) {
        newBadges.push(badges[4].id);
    }

    return newBadges;
};
