const getDurationInDays = (duration: string): number => {
    const dayMatches = duration.match(/(\d+)\s*days?/i);
    const weekMatches = duration.match(/(\d+)\s*weeks?/i);
    const monthMatches = duration.match(/(\d+)\s*months?/i);
    const yearMatches = duration.match(/(\d+)\s*years?/i);

    if (dayMatches) return parseInt(dayMatches[1], 10);
    if (weekMatches) return parseInt(weekMatches[1], 10) * 7;
    if (monthMatches) return parseInt(monthMatches[1], 10) * 30;
    if (yearMatches) return parseInt(yearMatches[1], 10) * 365;

    return 0;
};

export const calculateExpiryDate = (duration: string): Date => {
    const durationInDays = getDurationInDays(duration);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationInDays);
    // return expiryDate.toISOString();
    return expiryDate
};
