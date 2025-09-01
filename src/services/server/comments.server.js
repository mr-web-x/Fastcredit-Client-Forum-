import "server-only";

import serverApiClient from "../base/ServerApiClient";

class CommentsServiceServer {
  constructor() {
    this.client = serverApiClient;
  }

  // === SERVER-SIDE ===

  async getCommentsForQuestion(questionId, includeUnapproved = false) {
    try {
      const qp = new URLSearchParams();
      if (includeUnapproved) qp.set("includeUnapproved", "true");
      const url = `/comments/question/${questionId}${
        qp.toString() ? `?${qp.toString()}` : ""
      }`;
      return await this.client.get(url);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[CommentsServiceServer.getCommentsForQuestion]",
          e.message
        );
      }
      return [];
    }
  }

  async getCommentReplies(commentId) {
    return this.client.get(`/comments/${commentId}/replies`);
  }

  async createComment(questionId, commentData) {
    return this.client.post(`/comments/question/${questionId}`, commentData);
  }

  async createReply(questionId, parentCommentId, content) {
    return this.client.post(`/comments/question/${questionId}`, {
      content,
      parentComment: parentCommentId,
    });
  }

  async updateComment(commentId, updateData) {
    return this.client.put(`/comments/${commentId}`, updateData);
  }

  async likeComment(commentId) {
    return this.client.post(`/comments/${commentId}/like`);
  }

  async deleteComment(commentId) {
    return this.client.delete(`/comments/${commentId}`);
  }

  async getPopularComments(limit = 10) {
    try {
      return await this.client.get(`/comments/popular?limit=${limit}`);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[CommentsServiceServer.getPopularComments]", e.message);
      }
      return [];
    }
  }

  async searchComments(params = {}) {
    const { q, page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      q: q || "",
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/comments/search?${qp.toString()}`);
  }

  async getUserComments(userId, params = {}) {
    const { page = 1, limit = 10 } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return this.client.get(`/comments/user/${userId}?${qp.toString()}`);
  }

  // === ADMIN ===

  async moderateComment(commentId, moderationData) {
    return this.client.post(`/comments/${commentId}/moderate`, moderationData);
  }

  async getPendingComments(params = {}) {
    const { page = 1, limit = 10, status = "pending" } = params;
    const qp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) qp.set("status", status);
    return this.client.get(`/comments/pending?${qp.toString()}`);
  }

  async bulkModerateComments(commentIds, action, reason) {
    return this.client.post("/comments/bulk-moderate", {
      commentIds,
      action,
      reason,
    });
  }

  // === УТИЛИТЫ (те же, что и в клиенте) ===

  buildCommentsTree(comments) {
    if (!Array.isArray(comments)) return [];
    const map = new Map();
    const roots = [];
    comments.forEach((c) => map.set(c._id, { ...c, replies: [] }));
    comments.forEach((c) => {
      const node = map.get(c._id);
      if (c.parentComment) {
        const parent = map.get(c.parentComment);
        if (parent) parent.replies.push(node);
      } else {
        roots.push(node);
      }
    });
    const sortByDate = (arr) =>
      arr
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((c) => ({ ...c, replies: sortByDate(c.replies) }));
    return sortByDate(roots);
  }

  canUserComment(user) {
    if (!user) return false;
    return user.isActive && !user.isBanned;
  }

  canUserEditComment(user, comment) {
    if (!user || !comment) return false;
    const ageMs = Date.now() - new Date(comment.createdAt).getTime();
    const isRecent = ageMs < 15 * 60 * 1000;
    const isAuthor = user._id === (comment.author?._id ?? comment.author);
    const isAdmin = user.role === "admin";
    return isAdmin || (isAuthor && isRecent);
  }

  canUserDeleteComment(user, comment) {
    if (!user || !comment) return false;
    const isAuthor = user._id === (comment.author?._id ?? comment.author);
    const isAdmin = user.role === "admin";
    const isModerator = user.role === "moderator";
    return isAuthor || isAdmin || isModerator;
  }

  getCommentDepth(comment, allComments) {
    if (!comment.parentComment) return 0;
    const parent = allComments.find((c) => c._id === comment.parentComment);
    if (!parent) return 0;
    return 1 + this.getCommentDepth(parent, allComments);
  }

  formatCommentTime(createdAt) {
    const now = new Date();
    const d = new Date(createdAt);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "práve teraz";
    if (diff < 3600) return `pred ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `pred ${Math.floor(diff / 3600)} hod`;
    return d.toLocaleDateString("sk-SK");
  }
}

export default new CommentsServiceServer();
