const todoList = document.querySelector("#todo");
const todoUL = todoList.querySelector("ul");

// Window load event
window.addEventListener("load", (event) => {
    console.log("Window loaded");

    // Load data when window is loaded
    loadData();
});


// Checks if list is empty, if it is, show empty text
function checkIfListIsEmpty() {
    const emptyTitle = document.querySelector(".list h1");
    if (todoUL.children.length == 0) {
        emptyTitle.className = "visible";
    } else {
        emptyTitle.className = "hidden";
    }

}


todoUL.addEventListener("change", function(event) {
    if (event.target && event.target.matches('.checkBox')) {
        markAsComplete(event);
    }
});

todoUL.addEventListener("click", function(event) {
    if (event.target && event.target.matches('.removeBtn')) {
        removeTask(event);
    }
});

todoUL.addEventListener("click", function(event) {
    if (event.target && event.target.matches('.editBtn')) {
        //removeTask(event);
    }
});

// Add task function
function addTask() {
    const inputField = document.querySelector(".inputField input");
    const inputValue = inputField.value.trim();
    
    // Make sure it's not empty before adding task
    if (inputValue != "") {
        // Create the list element
        const task = document.createElement("li");

        // Create the checkbox
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.className = "checkBox";

        // Create the paragraph element (the task name)
        const title = document.createElement("p");
        title.textContent = inputValue;

        // Create the Edit button
        const editButton = document.createElement("button");
        editButton.className = "editBtn btn";
        editButton.textContent = "Edit";

        // Create the Remove button
        const removeButton = document.createElement("button");
        removeButton.className = "removeBtn btn";
        removeButton.textContent = "Remove";
        
        // Append the elements
        task.appendChild(checkBox);
        task.appendChild(title);
        task.appendChild(editButton);
        task.appendChild(removeButton);

        // Append the task to the list
        todoUL.appendChild(task);
        saveData();

        // Check if list is empty (temporary)
        checkIfListIsEmpty();

    }
}

// Remove task function
function removeTask(event) {
    const task = event.target.closest("li");
    task.remove();
    checkIfListIsEmpty();
    console.log("Remove");
    saveData();
}

// Mark task as complete. (Assigns the class checked to the task, that's it for now)
function markAsComplete(event) {
    const task = event.target.closest("li");
    if (task.className != "checked") {
        task.classList.add("checked");
    } else {
        task.classList.remove("checked");
    }
    saveData();
}

// Save data function
function saveData() {

    // Does not save the state of the checkbox yet
    localStorage.setItem("taskList", todoUL.innerHTML);
    console.log("Data saved");
}

// Load data function
function loadData() {
    todoUL.innerHTML = localStorage.getItem("taskList");
    checkIfListIsEmpty();
    console.log("Tasks retrieved");
}


