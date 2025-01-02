"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExpiryDate = void 0;
const getDurationInDays = (duration) => {
    const dayMatches = duration.match(/(\d+)\s*days?/i);
    const weekMatches = duration.match(/(\d+)\s*weeks?/i);
    const monthMatches = duration.match(/(\d+)\s*months?/i);
    const yearMatches = duration.match(/(\d+)\s*years?/i);
    if (dayMatches)
        return parseInt(dayMatches[1], 10);
    if (weekMatches)
        return parseInt(weekMatches[1], 10) * 7;
    if (monthMatches)
        return parseInt(monthMatches[1], 10) * 30;
    if (yearMatches)
        return parseInt(yearMatches[1], 10) * 365;
    return 0;
};
const calculateExpiryDate = (duration) => {
    const durationInDays = getDurationInDays(duration);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationInDays);
    // return expiryDate.toISOString();
    return expiryDate;
};
exports.calculateExpiryDate = calculateExpiryDate;
