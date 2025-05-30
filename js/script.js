const initialTasks = [
  {
    id: 1, //added from the inital data
    title: "Understand Given User Stories 🧠",
    description:
      "As a person building my project, I want to read and interpret the provided user stories so that I can plan and implement features that meet the user's needs.",
    status: "todo",
  },
  {
    id: 2,
    title: "Add More Design Features from Figma 🎨",
    description:
      "As a person refining my UI, I want to implement additional visual elements and layout improvements from the Figma design so that my project looks polished and professional.",
    status: "todo",
  },
  {
    id: 3,
    title: "Display Dynamic Data with JavaScript ⚡",
    description:
      "As a person building a responsive app, I want to fetch tasks from an API and display them on the board so that the content updates dynamically.",
    status: "doing",
  },
  {
    id: 4,
    title: "Write Clean, Modular Code 🧼",
    description:
      "As a person writing JavaScript, I want to organize my code into reusable functions or modules so that it's easier to maintain and debug.",
    status: "doing",
  },
  {
    id: 5,
    title: "Manually Test My Application 🧪",
    description:
      "As a person preparing for presentation, I want to manually test each part of my app to make sure task editing, movement, and storage work as expected.",
    status: "todo",
  },
  {
    id: 6,
    title: "Record a Demo Video 🎥",
    description:
      "As a person showcasing my work, I want to record a 3–5 minute video walkthrough explaining how my app works and the features I implemented.",
    status: "todo",
  },
  {
    id: 7,
    title: "Pitch My Project with Confidence 🎤",
    description:
      "As a person presenting my project, I want to prepare a short explanation of the problem, my solution, and what I learned so that I can share it with clarity and confidence.",
    status: "todo",
  },
  {
    id: 8,
    title: "Reflect on My Learning Journey 💭",
    description:
      "As a person completing my project, I want to write or record a short reflection on what I learned and what challenges I overcame so that I can grow from the experience.",
    status: "todo",
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
  const deleteTaskBtn = document.getElementById("delete-task-btn");

  deleteTaskBtn.addEventListener("click", () => {
    if (!currentEditingTask) return;

    const confirmDelete = confirm("Are you sure you wanna delete");

    if (!confirmDelete) return;

    // Remove from tasks array
    tasks = tasks.filter((task) => task.id !== currentEditingTask.id);

    // Remove from DOM
    const card = document.querySelector(`[data-id="${currentEditingTask.id}"]`);
    if (card) card.remove();

    // Save updated task list to localStorage
    saveTasksToLocalStorage();

    // Close modal
    modal.classList.add("hidden");
  });

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
