document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");

    function loadTasks() {
        fetch("/tasks")
            .then(res => res.json())
            .then(tasks => {
                taskList.innerHTML = "";
                tasks.forEach(task => {
                    const li = document.createElement("li");
                    li.classList.toggle("completed", task.completed === 1);

                    const span = document.createElement("span");
                    span.textContent = task.text;
                    span.style.cursor = "pointer";
                    span.onclick = () => toggleTask(task.id, task.completed === 0); // TOGGLE

                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "X";
                    deleteBtn.className = "delete-btn";
                    deleteBtn.onclick = () => deleteTask(task.id);

                    li.appendChild(span);
                    li.appendChild(deleteBtn);
                    taskList.appendChild(li);
                });
            });
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        fetch("/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, completed: false })
        })
        .then(() => {
            taskInput.value = "";
            loadTasks();
        });
    }

    function toggleTask(id, completed) {
        fetch(`/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed })
        })
        .then(() => loadTasks());
    }

    function deleteTask(id) {
        fetch(`/tasks/${id}`, { method: "DELETE" })
            .then(() => loadTasks());
    }

    addTaskBtn.addEventListener("click", addTask);
    loadTasks();
});
