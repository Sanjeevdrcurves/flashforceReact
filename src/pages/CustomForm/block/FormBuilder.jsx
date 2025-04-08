import React, { useState, useRef, useEffect, Fragment } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

/* ------------------------------------------------
   Utility: Generate Unique IDs
   ------------------------------------------------*/
let idCounter = 0;
const generateRandomId = () => `field-${++idCounter}`;

const API_URL =
  import.meta.env.VITE_FLASHFORCE_API_URL || "http://localhost:3000";

/* ------------------------------------------------
   CompanyHeader Component
   (Optional - Placeholder for your company logo/header)
   ------------------------------------------------*/
function CompanyHeader() {
  return (
    <div className="mb-6">
      {/* Your Company Header (optional) */}
    </div>
  );
}

/* ------------------------------------------------
   LibraryFieldItem Component
   (Displays each available field in the library)
   ------------------------------------------------*/
function LibraryFieldItem({ field, onDropLibraryField }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "libraryField",
    item: { ...field },
    end: (draggedItem, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.name === "DroppableArea") {
        onDropLibraryField(draggedItem);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center justify-between p-3 bg-gray-100 border rounded shadow hover:bg-gray-200 cursor-move transition duration-200 ease-in-out"
    >
      <div className="flex items-center">
        <span className="text-xl mr-2 text-blue-500">{field.icon}</span>
        <span className="font-medium text-gray-700">{field.label}</span>
      </div>
      <span className="text-gray-400">⋮</span>
    </div>
  );
}

/* ------------------------------------------------
   FormFieldItem Component (Accordion-style)
   (Displays each field within your form for editing)
   ------------------------------------------------*/
