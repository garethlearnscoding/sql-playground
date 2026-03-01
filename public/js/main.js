/* Vendor Scripts */
import "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-sql.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js";


/* Custom Scripts */
import "./example.js";
import { initDB } from './db.js';
import { renderTable, attachUIHandlers } from './ui.js';

window.addEventListener("DOMContentLoaded", async () => {
  await initDB();
  renderTable();
  attachUIHandlers();
});