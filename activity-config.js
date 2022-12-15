/**
 * Base Activity config.json
 */
module.exports = function configJSON(req) {
  return {
    workflowApiVersion: "1.1",
    metaData: {
      icon: "assets/lineup7-icon.png",
      category: "messages",
    },
    type: "RESTDECISION",
    name: "Lineup7 Boxfid",
    arguments: {
      execute: {
        inArguments: [],
        outArguments: [],
        // url: `https://${req.headers.host}/execute`,
        url: `https://eoq5trhuj41ha88.m.pipedream.net`,
        verb: "POST",
      },
    },
    configurationArguments: {
      publish: {
        // url: `https://${req.headers.host}/publish`,
        url: `https://eoq5trhuj41ha88.m.pipedream.net`,
        verb: "POST",
      },
    },
    userInterfaces: {
      configurationSupportsReadOnlyMode: true,
      configInspector: {
        size: "scm-lg",
      },
    },
    outcomes: [
      {
        arguments: {
          branchResult: "success",
        },
        metaData: {
          label: "Success",
        },
      },
    ],
    editable: true,
    errors: [],
  };
};
