let todos = [];
let completedTodos = [];

function loadTasks() {
    const savedTodos = localStorage.getItem('todos');
    const savedCompletedTodos = localStorage.getItem('completedTodos');
    
    if (savedTodos) todos = JSON.parse(savedTodos);
    if (savedCompletedTodos) completedTodos = JSON.parse(savedCompletedTodos);
    
    renderTodos();
    renderCompletedTodos();
}

function saveTasks() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
}

function updateDate() {
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateElement.textContent = `${dd}/${mm}/${yyyy}`;
}

function addTodo(event) {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (event.key === 'Enter' && text) {
        todos.push({
            id: Date.now(),
            text: text,
            completed: false,
            date: new Date().toISOString()
        });
        input.value = '';
        saveTasks();
        renderTodos();
    }
}

function toggleTodo(id) {
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex !== -1) {
        const todo = todos[todoIndex];
        todo.completed = !todo.completed;
        
        if (todo.completed) {
            // Move to completed list
            todos.splice(todoIndex, 1);
            completedTodos.unshift({
                ...todo,
                completedDate: new Date().toISOString()
            });
        }
        
        saveTasks();
        renderTodos();
        renderCompletedTodos();
    }
}

function deleteTodo(id, isCompleted = false) {
    if (isCompleted) {
        completedTodos = completedTodos.filter(t => t.id !== id);
    } else {
        todos = todos.filter(t => t.id !== id);
    }
    saveTasks();
    renderTodos();
    renderCompletedTodos();
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onclick="toggleTodo(${todo.id})">
            <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <button onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

function renderCompletedTodos() {
    const completedList = document.getElementById('completedList');
    completedList.innerHTML = '';
    
    completedTodos.forEach(todo => {
        const li = document.createElement('li');
        const completedDate = new Date(todo.completedDate).toLocaleDateString();
        li.innerHTML = `
            <input type="checkbox" checked disabled>
            <span class="completed">${todo.text}</span>
            <span class="completed-date">${completedDate}</span>
            <button onclick="deleteTodo(${todo.id}, true)">Delete</button>
        `;
        completedList.appendChild(li);
    });
}

function toggleCompletedSection() {
    const completedList = document.getElementById('completedList');
    const toggleIcon = document.querySelector('.toggle-icon');
    completedList.classList.toggle('hidden');
    toggleIcon.classList.toggle('rotated');
}

document.getElementById('todoInput').addEventListener('keypress', addTodo);
updateDate();
loadTasks(); 