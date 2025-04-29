import React, { useState, useEffect } from 'react';
import { getMenuItems, updateMenuItem, addMenuItem } from '../../db/database';
import { MenuItem } from '../../types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'> | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  useEffect(() => {
    loadMenuItems();
  }, []);
  
  const loadMenuItems = () => {
    const items = getMenuItems();
    setMenuItems(items);
  };
  
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);
  
  const handleToggleAvailability = (item: MenuItem) => {
    const updatedItem = { ...item, available: !item.available };
    updateMenuItem(updatedItem);
    setMenuItems(prevItems =>
      prevItems.map(menuItem => (menuItem.id === item.id ? updatedItem : menuItem))
    );
  };
  
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem(null);
  };
  
  const handleCancelEdit = () => {
    setEditingItem(null);
  };
  
  const handleSaveEdit = () => {
    if (editingItem) {
      updateMenuItem(editingItem);
      setMenuItems(prevItems =>
        prevItems.map(item => (item.id === editingItem.id ? editingItem : item))
      );
      setEditingItem(null);
    }
  };
  
  const handleAddNewItem = () => {
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: '',
      available: true,
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800'
    });
    setEditingItem(null);
  };
  
  const handleCancelAdd = () => {
    setNewItem(null);
  };
  
  const handleSaveNewItem = () => {
    if (newItem && newItem.name && newItem.price > 0 && newItem.category) {
      const addedItem = addMenuItem(newItem);
      setMenuItems(prevItems => [...prevItems, addedItem]);
      setNewItem(null);
    }
  };
  
  const handleEditChange = (field: keyof MenuItem, value: string | number | boolean) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };
  
  const handleNewItemChange = (field: keyof Omit<MenuItem, 'id'>, value: string | number | boolean) => {
    if (newItem) {
      setNewItem({ ...newItem, [field]: value });
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        <button 
          className="btn btn-primary flex items-center"
          onClick={handleAddNewItem}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Item
        </button>
      </div>
      
      {/* Category tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${activeCategory === category 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-amber-50'
                }
              `}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Add new item form */}
      {newItem && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Menu Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input 
                type="text"
                className="input"
                value={newItem.name}
                onChange={(e) => handleNewItemChange('name', e.target.value)}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                type="text"
                className="input"
                value={newItem.category}
                onChange={(e) => handleNewItemChange('category', e.target.value)}
                placeholder="e.g., Main, Sides, Beverages"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                className="input"
                value={newItem.price}
                onChange={(e) => handleNewItemChange('price', parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                type="text"
                className="input"
                value={newItem.image}
                onChange={(e) => handleNewItemChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="input"
                rows={3}
                value={newItem.description}
                onChange={(e) => handleNewItemChange('description', e.target.value)}
                placeholder="Enter item description"
              ></textarea>
            </div>
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="newItemAvailable"
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                checked={newItem.available}
                onChange={(e) => handleNewItemChange('available', e.target.checked)}
              />
              <label htmlFor="newItemAvailable" className="ml-2 block text-sm text-gray-700">
                Available for ordering
              </label>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn btn-primary flex items-center"
              onClick={handleSaveNewItem}
            >
              <Save className="mr-2 h-5 w-5" />
              Save Item
            </button>
            <button 
              className="btn btn-outline flex items-center"
              onClick={handleCancelAdd}
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Edit item form */}
      {editingItem && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Menu Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input 
                type="text"
                className="input"
                value={editingItem.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input 
                type="text"
                className="input"
                value={editingItem.category}
                onChange={(e) => handleEditChange('category', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                className="input"
                value={editingItem.price}
                onChange={(e) => handleEditChange('price', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                type="text"
                className="input"
                value={editingItem.image}
                onChange={(e) => handleEditChange('image', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="input"
                rows={3}
                value={editingItem.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
              ></textarea>
            </div>
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="itemAvailable"
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                checked={editingItem.available}
                onChange={(e) => handleEditChange('available', e.target.checked)}
              />
              <label htmlFor="itemAvailable" className="ml-2 block text-sm text-gray-700">
                Available for ordering
              </label>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn btn-primary flex items-center"
              onClick={handleSaveEdit}
            >
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </button>
            <button 
              className="btn btn-outline flex items-center"
              onClick={handleCancelEdit}
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Menu items table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-amber-600 hover:text-amber-900 mr-3"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      className={`${item.available ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                      onClick={() => handleToggleAvailability(item)}
                    >
                      {item.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;