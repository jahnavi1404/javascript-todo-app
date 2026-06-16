const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* Save State */
function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* Render UI */
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if(currentFilter === "active")
            return !task.completed;

        if(currentFilter === "completed")
            return task.completed;

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">

                <button class="toggle-btn">
                    ✓
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}

/* Create */
function addTask() {

    const text = taskInput.value.trim();

    if(!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed:false
    });

    saveTasks();
    renderTasks();

    taskInput.value="";
}

addBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keypress",
    e => {
        if(e.key==="Enter"){
            addTask();
        }
    }
);

/* Event Delegation */
taskList.addEventListener(
    "click",
    e => {

        const li =
            e.target.closest("li");

        if(!li) return;

        const id =
            Number(li.dataset.id);

        const task =
            tasks.find(
                t => t.id === id
            );

        /* Delete */
        if(
            e.target.classList.contains(
                "delete-btn"
            )
        ){

            tasks =
                tasks.filter(
                    t => t.id !== id
                );

            saveTasks();
            renderTasks();
        }

        /* Toggle Complete */
        if(
            e.target.classList.contains(
                "toggle-btn"
            )
        ){

            task.completed =
                !task.completed;

            saveTasks();
            renderTasks();
        }

        /* Update */
        if(
            e.target.classList.contains(
                "edit-btn"
            )
        ){

            const newText =
                prompt(
                    "Edit Task",
                    task.text
                );

            if(newText){

                task.text =
                    newText.trim();

                saveTasks();
                renderTasks();
            }
        }
    }
);

/* Filters */
filterBtns.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            filterBtns.forEach(
                b => b.classList.remove(
                    "active"
                )
            );

            btn.classList.add(
                "active"
            );

            currentFilter =
                btn.dataset.filter;

            renderTasks();
        }
    );
});

/* Initial Load */
renderTasks();