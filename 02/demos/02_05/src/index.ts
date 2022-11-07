
// @ts-nocheck
import AWSAppSyncClient from "aws-appsync";
import { GetAllQuery } from "./graphql/Queries.ts";

const client = null;
var tasks: any[] = [];
var tasksContainer: any = null;

setupEvents();

async function appLoaded() {
  client= new AWSAppSyncClient({
    url: 'https://rhwswuom4jajhlnuclqm2vxyhe.appsync-api.us-east-1.amazonaws.com/graphql',
    region: 'us-east-1',
    auth: {
      type: 'API_KEY',
      apiKey: 'da2-kcuwbyfsevd2lcehfhjcabaolq',
    }
  });
  
  loadTasks()
  
  loadTasks()
  $('#task-content').summernote();
  tasksContainer = document.getElementById('product-list');
}

async function loadTasks() {
 const query = GetAllQuery
 var result = await client.query({
  query, fetchPolicy: 'network-only'
});

tasks = result.data.listGlobomanticsTasks.items;
renderTasks(tasks)

}
async function createTask(title: string, descripton: string) {
 
}
async function updateTask(id: string, title: string, description: string) {
 
}
async function deleteTask(id: string) {
 
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
function setupEvents() {
  document.addEventListener("DOMContentLoaded", appLoaded)
  document.getElementById('newtask-form').addEventListener('submit', onNewTask)
  document.getElementById('updatetask-form').addEventListener('submit', onSaveTask)
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

