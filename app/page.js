"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import { useTranslation } from 'react-i18next';
import './i18n'; // Import i18n configuration

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', expirationDate: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const { t, i18n } = useTranslation();

  // Fetch items from the database
  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'pantryItems'));
      const itemsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        quantity: doc.data().quantity,
        expirationDate: doc.data().expirationDate
      }));
      setItems(itemsArray);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  // Fetch notes from the database
  const fetchNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notes'));
      const notesArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        content: doc.data().content
      }));
      setNotes(notesArray);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  // Add items to the database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity !== '') {
      try {
        await addDoc(collection(db, 'pantryItems'), {
          name: newItem.name.trim(),
          quantity: parseInt(newItem.quantity, 10) || 0,
          expirationDate: newItem.expirationDate
        });
        setNewItem({ name: '', quantity: '', expirationDate: '' }); // Reset form
        fetchItems(); // Refresh items after adding
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      console.warn('Name or quantity is missing.');
    }
  };

  // Add a note to the database
  const addNote = async (e) => {
    e.preventDefault();
    if (newNote.trim() !== '') {
      try {
        await addDoc(collection(db, 'notes'), { content: newNote.trim() });
        setNewNote(''); // Reset form
        fetchNotes(); // Refresh notes after adding
      } catch (error) {
        console.error("Error adding note: ", error);
      }
    } else {
      console.warn('Note content is missing.');
    }
  };

  // Delete an item from the database
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantryItems', id));
      fetchItems(); // Refresh items after deleting
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Delete a note from the database
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      fetchNotes(); // Refresh notes after deleting
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  // Update the quantity of an item
  const updateQuantity = async (id, change) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change); // Ensure quantity doesn't go below 0
      try {
        await updateDoc(doc(db, 'pantryItems', id), { quantity: newQuantity });
        fetchItems(); // Refresh items after updating
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  // Calculate upcoming expirations
  const upcomingExpirations = items.filter(item => 
    new Date(item.expirationDate) < new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  // Filter items based on the search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch items and notes when the component mounts
  useEffect(() => {
    fetchItems();
    fetchNotes();
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-900 via-red-900 to-black p-4 md:p-8">
      <header className="text-center text-white mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t('title')}</h1>
        <p className="text-base md:text-lg">{t('description')}</p>
      </header>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={() => i18n.changeLanguage('en')}
          title="English"
          className="p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
        >
          <img src="/flags/en.svg" alt="English" className="w-8 h-8" />
        </button>
        <button
          onClick={() => i18n.changeLanguage('nl')}
          title="Dutch"
          className="p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
        >
          <img src="/flags/nl.svg" alt="Dutch" className="w-8 h-8" />
        </button>
      </div>

      {/* Add New Item Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-400">{t('addNewItem')}</h2>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-3" onSubmit={addItem}>
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
            type="text"
            placeholder={t('itemName')}
          />
          <input
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
            type="number"
            placeholder={t('quantity')}
          />
          <input
            value={newItem.expirationDate}
            onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
            type="date"
            placeholder={t('expirationDate')}
          />
          <button
            className="bg-red-600 text-white p-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 col-span-1 md:col-span-3"
            type='submit'>
            {t('addNewItem')}
          </button>
        </form>
      </section>

      {/* Search and Items Section */}
      <div className="flex flex-col items-center w-full space-y-8">
        
        {/* Search Items */}
        <section className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-400">{t('searchItems')}</h2>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 mb-4 w-full"
            type="text"
            placeholder={t('search')}
          />
        </section>

        {/* All Items */}
        <section className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-400">{t('All Items')}</h2>
          {filteredItems.length > 0 ? (
            <ul className="space-y-4">
              {filteredItems.map((item) => (
                <li key={item.id} className="flex flex-col md:flex-row justify-between items-start bg-blue-100 shadow-lg rounded-lg p-4 border border-gray-300">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Expires: {new Date(item.expirationDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 md:mt-0 md:ml-4">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="bg-yellow-500 text-white p-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
                      {t('decrease')}
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                      {t('increase')}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
                      {t('delete')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">{t('noItems')}</p>
          )}
        </section>

        {/* Upcoming Expirations */}
        <section className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-400">{t('upcomingExpirations')}</h2>
          {upcomingExpirations.length > 0 ? (
            <ul className="space-y-4">
              {upcomingExpirations.map((item) => (
                <li key={item.id} className="flex flex-col md:flex-row justify-between items-start bg-yellow-100 shadow-lg rounded-lg p-4 border border-gray-300">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Expires: {new Date(item.expirationDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300 mt-2 md:mt-0 md:ml-4">
                    {t('delete')}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">{t('noItems')}</p>
          )}
        </section>
      </div>

      {/* Notes Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mt-8 w-full max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-400">{t('Notes')}</h2>
        <form onSubmit={addNote} className="mb-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-300 mb-4 w-full"
            placeholder={t('writeNote')}
            rows="4"
          />
          <button
            className="bg-red-600 text-white p-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            type="submit">
            {t('addNote')}
          </button>
        </form>
        {notes.length > 0 ? (
          <ul className="space-y-4">
            {notes.map((note) => (
              <li key={note.id} className="flex justify-between items-start bg-gray-100 shadow-lg rounded-lg p-4 border border-gray-300">
                <p className="text-black">{note.content}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
                  {t('delete')}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{t('noNotes')}</p>
        )}
      </section>

      <footer className="text-center text-white mt-8 p-4">
        <p>{t('createdBy')} <a href="https://lp-mocha.vercel.app/" target="_blank" className="text-teal-400 hover:underline">{t('website')}</a>.</p>
      </footer>
    </main>
  );
}
