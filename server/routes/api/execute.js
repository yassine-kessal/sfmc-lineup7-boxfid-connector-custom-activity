const { default: axios } = require("axios");

module.exports = async (req, reply) => {
  try {
    // TODO: control data and type
    const inArguments = req.body.inArguments[0];

    const date = new Date(
      inArguments.loyaltyEventDateSelect.value.split(" ")[0]
    );

    const eventCreate = {
      title: String(inArguments.activity.activityName),
      store: String(inArguments.loyaltyStore.value),
      fid_account: parseInt(inArguments.loyaltyAccount.value, 10),
      event_rule: parseInt(inArguments.event.value, 10),
      event_date: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`,
    };

    if (inArguments.event.is_dynamic) {
      eventCreate["value"] = String(inArguments.loyaltyPoints.value);
    }

    console.log("eventCreate", eventCreate);

    const uri = new URL(
      "/api/engine/event/create/",
      process.env.BOXFID_BASEURI
    );

    const eventCreateResult = await axios.post(uri, eventCreate, {
      headers: {
        Authorization: `Bearer ${req.auth.access_token}`,
      },
    });

    console.log("Event created", eventCreateResult.data);

    return reply.code(200).send({
      branchResult: "success",
    });
  } catch (e) {
    console.log("Error while creating event", e.response.data);

    return reply.code(400).send({
      branchResult: "failed",
    });
  }
};
