module.exports = async (req, reply) => {
  return reply.sendFile("index.html");
};
