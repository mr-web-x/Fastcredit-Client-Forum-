import "server-only";
import serverApiClient from "../base/ServerApiClient";
import authService from "./auth.server";
import adminService from "./admin.server";
import answersService from "./answers.server";
import categoriesService from "./categories.server";
import commentsService from "./comments.server";
import questionsService from "./questions.server";
import reportsService from "./reports.server";
import usersService from "./users.server";

export {
  serverApiClient,
  authService,
  adminService,
  answersService,
  categoriesService,
  commentsService,
  questionsService,
  reportsService,
  usersService,
};
