const todoList = document.querySelector("#todo");
const todoUL = todoList.querySelector("ul");

// Window load event
window.addEventListener("load", (event) => {
    console.log("Window loaded");

    // Load data when window is loaded
    loadData();
});

// Save data function
function saveData(taskID, taskData) {
    // Save the data, taskID being the key, taskData being the value
    // Task ID is a randomly generated key to make sure it's unique so it's easy to get information about that exact task
    localStorage.setItem(taskID, JSON.stringify(taskData));
    console.log("Data saved");
}

// Load data function
function loadData() {

    if (storageAvailable("localStorage")) {
        // Loops through storage
        for (let i = 0; i < localStorage.length; i++) {
            // Gets the taskID from the task
            const taskID = localStorage.key(i);
            // Gets the data that belongs to the taskID
            const taskData = JSON.parse(localStorage.getItem(taskID));
            const taskName = taskData.taskName;
            const isChecked = taskData.isChecked;
            
            // Sends the data to the create task elements function which will create the elements on the page
            createTaskElements(taskID, taskName, isChecked);
        }
        
        checkIfListIsEmpty();
        console.log("Tasks retrieved");
    } else {
        console.log("LocalStorage is not supported or available");
    }

}

// Delete data function
function deleteData(taskID) {
    localStorage.removeItem(taskID);
}

// Generated a unique ID
function generateUUID() {
    return Math.random().toString(16).slice(2);
}

// Checks if LocalStorage is supported and available
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === "QuotaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
        );
    }
}
  

// ------------------------------------------------------------------ //

// Checks if list is empty, if it is, show empty text
function checkIfListIsEmpty() {
    const emptyTitle = document.querySelector(".list h1");
    if (todoUL.children.length == 0) {
        emptyTitle.className = "visible";
    } else {
        emptyTitle.className = "hidden";
    }

}

// Adds the event listeners to the buttons
// Was added separately when buttons didn't work on reload. Can probably re-add these to the create task elements class now.
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

/*todoUL.addEventListener("click", function(event) {
    if (event.target && event.target.matches('.editBtn')) {
        //removeTask(event);
    }
});*/



todoUL.addEventListener("click", function(event) {
    if (event.target && event.target.matches('.taskTitle')) {
        console.log("Clicked title");
        editTask(event);
    }
});

// ------------------------------------------------------------------ //

// Create task element function, a function used when creating tasks and loading them back.
function createTaskElements(taskID, taskName, isChecked) {
    
    // Create the list element
    const task = document.createElement("li");
    if (isChecked) {
        task.className = "grid checked";
    } else {
        task.className = "grid";
    }
    task.id = taskID;

    // Create the checkbox
    const checkBox = document.createElement("input");
    checkBox.checked = isChecked;
    checkBox.type = "checkbox";
    checkBox.className = "checkBox";

    // Create the paragraph element (the task name)
    const title = document.createElement("p");
    title.className = "taskTitle";
    title.textContent = taskName;

    // Create the Edit button -- Unused
    /*const editButton = document.createElement("button");
    editButton.className = "editBtn btn";
    editButton.textContent = "Edit";*/

    // Create the Remove button
    const removeButton = document.createElement("button");
    removeButton.className = "removeBtn btn hoverBtn";
    removeButton.textContent = "Remove";
    
    // Append the elements
    task.appendChild(checkBox);
    task.appendChild(title);
    //task.appendChild(editButton);
    task.appendChild(removeButton);

    // Append the task to the list
    todoUL.appendChild(task);

}

// Add task function
function addTask() {
    const inputField = document.querySelector(".inputField input");
    const inputValue = inputField.value.trim();

    // Unique Task ID
    const taskID = generateUUID();
    const isChecked = false;
    
    // Make sure it's not empty before adding task
    if (inputValue != "") {
        
        // Use create task elements function to create the elements
        createTaskElements(taskID, inputValue, isChecked);

        inputField.value = "";

        // Save the data
        const taskData = {
            isChecked: isChecked,
            taskName: inputValue
        }
        saveData(taskID, taskData);

        // Check if list is empty (temporary)
        checkIfListIsEmpty();

    }
}

// Remove task function
function removeTask(event) {
    const task = event.target.parentElement;
    const taskID = task.id;
    task.remove();

    checkIfListIsEmpty();
    deleteData(taskID);
}

// Mark task as complete
function markAsComplete(event) {
    const task = event.target.parentElement;
    const taskID = task.id;
    const taskData = JSON.parse(localStorage.getItem(taskID));

    let updatedData;

    if (!taskData.isChecked) {
        task.classList.add("checked");
        updatedData = {
            isChecked: true,
            taskName: taskData.taskName
        }
    } else {
        task.classList.remove("checked");
        updatedData = {
            isChecked: false,
            taskName: taskData.taskName
        }
    }
    saveData(taskID, updatedData);
}


// Editing task function
// Allows the user to click on the paragraph element to edit the name of the task,
// Replaces the paragraph with an input that the user can enter the new name into and press enter to apply the changes
function editTask(event) {
    const paragraph = event.target;
    const task = paragraph.parentElement;
    const taskID = task.id;
    console.log(paragraph);
    const taskData = JSON.parse(localStorage.getItem(taskID));
    
    // Create the input element
    const editInput = document.createElement("input");
    editInput.type = "text"; // Set the input type as needed
    editInput.value = paragraph.textContent; // Set the input value to the paragraph's text content
    editInput.id = "editTaskInput";

    // Replace the paragraph with the input element
    task.replaceChild(editInput, paragraph);
    editInput.focus();

    editInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            
            const newName = editInput.value;
            task.replaceChild(paragraph, editInput);
            paragraph.textContent = newName;
            
            // Save the updated data
            const updatedData = {
                isChecked: taskData.isChecked,
                taskName: newName
            }
            saveData(taskID, updatedData);
        }
    });

    
}
