import axios from 'axios';
//one monokai 
//bracket pair colorizer
(function() {
  const inputTodo = document.getElementById('input-todo');
  const todoList = document.getElementById('todo-list');
  let todos;

  const render = function() {
    let html = '';
    todos.forEach(({ id, content, completed }) => {
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
  };

  const lastTodoId = function() {
    return todos ? Math.max.apply(null, todos.map(function(todo) {
      return todo.id;
    })) + 1 : 1;
  };

  const getTodos = function() {
    axios.get('/todos')
      .then(res => {
        todos = res.data;
        render();
        console.log('[GET]\n', todos);
      })
      .catch(err => console.log(err.response));
  };

  const addTodo = function() {
    const content = inputTodo.value;
    inputTodo.value = '';

    let todo;

    if (!todos || !todos.length) {
      todo = { id: 1, content, completed: false };
    } else {
      todo = { id: lastTodoId(), content, completed: false };
    }

    axios.post('/todos', todo)
      .then(res => {
        console.log('[ADD]\n', res.data);
        getTodos();
      })
      .catch(err => console.log(err.response));
  };

  const removeTodo = function(id) {

    axios.delete(`/todos/${id}`)
      .then(res => {
        console.log('[DELETE]\n', res.data);
        getTodos();
      })
      .catch(err => console.log(err.response));
  };

  const toggleTodo = function(id) {
    let result = todos.find(todo => todo.id == id);

    const updateTodos = { completed: !result.completed };
    console.log(updateTodos);
    axios.patch(`/todos/${id}`, updateTodos)
      .then(res => {
        console.log('[UPDATE]\n', res.data);
        getTodos();
      })
      .catch(err => console.log(err.response));
  };

  todoList.addEventListener('change', function(e) {
    toggleTodo(e.target.id);
  });

  todoList.addEventListener('click', function(e) {

    const target = e.target;
    if (!target || target.nodeName !== 'SPAN' || target.parentNode.nodeName === 'LABEL') return;
    removeTodo(target.dataset.id);
  });

  inputTodo.addEventListener('keyup', function(e) {
    if (e.keyCode !== 13 || inputTodo.value === '') return;
    addTodo();
  });

  window.addEventListener('load', function() {
    getTodos();
  });
})();