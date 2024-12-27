import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import postsModel from "../models/posts_model";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postsModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

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

const userInfo2: UserInfo = {
  email: "Sahar@gmail.com",
  password: "123456",
};

describe("Auth Tests", () => {
  test("Auth Registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).toBe(200);
  });

  test("Auth Registration fail trying to register twice", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth Registration fail trying to register without email", async () => {
    const response = await request(app).post("/auth/register").send({
      password: userInfo.password,
    });
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth Login", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);
    expect(response.statusCode).toBe(200);
    const { accessToken, refreshToken, _id } = response.body;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(_id).toBeDefined();
    userInfo.accessToken = accessToken;
    userInfo.refreshToken = refreshToken;
    userInfo._id = _id;
  });

  test("Auth Login fail no email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ password: userInfo.password });
    expect(response.statusCode).toBe(400);
  });

  test("Auth Login fail wrong email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "wrong email",
      password: userInfo.password,
    });
    expect(response.statusCode).toBe(400);
  });

  test("Auth Login fail wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: "wrong password",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Make sure two access tokens are not the same", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
  });

  test("Get protected API", async () => {
    const response = await request(app).post("/posts").send({
      owner: "invalid owner",
      title: "My First post",
      content: "This is my first post",
    });
    expect(response.statusCode).not.toBe(201);

    const response2 = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        owner: "invalid owner",
        title: "My First post",
        content: "This is my first post",
      });
    expect(response2.statusCode).toBe(201);
  });

  test("Get protected API invalid token", async () => {
    const response = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + userInfo.accessToken + "1",
      })
      .send({
        owner: userInfo._id,
        title: "My First post",
        content: "This is my first post",
      });
    expect(response.statusCode).not.toBe(201);
  });

  test("Refresh Token", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  });

  test("Logout/refresh fail - no refresh token", async () => {
    const response = await request(app).post("/auth/logout").send("");
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post("/auth/refresh").send("");
    expect(response2.statusCode).not.toBe(200);
  });

  test("Logout/refresh fail - invalid refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: "invalid token",
    });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: "invalid token",
    });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Logout fail - reuse refresh tokens", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.statusCode).toBe(200);

    const response2 = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Logout fail - reuse refresh tokens", async () => {
    const register = await request(app).post("/auth/register").send(userInfo2);
    const login = await request(app).post("/auth/login").send({
      email: userInfo2.email,
      password: userInfo2.password,
    });

    const { refreshToken, accessToken } = login.body;
    userInfo2.refreshToken = refreshToken;

    await request(app)
      .delete("/auth/delete")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: userInfo2.email,
        password: userInfo2.password,
      });

    const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo2.refreshToken,
    });
    expect(response.statusCode).not.toBe(200);
  });

  test("Logout fail - refresh token belongs to deleted user", async () => {
    const register = await request(app).post("/auth/register").send(userInfo2);
    const login = await request(app).post("/auth/login").send({
      email: userInfo2.email,
      password: userInfo2.password,
    });

    const { refreshToken, accessToken } = login.body;
    userInfo2.refreshToken = refreshToken;

    await request(app)
      .delete("/auth/delete")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: userInfo2.email,
        password: userInfo2.password,
      });

    const response = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo2.refreshToken,
    });
    expect(response.statusCode).not.toBe(200);
  });

  test("Refresh token multiple usage", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.statusCode).toBe(200);
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;

    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response2.statusCode).toBe(200);
    const newRefreshToken = response2.body.refreshToken;

    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);

    const response4 = await request(app).post("/auth/refresh").send({
      refreshToken: newRefreshToken,
    });
    expect(response4.statusCode).not.toBe(200);
  });

  jest.setTimeout(10000);
  test("timeout on refresh access token", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.statusCode).toBe(200);
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 6000));

    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response3.statusCode).toBe(200);
    userInfo.accessToken = response3.body.accessToken;
    userInfo.refreshToken = response3.body.refreshToken;

    const response4 = await request(app)
      .post("/posts")
      .set({
        authorization: "jwt " + userInfo.accessToken,
      })
      .send({
        owner: "invalid owner",
        title: "My First post",
        content: "This is my first post",
      });
    expect(response4.statusCode).toBe(201);
  });

  test("Update user - Success", async () => {
    const testUser = {
      email: "testemail@gmail.com",
      password: "testpassword",
    };
    let accessToken;

    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    accessToken = res.body.accessToken;

    const response = await request(app)
      .put("/auth/update")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: "blabla@gmail.com",
        password: "blabla",
      });
    expect(response.statusCode).toBe(200);

    const response2 = await request(app)
      .put("/auth/update")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: "ori@gmail.com",
      });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app)
      .put("/auth/update")
      .set("authorization", "JWT " + accessToken)
      .send({
        password: "123345",
      });
    expect(response3.statusCode).toBe(200);
  });

  test("Update user - fail email already exist", async () => {
    await request(app).post("/auth/register").send(userInfo2);
    await request(app).post("/auth/register").send(userInfo);
    const res = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    const accessToken2 = res.body.accessToken;
    const response = await request(app)
      .put("/auth/update")
      .set("authorization", "JWT " + accessToken2)
      .send({
        email: userInfo2.email,
      });
    expect(response.statusCode).toBe(401);
  });

  test("Update user - user doesn't exist trying ro update after delete", async () => {
    const testUser = {
      email: "testemail",
      password: "testpassword",
    };
    let accessToken;
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    accessToken = res.body.accessToken;
    await request(app)
      .delete("/auth/delete")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    const response = await request(app)
      .put("/auth/update")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: "123@gmail.com",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Delete user - Success", async () => {
    const testUser = {
      email: "testuser@gmail.com",
      password: "testpassword",
    };
    let accessToken;

    const res = await request(app).post("/auth/register").send(testUser);
    const res2 = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    accessToken = res2.body.accessToken;
    const response3 = await request(app)
      .delete("/auth/delete")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response3.statusCode).toBe(200);
  });

  test("Delete user - Fail by no email or password", async () => {
    const testUser = {
      email: "",
      password: "",
    };

    const response = await request(app)
      .delete("/auth/delete")
      .set("authorization", "JWT " + userInfo.accessToken)
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.statusCode).toBe(400);
  });

  test("Delete user - Fail by incorrect email", async () => {
    const testUser = {
      email: "testuser@gmail.com",
      password: "testpassword",
    };
    let accessToken;

    const res = await request(app).post("/auth/register").send(testUser);
    const res2 = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    accessToken = res2.body.accessToken;

    const response3 = await request(app)
      .delete("/auth/delete")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: testUser.email + "something",
        password: testUser.password,
      });

    expect(response3.statusCode).toBe(400);
  });

  test("Delete user - Fail by incorrect password", async () => {
    const testUser = {
      email: "testuser@gmail.com",
      password: "testpassword",
    };
    let accessToken;

    const res = await request(app).post("/auth/register").send(testUser);
    const res2 = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    accessToken = res2.body.accessToken;

    const response3 = await request(app)
      .delete("/auth/delete")
      .set("authorization", "JWT " + accessToken)
      .send({
        email: testUser.email,
        password: testUser.password + "something",
      });

    expect(response3.statusCode).toBe(400);
  });
});
