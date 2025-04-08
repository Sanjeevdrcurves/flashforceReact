
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useLabelEntries = () => {
  const [labels, setLabels] = useState([]);

  const addLabel = () => {
    setLabels([
      ...labels,
      { name: "", id: `label-${uuidv4()}` }
    ]);
  };

  const updateLabel = (id, name) => {
    setLabels(
      labels.map(label => 
        label.id === id ? { ...label, name } : label
      )
    );
  };

  const removeLabel = (id) => {
    setLabels(labels.filter(label => label.id !== id));
  };

  return {
    labels,
    addLabel,
    updateLabel,
    removeLabel
  };
};
