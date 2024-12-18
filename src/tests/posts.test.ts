import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postsModel from "../models/posts_model";
import { Express } from "express";
import userModel from "../models/user_model";

let app: Express;

type UserInfo = {
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
};
const userInfo: UserInfo = {
  email: "eliav@gmail.com",
  password: "123456",
};

beforeAll(async () => {
  app = await initApp();
  await postsModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo.accessToken = response.body.accessToken;
  userInfo.refreshToken = response.body.refreshToken;
  userInfo._id = response.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

var postId = "";

const testPost1 = {
  owner: "Eliav",
  title: "My First post",
  content: "This is my first post",
};

const testPost2 = {
  owner: "Eliav2",
  title: "My First post 2",
  content: "This is my first post 2",
};

const testPostFail = {
  content: "This is my first post 2",
  owner: "Eliav2",
};

describe("Posts Tests", () => {
  test("Posts Create test", async () => {
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.accessToken)
      .send(testPost1);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.owner).toBe(userInfo._id);
    expect(post.title).toBe(testPost1.title);
    expect(post.content).toBe(testPost1.content);
    postId = post._id;
  });

  test("Posts Get All test", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
  });

  test("Posts Create test - wrong accessToken", async () => {
    let toModify: string = userInfo.accessToken as string;
    let modified = toModify.slice(0, 1) + "3" + toModify.slice(2);
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + modified)
      .send(testPost1);
    expect(response.statusCode).toBe(403);
  });

  test("Posts Create test fail", async () => {
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({ content: "This is my first post 2" });
    expect(response.statusCode).toBe(400);
  });

  test("Posts Get By Id test", async () => {
    const response = await request(app).get("/posts/" + postId);
    const post = response.body;
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(post._id);
  });

  test("Posts Get By Id test fail", async () => {
    const response = await request(app).get("/posts/" + postId + "3");
    const post = response.body;
    expect(response.statusCode).toBe(400);
  });

  test("Posts Create test", async () => {
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.accessToken)
      .send(testPost2);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.title).toBe(testPost2.title);
    expect(post.content).toBe(testPost2.content);
    postId = post._id;
  });

  test("Posts Create test fail", async () => {
    const response = await request(app).post("/posts").send(testPostFail);
    expect(response.statusCode).not.toBe(201);
  });

  test("Posts get posts by owner", async () => {
    const response = await request(app).get("/posts?owner=" + userInfo._id);
    const post = response.body[0];
    expect(response.statusCode).toBe(200);
    expect(post.owner).toBe(userInfo._id);
    expect(response.body.length).toBe(2);
  });

  test("Posts get posts by owner- fail wrong owner", async () => {
    const response = await request(app).get("/posts?owner=" + 123456);
    expect(response.statusCode).not.toBe(200);
  });

  test("Posts Update test", async () => {
    const response = await request(app)
      .put("/posts/" + postId)
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({ title: "My First post updated" });
    const post = response.body;
    expect(response.statusCode).toBe(200);
    expect(post.title).toBe("My First post updated");
  });

  test("Posts Update test fail - bad format id", async () => {
    const response = await request(app)
      .put("/posts/" + postId + 3)
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({ title: "My First post updated" });
    expect(response.statusCode).toBe(400);
  });

  test("Posts Update test fail - wrong id", async () => {
    const response = await request(app)
      .put("/posts/" + postId.slice(0, 1) + "3" + postId.slice(2))
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({ title: "My First post updated" });
    expect(response.statusCode).toBe(404);
  });

  test("Posts Delete test", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set("authorization", "JWT " + userInfo.accessToken);
    expect(response.statusCode).toBe(200);

    const respponse2 = await request(app).get("/posts/" + postId);
    expect(respponse2.statusCode).toBe(404);

    const respponse3 = await request(app).get("/posts/" + postId);
    const post = respponse3.body;
    expect(respponse3.statusCode).toBe(404);
  });

  test("Posts Delete test fail", async () => {
    const response = await request(app)
      .delete("/posts/" + postId + 3)
      .set("authorization", "JWT " + userInfo.accessToken);
    expect(response.statusCode).toBe(400);
  });
});
