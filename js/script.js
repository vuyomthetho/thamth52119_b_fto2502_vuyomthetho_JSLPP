// Initial list of default tasks to load if none exist in localStorage
const initialTasks = [
  {
    id: 1,
    title: "Understand Given User Stories 🧠",
    description:
      "As a person building my project, I want to read and interpret the provided user stories so that I can plan and implement features that meet the user's needs.",
    status: "todo",
  },
  // ... other tasks (same structure)
];

// Variables to hold task data and the currently edited task
let tasks;
let currentEditingTask = null;

// Modal elements for viewing/creating/editing tasks
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalStatus = document.getElementById("modal-status");
const closeModalBtn = document.getElementById("close-modal");
const saveTaskBtn = document.getElementById("save-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");
const addTaskTopBtn = document.getElementById("add-task-btn");

// Save tasks to localStorage so they persist after refresh
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display each task card in the correct column
function renderTasks(tasks) {
  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = task.title;
    card.dataset.id = task.id;

    const column = document.querySelector(
      `.column[data-status="${task.status}"]`
    );
    column.appendChild(card);

    // Open modal to edit task when clicked
    card.addEventListener("click", () => {
      openModal(task);
    });
  });
}

// Fill modal with task data to edit
function openModal(task) {
  currentEditingTask = task;
  modal.classList.remove("hidden");
  modalTitle.value = task.title;
  modalDescription.value = task.description;
  modalStatus.value = task.status;
  document.getElementById("modal-heading").textContent = "EDIT TASK";
  saveTaskBtn.textContent = "Save Changes";
  deleteTaskBtn.classList.remove("hidden");
}

// When user clicks "+ Add New Task"
addTaskTopBtn.addEventListener("click", () => {
  currentEditingTask = null;
  modalTitle.value = "";
  modalDescription.value = "";
  modalStatus.value = "todo";
  document.getElementById("modal-heading").textContent = "ADD NEW TASK";
  saveTaskBtn.textContent = "Create Task";
  deleteTaskBtn.classList.add("hidden");
  modal.classList.remove("hidden");
});

// Close modal when "X" is clicked
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Save or update task when "Save" or "Create" button is clicked
saveTaskBtn.addEventListener("click", () => {
  const title = modalTitle.value.trim();
  const description = modalDescription.value.trim();
  const status = modalStatus.value;

  if (!title) return; // Prevent empty tasks

  // If editing existing task
  if (currentEditingTask) {
    currentEditingTask.title = title;
    currentEditingTask.description = description;

    const oldCard = document.querySelector(
      `[data-id="${currentEditingTask.id}"]`
    );
    oldCard.textContent = title;

    // If task status changed, move it to a new column
    if (currentEditingTask.status !== status) {
      const newColumn = document.querySelector(
        `.column[data-status="${status}"]`
      );
      newColumn.appendChild(oldCard);
      currentEditingTask.status = status;
    }

    saveTasksToLocalStorage();
  } else {
    // Create new task
    const newTask = {
      id: Date.now(),
      title,
      description,
      status,
    };

    tasks.push(newTask);
    saveTasksToLocalStorage();

    const column = document.querySelector(`.column[data-status="${status}"]`);
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = newTask.title;
    card.dataset.id = newTask.id;
    column.appendChild(card);

    // Set up click to edit new task
    card.addEventListener("click", () => {
      openModal(newTask);
    });
  }

  modal.classList.add("hidden");
});

// Delete task when delete button is clicked
deleteTaskBtn.addEventListener("click", () => {
  if (!currentEditingTask) return;
  const confirmDelete = confirm("Are you sure you wanna delete?");
  if (!confirmDelete) return;

  tasks = tasks.filter((task) => task.id !== currentEditingTask.id);
  const card = document.querySelector(`[data-id="${currentEditingTask.id}"]`);
  if (card) card.remove();
  saveTasksToLocalStorage();
  modal.classList.add("hidden");
});

// Load tasks when page is ready
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("tasks");
  tasks = saved ? JSON.parse(saved) : [...initialTasks];
  renderTasks(tasks);
});

// Sidebar toggle for mobile/desktop
const toggleBtn = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar-container");
const backdrop = document.getElementById("sidebar-backdrop");

// Show/hide sidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  backdrop.classList.toggle("show");
});

// Close sidebar when clicking outside
backdrop.addEventListener("click", () => {
  sidebar.classList.remove("open");
  backdrop.classList.remove("show");
});
const themeToggleBtn = document.getElementById("theme-toggle");

// Load saved theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggleBtn.textContent = "🌙";
}

// Toggle on click
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggleBtn.textContent = isDark ? "🌙" : "🌞";
});
