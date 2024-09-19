# Pantry Management App

This project is a simple pantry management web application that allows users to track items, manage inventory, and keep notes. It is built using React, Firebase for the backend, and i18n for internationalization, supporting both English and Dutch languages.

## Features

- **Add and Manage Pantry Items**: Users can add items with details such as name, quantity, and expiration date. Items can also be updated or deleted.
- **Track Expiring Items**: Items nearing expiration are highlighted, allowing users to take timely action.
- **Search Functionality**: Users can search for items based on their name.
- **Notes Section**: Users can add, view, and delete notes for reminders or other purposes.
- **Internationalization (i18n)**: The app supports multiple languages (currently English and Dutch).
- **Firebase Integration**: Items and notes are stored in Firebase Firestore, with real-time data fetching and updating.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **Firebase Firestore**: Backend to store and retrieve pantry items and notes.
- **i18n**: Internationalization support for switching between different languages.
- **Tailwind CSS**: Styling the UI components with a modern, responsive design.
- **JavaScript (ES6)**: For the logic and functionality of the application.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/MohKazz/pantry-management-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd pantry-management-app
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up Firebase:

   - Create a Firebase project and configure Firestore.
   - Add your Firebase configuration to `firebase.js` in the project.

5. Run the development server:

   ```bash
   npm run dev
   ```

6. The application will be running on `http://localhost:3000`.

## Usage

- **Adding Items**: Fill in the name, quantity, and expiration date of an item, then click "Add Item" to save it to the database.
- **Managing Inventory**: Use the "Increase" and "Decrease" buttons to adjust the quantity of an item, or the "Delete" button to remove it.
- **Search**: Use the search bar to filter items by name.
- **Notes**: Add new notes using the provided form and manage them by deleting unnecessary ones.
- **Language Switching**: Switch between English and Dutch using the buttons provided in the top-right corner.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, feel free to reach out:

- **Email**: [mohakhazza@gmail.com](mailto:mohakhazza@gmail.com)
- **GitHub**: [github.com/MohKazz](https://github.com/MohKazz)

Enjoy managing your pantry efficiently!
