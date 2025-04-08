/* eslint-disable prettier/prettier */
import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid } from '@/components';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { isPlanupdate } from '../../../../../redux/actions';
import './DataGrid.css'

const PlanCategory = ({isDrawerOpen}) => {
  // State for categories, search term, and input fields
  const [categories, setCategories] = useState([]);
const dispatch=useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const {userId, companyId} = useSelector(state => state.AuthReducerKey);

  const [loading, setLoading] = useState(false); // For API call loading state

  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

useEffect(()=>{
  setEditingCategoryId(null);
  setCategoryName('');

},[isDrawerOpen])
  // Fetch categories on component mount (optional)
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/PlanCategory`);
     
      const data = await response.json();
      setCategories(data || []);
      console.log(data);
       // Adjust based on API response format
    } catch (error) {
      toast.error('Failed to fetch categories!');
    } finally {
      setLoading(false);
    }
  };

  // Call fetchCategories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on the search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((category) =>
      category.planCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, categories]);

  // Add or update a category
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Category name cannot be empty!');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (editingCategoryId !== null) {
        // Update category API
        response = await fetch(`${API_URL}/PlanCategory/Update?id=${editingCategoryId}&planCategoryName=${categoryName}&modifiedBy=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        dispatch(isPlanupdate(editingCategoryId))
      fetchCategories();


      } else {
        // Add new category API
        response = await fetch(`${API_URL}/PlanCategory/Add?planCategoryName=${categoryName}&createdBy=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        fetchCategories();
      dispatch(isPlanupdate(categoryName))
     
      }
      if (editingCategoryId !== null) {
          toast.success('Category updated successfully!');
      }
      else{
        toast.success('Category added successfully!');
      }
     

      //const result = await response.json();
      
      // if (editingCategoryId !== null) {
      //   // Update category in state
      //   setCategories((prev) =>
      //     prev.map((category) =>
      //       category.id === editingCategoryId
      //         ? { ...category, name: categoryName }
      //         : category
      //     )
      //   );
      //   toast.success('Category updated successfully!');
      //   setEditingCategoryId(null); // Reset editing state
      // } else {
      //   // Add new category to state
      //   setCategories((prev) => [...prev, result.category]); // Adjust based on API response
      //   toast.success('Category added successfully!');
      // }

      setCategoryName(''); // Clear input field
    } catch (error) {
      toast.error('Failed to save category!');
    } finally {
      setLoading(false);
    }
  };

  // Edit a category
  const handleEditCategory = (id, name) => {
    setEditingCategoryId(id);
    setCategoryName(name); // Pre-fill input field with current category name
  };

  // Delete a category
  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/PlanCategory/${id}?modifiedBy=${userId}`, {
        method: 'DELETE',
      });
      dispatch(isPlanupdate(id))
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
     fetchCategories();
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete category!');
    } finally {
      setLoading(false);
    }
  };

  // Define columns for the DataGrid
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <span>{row.original.planCategoryId}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Category Name',
        cell: ({ row }) => <span>{row.original.planCategoryName}</span>,
      },
 
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditCategory(row.original.planCategoryId, row.original.planCategoryName)}
              className="btn btn-warning btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteCategory(row.original.planCategoryId)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="plan-category" >
      {/* Toast notifications */}
      <Toaster />

      {/* Toolbar */}
      <div className="toolbar mb-4 flex flex-col sm:flex-row gap-2 items-center">
  {/* Search Input - Smaller Width */}
  <Input
    placeholder="Search Categories"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-40 sm:w-60" // Adjust width as needed
  />
  
  <div className="flex gap-2 items-center">
    {/* Category Input */}
    <Input
      placeholder="Category Name"
      value={categoryName}
      onChange={(e) => setCategoryName(e.target.value)}
      disabled={loading}
      className="w-48 sm:w-64" // Adjust width as needed
    />
    
    {/* Wider Button */}
    <button
      onClick={handleSaveCategory}
      className={`btn ${editingCategoryId !== null ? 'btn-success' : 'btn-primary'} w-32 sm:w-40 flex justify-center items-center text-center`} 
      disabled={loading}
    >
      {editingCategoryId !== null ? 'Update' : 'Add'}
      </button>
  </div>
</div>


      {/* DataGrid */}
      <DataGrid
        columns={columns}
        data={filteredCategories}
        pagination={{ size: 10 }}
        loading={loading}
      />
    </div>
  );
};

export { PlanCategory };
