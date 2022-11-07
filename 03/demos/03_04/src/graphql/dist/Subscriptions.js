"use strict";
exports.__esModule = true;
exports.DeleteTaskSubscription = exports.UpdateTaskSubscription = exports.CreateTaskSubscription = void 0;
var graphql_tag_1 = require("graphql-tag");
exports.CreateTaskSubscription = graphql_tag_1["default"]("\nsubscription onCreateGlobomanticsTasks {\n  onCreateGlobomanticsTasks{\n    id,\n    title,\n    description,\n    date\n  }\n}\n");
exports.UpdateTaskSubscription = graphql_tag_1["default"]("\nsubscription onUpdateGlobomanticsTasks {\n    onUpdateGlobomanticsTasks{\n    id,\n    title,\n    description,\n    date\n  }\n}\n");
exports.DeleteTaskSubscription = graphql_tag_1["default"]("\nsubscription onDeleteGlobomanticsTasks {\n  onDeleteGlobomanticsTasks{\n    id,\n    title,\n    description,\n    date\n  }\n}\n");
