// if it's not on production use .env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const path = require("path").posix;
const fastify = require("fastify")({ logger: true });
const { default: axios } = require("axios");

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "dist"),
});

// Frontend
fastify.get("/", require("./server/routes/web/activity"));
fastify.get("/config.json", require("./server/routes/web/config"));

fastify.get(
  "/event-list/",
  { preHandler: require("./server/middlewares/authentication") },
  require("./server/routes/api/event-list")
);

// Backend
fastify.post("/publish", require("./server/routes/api/publish"));
fastify.post(
  "/execute",
  { preHandler: require("./server/middlewares/authentication") },
  require("./server/routes/api/execute")
);

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
