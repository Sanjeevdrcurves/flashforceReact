import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// ---------------------------------------------------------------------
// Change this if your environment variables or import paths differ
// ---------------------------------------------------------------------
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

// ----------------------------
// Utility: Generate Unique IDs
// ----------------------------
let idCounter = 0;
const generateRandomId = () => `field-${++idCounter}`;

/** 
 * Helper to reorder items within an array
 * moving one item from oldIndex to newIndex.
 */
function reorderArray(list, fromIndex, toIndex) {
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Helper to insert a new item into an array at a specific index.
 */
function insertIntoArray(list, index, newItem) {
  const result = [...list];
  result.splice(index, 0, newItem);
  return result;
}

// =======================================================
// ================    LIBRARY FIELD ITEM   ==============
// =======================================================
function LibraryFieldItem({ field }) {
  // We keep "libraryField" so we can tell them apart in the child’s drop.
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "libraryField",
    item: { ...field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      style={{
        width: "44%",
        float: "left",
        marginLeft: "2%",
        marginTop: "3%",
        opacity: isDragging ? 0.5 : 1,
      }}
      className="flex flex-col items-center justify-center p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 cursor-move transition-transform duration-300 ease-in-out transform hover:scale-105"
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-base text-blue-500">{field.icon}</span>
        <span className="text-xs font-medium text-gray-700">{field.label}</span>
      </div>
    </div>
  );
}

// =======================================================
// ================    FORM FIELD ITEM    ================
// =======================================================
function FormFieldItem({
  field,
  index,
  fields,
  updateFields, // function to replace the array (top-level or sub-level)
  // The rest are callback props for your input logic
  onRemoveField,
  onLabelChange,
  onRequiredChange,
  onAddOption,
  onOptionChange,
  onRemoveOption,
  onMaxWordsChange,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef(null);

  // DRAG existing form fields
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "formField",
    item: {
      index, // needed for reorder
      hasInserted: false, // track insertion of library items
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // DROP to reorder or insert library item
  const [, dropRef] = useDrop({
    accept: ["formField", "libraryField"],
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;

      const hoverIndex = index; 
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 1) REORDER existing fields
      if (monitor.getItemType() === "formField") {
        const dragIndex = draggedItem.index;
        if (dragIndex === hoverIndex) return;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        const reordered = reorderArray(fields, dragIndex, hoverIndex);
        updateFields(reordered);

        draggedItem.index = hoverIndex; // update so we don't reorder repeatedly
      }

      // 2) INSERT a library field into the correct position
      if (monitor.getItemType() === "libraryField") {
        // If we already inserted, skip
        if (draggedItem.hasInserted) return;

        const insertBefore = hoverClientY < hoverMiddleY;
        const insertionIndex = insertBefore ? hoverIndex : hoverIndex + 1;

        // Build a new item
        const newField = {
          ...draggedItem,
          id: generateRandomId(),
        };
        // Insert it
        const withInserted = insertIntoArray(fields, insertionIndex, newField);
        updateFields(withInserted);

        // Mark as inserted so we don't keep adding duplicates
        draggedItem.hasInserted = true;
      }
    },
  });

  dragRef(dropRef(ref)); // combine references

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="border border-gray-300 rounded-lg shadow hover:shadow-md transition duration-200 ease-in-out mb-4"
    >
      {/* Accordion Header with Remove Icon */}
      <div
        className="flex items-center justify-between bg-gray-200 p-2 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="font-semibold">
            {field.label || field.type || "Field"}
          </span>
        </div>
        <div className="flex items-center">
          {/* Hide remove button if it's a default field */}
          {!field.isDefault && (
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
          )}
          <span>{isOpen ? "-" : "+"}</span>
        </div>
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
            placeholder="Enter field label"
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

          {/* Max Character Limit for certain types */}
          {["text", "textarea", "email", "password"].includes(field?.type) && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Max Character Limit (optional)
              </label>
              <input
                type="number"
                min="1"
                value={field?.maxWords || ""}
                onChange={(e) => onMaxWordsChange(field.id, e.target.value)}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none mt-1"
                placeholder="Enter max characters"
              />
            </div>
          )}

          {/* Previews by type */}
          {field.type === "text" && (
            <input
              disabled
              type="text"
              className="w-full border p-2 mb-3 rounded"
              placeholder="(Text input)"
            />
          )}

          {field.type === "email" && (
            <input
              disabled
              type="email"
              className="w-full border p-2 mb-3 rounded"
              placeholder="(Email input)"
            />
          )}

          {field.type === "tel" && (
            <input
              disabled
              type="tel"
              className="w-full border p-2 mb-3 rounded"
              placeholder="(Phone input)"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              disabled
              rows="4"
              className="w-full border p-2 mb-3 rounded"
              placeholder="(Textarea)"
            />
          )}

          {field.type === "date" && (
            <input
              disabled
              type="date"
              className="w-full border p-2 mb-3 rounded"
            />
          )}

          {/* Checkboxes & Options */}
          {field.type === "checkbox" && (
            <div>
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    disabled
                    className="mr-2 focus:ring-blue-400"
                  />
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      onOptionChange(field.id, optIndex, e.target.value)
                    }
                    className="border p-2 flex-1 rounded"
                    placeholder="Checkbox label"
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
            <div>
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <input
                    disabled
                    type="radio"
                    className="mr-2 focus:ring-blue-400"
                    name={`radio-${field.id}`}
                  />
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      onOptionChange(field.id, optIndex, e.target.value)
                    }
                    className="border p-2 flex-1 rounded"
                    placeholder="Radio label"
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

          {/* Select & Select2 */}
          {["select", "select2"].includes(field.type) && (
            <div>
              {field.type === "select2" && (
                <p className="text-gray-500 text-sm mb-2">
                  <em>(Select2 would normally be a more advanced widget.)</em>
                </p>
              )}
              <select disabled className="w-full border p-2 mb-3 rounded">
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
                    className="border p-2 flex-1 rounded"
                    placeholder="Option label"
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

          {field.type === "password" && (
            <input
              disabled
              type="password"
              className="w-full border p-2 mb-3 rounded"
              placeholder="(Password)"
            />
          )}

          {field.type === "file-upload" && (
            <input
              disabled
              type="file"
              className="w-full border p-2 mb-3 rounded"
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
                  className="w-full border p-2 rounded"
                  placeholder="Height (cm)"
                />
                <input
                  type="number"
                  disabled
                  className="w-full border p-2 rounded"
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

// =======================================================
// ================  SECTION DROPPABLE AREA  =============
// =======================================================
function SectionDroppableArea({ sectionField, updateSectionInnerFields }) {
  /**
   * This area’s `drop` logic handles:
   * - Dropping a library item onto *empty space* in the section (if no sub-fields are hovered).
   * - Reordering and insertion between sub-fields happen inside <FormFieldItem>.
   */
  const [{ isOver }, dropRef] = useDrop({
    accept: ["libraryField"],
    drop: (draggedItem, monitor) => {
      if (monitor.didDrop()) return; // child handled it
      if (draggedItem.hasInserted) return; // already inserted

      // If dropping on empty space (or outside subfields), add at end
      const newInnerField = {
        ...draggedItem,
        id: generateRandomId(),
        options: draggedItem.options || [],
        maxWords: draggedItem.maxWords || null,
      };
      updateSectionInnerFields(sectionField.id, [
        ...sectionField.fields,
        newInnerField,
      ]);
      draggedItem.hasInserted = true; // prevent duplicates
      return { name: "SectionDroppableArea" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const subFields = sectionField.fields || [];
  const columnCount = sectionField.columns || 1;

  // We'll pass "updateFields" down to each <FormFieldItem>
  // so it can reorder or insert them
  const updateAllSubFields = (newFields) => {
    updateSectionInnerFields(sectionField.id, newFields);
  };

  return (
    <div
      ref={dropRef}
      className={`p-4 border-2 border-dashed rounded-lg min-h-[100px] transition duration-200 ease-in-out ${
        isOver ? "bg-blue-100" : "bg-blue-50"
      }`}
    >
      {subFields.length === 0 ? (
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
          {subFields.map((innerField, idx) => (
            <FormFieldItem
              key={innerField.id}
              field={innerField}
              index={idx}
              fields={subFields}
              updateFields={updateAllSubFields}
              onRemoveField={(innerFieldId) => {
                // If it's default, skip removal (this is optional if you want nested defaults)
                // But typically "default sections" wouldn't be removed either.
                const filtered = subFields.filter((f) => f.id !== innerFieldId);
                updateSectionInnerFields(sectionField.id, filtered);
              }}
              onLabelChange={(innerFieldId, newLabel) => {
                const updated = subFields.map((f) =>
                  f.id === innerFieldId ? { ...f, label: newLabel } : f
                );
                updateSectionInnerFields(sectionField.id, updated);
              }}
              onRequiredChange={(innerFieldId, required) => {
                const updated = subFields.map((f) =>
                  f.id === innerFieldId ? { ...f, required } : f
                );
                updateSectionInnerFields(sectionField.id, updated);
              }}
              onAddOption={(innerFieldId) => {
                const updated = subFields.map((f) => {
                  if (f.id !== innerFieldId) return f;
                  return {
                    ...f,
                    options: [
                      ...f.options,
                      { label: `Option ${f.options.length + 1}` },
                    ],
                  };
                });
                updateSectionInnerFields(sectionField.id, updated);
              }}
              onOptionChange={(innerFieldId, optIndex, newLabel) => {
                const updated = subFields.map((f) => {
                  if (f.id !== innerFieldId) return f;
                  const newOpts = [...f.options];
                  newOpts[optIndex] = { label: newLabel };
                  return { ...f, options: newOpts };
                });
                updateSectionInnerFields(sectionField.id, updated);
              }}
              onRemoveOption={(innerFieldId, optIndex) => {
                const updated = subFields.map((f) => {
                  if (f.id !== innerFieldId) return f;
                  const newOpts = f.options.filter((_, i) => i !== optIndex);
                  return { ...f, options: newOpts };
                });
                updateSectionInnerFields(sectionField.id, updated);
              }}
              onMaxWordsChange={(innerFieldId, maxWords) => {
                const updated = subFields.map((f) => {
                  if (f.id !== innerFieldId) return f;
                  return {
                    ...f,
                    maxWords: maxWords ? parseInt(maxWords, 10) : null,
                  };
                });
                updateSectionInnerFields(sectionField.id, updated);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =======================================================
// ===============  SECTION FIELD ITEM  ==================
// =======================================================
function SectionFieldItem({
  field,
  onSectionTitleChange,
  updateSectionInnerFields,
  onRemoveField,
  onSectionColumnsChange,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-gray-300 rounded-lg shadow mb-4">
      <div
        className="flex items-center justify-between bg-gray-200 p-2 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="font-semibold">{field.label || "Section"}</span>
        </div>
        <div className="flex items-center">
          {/* Hide remove if it's default, but here we assume sections are not default */}
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
          <span>{isOpen ? "-" : "+"}</span>
        </div>
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

          {/* Number of items per row */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of items per row
          </label>
          <input
            type="number"
            min="1"
            max="4"
            value={field.columns}
            onChange={(e) => onSectionColumnsChange(field.id, e.target.value)}
            className="w-24 border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400"
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

// =======================================================
// ==============   MAIN DROPPABLE AREA   ================
// =======================================================
function MainDroppableArea({
  fields,
  setFields,
  // The rest are callbacks to manage field properties
  onRemoveField,
  onLabelChange,
  onRequiredChange,
  onAddOption,
  onOptionChange,
  onRemoveOption,
  onMaxWordsChange,
  onSectionTitleChange,
  updateSectionInnerFields,
  onSectionColumnsChange,
}) {
  /**
   * This top-level droppable handles dropping a libraryField
   * in empty space if there are no existing fields hovered.
   */
  const [{ isOver }, dropRef] = useDrop({
    accept: ["libraryField"],
    drop: (draggedItem, monitor) => {
      // If a child <FormFieldItem> or <SectionDroppableArea> has already handled insertion,
      // or we have hasInserted = true, skip.
      if (monitor.didDrop()) return;
      if (draggedItem.hasInserted) return;

      // If user drops on empty area at top level, add it at the end
      const newField = {
        ...draggedItem,
        id: generateRandomId(),
      };
      setFields([...fields, newField]);
      draggedItem.hasInserted = true; // mark inserted

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
          Drag fields here to build your custom field
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field, index) =>
            field?.type === "section" ? (
              <SectionFieldItem
                key={field.id}
                field={field}
                onSectionTitleChange={onSectionTitleChange}
                updateSectionInnerFields={updateSectionInnerFields}
                onRemoveField={onRemoveField}
                onSectionColumnsChange={onSectionColumnsChange}
              />
            ) : (
              <FormFieldItem
                key={field.id}
                field={field}
                index={index}
                fields={fields}
                updateFields={setFields}
                onRemoveField={onRemoveField}
                onLabelChange={onLabelChange}
                onRequiredChange={onRequiredChange}
                onAddOption={onAddOption}
                onOptionChange={onOptionChange}
                onRemoveOption={onRemoveOption}
                onMaxWordsChange={onMaxWordsChange}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

// =======================================================
// ============   MAIN COMPONENT: CustomFieldPage  =======
// =======================================================
export default function CustomFieldPage() {
  const navigate = useNavigate();
  const { formid } = useParams();
  const { companyId } = useSelector((state) => state.AuthReducerKey);

  const [fieldFormid, setFieldFormid] = useState(0);
  const [formName, setFormName] = useState("Untitled Custom Field");
  const [fields, setFields] = useState([]);

  // For toggling between "Default Fields" and "Available Fields"
  const [activeTab, setActiveTab] = useState("default");

  // ------------------
  // Default Fields (cannot be removed)
  // ------------------
  const defaultFields = [
    {
      id: generateRandomId(),
      label: "Full Name",
      icon: "👤",
      type: "text",
      options: [],
      required: false,
      isDefault: true, // <= This is the key
    },
    {
      id: generateRandomId(),
      label: "Date of Birth",
      icon: "🎂",
      type: "date",
      options: [],
      required: false,
      isDefault: true,
    },
    {
      id: generateRandomId(),
      label: "Phone Number",
      icon: "📱",
      type: "tel",
      options: [],
      required: false,
      isDefault: true,
    },
  ];

  // ------------------
  // Additional Library Fields
  // ------------------
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
      columns: 2,
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

  // Fetch existing form data
  useEffect(() => {
    if (formid) {
      // if we have an existing form, load it
      axios
        .get(`${API_URL}/CustomForm/GetCustomFormFieldById/${formid}/${companyId}`)
        .then((response) => {
          if (!response.data?.length) return;
          const { formName, otherJSON, fieldFormId } = response.data[0];
          setFormName(formName || "Untitled Custom Field");
          setFieldFormid(fieldFormId);

          try {
            const parsed = JSON.parse(otherJSON);
            if (parsed.fields) {
              // Merge default fields to ensure they're present
              const mergedFields = [
                ...defaultFields,
                // only add fields that aren't default
                ...parsed.fields.filter((f) => !f.isDefault),
              ];
              setFields(mergedFields);
            }
          } catch (error) {
            console.error("Error parsing custom field JSON:", error);
          }
        })
        .catch((err) => {
          console.error("Error fetching custom field by ID:", err);
        });
    } else {
      // if it's a NEW form, automatically add default fields
      setFields(defaultFields);
    }
  }, [formid, companyId]);

  // Field manipulation
  //  => BLOCK removal of default fields
  const handleRemoveField = (fieldId) => {
    setFields((prev) =>
      prev.filter((f) => {
        // If it's a default field, do NOT remove it
        if (f.isDefault && f.id === fieldId) {
          return true; // keep it
        }
        // otherwise remove it if IDs match
        return f.id !== fieldId;
      })
    );
  };

  const handleLabelChange = (fieldId, newLabel) => {
    setFields((prev) =>
      prev.map((fld) =>
        fld.id === fieldId ? { ...fld, label: newLabel } : fld
      )
    );
  };

  const handleRequiredChange = (fieldId, isRequired) => {
    setFields((prev) =>
      prev.map((fld) =>
        fld.id === fieldId ? { ...fld, required: isRequired } : fld
      )
    );
  };

  const handleAddOption = (fieldId) => {
    setFields((prev) =>
      prev.map((fld) => {
        if (fld.id !== fieldId) return fld;
        return {
          ...fld,
          options: [
            ...fld.options,
            { label: `Option ${fld.options.length + 1}` },
          ],
        };
      })
    );
  };

  const handleOptionChange = (fieldId, optIndex, newLabel) => {
    setFields((prev) =>
      prev.map((fld) => {
        if (fld.id !== fieldId) return fld;
        const updatedOptions = [...fld.options];
        updatedOptions[optIndex] = { label: newLabel };
        return { ...fld, options: updatedOptions };
      })
    );
  };

  const handleRemoveOption = (fieldId, optIndex) => {
    setFields((prev) =>
      prev.map((fld) => {
        if (fld.id !== fieldId) return fld;
        const updatedOptions = fld.options.filter((_, i) => i !== optIndex);
        return { ...fld, options: updatedOptions };
      })
    );
  };

  const handleMaxWordsChange = (fieldId, maxWords) => {
    setFields((prev) =>
      prev.map((fld) =>
        fld.id === fieldId
          ? { ...fld, maxWords: maxWords ? parseInt(maxWords, 10) : null }
          : fld
      )
    );
  };

  const handleSectionTitleChange = (sectionId, newTitle) => {
    setFields((prev) =>
      prev.map((fld) =>
        fld.id === sectionId ? { ...fld, label: newTitle } : fld
      )
    );
  };

  const updateSectionInnerFields = (sectionId, newFields) => {
    setFields((prev) =>
      prev.map((fld) =>
        fld.id === sectionId ? { ...fld, fields: newFields } : fld
      )
    );
  };

  const handleSectionColumnsChange = (sectionId, newValue) => {
    setFields((prev) =>
      prev.map((fld) => {
        if (fld.id === sectionId) {
          return {
            ...fld,
            columns: parseInt(newValue, 10) || 1,
          };
        }
        return fld;
      })
    );
  };

  // Save the entire form
  const handleSave = async () => {
    const payload = {
      fieldFormId: fieldFormid ? fieldFormid : 0,
      companyID: companyId,
      formName,
      otherJSON: JSON.stringify({ fields }),
      createdBy: 123,
      masterCustomFormFieldId: formid,
      createdDate: new Date().toISOString(),
    };
    try {
      const response = await axios.post(
        `${API_URL}/CustomForm/CreateCustomFormField`,
        payload
      );
      console.log("Saved custom fields:", response.data);
      // Go back or show success
      navigate(-1);
    } catch (err) {
      console.error("Error saving custom fields:", err);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8 min-h-screen bg-gray-50">
        {/* Custom Field Name */}
        <div className="mb-6">
          <label
            className="block font-bold text-gray-700 mb-2"
            htmlFor="formName"
          >
            Custom Field Name
          </label>
          <input
            id="formName"
            type="text"
            disabled={!!formid}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="Enter custom field name..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Tabs for Default Fields & Available Fields */}
          <div>
            <h2 className="font-bold mb-4 text-gray-600">Field Library</h2>

            {/* Tab Header */}
            <div className="flex border-b mb-2">
              <button
                onClick={() => setActiveTab("default")}
                className={`px-4 py-2 ${
                  activeTab === "default"
                    ? "border-b-2 border-blue-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Default Fields
              </button>
              <button
                onClick={() => setActiveTab("library")}
                className={`px-4 py-2 ${
                  activeTab === "library"
                    ? "border-b-2 border-blue-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Available Fields
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-4 h-[400px] overflow-y-auto border rounded-lg p-4">
              {activeTab === "default" &&
                defaultFields.map((field) => (
                  <LibraryFieldItem key={field.id} field={field} />
                ))}

              {activeTab === "library" &&
                libraryFields.map((field) => (
                  <LibraryFieldItem key={field.id} field={field} />
                ))}
            </div>
          </div>

          {/* Right column: Custom field builder */}
          <div className="md:col-span-2">
            <h2 className="font-bold mb-4 text-gray-600">
              Custom Field Builder
            </h2>
            <MainDroppableArea
              fields={fields}
              setFields={setFields}
              onRemoveField={handleRemoveField}
              onLabelChange={handleLabelChange}
              onRequiredChange={handleRequiredChange}
              onAddOption={handleAddOption}
              onOptionChange={handleOptionChange}
              onRemoveOption={handleRemoveOption}
              onMaxWordsChange={handleMaxWordsChange}
              onSectionTitleChange={handleSectionTitleChange}
              updateSectionInnerFields={updateSectionInnerFields}
              onSectionColumnsChange={handleSectionColumnsChange}
            />
            <div className="mt-6">
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Save Custom Field
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
