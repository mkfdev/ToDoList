//단축키 ctrl+D 
(function() {

  var todoList = document.getElementById('todo-list');
  var todos;
  var inputTodo = document.getElementById('input-todo');

  var getTodos = function() {
    todos = [
      { id: 3, content: 'HTML', completed: false },
      { id: 2, content: 'CSS', completed: false },
      { id: 1, content: 'Javascript', completed: false }
    ];
    render();
    console.log('[GET]\n', todos);
  };

  var lastTodoId = function() {
    //todos의 모든 요소를 방문해서 
    //각 요소의 id값을 비교하고
    //그중 최대인 id값에 +1한 값을 반환

    // todos.map(function(todo) {
    //   return todo.id; // ->[3,2,1]
    // })
    return todos ? Math.max.apply(null, todos.map(function(todo) {
      return todo.id;
    })) + 1 : 1;
  };

  var addTodo = function() {
    //유요한 id값 생성
    //최신 data todos의 첫번째 요소로 추가
    var content = inputTodo.value;
    inputTodo.value = '';

    if (!todos || todos.length === 0) {
      todos = [{ id: 1, content: content, completed: false }];
    } else {
      todos = [{ id: lastTodoId(), content: content, completed: false }].concat(todos);
      //todos.unshift([{ id: lastTodoId(), content: content, completed: false }]);
    }
    render();
    console.log('', todos);
  };


  var toggleTodoComplete = function(id) {
    todos = todos.map(function(todo) {
      //첫번째 인자 target, 뒤 인자값들이 합쳐진 객체 반환
      return todo.id == id ? Object.assign({}, todo, { completed: !todo.completed }) : todo;
      render();
    });
  };


  var removeTodo = function(id) {

    todos = todos.filter(function(todo) {
      //return 다음에 적혀있는 조건이 참인 경우만 pass(객체에 반영)
      //todo.id는 숫자, id는 문자
      return todo.id != id;
    });
    render();
    console.log('remove\n', todos);
  };

  var render = function() {
    var html = '';

    //새로운 배열을 만들 필요가 없을 때 사용(map과의 차이점)
    todos.forEach(function(todo) {
      html += '<li class="list-group-item">\
      <div class="hover-anchor">\
      <a class="hover-action text-muted">\
      <span class="glyphicon glyphicon-remove-circle pull-right" data-id="' + todo.id + '"></span>\
      </a>\
      <label class="i-checks" for="' + todo.id + '">\
      <input type="checkbox" id="' + todo.id + '"' + ((todo.completed) ? 'checked' : '') + '><i></i>\
      <span>' + todo.content + '</span>\
      </label>\
      </div>\
      </li>';
    }); //forEach
    todoList.innerHTML = html;
  };

  inputTodo.addEventListener('keyup', function(e) {
    if (e.keyCode !== 13 || inputTodo.value.trim() === '') {
      //str.trim() -> str 원본이 변하지 않음
      return;
    }
    addTodo();
  });

  window.addEventListener('load', function() {
    getTodos();
  });

  todoList.addEventListener('change', function() {
    toggleTodoComplete(e.target.id);
  });

  todoList.addEventListener('click', function(e) {
    var target = e.target;
    if (!target || target.nodeName !== 'SPAN' || target.parentNode.nodeName === 'LABEL') {
      return;
    }
    removeTodo(target.dataset.id); // target.getAttribute('id')랑 같음
  });
})();