function FormFieldItem({
  field,
  index,
  moveField,
  onRemoveField,
  onLabelChange,
  onRequiredChange,
  onAddOption,
  onOptionChange,
  onRemoveOption,
  onMaxWordsChange,
  onPropertyChange, // <-- for updating searchable & multiSelect (or any other property)
  activePage,
  setPages,
}) {
  const [isOpen, setIsOpen] = useState(true);

  // Draggable
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "formField",
    item: { id: field?.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  // Drop target for reordering
  const [, dropRef] = useDrop({
    accept: "formField",
    hover: (draggedItem) => {
      if (draggedItem.id === field.id) return;
      const fromIndex = draggedItem.index;
      const toIndex = index;
      if (fromIndex !== toIndex) {
        moveField(fromIndex, toIndex);
        draggedItem.index = toIndex;
      }
    },
  });

  const ref = useRef(null);
  dragRef(dropRef(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="border border-gray-300 rounded-lg shadow hover:shadow-md transition duration-200 ease-in-out mb-4"
    >
      {/* Accordion Header */}
      <div className="flex items-center justify-between bg-gray-200 p-2 select-none">
        <div className="flex items-center space-x-2">
          {/* Toggle Accordion */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {isOpen ? "–" : "+"}
          </button>
          <span className="font-semibold">
            {field.label || field.type || "Field"}
          </span>
        </div>
        {/* Remove Field Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveField(field.id);
          }}
          className="text-red-500 mr-2 focus:outline-none"
          title="Remove Field"
        >
          ✖
        </button>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-4 bg-white">
          {/* Field Label */}
          <input
            type="text"
            value={field?.label}
            onChange={(e) => onLabelChange(field.id, e.target.value)}
            className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter field label here..."
          />

          {/* Required Checkbox */}
          <label className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              checked={field?.required}
              onChange={(e) => onRequiredChange(field.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-700">Required</span>
          </label>

          {/* For text, textarea, email, password => Max Character Limit */}
          {["text", "textarea", "email", "password"].includes(field?.type) && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Maximum Character Limit (optional)
              </label>
              <input
                type="number"
                min="1"
                value={field?.maxWords || ""}
                onChange={(e) => onMaxWordsChange(field.id, e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none mt-1"
                placeholder="e.g. 100"
              />
            </div>
          )}

          {/* Field-Specific Preview (disabled) */}
          {field.type === "text" && (
            <input
              disabled
              type="text"
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="(Enter text...)"
            />
          )}
          {field.type === "email" && (
            <input
              disabled
              type="email"
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="(Enter email...)"
            />
          )}
          {field.type === "tel" && (
            <input
              disabled
              type="tel"
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="(Enter phone number...)"
            />
          )}
          {field.type === "textarea" && (
            <textarea
              disabled
              rows="4"
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="(Write something...)"
            />
          )}
          {field.type === "date" && (
            <input
              disabled
              type="date"
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="(Select a date...)"
            />
          )}
          {field.type === "checkbox" && (
            <div>
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    disabled
                    className="mr-2 w-10 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      onOptionChange(field.id, optIndex, e.target.value)
                    }
                    className="border p-2 flex-1 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Option label..."
                  />
                  <button
                    onClick={() => onRemoveOption(field.id, optIndex)}
                    className="ml-2 text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => onAddOption(field.id)}
                className="text-blue-500 text-sm mt-2 hover:underline"
              >
                + Add Option
              </button>
            </div>
          )}
          {field.type === "radio" && (
            <div className="mt-2">
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <input
                    disabled
                    type="radio"
                    name={`radio-${field.id}`}
                    className="w-4 h-4 flex-shrink-0 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      onOptionChange(field.id, optIndex, e.target.value)
                    }
                    className="border p-2 rounded focus:ring-2 focus:ring-blue-400 
                               focus:outline-none flex-grow mx-2"
                    placeholder="Radio label..."
                  />
                  <button
                    onClick={() => onRemoveOption(field.id, optIndex)}
                    className="text-red-500 text-sm hover:underline flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => onAddOption(field.id)}
                className="text-blue-500 text-sm hover:underline"
              >
                + Add Option
              </button>
            </div>
          )}
          {field.type === "select" && (
            <div>
              <select
                disabled
                className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {field.options.map((option, optIndex) => (
                  <option key={optIndex}>{option.label}</option>
                ))}
              </select>
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      onOptionChange(field.id, optIndex, e.target.value)
                    }
                    className="border p-2 flex-1 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Option label..."
                  />
                  <button
                    onClick={() => onRemoveOption(field.id, optIndex)}
                    className="ml-2 text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => onAddOption(field.id)}
                className="text-blue-500 text-sm mt-2 hover:underline"
              >
                + Add Option
              </button>
            </div>
          )}

          {/* NEW: Handling select2 fields similarly to 'select', plus toggles for searchable/multiSelect */}
          {field.type === "select2" && (
            <div>
              {/* Disabled preview */}
              <Select
                isDisabled
                options={field.options.map((opt) => ({
                  label: opt.label,
                  value: opt.label,
                }))}
                placeholder="(React Select Preview)"
              />
              {/* Options editing */}
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2 mt-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      onOptionChange(field.id, optIndex, e.target.value)
                    }
                    className="border p-2 flex-1 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="Option label..."
                  />
                  <button
                    onClick={() => onRemoveOption(field.id, optIndex)}
                    className="ml-2 text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => onAddOption(field.id)}
                className="text-blue-500 text-sm mt-2 hover:underline"
              >
                + Add Option
              </button>

              {/* Checkboxes to toggle searchable and multiSelect */}
              <div className="flex items-center mt-4 space-x-2">
                <label className="text-sm text-gray-700">Searchable:</label>
                <input
                  type="checkbox"
                  checked={field.searchable || false}
                  onChange={(e) =>
                    onPropertyChange(field.id, "searchable", e.target.checked)
                  }
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center mt-2 space-x-2">
                <label className="text-sm text-gray-700">Multi Select:</label>
                <input
                  type="checkbox"
                  checked={field.multiSelect || false}
                  onChange={(e) =>
                    onPropertyChange(field.id, "multiSelect", e.target.checked)
                  }
                  className="h-4 w-4"
                />
              </div>
            </div>
          )}

          {field.type === "password" && (
            <input
              disabled
              type="password"
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="(Enter password...)"
            />
          )}
          {field.type === "file-upload" && (
            <input
              disabled
              type="file"
              className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="(Upload file...)"
            />
          )}
          {field.type === "title" && (
            <div className="p-2 border-b-2 border-gray-300 text-xl text-gray-700 font-semibold mb-3">
              (Title Field)
            </div>
          )}
          {field.type === "bmi" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                BMI Calculator
              </label>
              <div className="flex space-x-2 mt-2">
                <input
                  type="number"
                  disabled
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Height (cm)"
                />
                <input
                  type="number"
                  disabled
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Weight (kg)"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">BMI: (Calculated)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------
   SectionDroppableArea Component
   (Allows you to drag fields *inside* a Section)
   ------------------------------------------------*/
function SectionDroppableArea({ sectionField, updateSectionInnerFields }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ["libraryField"],
    drop: (item) => {
      // Optionally limit the number of fields in a section
      if (sectionField.fields.length >= 10) {
        return;
      }
      const newInnerField = {
        ...item,
        id: generateRandomId(),
        options: item.options || [],
        maxWords: item.maxWords || null,
      };
      updateSectionInnerFields(sectionField.id, [
        ...sectionField.fields,
        newInnerField,
      ]);
      return { name: "SectionDroppableArea" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Decide column count based on how many fields exist
  const columnCount = sectionField.fields.length > 1 ? 2 : 1;

  return (
    <div
      ref={dropRef}
      className={`p-4 border-2 border-dashed rounded-lg min-h-[100px] transition duration-200 ease-in-out ${
        isOver ? "bg-blue-100" : "bg-blue-50"
      }`}
    >
      {sectionField.fields.length === 0 ? (
        <p className="text-gray-500 text-center">
          Drag fields here (max 10 allowed)
        </p>
      ) : (
        <div
          className="gap-4"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          }}
        >
          {sectionField.fields.map((innerField, idx) => (
            <FormFieldItem
              key={innerField.id}
              field={innerField}
              index={idx}
              moveField={(from, to) => {
                const newInnerFields = [...sectionField.fields];
                const [moved] = newInnerFields.splice(from, 1);
                newInnerFields.splice(to, 0, moved);
                updateSectionInnerFields(sectionField.id, newInnerFields);
              }}
              onRemoveField={(innerFieldId) => {
                updateSectionInnerFields(
                  sectionField.id,
                  sectionField.fields.filter((f) => f.id !== innerFieldId)
                );
              }}
              onLabelChange={(innerFieldId, newLabel) => {
                updateSectionInnerFields(
                  sectionField.id,
                  sectionField.fields.map((f) =>
                    f.id === innerFieldId ? { ...f, label: newLabel } : f
                  )
                );
              }}
              onRequiredChange={(innerFieldId, required) => {
                updateSectionInnerFields(
                  sectionField.id,
                  sectionField.fields.map((f) =>
                    f.id === innerFieldId ? { ...f, required } : f
                  )
                );
              }}
              onAddOption={(innerFieldId) => {
                updateSectionInnerFields(
                  sectionField.id,
                  sectionField.fields.map((f) => {
                    if (f.id === innerFieldId) {
                      return {
                        ...f,
                        options: [
                          ...f.options,
                          { label: `Option ${f.options.length + 1}` },
                        ],
                      };
                    }
                    return f;
                  })
                );
              }}
              onOptionChange={(innerFieldId, optIndex, newLabel) => {
                updateSectionInnerFields(
                  sectionField.id,
                  sectionField.fields.map((f) => {
                    if (f.id === innerFieldId) {
                      const updatedOptions = f.options.map((opt, i) =>
                        i === optIndex ? { ...opt, label: newLabel } : opt
                      );
                      return { ...f, options: updatedOptions };
                    }
                    return f;
                  })
                );
              }}
              onRemoveOption={(innerFieldId, optIndex) => {
                updateSectionInnerFields(
                  sectionField.id,
                  sectionField.fields.map((f) => {
                    if (f.id === innerFieldId) {
                      const updatedOptions = f.options.filter(
                        (_, i) => i !== optIndex
                      );
                      return { ...f, options: updatedOptions };
                    }
                    return f;
                  })
                );
              }}
              onMaxWordsChange={(innerFieldId, maxWords) => {
                updateSectionInnerFields(
                  sectionField.id,
                  sectionField.fields.map((f) =>
                    f.id === innerFieldId
                      ? { ...f, maxWords: maxWords ? parseInt(maxWords) : null }
                      : f
                  )
                );
              }}
              onPropertyChange={(id, prop, val) => {
                updateSectionInnerFields(
                  sectionField.id,
                  sectionField.fields.map((f) =>
                    f.id === id ? { ...f, [prop]: val } : f
                  )
                );
              }}
              activePage={null}
              setPages={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------
   SectionFieldItem Component
   (Wraps each 'section' field + droppable inner area)
   ------------------------------------------------*/
function SectionFieldItem({
  field,
  index,
  onSectionTitleChange,
  updateSectionInnerFields,
  onRemoveField,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-gray-300 rounded-lg shadow mb-4 transition duration-200 ease-in-out">
      {/* Accordion header for Section */}
      <div className="flex items-center justify-between bg-gray-200 p-2 select-none">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {isOpen ? "–" : "+"}
          </button>
          <span className="font-semibold">{field.label || "Section"}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveField(field.id);
          }}
          className="text-red-500 mr-2 focus:outline-none"
          title="Remove Section"
        >
          ✖
        </button>
      </div>

      {isOpen && (
        <div className="p-4">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onSectionTitleChange(field.id, e.target.value)}
            placeholder="Section Title"
            className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
          />
          <SectionDroppableArea
            sectionField={field}
            updateSectionInnerFields={updateSectionInnerFields}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------
   MainDroppableArea Component
   (The main drop zone for each page)
   ------------------------------------------------*/
function MainDroppableArea({
  fields,
  moveField,
  onRemoveField,
  onLabelChange,
  onRequiredChange,
  onAddOption,
  onOptionChange,
  onRemoveOption,
  onDropLibraryField,
  onMaxWordsChange,
  onPropertyChange,
  activePage,
  setPages,
  onSectionTitleChange,
  updateSectionInnerFields,
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ["libraryField"],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
      return { name: "DroppableArea" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`p-6 border-2 border-dashed border-blue-400 rounded-lg min-h-[300px] transition duration-200 ease-in-out ${
        isOver ? "bg-blue-100" : "bg-blue-50"
      }`}
    >
      {fields.length === 0 ? (
        <p className="text-gray-500 text-center">
          Drag fields here to build your form
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field, index) =>
            field?.type === "section" ? (
              <div key={field.id}>
                <SectionFieldItem
                  field={field}
                  index={index}
                  onSectionTitleChange={onSectionTitleChange}
                  updateSectionInnerFields={updateSectionInnerFields}
                  onRemoveField={onRemoveField}
                />
              </div>
            ) : (
              <FormFieldItem
                key={field?.id}
                field={field}
                index={index}
                moveField={moveField}
                onRemoveField={onRemoveField}
                onLabelChange={onLabelChange}
                onRequiredChange={onRequiredChange}
                onAddOption={onAddOption}
                onOptionChange={onOptionChange}
                onRemoveOption={onRemoveOption}
                onMaxWordsChange={onMaxWordsChange}
                onPropertyChange={onPropertyChange} // for select2 toggles
                activePage={activePage}
                setPages={setPages}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------
   StepperFormPreview Component
   (Multistep form preview)
   ------------------------------------------------*/
function StepperFormPreview({ formName, pages, formHeader, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === pages.length - 1;

  const handleNext = () => {
    if (currentStep < pages.length - 1) setCurrentStep(currentStep + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentFields = pages[currentStep].fields || [];
  const sectionFields = currentFields.filter((f) => f.type === "section");
  const nonSectionFields = currentFields.filter((f) => f.type !== "section");

  // Renders each field in preview mode
  const renderFieldPreview = (field) => {
    if (field.type === "section") {
      return (
        <div key={field.id} className="mb-4">
          <div className="p-2 bg-gray-100 border border-gray-300 rounded">
            <div className="font-semibold mb-2">{field.label}</div>
            {field.fields && field.fields.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {field.fields.map((innerField) => (
                  <div key={innerField.id}>{renderFieldPreview(innerField)}</div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No fields in this section.
              </p>
            )}
          </div>
        </div>
      );
    }

    if (field.type === "bmi") {
      return (
        <div key={field.id} className="mb-4">
          <label className="block font-medium mb-1 text-gray-700">
            BMI Calculator
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              disabled
              className="w-full border p-2 rounded bg-gray-100"
              placeholder="Height (cm)"
            />
            <input
              type="number"
              disabled
              className="w-full border p-2 rounded bg-gray-100"
              placeholder="Weight (kg)"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">BMI: (Calculated)</p>
        </div>
      );
    }

    // Default (non-section, non-BMI) fields
    return (
      <div key={field.id} className="mb-4">
        <label className="block font-medium mb-1 text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* text, textarea, email, password => show placeholder with maxWords */}
        {["text", "textarea", "email", "password"].includes(field.type) && (
          <input
            type={field.type === "textarea" ? "text" : field.type}
            disabled
            required={field.required}
            className="w-full border p-2 rounded bg-gray-100"
            placeholder={`(Max ${field.maxWords || "∞"} characters)`}
          />
        )}

        {field.type === "tel" && (
          <input
            type="tel"
            disabled
            required={field.required}
            className="w-full border p-2 rounded bg-gray-100"
            placeholder="(Enter phone number...)"
          />
        )}

        {field.type === "date" && (
          <input
            type="date"
            disabled
            required={field.required}
            className="w-full border p-2 rounded bg-gray-100"
            placeholder="(Select a date...)"
          />
        )}

        {field.type === "checkbox" && (
          <div className="space-y-2">
            {field.options.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 flex-shrink-0"
                  disabled
                  required={field.required}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {field.type === "radio" && (
          <div className="mt-2">
            {field.options.map((option, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <input
                  type="radio"
                  disabled
                  required={field.required}
                  name={`radio-${field.id}`}
                  className="w-4 h-4 flex-shrink-0"
                />
                <span className="mx-2 flex-grow text-gray-700">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {field.type === "select" && (
          <select
            disabled
            required={field.required}
            className="w-full border p-2 rounded bg-gray-100"
          >
            {field.options.map((option, idx) => (
              <option key={idx}>{option.label}</option>
            ))}
          </select>
        )}

        {field.type === "select2" && (
          <div>
            {field.searchable ? (
              <Select
                options={field.options.map((opt) => ({
                  label: opt.label,
                  value: opt.label,
                }))}
                isMulti={field.multiSelect}
                isDisabled
                placeholder="Select..."
              />
            ) : (
              <select
                disabled
                multiple={field.multiSelect}
                required={field.required}
                className="w-full border p-2 rounded bg-gray-100"
              >
                {field.options.map((option, idx) => (
                  <option key={idx}>{option.label}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {field.type === "file-upload" && (
          <input
            type="file"
            disabled
            required={field.required}
            className="w-full border p-2 rounded bg-gray-100"
            placeholder="(Upload file...)"
          />
        )}

        {field.type === "title" && (
          <div className="p-2 border-b-2 border-gray-300 text-xl text-gray-700 font-semibold">
            (Title Field)
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      <div className="container mx-auto px-4 py-6">
        {/* If you have a custom Navbar or Toolbar, include it here */}
        {formHeader && formHeader.content && (
          <div className="mb-6">
            {formHeader.type === "html" ? (
              <div
                className="p-4 bg-gray-100 rounded border"
                dangerouslySetInnerHTML={{ __html: formHeader.content }}
              />
            ) : (
              <img
                src={formHeader.content}
                alt="Form Header"
                className="w-full rounded mb-4"
              />
            )}
          </div>
        )}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow mt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-600 text-center">
            {pages[currentStep].name || `Page ${currentStep + 1}`}
          </h3>
          {currentFields.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              No fields on this page.
            </p>
          ) : (
            <Fragment>
              {nonSectionFields.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {nonSectionFields.map((field) => renderFieldPreview(field))}
                </div>
              )}
              {sectionFields.length > 0 &&
                sectionFields.map((section) => (
                  <div key={section.id} className="mb-4">
                    {renderFieldPreview(section)}
                  </div>
                ))}
            </Fragment>
          )}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded shadow ${
                currentStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            >
              Previous
            </button>
            {!isLastStep ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded shadow bg-blue-500 text-white hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => alert("Form submitted!")}
                className="px-4 py-2 rounded shadow bg-green-500 text-white hover:bg-green-600"
              >
                Submit
              </button>
            )}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

/* ------------------------------------------------
   Main FormBuilder Component
   (The big one that ties everything together)
   ------------------------------------------------*/
export default function FormBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formid, linkingid } = useParams();

  const [formName, setFormName] = useState("Untitled Form");
  const [pages, setPages] = useState([
    { id: generateRandomId(), name: "Page 1", fields: [] },
  ]);
  const [activePage, setActivePage] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  // Form header state (can be HTML or image)
  const [formHeader, setFormHeader] = useState({ type: "html", content: "" });

  useEffect(() => {
    // Load existing form if we have a formid
    if (formid) {
      axios
        .get(`${API_URL}/CustomForm/GetCustomFormByID/${formid}?linkId=${linkingid}`)
        .then((response) => {
          const { formName, otherJSON } = response.data[0];
          setFormName(formName || "Untitled Form");
          try {
            const parsed = JSON.parse(otherJSON);
            if (parsed.pages) {
              setPages(parsed.pages);
              if (parsed.header) setFormHeader(parsed.header);
            } else {
              setPages(parsed);
            }
          } catch (error) {
            console.error("Error parsing form JSON:", error);
          }
        })
        .catch((err) => {
          console.error("Error fetching form by ID:", err);
        });
    }
  }, [formid, linkingid]);

  // Available fields for library
  const libraryFields = [
    {
      id: generateRandomId(),
      label: "Text Field",
      icon: "T",
      type: "text",
      options: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Email",
      icon: "📧",
      type: "email",
      options: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Phone Number",
      icon: "📱",
      type: "tel",
      options: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Textarea",
      icon: "📝",
      type: "textarea",
      options: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Date",
      icon: "📅",
      type: "date",
      options: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Checkbox",
      icon: "☑️",
      type: "checkbox",
      options: [{ label: "Option 1" }],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Radio Button",
      icon: "⚪",
      type: "radio",
      options: [{ label: "Option 1" }],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Select",
      icon: "🔽",
      type: "select",
      options: [{ label: "Option 1" }],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Password",
      icon: "🔒",
      type: "password",
      options: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "File Upload",
      icon: "📤",
      type: "file-upload",
      options: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "BMI Calculator",
      icon: "⚖️",
      type: "bmi",
      options: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Section",
      icon: "S",
      type: "section",
      fields: [],
      required: false,
    },
    {
      id: generateRandomId(),
      label: "Select2",
      icon: "🔍🔽",
      type: "select2",
      options: [{ label: "Option 1" }],
      required: false,
      searchable: true,
      multiSelect: false,
    },
  ];

  // Add / remove pages
  const handleAddPage = () => {
    const newPageIndex = pages.length;
    setPages((prev) => [
      ...prev,
      { id: generateRandomId(), name: `Page ${newPageIndex + 1}`, fields: [] },
    ]);
    setActivePage(newPageIndex);
  };

  const handleRemovePage = (pageIndex) => {
    if (pages.length === 1) return; // keep at least 1 page
    setPages((prev) => {
      const newPages = prev.filter((_, i) => i !== pageIndex);
      if (pageIndex >= newPages.length) setActivePage(newPages.length - 1);
      return newPages;
    });
  };

  const handlePageNameChange = (pageIndex, newName) => {
    setPages((prev) =>
      prev.map((pg, i) => (i === pageIndex ? { ...pg, name: newName } : pg))
    );
  };

  // When a field is dragged from the library to the main area
  const handleDropLibraryField = (field) => {
    const newField = {
      ...field,
      id: generateRandomId(),
      options: field.options || [],
      maxWords: field.maxWords || null,
      fields: field.fields ? field.fields : [],
    };
    setPages((prev) => {
      const newPages = [...prev];
      newPages[activePage].fields.push(newField);
      return newPages;
    });
  };

  const moveField = (fromIndex, toIndex) => {
    setPages((prev) => {
      const newPages = [...prev];
      const fields = [...newPages[activePage].fields];
      const [moved] = fields.splice(fromIndex, 1);
      fields.splice(toIndex, 0, moved);
      newPages[activePage].fields = fields;
      return newPages;
    });
  };

  // Basic field manipulations
  const handleRemoveField = (fieldId) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[activePage].fields = newPages[activePage].fields.filter(
        (f) => f.id !== fieldId
      );
      return newPages;
    });
  };

  const handleLabelChange = (fieldId, newLabel) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) =>
            fld.id === fieldId ? { ...fld, label: newLabel } : fld
          ),
        };
      })
    );
  };

  const handleRequiredChange = (fieldId, isRequired) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) =>
            fld.id === fieldId ? { ...fld, required: isRequired } : fld
          ),
        };
      })
    );
  };

  const handleAddOption = (fieldId) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) => {
            if (fld.id !== fieldId) return fld;
            return {
              ...fld,
              options: [
                ...fld.options,
                { label: `Option ${fld.options.length + 1}` },
              ],
            };
          }),
        };
      })
    );
  };

  const handleOptionChange = (fieldId, optIndex, newLabel) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) => {
            if (fld.id !== fieldId) return fld;
            const updatedOptions = fld.options.map((opt, i) =>
              i === optIndex ? { ...opt, label: newLabel } : opt
            );
            return { ...fld, options: updatedOptions };
          }),
        };
      })
    );
  };

  const handleRemoveOption = (fieldId, optIndex) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) => {
            if (fld.id !== fieldId) return fld;
            const updatedOptions = fld.options.filter((_, i) => i !== optIndex);
            return { ...fld, options: updatedOptions };
          }),
        };
      })
    );
  };

  const handleMaxWordsChange = (fieldId, maxWords) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) =>
            fld.id === fieldId
              ? {
                  ...fld,
                  maxWords: maxWords ? parseInt(maxWords, 10) : null,
                }
              : fld
          ),
        };
      })
    );
  };

  const handleSectionTitleChange = (sectionId, newTitle) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) =>
            fld.id === sectionId ? { ...fld, label: newTitle } : fld
          ),
        };
      })
    );
  };

  const updateSectionInnerFields = (sectionId, newFields) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) =>
            fld.id === sectionId ? { ...fld, fields: newFields } : fld
          ),
        };
      })
    );
  };

  // Generic property change (used for searchable, multiSelect, etc.)
  const handlePropertyChange = (fieldId, propertyName, value) => {
    setPages((prev) =>
      prev.map((page, pIndex) => {
        if (pIndex !== activePage) return page;
        return {
          ...page,
          fields: page.fields.map((fld) =>
            fld.id === fieldId
              ? {
                  ...fld,
                  [propertyName]: value,
                }
              : fld
          ),
        };
      })
    );
  };

  // Saving to server
  const handleSave = async () => {
    const pagesToSave = pages.map((page) => ({
      ...page,
      // Remove the "icon" property before saving
      fields: page.fields.map(({ icon, ...rest }) => rest),
    }));
    const payload = {
      formId: location?.state?.duplicate ? 0 : formid ? formid : 0,
      companyID: 0,
      formName: formName,
      otherJSON: JSON.stringify({ header: formHeader, pages: pagesToSave }),
      createdBy: "admin",
      createdDate: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        `${API_URL}/CustomForm/CreateCustomForm`,
        payload
      );
      console.log("Saved form:", response.data);
      navigate(-1);
    } catch (err) {
      console.error("Error saving form:", err);
    }
  };

  // Preview / Close
  const handlePreview = () => setIsPreview(true);
  const handleClosePreview = () => setIsPreview(false);
  const closeForm = () => {
    navigate(-1);
  };

  if (isPreview) {
    return (
      <StepperFormPreview
        formName={formName}
        pages={pages}
        formHeader={formHeader}
        onClose={handleClosePreview}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8 min-h-screen bg-gray-50">
        <CompanyHeader />
        {/* Top panel for form name & header configuration */}
        <div className="mb-6 bg-white shadow-md rounded-lg p-5">
          {/* Form name */}
          <div className="mb-6">
            <label
              className="block font-bold text-gray-700 mb-2"
              htmlFor="formName"
            >
              Form Name
            </label>
            <input
              id="formName"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter form name..."
            />
          </div>

          {/* Form Header (HTML or image) */}
          <h2 className="font-semibold text-lg text-gray-800 mb-3">
            Form Header
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="headerType"
                checked={formHeader.type === "html"}
                onChange={() => setFormHeader({ ...formHeader, type: "html" })}
                className="hidden"
              />
              <span
                className={`w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center 
                  ${
                    formHeader.type === "html"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
              >
                {formHeader.type === "html" && (
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                )}
              </span>
              <span className="text-gray-700">HTML</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="headerType"
                checked={formHeader.type === "image"}
                onChange={() => setFormHeader({ ...formHeader, type: "image" })}
                className="hidden"
              />
              <span
                className={`w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center 
                  ${
                    formHeader.type === "image"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
              >
                {formHeader.type === "image" && (
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                )}
              </span>
              <span className="text-gray-700">Image</span>
            </label>
          </div>

          {formHeader.type === "html" ? (
            <textarea
              value={formHeader.content}
              onChange={(e) =>
                setFormHeader({ ...formHeader, content: e.target.value })
              }
              placeholder="Enter HTML content for your header..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 transition duration-200"
              rows="3"
            />
          ) : (
            <input
              type="text"
              value={formHeader.content}
              onChange={(e) =>
                setFormHeader({ ...formHeader, content: e.target.value })
              }
              placeholder="Enter image URL for your header..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          )}

          {/* Page controls */}
          <div className="flex items-center space-x-4 mb-6 mt-6">
            <button
              onClick={handleAddPage}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
            >
              Add Page
            </button>
            {pages.length > 1 && (
              <button
                onClick={() => handleRemovePage(activePage)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
              >
                Remove Current Page
              </button>
            )}
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2 text-gray-600">Page Navigation</h2>
            <div className="flex space-x-2 mb-4">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => setActivePage(index)}
                  className={`px-4 py-2 rounded shadow ${
                    index === activePage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Page {index + 1}
                </button>
              ))}
            </div>
            <label className="block text-gray-700 font-medium mb-1">
              Page Name
            </label>
            <input
              type="text"
              value={pages[activePage].name || ""}
              onChange={(e) => handlePageNameChange(activePage, e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder={`Page ${activePage + 1}`}
            />
          </div>
        </div>

        {/* Main layout: library on the left, form builder on the right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Library */}
          <div>
            <h2 className="font-bold mb-4 text-gray-600">Available Fields</h2>
            <div className="space-y-4 h-[400px] overflow-y-auto border rounded-lg p-4">
              {libraryFields.map((field) => (
                <LibraryFieldItem
                  key={field?.id}
                  field={field}
                  onDropLibraryField={handleDropLibraryField}
                />
              ))}
            </div>
          </div>

          {/* Form Builder Area */}
          <div className="md:col-span-2">
            <h2 className="font-bold mb-4 text-gray-600">
              Form Builder (Page {activePage + 1})
            </h2>
            <MainDroppableArea
              fields={pages[activePage].fields}
              moveField={moveField}
              onRemoveField={handleRemoveField}
              onLabelChange={handleLabelChange}
              onRequiredChange={handleRequiredChange}
              onAddOption={handleAddOption}
              onOptionChange={handleOptionChange}
              onRemoveOption={handleRemoveOption}
              onDropLibraryField={handleDropLibraryField}
              onMaxWordsChange={handleMaxWordsChange}
              onPropertyChange={handlePropertyChange}
              activePage={activePage}
              setPages={setPages}
              onSectionTitleChange={handleSectionTitleChange}
              updateSectionInnerFields={updateSectionInnerFields}
            />
            <div className="mt-6 space-x-4">
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200 ease-in-out"
              >
                {location?.state?.duplicate
                  ? "Duplicate"
                  : formid
                  ? "Update Form"
                  : "Save Form"}
              </button>
              <button
                onClick={handlePreview}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200 ease-in-out"
              >
                Preview
              </button>
              <button
                onClick={closeForm}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transition duration-200 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
