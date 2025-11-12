# Library Inventory Management System
[https://inventory-application-ivory.vercel.app/author](https://inventory-application-ivory.vercel.app)
Might show an internal server error sometimes because the Neon server where the backend is hosted sleeps and might not respond. 

A full-stack web application for managing a library's book inventory. This application allows users to browse, add, edit, and delete books from the inventory. It features a clean and intuitive user interface and a robust backend powered by Node.js and PostgreSQL.

## Features

*   **View All Books:** Browse the entire book collection on the main page.
*   **Detailed View:** Click on a book to see more details, including synopsis, rating, and number of copies.
*   **Add New Books:** Easily add new books to the inventory through a dedicated form.
*   **Edit Book Details:** Update the information of existing books.
*   **Delete Books:** Remove books from the inventory.
*   **Filter by Genre and Author:** Sort the book collection by genre or author to easily find what you're looking for.
*   **Admin Protection:** Destructive actions such as editing and deleting books are protected by an admin password.

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **Frontend:** EJS (Embedded JavaScript templates), CSS, JavaScript
*   **Dependencies:** `pg` for PostgreSQL connection, `express-validator` for input validation.
