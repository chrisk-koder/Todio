
// Add Task Function
function addTask() {
    // Get the todo list
    const todoList = document.querySelector("#todo")
    // Get the text input
    const textInput = document.querySelector("#taskInput");
    // Trims the input
    const taskText = textInput.value.trim();

    // Check if text input is NOT empty
    if (taskText != "") {
        
        // Create the li element
        const task = document.createElement("li");

        // Set the text of the li element to text from input
        task.textContent = taskText;

        // Create the remove button
        const removeButton = document.createElement("button");
        
        const removeIcon = document.createElement("i");
        removeIcon.setAttribute("data-feather", "x");
        removeButton.appendChild(removeIcon);
        
        removeButton.onclick = function() {
            // Remove the task and button
            task.remove();
            removeButton.remove();
        };
        
        // Append the task to the todo list
        todoList.appendChild(task);
        // Append the remove button to the task
        todoList.appendChild(removeButton);
        
        // Reset text in input after
        textInput.value = "";
    }

}