const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
  },
  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
  },
  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
  },
  {
    id: 11,
    title: "Learn Data Structures and Algorithms 📚",
    description:
      "Study fundamental data structures and algorithms to solve coding problems efficiently",
    status: "todo",
  },
  {
    id: 12,
    title: "Contribute to Open Source Projects 🌐",
    description:
      "Gain practical experience and collaborate with others in the software development community",
    status: "done",
  },
  {
    id: 13,
    title: "Build Portfolio Projects 🛠️",
    description:
      "Create a portfolio showcasing your skills and projects to potential employers",
    status: "done",
  },
];

//task list
let tasks;

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// function to render tasks into correct columns
function renderTasks(tasks) {
  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = task.title;
    card.dataset.id = task.id;

    const column = document.querySelector(
      `.column[data-status="${task.status}"]`
    );
    const addButton = column.querySelector(".add-task-btn");
    column.insertBefore(card, addButton);

    card.addEventListener("click", () => {
      openModal(task);
    });
  });
}

// creating of modal
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalStatus = document.getElementById("modal-status");
const closeModalBtn = document.getElementById("close-modal");

// this is to edit tasks
let currentEditingTask = null;

// open modal with task data
function openModal(task) {
  currentEditingTask = task;
  modal.classList.remove("hidden");
  modalTitle.value = task.title;
  modalDescription.value = task.description;
  modalStatus.value = task.status;
}

// add click listeners
function addTaskClickEvents(tasks) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const taskId = parseInt(card.dataset.id);
      const task = tasks.find((t) => t.id === taskId);
      openModal(task);
    });
  });
}

// close modal and save changes
closeModalBtn.addEventListener("click", () => {
  if (currentEditingTask) {
    currentEditingTask.title = modalTitle.value;
    currentEditingTask.description = modalDescription.value;
    const newStatus = modalStatus.value;

    // update the card in the DOM
    const oldColumn = document.querySelector(
      `.column[data-status="${currentEditingTask.status}"]`
    );
    const card = oldColumn.querySelector(
      `[data-id="${currentEditingTask.id}"]`
    );

    // move card if status changed
    if (currentEditingTask.status !== newStatus) {
      const newColumn = document.querySelector(
        `.column[data-status="${newStatus}"]`
      );
      const addButton = newColumn.querySelector(".add-task-btn");
      newColumn.insertBefore(card, addButton);
      currentEditingTask.status = newStatus;
    }

    // update the card title
    card.textContent = currentEditingTask.title;

    saveTasksToLocalStorage();
  }

  modal.classList.add("hidden");
});

// load and initialize everything
document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || initialTasks;
  renderTasks(tasks);
  addTaskClickEvents(tasks);

  const addTaskTopBtn = document.getElementById("add-task-btn"); //we can now use the button

  addTaskTopBtn.addEventListener("click", () => {
    currentEditingTask = null;
    modalTitle.value = "";
    modalDescription.value = "";
    modalStatus.value = "todo";
    document.getElementById("modal-heading").textContent = "ADD NEW TASK";
    modal.classList.remove("hidden");
  });
});

const saveTaskBtn = document.getElementById("save-task-btn"); //find this on save task button
saveTaskBtn.addEventListener("click", () => {
  const title = modalTitle.value.trim();
  const description = modalDescription.value.trim();
  const status = modalStatus.value;

  if (!title) return; //ensure that there must be something written so its never blank

  if (currentEditingTask) return;

  const newTask = {
    //allows for the making of new task
    id: Date.now(),
    title,
    description,
    status,
  };

  tasks.push(newTask);
  saveTasksToLocalStorage(); //added this in order to save all changes

  const column = document.querySelector(`.column[data-status="${status}"]`);
  const addButton = column.querySelector(".add-task-btn");
  const card = document.createElement("div");
  card.classList.add("card");
  card.textContent = newTask.title;
  card.dataset.id = newTask.id;
  column.insertBefore(card, addButton);

  card.addEventListener("click", () => {
    openModal(newTask);
  });

  modal.classList.add("hidden");
});
