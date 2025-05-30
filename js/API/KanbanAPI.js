const API_URL = "https://jsl-kanban-api.vercel.app/";

export default class KanbanAPI {
  /**
   * Fetch tasks from the external API
   * @returns {Promise<Array>} - array of columns with tasks
   */
  static async fetchTasks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch tasks.");
      const data = await response.json();
      this.save(data);
      return data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  /**
   * Get items from a specific column from localStorage
   * @param {number} columnId
   * @returns {Array} items
   */
  static getItems(columnId) {
    const column = read().find((column) => column.id === columnId);
    return column ? column.items : [];
  }

  /**
   * Insert a new task into a column
   * @param {number} columnId
   * @param {string} content
   * @returns {object} new item
   */
  static insertItem(columnId, content) {
    const data = read();
    const column = data.find((column) => column.id === columnId);
    const newItem = {
      id: Math.floor(Math.random() * 100000),
      content: content,
    };

    if (!column) return;

    column.items.push(newItem);
    this.save(data);
    return newItem;
  }

  /**
   * Update an existing task
   * @param {number} itemId
   * @param {object} updates
   */
  static updateItem(itemId, updates) {
    const data = read();

    for (const column of data) {
      const item = column.items.find((item) => item.id === itemId);
      if (item) {
        Object.assign(item, updates);
        break;
      }
    }

    this.save(data);
  }

  /**
   * Delete a task by ID
   * @param {number} itemId
   */
  static deleteItem(itemId) {
    const data = read();

    for (const column of data) {
      const index = column.items.findIndex((item) => item.id === itemId);
      if (index > -1) {
        column.items.splice(index, 1);
        break;
      }
    }

    this.save(data);
  }

  /**
   * Save data to localStorage
   * @param {Array} data
   */
  static save(data) {
    localStorage.setItem("kanban-data", JSON.stringify(data));
  }

  /**
   * Load data from localStorage (or return defaults if not found)
   * @returns {Array}
   */
  static load() {
    return read();
  }
}

/**
 * Read Kanban data from localStorage
 * @returns {Array} columns with tasks
 */
function read() {
  const json = localStorage.getItem("kanban-data");

  if (!json) {
    return [
      { id: 1, name: "To Do", items: [] },
      { id: 2, name: "Doing", items: [] },
      { id: 3, name: "Done", items: [] },
    ];
  }

  return JSON.parse(json);
}
