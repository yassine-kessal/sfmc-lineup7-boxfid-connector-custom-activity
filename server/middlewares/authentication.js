const { default: axios } = require("axios");
const fs = require("fs").promises;
const path = require("path").posix;

const authObjFilePath = path.join(process.cwd(), "temp", "auth.json");

const readAccessTokenFromTempFile = async () => {
  try {
    const authObj = await fs.readFile(authObjFilePath, "utf-8");

    return JSON.parse(authObj);
  } catch (e) {
    console.log("Error while reading access token from temp file", e);

    return false;
  }
};

const isAccessTokenValid = (authObj) => {
  const now = new Date();
  const expiredAt = new Date(now.getTime() + (authObj.expires_in - 120) * 1000);

  console.log(
    "isAccessTokenValid",
    now,
    expiredAt,
    now.getTime() < expiredAt.getTime()
  );
  return now.getTime() < expiredAt.getTime();
};

const requestNewAccessToken = async () => {
  try {
    const authReq = await axios({
      method: "post",
      url: new URL("/api/o/token/", process.env.BOXFID_BASEURI).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: `username=${process.env.BOXFID_USERNAME}&password=${process.env.BOXFID_PASSWORD}&grant_type=${process.env.BOXFID_GRANT_TYPE}&client_id=${process.env.BOXFID_CLIENT_ID}&client_secret=${process.env.BOXFID_CLIENT_SECRET}&scope=${process.env.BOXFID_SCOPE}`,
    });

    if (authReq.status === 200) {
      return authReq.data;
    }
  } catch (e) {
    console.log("Error while requesting access token", e);

    return false;
  }
};

const writeAccessTokenToTempFile = async (authObj) => {
  try {
    await fs.writeFile(authObjFilePath, JSON.stringify(authObj));

    return true;
  } catch (e) {
    console.log("Error while writing access token to temp file", e);

    return false;
  }
};

module.exports = async (req, reply) => {
  try {
    const authObj = await readAccessTokenFromTempFile();

    if (authObj && isAccessTokenValid(authObj)) {
      req.auth = authObj;
      console.log("from file is valid");

      return true;
    } else {
      const newAuthObj = await requestNewAccessToken();

      console.log("request new access token", newAuthObj);

      if (newAuthObj) {
        await writeAccessTokenToTempFile(newAuthObj);

        req.auth = newAuthObj;

        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.log("Error while authenticating", e);

    return false;
  }
};
