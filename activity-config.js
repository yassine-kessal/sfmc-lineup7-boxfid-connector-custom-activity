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
        url: `https://${req.headers.host}/execute`,
        verb: "POST",
      },
    },
    configurationArguments: {
      publish: {
        url: `https://${req.headers.host}/publish`,
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
          label: "Réussi",
        },
      },
      {
        arguments: {
          branchResult: "failed",
        },
        metaData: {
          label: "Refusé",
        },
      },
    ],
    editable: true,
    errors: [],
  };
};
