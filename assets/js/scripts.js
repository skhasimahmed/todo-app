const addTodoButton = document.getElementById('add-todo'),
    btnText = addTodoButton.innerText,
    todoInput = document.getElementById('todo-input'),
    todosList = document.getElementById('todos-list'),
    addTodoForm = document.getElementById('add-todo-form'),
    errorMessage = document.getElementById('error-message')

let todos = [],
    editId = null,
    allTrs,
    objStr = localStorage.getItem('todos')

if (objStr != null) todos = JSON.parse(objStr)

displayTodos(true)

addTodoForm.addEventListener('submit', (event) => {
    event.preventDefault()

    errorMessage.hidden = true

    const todo = todoInput.value.trim()

    // empty task checking
    if (!todo.length) {
        printErrorMessage('Task name can not be empty.')
        return
    }

    // duplicate task name checking
    if (isDuplicateTodo(todo, editId)) {
        printErrorMessage(`${todo} is already present in your todo list. Try adding a different task.`)
        return
    }

    if (editId != null) {
        let spliceIndex = undefined

        let selectedTodo = todos.map((todo, index) => {
            if (todo.id == editId) {
                spliceIndex = index
                return todo
            }
        })

        if (typeof spliceIndex != 'undefined') {
            todos.splice(spliceIndex, 1, {
                ...selectedTodo[spliceIndex],
                'title': todo
            })

            editId = null
        }
    } else {
        todos.unshift({
            'title': todo,
            'id': uniq = 'todo-' + (new Date()).getTime(),
            'completedAt': null,
            'isComplete': false
        })
    }

    saveTodo(todos)

    todoInput.value = ``

    addTodoButton.innerText = btnText
})

const saveTodo = (todos, focus = true) => {
    let todosString = JSON.stringify(todos)

    localStorage.setItem('todos', todosString)

    displayTodos(focus)
}

function displayTodos(focus) {
    const noDataElement = document.getElementById('no-data')

    if (todos.length) noDataElement.hidden = true
    else noDataElement.hidden = false

    let html = ``

    todos.forEach((todo, i) => {
        let titleText = ``,
            className = ``,
            completedAtHTML = ``

        if (!todo.isComplete) {
            titleText = `Mark as complete`
        } else {
            titleText = `Mark as incomplete`
            className = `completed`
            completedAtHTML = `<br>
            <span class="completed-text">Completed at: ${todo.completedAt}</span>`
        }

        html += `<tr>
            <td>
                <span href="javascript:void(0);" style="cursor:pointer; font-weight: 500;" title="${titleText}" onClick="markAsCompleted('${todo.id}')" class="${className}">${todo.title}</span> 
                
                ${completedAtHTML}
            </td>

            <td style="text-align: right; vertical-align: middle;">
                <div style="display:inline-flex;">
                    <i title="Edit todo" class="edit-todo btn text-white fa fa-edit btn-info mx-2" onClick="editTodo('${todo.id}')"></i>
                    <i title="Delete todo" class="delete-todo btn btn-danger text-white fa fa-trash" onClick="deleteTodo('${todo.id}')" id="delete-${todo.id}"></i>
                </div>
            </td>
        </tr>`
    })

    todosList.innerHTML = html

    allTrs = document.querySelectorAll('#todos-list tr')

    if (focus) todoInput.focus()
}

const editTodo = (todoId) => {
    // Enable previously disabled delete todo option
    if (document.querySelector('.hide-for-editing')) {
        document.querySelector('.hide-for-editing').classList.remove('hide-for-editing')
    }

    // Disable delete todo option while editing
    document.getElementById(`delete-${todoId}`).classList.add('hide-for-editing')

    let selectedTodo = todos.filter(todo => {
        return todo.id == todoId
    })

    if (selectedTodo.length) {
        editId = selectedTodo[0].id

        todoInput.value = selectedTodo[0].title
        todoInput.focus()

        addTodoButton.innerText = 'Save Changes'
    }
}

const deleteTodo = (todoId) => {
    let spliceIndex = undefined

    let selectedTodo = todos.map((todo, index) => {
        if (todo.id == todoId) {
            spliceIndex = index
            return todo
        }
    })

    if (typeof spliceIndex != 'undefined') {
        todos.splice(spliceIndex, 1)

        saveTodo(todos, false)
    }
}

const selectedTodo = (todoId) => {
    return 'null'
}

const markAsCompleted = (todoId) => {
    console.log(this);
    let date = new Date()

    let options = {
        weekday: "long", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
    }

    let completedAt = date.toLocaleTimeString("en-us", options)

    let spliceIndex = undefined

    let selectedTodo = todos.map((todo, index) => {
        if (todo.id == todoId) {
            spliceIndex = index
            return todo
        }
    })

    if (typeof spliceIndex != 'undefined') {
        let isComplete = !selectedTodo[spliceIndex].isComplete

        if (!isComplete) completedAt = null

        todos.splice(spliceIndex, 1, {
            ...selectedTodo[spliceIndex],
            isComplete,
            completedAt
        })

        saveTodo(todos, false)
    }
}

const printErrorMessage = (message) => {
    if (message.trim().length) {
        todoInput.focus()
        errorMessage.hidden = false
        errorMessage.innerHTML = message
    }
}

const isDuplicateTodo = (todo, editId) => {
    let isDuplicate = false

    todos.map(todoItem => {
        if (todoItem.title == todo && editId != todoItem.id) isDuplicate = true
    })

    return isDuplicate
}
