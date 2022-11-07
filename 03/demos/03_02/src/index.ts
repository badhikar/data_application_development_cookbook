
// @ts-nocheck
import  {AWSAppSyncClient, AUTH_TYPE} from "aws-appsync";
import { GetAllQuery } from "./graphql/Queries.ts";
import {  CreateTaskMutation, UpdateTaskMutation, DeleteTaskMutation } from "./graphql/Mutations.ts";
import { CreateTaskSubscription , UpdateTaskSubscription, DeleteTaskSubscription } from "./graphql/Subscriptions.ts";
import { Auth,Hub } from 'aws-amplify'


var currentUserName: string = null
const client = null

Auth.configure({
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
})

Hub.listen("auth", ({ payload: { event, data } }) => {
  switch (event) {
    case "signIn":
      getCurrentUser()
      break;
    case "signOut":
      getCurrentUser()
      break;
    case "customOAuthState":
      alert('custom state')
  }
});

var tasks: any[] = [];
var tasksContainer: any = null;

setupEvents();
async function appLoaded() {

  $('#task-content').summernote();
  tasksContainer = document.getElementById('product-list');


  if(!await getCurrentUser()) return;
  var authToken=(await Auth.currentSession()).getAccessToken().getJwtToken();
  client = new AWSAppSyncClient({
    url: 'https://rhwswuom4jajhlnuclqm2vxyhe.appsync-api.us-east-1.amazonaws.com/graphql',
    region: 'us-east-1',
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: authToken,
    }
  });
  
 let taskCreatedObservable= client.subscribe({ query: CreateTaskSubscription })
 taskCreatedObservable.subscribe({
    next: (input:any)=>{console.log('task created', input);loadTasks();}
});
let taskUpdatedObservable=client.subscribe({ query: UpdateTaskSubscription })
taskUpdatedObservable.subscribe({
  next: (input:any)=>{console.log('task updated', input);loadTasks();}
});
let taskDeletedObservable=client.subscribe({ query: DeleteTaskSubscription })
taskDeletedObservable.subscribe({
  next: (input:any)=>{console.log('task deleted', input);loadTasks();}
});

  loadTasks()
 
}
async function loadTasks() {
  const query = GetAllQuery;
  var result = await client.query({
    query, fetchPolicy: 'network-only'
  });

  tasks = result.data.listGlobomanticsTasks.items;
  renderTasks(tasks)
}
async function createTask(title: string, descripton: string) {
  const mutate = CreateTaskMutation;
  let task = {
    title: title,
    date: new Date().toISOString().slice(0, 10),
    description: descripton
  }
  client.mutate({ mutation: mutate, variables: { createglobomanticstasksinput: task } })
    .then(result => {
      loadTasks();
      closeModals()

    })
    .catch(console.error);
}
async function updateTask(id: string, title: string, description: string) {
  const mutate = UpdateTaskMutation;
  let task = {
    id: id,
    title: title,
    description: description
  }
  client.mutate({ mutation: mutate, variables: { updateglobomanticstasksinput: task } })
    .then(result => {
      loadTasks()
      closeModals()
    })
    .catch(console.error);
}
async function deleteTask(id: string) {
  const mutate = DeleteTaskMutation;
  let task = {
    id: id
  }
  client.mutate({ mutation: mutate, variables: { deleteglobomanticstasksinput: task } })
    .then(result => {
      loadTasks()
    })
    .catch(console.error);
}

function onNewTask() {
  let newTaskData = {
    title: document.getElementById('task-title').value,
    description: $('#task-content').summernote('code')
  }
  console.log('new task', newTaskData)
  createTask(newTaskData.title, newTaskData.description)
  document.getElementById('task-title').value='',
  $('#task-content').summernote('code','')

}
function onSaveTask() {
  let taskData = {
    id: document.getElementById('updatetask-id').value,
    title: document.getElementById('updatetask-title').value,
    description: $('#updatetask-content').summernote('code')
  }
  console.log('new task', taskData)
  updateTask(taskData.id, taskData.title, taskData.description)
}

async function openTask(id: string) {
  var task = tasks.find(z => z.id == id);
  document.getElementById('updatetask-id').value = id;
  document.getElementById('updatetask-title').value = task.title
  $('#updatetask-content').summernote('code', task.description);
  $('#taskdetails-modal').modal('show');
}
function onLogin() {
  Auth.federatedSignIn().then(result => {
  }).catch((err: any) => {
    console.log(err)
  })
}
function onLogout() {

  Auth.signOut().then(result => {
    setUserState(null);
  }).catch(err => {
    displayObject(err)
  })
}
function setUserState(user: any) {
  var usernamePlaceholder = document.getElementById('username-placeholder');
  var loginButton = document.getElementById('login-button');
  var logoutButton = document.getElementById('logout-button');
  if (!user) {
    usernamePlaceholder.innerHTML = ''
    usernamePlaceholder.style.display = 'none'
    loginButton.style.display = 'block'
    logoutButton.style.display = 'none'
  }
  else {
    usernamePlaceholder.innerHTML = user.username
    usernamePlaceholder.style.display = 'block'
    loginButton.style.display = 'none'
    logoutButton.style.display = 'block'
  }
}
async function getCurrentUser(): Promise<CognitoUser> {
  try {

    var currentUser = <CognitoUser>(await Auth.currentAuthenticatedUser());
    console.log('getCurrentUser', currentUser);

    setUserState(currentUser)
    return currentUser
  }
  catch (err) {
    console.log('Error loading user', err);
    setUserState(null)
  }

}
function setupEvents() {
  document.addEventListener("DOMContentLoaded", appLoaded)
  document.getElementById('newtask-form').addEventListener('submit', onNewTask)
  document.getElementById('updatetask-form').addEventListener('submit', onSaveTask)
  document.getElementById('login-button').addEventListener('click', onLogin)
  document.getElementById('logout-button').addEventListener('click', onLogout)


}
function closeModals() {

  $('.modal').modal('hide');
}
function renderTasks(tasks: any[]) {
  tasksContainer.innerHTML = ''
  tasks.forEach((product: { title: string; date: any; description: any; id: any; }) => {

    var card = document.createElement("DIV");
    card.classList.add('card')
    card.style.maxWidth = '250px'
    card.style.minWidth = '250px'
    card.style.marginRight = '20px'
    card.style.marginBottom = '10px'

    var cardimage = document.createElement("img")
    cardimage.classList.add('card-img-top')
    cardimage.classList.add('float-right')
    
    
    cardimage.style.height = '20px';
    cardimage.style.width = '20px';
    cardimage.style.position = 'absolute';
    cardimage.style.right = '5';
    cardimage.style.top = '5';

    cardimage.classList.add('card-img-top')
    cardimage.src = './images/G.png'
    card.appendChild(cardimage);

    var cardbody = document.createElement("DIV");
    cardbody.classList.add('card-body');
    card.append(cardbody)
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

    var viewButton = createLink('Open', () => {
      openTask(product.id)
    })
    viewButton.classList.add("card-link")

    cardbody.appendChild(viewButton);
    var deleteButton = createLink('Delete', () => {
      deleteTask(product.id)
    })
    deleteButton.classList.add("card-link")

    cardbody.appendChild(deleteButton);

    tasksContainer.appendChild(card)

  })
}
function createLink(label: string, handler: { (): void; (): void; (this: HTMLElement, ev: MouseEvent): any; }) {
  var btn = document.createElement("a");
  btn.href = "#"
  btn.addEventListener('click', handler);
  btn.innerHTML = label;
  return btn;
}

