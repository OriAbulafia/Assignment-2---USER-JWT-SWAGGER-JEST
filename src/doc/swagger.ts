import userPaths from "./auth_routes_Paths";
import postsPaths from "./posts_routes_Paths";
import Components from "./components";

const options = {
  openapi: "3.1.0",
  info: {
    title: "Express API with Swagger, Jest, TypeScript and JWT",
    version: "0.1.0",
    description:
      "This is a simple CRUD API application made with Express in TypeScript documented with Swagger, tested with Jest and protected with JWT.",
    license: {
      name: "MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
  },
  servers: [
    {
      url: `http://localhost:3001`,
    },
  ],
  paths: { ...userPaths, ...postsPaths },
  components: Components,
};

export default options;
