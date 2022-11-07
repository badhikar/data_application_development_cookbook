"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
// @ts-nocheck
var uuid_1 = require("uuid");
var aws_appsync_1 = require("aws-appsync");
var Queries_ts_1 = require("./graphql/Queries.ts");
var Mutations_ts_1 = require("./graphql/Mutations.ts");
var aws_amplify_1 = require("aws-amplify");
var currentUserName = null;
var client = null;
aws_amplify_1.Auth.configure({
    userPoolId: 'us-east-1_SI8Jry3S2',
    userPoolWebClientId: '6na2ooiugt93k55cuqemns63h2',
    oauth: {
        region: 'us-east-1',
        domain: 'globomanticscongnito.auth.us-east-1.amazoncognito.com',
        scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: 'https://127.0.0.1:8080',
        redirectSignOut: 'https://127.0.0.1:8080',
        responseType: 'code'
    }
});
aws_amplify_1.Hub.listen("auth", function (_a) {
    var _b = _a.payload, event = _b.event, data = _b.data;
    switch (event) {
        case "signIn":
            getCurrentUser();
            break;
        case "signOut":
            getCurrentUser();
            break;
        case "customOAuthState":
            alert('custom state');
    }
});
var tasks = [];
var tasksContainer = null;
setupEvents();
function appLoaded() {
    return __awaiter(this, void 0, void 0, function () {
        var authToken, conflictResolver;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    $('#task-content').summernote();
                    tasksContainer = document.getElementById('product-list');
                    return [4 /*yield*/, getCurrentUser()];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [4 /*yield*/, aws_amplify_1.Auth.currentSession()];
                case 2:
                    authToken = (_a.sent()).getAccessToken().getJwtToken();
                    conflictResolver = function (_a) {
                        var mutation = _a.mutation, mutationName = _a.mutationName, variables = _a.variables, data = _a.data, retries = _a.retries;
                        console.log('mutation', mutation);
                        console.log('mutationName', mutationName);
                        console.log('variables', variables);
                        console.log('data', data);
                        console.log('retries', retries);
                        return false;
                    };
                    client = new aws_appsync_1.AWSAppSyncClient({
                        url: 'https://rhwswuom4jajhlnuclqm2vxyhe.appsync-api.us-east-1.amazonaws.com/graphql',
                        region: 'us-east-1',
                        auth: {
                            type: aws_appsync_1.AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
                            jwtToken: authToken
                        },
                        conflictResolver: conflictResolver
                    });
                    //   client.subscribe({ query: CreateTaskSubscription }).subscribe({
                    //     next: ()=>loadTasks(),
                    //     complete: console.log,
                    //     error: console.log,
                    // });
                    // client.subscribe({ query: UpdateTaskSubscription }).subscribe({
                    //   next: ()=>loadTasks(),
                    //   complete: console.log,
                    //   error: console.log,
                    // });
                    // client.subscribe({ query: DeleteTaskSubscription }).subscribe({
                    //   next: ()=>loadTasks(),
                    //   complete: console.log,
                    //   error: console.log,
                    // });
                    loadTasks();
                    return [2 /*return*/];
            }
        });
    });
}
function loadTasks(nocache) {
    return __awaiter(this, void 0, void 0, function () {
        var query, result;
        return __generator(this, function (_a) {
            query = Queries_ts_1.GetAllQuery;
            result = client.watchQuery({
                query: query,
                fetchPolicy: 'cache-and-network'
            }).subscribe({
                next: function (result) {
                    tasks = result.data.listGlobomanticsTasks.items;
                    renderTasks(tasks);
                }
            });
            return [2 /*return*/];
        });
    });
}
function createTask(title, descripton) {
    return __awaiter(this, void 0, void 0, function () {
        var mutate, task;
        return __generator(this, function (_a) {
            mutate = Mutations_ts_1.CreateTaskMutation;
            task = {
                title: title,
                date: new Date().toISOString().slice(0, 10),
                description: descripton
            };
            client.mutate({ mutation: mutate, variables: { createglobomanticstasksinput: task }, update: function (cache, _a) {
                    var createGlobomanticsTasks = _a.data.createGlobomanticsTasks;
                    console.log('update', createGlobomanticsTasks);
                    var query = Queries_ts_1.GetAllQuery;
                    // Read query from cache
                    var data = cache.readQuery({ query: query });
                    // Add newly created item to the cache copy
                    data.listGlobomanticsTasks.items = __spreadArrays(data.listGlobomanticsTasks.items.filter(function (item) { return item.id !== createGlobomanticsTasks.id; }), [
                        createGlobomanticsTasks
                    ]);
                    //Overwrite the cache with the new results
                    cache.writeQuery({ query: query, data: data });
                },
                optimisticResponse: function () { return ({
                    createGlobomanticsTasks: {
                        __typename: 'CreateGlobomanticsTasksInput',
                        id: uuid_1.v4(),
                        title: title,
                        date: new Date().toISOString().slice(0, 10),
                        description: descripton
                    }
                }); }
            })
                .then(function (result) {
                loadTasks();
                closeModals();
            })["catch"](console.error);
            return [2 /*return*/];
        });
    });
}
function updateTask(id, title, description) {
    return __awaiter(this, void 0, void 0, function () {
        var mutate, task;
        return __generator(this, function (_a) {
            mutate = Mutations_ts_1.UpdateTaskMutation;
            task = {
                id: id,
                title: title,
                description: description
            };
            client.mutate({ mutation: mutate, variables: { updateglobomanticstasksinput: task } })
                .then(function (result) {
                loadTasks();
                closeModals();
            })["catch"](console.error);
            return [2 /*return*/];
        });
    });
}
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function () {
        var mutate, task;
        return __generator(this, function (_a) {
            mutate = Mutations_ts_1.DeleteTaskMutation;
            task = {
                id: id
            };
            client.mutate({ mutation: mutate, variables: { deleteglobomanticstasksinput: task } })
                .then(function (result) {
                loadTasks();
            })["catch"](console.error);
            return [2 /*return*/];
        });
    });
}
function onNewTask() {
    var newTaskData = {
        title: document.getElementById('task-title').value,
        description: $('#task-content').summernote('code')
    };
    console.log('new task', newTaskData);
    createTask(newTaskData.title, newTaskData.description);
    document.getElementById('task-title').value = '',
        $('#task-content').summernote('code', '');
}
function onSaveTask() {
    var taskData = {
        id: document.getElementById('updatetask-id').value,
        title: document.getElementById('updatetask-title').value,
        description: $('#updatetask-content').summernote('code')
    };
    console.log('new task', taskData);
    updateTask(taskData.id, taskData.title, taskData.description);
}
function openTask(id) {
    return __awaiter(this, void 0, void 0, function () {
        var task;
        return __generator(this, function (_a) {
            task = tasks.find(function (z) { return z.id == id; });
            document.getElementById('updatetask-id').value = id;
            document.getElementById('updatetask-title').value = task.title;
            $('#updatetask-content').summernote('code', task.description);
            $('#taskdetails-modal').modal('show');
            return [2 /*return*/];
        });
    });
}
function onLogin() {
    aws_amplify_1.Auth.federatedSignIn().then(function (result) {
    })["catch"](function (err) {
        console.log(err);
    });
}
function onLogout() {
    aws_amplify_1.Auth.signOut().then(function (result) {
        setUserState(null);
    })["catch"](function (err) {
        displayObject(err);
    });
}
function setUserState(user) {
    var usernamePlaceholder = document.getElementById('username-placeholder');
    var loginButton = document.getElementById('login-button');
    var logoutButton = document.getElementById('logout-button');
    if (!user) {
        usernamePlaceholder.innerHTML = '';
        usernamePlaceholder.style.display = 'none';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
    else {
        usernamePlaceholder.innerHTML = user.username;
        usernamePlaceholder.style.display = 'block';
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    }
}
function getCurrentUser() {
    return __awaiter(this, void 0, Promise, function () {
        var currentUser, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, aws_amplify_1.Auth.currentAuthenticatedUser()];
                case 1:
                    currentUser = (_a.sent());
                    console.log('getCurrentUser', currentUser);
                    setUserState(currentUser);
                    return [2 /*return*/, currentUser];
                case 2:
                    err_1 = _a.sent();
                    console.log('Error loading user', err_1);
                    setUserState(null);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setupEvents() {
    document.addEventListener("DOMContentLoaded", appLoaded);
    document.getElementById('newtask-form').addEventListener('submit', onNewTask);
    document.getElementById('updatetask-form').addEventListener('submit', onSaveTask);
    document.getElementById('login-button').addEventListener('click', onLogin);
    document.getElementById('logout-button').addEventListener('click', onLogout);
    document.getElementById('refresh-button').addEventListener('click', function () { return loadTasks(true); });
}
function closeModals() {
    $('.modal').modal('hide');
}
function renderTasks(tasks) {
    tasksContainer.innerHTML = '';
    tasks.forEach(function (product) {
        var card = document.createElement("DIV");
        card.classList.add('card');
        card.style.maxWidth = '250px';
        card.style.minWidth = '250px';
        card.style.marginRight = '20px';
        card.style.marginBottom = '10px';
        var cardimage = document.createElement("img");
        cardimage.classList.add('card-img-top');
        cardimage.classList.add('float-right');
        cardimage.style.height = '20px';
        cardimage.style.width = '20px';
        cardimage.style.position = 'absolute';
        cardimage.style.right = '5';
        cardimage.style.top = '5';
        cardimage.classList.add('card-img-top');
        cardimage.src = './images/G.png';
        card.appendChild(cardimage);
        var cardbody = document.createElement("DIV");
        cardbody.classList.add('card-body');
        card.append(cardbody);
        var cartTitle = document.createElement('h5');
        cartTitle.innerHTML = product.title;
        cartTitle.classList.add('card-title');
        cardbody.appendChild(cartTitle);
        var cartSubtitle = document.createElement('h6');
        cartSubtitle.innerHTML = product.date;
        cartSubtitle.classList.add('card-subtitle');
        cartSubtitle.classList.add('mb-2');
        cartSubtitle.classList.add('text-muted');
        cardbody.appendChild(cartSubtitle);
        // var cardtext = document.createElement("p");
        // cardtext.classList.add('card-text');
        // cardtext.innerHTML = `<b>${ (product.description && product.description.length>100)? (product.description.substring(0,100) + "..."): product.description}</b><br/>`
        // cardbody.append(cardtext)
        var viewButton = createLink('Open', function () {
            openTask(product.id);
        });
        viewButton.classList.add("card-link");
        cardbody.appendChild(viewButton);
        var deleteButton = createLink('Delete', function () {
            deleteTask(product.id);
        });
        deleteButton.classList.add("card-link");
        cardbody.appendChild(deleteButton);
        tasksContainer.appendChild(card);
    });
}
function createLink(label, handler) {
    var btn = document.createElement("a");
    btn.href = "#";
    btn.addEventListener('click', handler);
    btn.innerHTML = label;
    return btn;
}
