import React, { useState, useEffect } from 'react';
import VoiceInput from './components/VoiceInput';
import ItemList from './components/ItemList';
import { useTheme } from './components/ThemeProvider'; // ✅ Import ThemeProvider

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

// ThemeToggle component
// ThemeToggle component
const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg transition-all duration-200"
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};


function App() {
  const [shoppingList, setShoppingList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [alert, setAlert] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const fetchRecommendations = async () => {
    try {
      const historySnapshot = await getDocs(collection(db, 'shopping_history'));
      const historyItems = [];
      historySnapshot.forEach(doc => historyItems.push(doc.data()));

      // Dynamically pick API URL
const API_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_URL_DEV
    : import.meta.env.VITE_API_URL_PROD || ''; // fallback to relative path in production

const res = await fetch(`${API_URL}/voice-command/recommend`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ history: historyItems })
});

      const recData = await res.json();
      if (recData && recData.recommendations) {
        setRecommendations(recData.recommendations);
      }
    } catch (err) {
      console.error('❌ Failed to fetch recommendations:', err);
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'live_shopping_list'));
        const items = [];
        querySnapshot.forEach(doc => items.push(doc.data()));
        setShoppingList(items);
        await fetchRecommendations();
      } catch (err) {
        console.error('🔥 Failed to fetch shopping list:', err);
      }
    };

    fetchList();
  }, []);

  const updateList = (data) => {
    if (!data || data === 'Not a shopping command.') {
      setAlert('⚠️ Not a shopping command.');
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (data.intent === 'search_item') {
      const filtered = shoppingList.filter(item =>
        item.item.toLowerCase().includes(data.search_term.toLowerCase()) ||
        item.category?.toLowerCase().includes(data.search_term.toLowerCase()) ||
        item.brand?.toLowerCase().includes(data.search_term.toLowerCase())
      );

      setSearched(true);

      if (filtered.length === 0) {
        setSearchResults([]);
        setAlert('🔍 No matching items found.');
        setTimeout(() => setAlert(null), 3000);
      } else {
        setSearchResults(filtered);
        setAlert(`✅ Found ${filtered.length} item(s) matching "${data.search_term}"`);
        setTimeout(() => setAlert(null), 3000);
      }

      return;
    }

    setSearchResults([]);
    setSearched(false);

    setShoppingList(prev => {
      const existing = prev.find(entry => entry.item.toLowerCase() === data.item?.toLowerCase());

      if (data.intent === 'add_to_list') {
        const newItem = {
          item: data.item,
          quantity: data.quantity || 1,
          category: data.category || 'Uncategorized',
          price: (data.price || 0) * (data.quantity || 1),
          brand: data.brand || 'any',
          size: data.size || 'any'
        };

        const saveToFirebase = async () => {
          try {
            await setDoc(doc(db, 'live_shopping_list', newItem.item), newItem);
            await addDoc(collection(db, 'shopping_history'), {
              ...newItem,
              timestamp: new Date()
            });
            await fetchRecommendations();
          } catch (err) {
            console.error('🔥 Firestore write error:', err);
          }
        };

        saveToFirebase();

        setAlert(`✅ Added ${newItem.quantity} ${newItem.item}(s)`);
        setTimeout(() => setAlert(null), 3000);

        if (existing) {
          return prev.map(entry =>
            entry.item.toLowerCase() === data.item.toLowerCase()
              ? {
                  ...entry,
                  quantity: entry.quantity + newItem.quantity,
                  price: (newItem.price !== 0
                   ? (entry.quantity + newItem.quantity) * (newItem.price / newItem.quantity)
                     : entry.price),
                  category: newItem.category !== 'Uncategorized' ? newItem.category : entry.category,
                  brand: newItem.brand !== 'any' ? newItem.brand : entry.brand,
                  size: newItem.size !== 'any' ? newItem.size : entry.size
                }
              : entry
          );
        } else {
          return [...prev, newItem];
        }
      }

      if (data.intent === 'remove_from_list' && existing) {
        const updatedList = existing.quantity > data.quantity
          ? shoppingList.map(entry =>
              entry.item.toLowerCase() === data.item.toLowerCase()
                ? { ...entry, quantity: entry.quantity - data.quantity }
                : entry
            )
          : shoppingList.filter(entry => entry.item.toLowerCase() !== data.item.toLowerCase());

        const removeFromFirebase = async () => {
          try {
            if (existing.quantity <= data.quantity) {
              await deleteDoc(doc(db, 'live_shopping_list', existing.item));
            } else {
              await setDoc(doc(db, 'live_shopping_list', existing.item), {
                ...existing,
                quantity: existing.quantity - data.quantity
              });
            }
            await fetchRecommendations();
          } catch (err) {
            console.error('🔥 Failed to update Firestore on remove:', err);
          }
        };

        removeFromFirebase();

        setAlert(`❌ Removed ${data.quantity} ${data.item}(s)`);
        setTimeout(() => setAlert(null), 3000);

        return updatedList;
      }

      return prev;
    });
  };

  return (
    //<ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-500 gap-4">
            <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">🛒 Voice Shopping Assistant</h2>

            {/* VoiceInput + ThemeToggle */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <VoiceInput onResult={updateList} />
              <ThemeToggle />
            </div>
          </div>

          {/* Alert */}
          {alert && (
            <div className="mb-6 p-4 text-white bg-indigo-500 rounded-xl shadow-md text-center font-medium animate-pulse">
              {alert}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* List Section */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-500">
              {searched ? (
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">🔍 Search Results</h3>
                  <ItemList items={searchResults} />
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">📋 Shopping List</h3>
                  <ItemList items={shoppingList} />
                </>
              )}
            </div>

            {/* Recommendations Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-md rounded-xl p-6 border border-indigo-100 dark:border-gray-600 transition-colors duration-500">
              <h3 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                ✨ Recommendations
              </h3>
              {recommendations.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300 italic">No suggestions yet.</p>
              ) : (
                <div className="grid gap-3">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-400 transition-all duration-200 flex items-center gap-3"
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-600 text-indigo-600 dark:text-white text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-200">{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    //</ThemeProvider>
  );
}

export default App;
