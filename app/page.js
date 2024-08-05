"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import { useTranslation } from 'react-i18next';
import './i18n'; // Import i18n configuration

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', expirationDate: '' });
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

  // Delete an item from the database
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantryItems', id));
      fetchItems(); // Refresh items after deleting
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Calculate upcoming expirations
  const upcomingExpirations = items.filter(item => 
    new Date(item.expirationDate) < new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-red-900 to-black p-8">
      <header className="text-center text-white mb-8">
        <h1 className="text-5xl font-bold mb-2">{t('title')}</h1>
        <p className="text-lg">{t('description')}</p>
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

      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4 text-gray-400">{t('addNewItem')}</h2>
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

      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4 text-gray-400">{t('upcomingExpirations')}</h2>
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

      {/* Reintroduced section to display all items */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4 text-gray-400">{t('All Items')}</h2>
        {items.length > 0 ? (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col md:flex-row justify-between items-start bg-blue-100 shadow-lg rounded-lg p-4 border border-gray-300">
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

      <footer className="text-center text-white mt-8">
        <p>{t('createdBy')} <a href="https://mohkazz.github.io/LP/" target="_blank" className="text-teal-400 hover:underline">{t('website')}</a>.</p>
      </footer>
    </main>
  );
}
