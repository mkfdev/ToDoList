//ToDoList version2
(function() {
  var inputTodo = document.getElementById('input-todo');
  var todoList = document.getElementById('todo-list');
  var todos;

  //모든 리소스의 로드가 완료되면, load 이벤트가 발생한다.
  window.addEventListener('load', function(e) {
    getTodos();
  });

  var getTodos = function() {
    todos = [
      { id: 3, content: 'HTML', completed: false },
      { id: 2, content: 'CSS', completed: false },
      { id: 1, content: 'Javascript', completed: false }
    ];
    render();
  };

  const render = function() {
    let html = '';
    todos.forEach(({ id, content, completed }) => {
      const checked = completed ? 'checked' : '';
      console.log(this);

      html += `<li class="list-group-item">
                <div class="hover-anchor">
                  <a class="hover-action text-muted">
                    <span class="glyphicon glyphicon-remove-circle pull-right" data-id="${id}"></span>
                  </a>
                  <label class="i-checks" for="${id}">
                    <input type="checkbox" id="${id}" "${checked}"><i></i>
                    <span>${content}</span>
                  </label>
                </div>
              </li>`;
    });

    todoList.innerHTML = html;
  };

  //데이터를 입력(+엔터키)
  inputTodo.addEventListener('keyup', function(e) {
    if (e.keyCode !== 13 || inputTodo.value === '') return;
    addTodo();
  });

  var addTodo = function() {
    var content = inputTodo.value;
    inputTodo.value = '';

    console.log("Now" + todos.length);
    if (!todos || todos.length == 0) {
      todos = [{ id: 1, content, completed: false }];
    } else {
      todos = [{ id: lastTodoId(), content, completed: false }].concat(todos);
    }
    render();
  };

  //id값
  var lastTodoId = function() {
    return todos ? Math.max.apply(null, todos.map(function(todo) {
      return todo.id;
    })) + 1 : 1;
  };

  //change는 form event로 selectbox, checkbox, radio button의 상태가 
  //변경되었을 때 발생하는 이벤트이다.
  todoList.addEventListener('change', function(e) {
    //e.target.id는 todoList에서 변화가 감지된 요소의 id
    toggleTodoComplete(e.target.id);
    console.log('change event Element' + e.target.id);
  });

  //checkbox의 변화에 따라 completed 상태를 변경시킨다.
  var toggleTodoComplete = function(id) {
    todos = todos.map(function(todo) {
      return todo.id == id ? Object.assign({}, todo, { completed: !todo.completed }) : todo;
    });
    render();
  };

  //삭제
  todoList.addEventListener('click', function(e){
    var target = e.target;
    //선택한 target이 삭제버튼이 아닌 경우 return
    if (!target || target.nodeName !== 'SPAN' || target.parentNode.nodeName === 'LABEL') return;
    console.log(target.dataset.id);
    removeTodo(target.dataset.id);

  });

  var removeTodo = function(id) {
    todos = todos.filter(function(todo) {
      return todo.id != id;
    });
    render();
  };

}());