import KanbanAPI from "./kanbanAPI.js";

const todoItems = KanbanAPI.getItems(1); // Get items in "To Do"
console.log(todoItems); // Example output
