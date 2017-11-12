import axios from 'axios';

(function () {
  let todos;
  let status = 'all';
  const inputTodo = document.getElementById('input-todo');
  const todoList = document.getElementById('todo-list');
  const allChkinput = document.getElementById('chk-allComplete');
  const tabList = document.querySelectorAll('.nav > li');
  const btnDelete = document.getElementById('btn-removeCompletedTodos');


// tabList.forEach(function(val){
//   val.addEventListener('click', e => changeList(e.target.parentNode.id));
// });
  

  const changeList = function(id){
    return todos.filter(({completed}) => {
      switch(status){
        // _todos = todos.filter(todo => todo.completed === false);
        case 'active':
        return !completed;
  
        case 'completed':
        //_todos = todos.filter(todo => todo.completed === true);
        return completed;
  
        default:
        return true;
      }
    });
 };

  const countLeftNumber = function () {
    let _todos;
    return _todos = todos.filter(todo => todo.completed == false).length;
  };

  const countDeleteNumber = function () {
    let _todos;
    return _todos = todos.filter(todo => todo.completed == true).length;
  };

  const render = function () {
    let html = '';

    const _todos = changeList();
    _todos.forEach(({ id, content, completed }) => {
      const checked = completed ? 'checked' : '';

      html += `<li class="list-group-item">
                <div class="hover-anchor">
                  <a class="hover-action text-muted">
                    <span class="glyphicon glyphicon-remove-circle pull-right" data-id="${id}"></span>
                  </a>
                  <label class="i-checks" for="${id}">
                    <input type="checkbox" id="${id}" ${checked}><i></i>
                    <span>${content}</span>
                  </label>
                </div>
              </li>`;
    });
    todoList.innerHTML = html;

    document.getElementById('completedTodos').innerHTML = countDeleteNumber();
    document.getElementById('leftTodos').innerHTML = countLeftNumber();

    inputTodo.focus();
  };

 document.querySelector('.nav').addEventListener('click', function (e) {
   if (!e.target || e.target.nodeName !== 'A') return;

   // 모든 .nav > li 요소에서 active 클래스 제거
   [...this.childNodes].forEach(tab => {
     // Skip text node
     if (tab.nodeName === 'LI') {
       tab.classList.remove('active');
     }
   });

   // 클릭된 a 요소의 부모 요소(.nav > li)에 active 클래스 추가
   const navItem = e.target.parentNode;
   navItem.classList.add('active');

   status = navItem.id;
   render();
 });

  const getTodos = function () {
    console.log(todos);
    axios.get('/todos')
      .then(rs => {
        todos = rs.data;
        render();
        console.log('[GET]\n', todos);
      })
      .catch(err => console.log(err.response));
  };

  const lastId = function(){
    return todos ? Math.max(...todos.map(todo => todo.id)) +1 : 1;
  };

  const addTodos = function(){
    var content = inputTodo.value;
    inputTodo.value = '';

    let todo;
    if(!todos || !todos.length){
      todo = { id:1, content, completed:false }
    }else{
      todo = {id:lastId(), content, completed:false }
    }
   
    axios.post('/todos', todo)
      .then(res => {
        console.log('[ADD]\n', res.data);
        getTodos();
      })
      .catch(err => console.log(err.response));
  };

  const removeTodos = function(id){
    axios.delete(`/todos/${id}`)
    .then(res => {
      console.log('[DELETE]\n', res.data);
      getTodos();
    })
    .catch(err => console.log(err.response));
  };

  const toggleTodos = function(id){
    const obj = todos.find(todo => todo.id == id);
    const checked = obj.completed ? false : true;

    axios.patch(`/todos/${id}`,{completed:checked})
    .then(res => {
      console.log('[Toggle]\n', res);
      getTodos();
    })
    .catch(err => console.log(err.response));
  };

  const toggleAllTodos = function(chk){  
    const checkedAll = todos.map(todo => todo.completed == false ? Object.assign({}, todo, { completed: true }) : todo);
    const uncheckedAll = todos.map(todo => todo.completed == true ? Object.assign({}, todo, { completed: false }) : todo);
    todos = chk ? checkedAll : uncheckedAll;
    render();
  };

  const removeCompleted = function(){

    axios.delete('/todos/completed')
      .then(() => {
        console.log('[REMOVE-COMPLETED]');
        getTodos();
      })
      .catch(err => console.log(err.response));
  };

  btnDelete.addEventListener('click', removeCompleted);

  todoList.addEventListener('change', e => {
    toggleTodos(e.target.id);
  });

  todoList.addEventListener('click', e => {
    const target = e.target;
    if(!target || target.nodeName  !== 'SPAN' || target.parentNode.nodeName === 'LABEL') return;
    removeTodos(target.dataset.id);
  });

  inputTodo.addEventListener('keyup', e => {
    if(e.keyCode!==13 || e.target === '') return;

    addTodos();
  });

  allChkinput.addEventListener('change', e =>{
    toggleAllTodos(e.target.checked);
  });
  //처음 데이터(db) 가져오기
  window.addEventListener('load', function () {
    getTodos();
  });
})();