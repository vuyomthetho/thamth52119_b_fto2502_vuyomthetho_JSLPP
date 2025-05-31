const initialTasks = [
  {
    id: 1,
    title: "Understand Given User Stories 🧠",
    description:
      "As a person building my project, I want to read and interpret the provided user stories so that I can plan and implement features that meet the user's needs.",
    status: "todo",
    priority: "medium", // Other options: 'high', 'low'
  },
];

let tasks; // This will store the current task list (loaded from localStorage or default)
let currentEditingTask = null; // Used to keep track of which task is being edited in the modal

//modals
// These are the input fields and buttons inside the popup modal
const modal = document.getElementById("task-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalStatus = document.getElementById("modal-status");
const modalPriority = document.getElementById("modal-priority");
const modalHeading = document.getElementById("modal-heading");
const closeModalBtn = document.getElementById("close-modal");
const saveTaskBtn = document.getElementById("save-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");
const addTaskTopBtn = document.getElementById("add-task-btn");

// These handle sidebar toggle and dark/light theme switch
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const sidebarContainer = document.getElementById("sidebar-container");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");
const sidebarCloseBtn = document.getElementById("sidebar-close");
const themeToggle = document.getElementById("themeToggle");

// Save the current tasks list to localStorage so it remembers them after refreshing
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Hide the mobile sidebar and backdrop when user clicks outside or close button
function closeSidebar() {
  sidebarContainer.classList.remove("visible");
  sidebarBackdrop.classList.remove("active");
}

// Open the modal for either adding a new task or editing an existing one
function openModal(task = null) {
  currentEditingTask = task;

  if (task) {
    // We're editing an existing task
    modalTitle.value = task.title;
    modalDescription.value = task.description;
    modalStatus.value = task.status;
    modalPriority.value = task.priority || "medium";
    modalHeading.textContent = "EDIT TASK";
    saveTaskBtn.textContent = "Save Changes";
    deleteTaskBtn.classList.remove("hidden");
  } else {
    // We're adding a new task
    modalTitle.value = "";
    modalDescription.value = "";
    modalStatus.value = "todo";
    modalPriority.value = "medium";
    modalHeading.textContent = "ADD NEW TASK";
    saveTaskBtn.textContent = "Create Task";
    deleteTaskBtn.classList.add("hidden");
  }

  // Show the modal
  modal.classList.remove("hidden");
}

// Render (display) all tasks in the correct columns (todo, doing, done)
function renderTasks(taskList) {
  // First, remove all old task cards
  const columns = document.querySelectorAll(".column");
  columns.forEach((col) =>
    col.querySelectorAll(".card").forEach((c) => c.remove())
  );

  // These help us sort by priority and display emojis
  const priorityMap = { high: 0, medium: 1, low: 2 };
  const priorityEmoji = { high: "🔴", medium: "🟡", low: "🟢" };

  // Sort and render each task
  taskList
    .slice()
    .sort(
      (a, b) =>
        priorityMap[a.priority || "medium"] -
        priorityMap[b.priority || "medium"]
    )
    .forEach((task) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.id = task.id;

      const emoji =
        task.status !== "done" ? priorityEmoji[task.priority] || "🟡" : "";

      card.innerHTML = `<div class="card-title">${emoji} ${task.title}</div>`;

      const column = document.querySelector(
        `.column[data-status="${task.status}"]`
      );
      column.appendChild(card);

      // Clicking the card opens the modal for editing
      card.addEventListener("click", () => openModal(task));
    });
}
//event listeners

// When we click the top "Add Task" button
addTaskTopBtn.addEventListener("click", () => openModal());

// Close modal when clicking the close button
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));

// Save (or update) the task when the save button is clicked
saveTaskBtn.addEventListener("click", () => {
  const title = modalTitle.value.trim();
  const description = modalDescription.value.trim();
  const status = modalStatus.value;
  const priority = modalPriority.value;

  // Don't save if the title is empty
  if (!title) return;

  if (currentEditingTask) {
    // Update existing task
    currentEditingTask.title = title;
    currentEditingTask.description = description;
    currentEditingTask.status = status;
    currentEditingTask.priority = priority;
  } else {
    // Create new task
    const newTask = {
      id: Date.now(), // unique id
      title,
      description,
      status,
      priority,
    };
    tasks.push(newTask);
  }

  saveTasksToLocalStorage(); // Save to localStorage
  renderTasks(tasks); // Re-render the tasks
  modal.classList.add("hidden"); // Close modal
});

// Delete a task when the delete button is clicked
deleteTaskBtn.addEventListener("click", () => {
  if (!currentEditingTask) return;
  if (!confirm("Are you sure you want to delete this task?")) return;

  tasks = tasks.filter((task) => task.id !== currentEditingTask.id);
  saveTasksToLocalStorage();
  renderTasks(tasks);
  modal.classList.add("hidden");
});

//PAGE LOAD: Setup the app when the page finishes loading ===
document.addEventListener("DOMContentLoaded", async () => {
  await fetchTasksFromAPI();

  // Fallback: if fetch failed, use localStorage or initialTasks
  const saved =
    localStorage.getItem("kanban-data") || localStorage.getItem("tasks");
  tasks = saved ? JSON.parse(saved) : [...initialTasks];

  // Set default priority if missing
  tasks.forEach((task) => {
    if (!task.priority) task.priority = "medium";
  });

  saveTasksToLocalStorage(); // Save to "tasks" key for consistency
  renderTasks(tasks);

  // === Dark mode setup ===
  const isDark = localStorage.getItem("dark-mode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark-mode", themeToggle.checked);
  });
});

//sidebar

// Toggle sidebar collapse when sidebar toggle button is clicked
toggleSidebarBtn.addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("collapsed");
  toggleSidebarBtn.textContent = sidebar.classList.contains("collapsed")
    ? "Show Sidebar"
    : "Hide Sidebar";
});
async function fetchTasksFromAPI() {
  // STEP 1: Show loading message
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading tasks...";
  loadingMessage.id = "loading-msg";
  document.body.appendChild(loadingMessage);

  try {
    // STEP 2: Fetch tasks from the online API
    const response = await fetch("https://jsl-kanban-api.vercel.app/");
    if (!response.ok) throw new Error("Failed to fetch");

    // STEP 3: Get the tasks from the response
    const data = await response.json();

    // STEP 4: Save the tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(data));

    // STEP 5: Render them in your app
    renderTasks(data);

    // STEP 6: Remove the loading message
    loadingMessage.remove();
  } catch (error) {
    // STEP 7: Show error if something breaks
    loadingMessage.textContent = "❌ Error loading tasks. Please try again.";
    console.error("Fetch error:", error);
  }
}
