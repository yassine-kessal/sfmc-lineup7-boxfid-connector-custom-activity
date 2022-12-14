const activityConfig = require("../../../activity-config");

/**
 *
 */
module.exports = async function (req, reply) {
  return reply.status(200).send(activityConfig(req));
};
