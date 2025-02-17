import moment from "moment";

export const generateConversationId = (currentUserId, userId) => {
    return [currentUserId, userId].sort().join("_");
}

export const timeAgo = (timestamp) => {
    if (!timestamp) return;

    let date = timestamp.toDate();
    return moment(date).fromNow();
};