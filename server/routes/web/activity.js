module.exports = async (req, reply) => {
  console.log("hello");
  return reply.sendFile("index.html");
};
