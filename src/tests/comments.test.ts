import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import postsModel from "../models/posts_model";
import userModel from "../models/user_model";
import { Express } from "express";

let app: Express;

type UserInfo = {
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
};
const userInfo: UserInfo = {
  email: "Ori@gmail.com",
  password: "123456",
};

const testPost1 = {
  owner: "Ori",
  title: "My First post",
  content: "This is my first post",
};

const testComment1 = {
  comment: "My First post",
  postId: "",
};

beforeAll(async () => {
  app = await initApp();
  await commentsModel.deleteMany();
  await postsModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo.accessToken = response.body.accessToken;
  userInfo.refreshToken = response.body.refreshToken;
  userInfo._id = response.body._id;
  const response2 = await request(app)
    .post("/posts")
    .set("authorization", "JWT " + userInfo.accessToken)
    .send(testPost1);
  const post = response2.body;
  testComment1.postId = post._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

let commentId = "";

describe("Comments Tests", () => {
  test("Comment Create test", async () => {
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + userInfo.accessToken)
      .send(testComment1);
    const comment = response.body;
    expect(response.statusCode).toBe(201);
    expect(comment.owner).toBe(userInfo._id);
    expect(comment.comment).toBe(testComment1.comment);
    expect(comment.postId).toBe(testComment1.postId);
    commentId = comment._id;
  });

  test("Comment Create test - fail no accessToken", async () => {
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT ")
      .send(testComment1);
    expect(response.statusCode).toBe(401);
  });

  test("Comment Create test - wrong accessToken", async () => {
    let toModify: string = userInfo.accessToken as string;
    let modified = toModify.slice(0, 1) + "3" + toModify.slice(2);
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + modified)
      .send(testComment1);
    expect(response.statusCode).toBe(403);
  });

  test("Comments Get All comments", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
  });

  test("get comment by owner", async () => {
    const response = await request(app).get("/comments?owner=" + userInfo._id);
    expect(response.statusCode).toBe(200);
  });

  test("Comment Create test fail", async () => {
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({ comment: "My First post" });
    expect(response.statusCode).toBe(400);
  });

  test("Comment Get By Id test", async () => {
    const response = await request(app).get("/comments/" + commentId);
    const comment = response.body;
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(comment._id);
  });

  test("Comment Get By Id test fail not in fromat id", async () => {
    const response = await request(app).get("/comments/123456");
    expect(response.statusCode).toBe(400);
  });

  test("Comment Get By Id test fail wrong id", async () => {
    let modifiedId = commentId.slice(0, 1) + "3" + commentId.slice(2);
    const response = await request(app).get("/comments/" + modifiedId);
    expect(response.statusCode).toBe(404);
  });

  test("Comment Get By Post Id test", async () => {
    const response = await request(app).get(
      "/comments?postId=" + testComment1.postId
    );
    expect(response.statusCode).toBe(200);
  });

  test("Comment Get By Post Id test fail ID is not in format", async () => {
    const response = await request(app).get("/comments?postId=123456");
    expect(response.statusCode).toBe(404);
  });

  test("Comment Get By Post Id test fail ID is in format", async () => {
    let testId = testComment1.postId;
    let modifiedId = testId.slice(0, 1) + "3" + testId.slice(2);
    const response = await request(app).get("/comments/post/" + modifiedId);
    expect(response.statusCode).toBe(404);
  });

  test("Comment Update test - Working", async () => {
    const response = await request(app)
      .put("/comments/" + commentId)
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({ comment: "My Second post" });
    const comment = response.body;
    expect(response.statusCode).toBe(200);
    expect(comment.comment).toBe("My Second post");
  });

  test("Comment Update test fail - id not in format", async () => {
    const response = await request(app)
      .put("/comments/123456")
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({ comment: "My Second post" });
    expect(response.statusCode).toBe(400);
  });

  test("Comment Update test fail - id not found", async () => {
    let modifiedId = commentId.slice(0, 1) + "3" + commentId.slice(2);
    const response = await request(app)
      .put("/comments/" + modifiedId)
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({ comment: "My Second post" });
    expect(response.statusCode).toBe(404);
  });

  test("Comment Delete test", async () => {
    const response = await request(app)
      .delete("/comments/" + commentId)
      .set("authorization", "JWT " + userInfo.accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Comment Delete test fail", async () => {
    const response = await request(app)
      .delete("/comments/123456")
      .set("authorization", "JWT " + userInfo.accessToken);
    expect(response.statusCode).toBe(400);
  });
});
