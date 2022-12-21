const { default: axios } = require("axios");

module.exports = async (req, reply) => {
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
          Authorization: `Bearer ${req.auth.access_token}`,
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
};
