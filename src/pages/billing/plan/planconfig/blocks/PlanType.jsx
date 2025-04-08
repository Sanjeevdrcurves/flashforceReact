/* eslint-disable prettier/prettier */
import React, { useState, useMemo, useEffect } from "react";
import { DataGrid } from "@/components";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { isPlanupdate } from "../../../../../redux/actions";
import axios from "axios";

const PlanType = ({ isDrawerOpen }) => {
  // State for categories, search term, and input fields
  const [categories, setCategories] = useState([]);
  const [categoryType, setcategoryType] = useState([]);

  const [planType, setPlantype] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [catId, setCatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.AuthReducerKey);
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

  // Reset states when the drawer is toggled
  useEffect(() => {
    setEditingCategoryId(null);
    setCategoryName("");
  }, [isDrawerOpen]);

  // Fetch list of Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/PlanCategory`);
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      toast.error("Failed to fetch categories!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all plan types (if needed at a global level)
  const fetchAllplanType = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/PlanType/GetAll`);
      const data = await response.json();
      setPlantype(data || []);
    } catch (error) {
      toast.error("Failed to fetch plan types!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data for the currently selected Category (populate the DataGrid)
  const fetchGridData = async (categoryId) => {
    if (!categoryId) {
      setcategoryType([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/PlanType/GetByPlanCategory?planCategoryId=${categoryId}`
      );
      const data = response.data;
      setcategoryType(data || []);
    } catch (error) {
      console.error("Error fetching grid data:", error);
      toast.error("Failed to fetch plan types for this category!");
    } finally {
      setLoading(false);
    }
  };

  // On component mount (or re-open), load categories and plan types
  useEffect(() => {
    fetchCategories();
    fetchAllplanType();
  }, [isDrawerOpen]);

  // Filter plan types in the grid based on the search term
  const filteredCategoryType = useMemo(() => {
    if (!searchTerm) return categoryType;
    return categoryType.filter((category) =>
      category.planTypeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, categoryType]);

  // Handle Category <Select> change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCatId(categoryId);
    fetchGridData(categoryId);
  };

  // Add or Update PlanType
  const handleSaveCategory = async () => {
    if (!catId) {
      toast.error("Please select a category first!");
      return;
    }
    if (!categoryName.trim()) {
      toast.error("Plan type name cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (editingCategoryId !== null) {
        // Update existing plan type
        response = await fetch(
          `${API_URL}/PlanType/Update?planTypeId=${editingCategoryId}&planTypeName=${categoryName}&planCategoryId=${catId}&modifiedBy=${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // Add new plan type
        response = await fetch(
          `${API_URL}/PlanType/Add?planTypeName=${categoryName}&planCategoryId=${catId}&createdBy=${userId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      // Refresh both the category list & the grid
      await fetchCategories();
      await fetchGridData(catId);

      // Reset input & editing state
      setCategoryName("");
      setEditingCategoryId(null);

      toast.success("Data saved successfully!");
      dispatch(isPlanupdate(selectedCategory));
      dispatch(isPlanupdate(editingCategoryId || categoryName));
    } catch (error) {
      toast.error("Failed to save data!");
    } finally {
      setLoading(false);
    }
  };

  // Edit a PlanType
  const handleEditCategory = (id, name) => {
    setEditingCategoryId(id);
    setCategoryName(name);
  };

  // Delete a PlanType
  // const handleDeleteCategory = async (id) => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(
  //       `${API_URL}/PlanType/Delete/${id}?modifiedBy=${userId}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to delete data");

  //     // Refresh both the category list & the grid
  //     await fetchCategories();
  //     await fetchGridData(catId);

  //     toast.success("Data deleted successfully!");
  //     dispatch(isPlanupdate(id));
  //   } catch (error) {
  //     toast.error("Failed to delete data!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/PlanType/Delete/${id}?modifiedBy=${userId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete data");

      // Update state without waiting for API
      setcategoryType((prev) => prev.filter(item => item.planTypeId !== id));

      toast.success("Data deleted successfully!");
      dispatch(isPlanupdate(id));
    } catch (error) {
      toast.error("Failed to delete data!");
    } finally {
      setLoading(false);
    }
};



  // Define columns for the DataGrid
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <span>{row.original.planTypeId}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Plan Type Name",
        cell: ({ row }) => <span>{row.original.planTypeName}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() =>
                handleEditCategory(
                  row.original.planTypeId,
                  row.original.planTypeName
                )
              }
              className="btn btn-warning btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteCategory(row.original.planTypeId)}
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
    <div className="plan-category">
      <Toaster />

      {/* Toolbar */}
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
       
        <Input
          placeholder="Search Plan Types"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        {/* Select a Category to filter plan types */}
        <Select
          value={selectedCategory}
          onValueChange={handleCategoryChange}
          disabled={loading}
          className="w-full selectbox"
        >
          <SelectTrigger className="w-full h-10" size="sm">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="w-40 select-content">
            {categories.map((category) => (
              <SelectItem
                key={category.planCategoryId}
                value={category.planCategoryId}
              >
                {category.planCategoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Input for Plan Type Name */}
        <Input
          placeholder="Plan Type Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          disabled={loading}
        />

        <a
          onClick={handleSaveCategory}
          className={`btn ${
            editingCategoryId !== null ? "btn-success w-50" : "btn-primary align-center"
          }`}
          disabled={loading}
        >
          {editingCategoryId !== null ? "Update" : "Add"}
        </a>
        
      
</div>
      {/* DataGrid */}
      <DataGrid
        columns={columns}
        data={filteredCategoryType}
        pagination={{ size: 10 }}
        loading={loading}
      />
    </div>
  );
};

export { PlanType };
