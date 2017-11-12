(function() {

  var todos = [];
  var inputTodo = document.getElementById('input-todo');
  var todoList = document.getElementById('todo-list');

  var render = function() {
    var html = '';

    todos.forEach(function(list) {
      var checked = list.completed ? 'checked' : '';
      html += ' <li class="list-group-item">\
            <div class="hover-anchor">\
              <a class="hover-action text-muted">\
                <span class="glyphicon glyphicon-remove-circle pull-right" data-id="' + list.id + '"></span>\
              </a>\
              <label class="i-checks" for="' + list.id + '">\
                <input type="checkbox" id="' + list.id + '"' + checked + '><i></i>\
                <span>' + list.content + '</span>\
              </label>\
            </div>\
          </li>';
    });
    todoList.innerHTML = html;
  };


  var lastTodoId = function() {
    return todos ? Math.max.apply(null, todos.map(function(todo) {
      return todo.id;
    })) + 1 : 1;
  };


  var addTodos = function() {
    var tempContent = inputTodo.value;
    inputTodo.value = '';

    if (!todos || todos.length === 0) {
      todos = [{ id: 1, content: tempContent, completed: false }];
    } else {
      todos = [{ id: lastTodoId(), content: tempContent, completed: false }].concat(todos);
    }
    render();
    console.log('[add]\n' + todos);
  };

  var toggleTodoList = function(id) {
    todos = todos.map(function(todo) {
      return todo.id == id ? Object.assign({}, todo, { completed: !todo.completed }) : todo;
    });
    render();
    console.log('[changeCheckbox]\n', todos);
  };

  var removeTodo = function(id) {
    todos = todos.filter(function(todo) {
      return todo.id != id;
    });
    render();
    console.log('[remove]\n', todos);
  };


  todoList.addEventListener('click', function(e) {
    var target = e.target;
    if (!target || target.nodeName !== 'SPAN' || target.parentNode.nodeName === 'LABEL') return;
    removeTodo(e.target.dataset.id);
  });


  todoList.addEventListener('change', function(e) {
    toggleTodoList(e.target.id);
  });


  inputTodo.addEventListener('keyup', function(e) {
    if (e.keyCode !== 13 || inputTodo.value.trim() === '') return;
    addTodos();
  });
})();