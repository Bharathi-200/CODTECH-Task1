const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();

function getFormattedDateTime() {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  const now = new Date();
  return now.toLocaleDateString('en-US', options);
}

function getTodoHtml(todo, index) {
  if (filter && filter !== todo.status) {
    return '';
  }
  let checked = todo.status === "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <div class="timestamp">${getFormattedDateTime()}</div>
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="todo-name ${checked}">${todo.name}</span>
        <div class="reminder-container">
          <input type="datetime-local" class="reminder-input" id="reminder-${index}" name="reminder-${index}">
          <button class="set-reminder-btn" data-index="${index}" onclick="setReminder(this)">Set Reminder</button>
        </div>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `;
}

function showTodos() {
  if (todosJson.length === 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending", reminder: null });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key !== "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function setReminder(button) {
  const index = button.dataset.index;
  const reminderInput = document.getElementById(`reminder-${index}`);
  if (reminderInput.value) {
    todosJson[index].reminder = reminderInput.value;
    localStorage.setItem("todos", JSON.stringify(todosJson));
    alert(`Reminder set for ${reminderInput.value}`);
  } else {
    alert("Please select a valid reminder date and time.");
  }
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
