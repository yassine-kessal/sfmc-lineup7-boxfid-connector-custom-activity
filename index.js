// if it's not on production use .env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const path = require("path").posix;
const fastify = require("fastify")({ logger: true });

const activityConfig = require("./server/routes/web/config");
const activityFrontend = require("./server/routes/web/activity");
const { default: axios } = require("axios");

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "frontend"),
});

// Frontend
fastify.get("/", activityFrontend);
fastify.get("/config.json", activityConfig);

fastify.get("/event-list", async (req, reply) => {
  // TODO : edit on production mode
  reply.header("Access-Control-Allow-Origin", "*");

  try {
    let eventListResult = [],
      page = 1,
      hasMore = true;

    while (hasMore) {
      const uri = new URL(
        "/api/engine/event-rule/",
        process.env.BOXFID_BASEURI
      );
      uri.searchParams.set("page", page);
      uri.searchParams.set("type_event", [8, 9, 10, 11]);
      uri.searchParams.set("type_model", [2]);
      uri.searchParams.set("active", true);

      console.log("URI : ", uri.toString());

      const eventList = await axios.get(uri, {
        headers: {
          Authorization: `Token ${process.env.BOXFID_API_TOKEN}`,
        },
      });

      eventListResult.push(...eventList.data.results);

      if (eventList.data.next) {
        page++;
      } else {
        hasMore = false;
        break;
      }
    }

    return eventListResult;
  } catch (e) {
    console.log(e);
  }
});

// Backend

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
