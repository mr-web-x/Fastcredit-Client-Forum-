"use client";

// Экспорт только того, что безопасно для браузера
export { default as apiClient } from "../base/ApiClient";

// Клиентские сервисы (используют apiClient)
export { default as authService } from "./auth.client";
export { default as adminService } from "./admin.client";
export { default as answersService } from "./answers.client";
export { default as categoriesService } from "./categories.client";
export { default as commentsService } from "./comments.client";
export { default as questionsService } from "./questions.client";
export { default as reportsService } from "./reports.client";
export { default as usersService } from "./users.client";
