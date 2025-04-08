
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LabelEntry } from "../types";

export const useLabelEntries = () => {
  const [labels, setLabels] = useState<LabelEntry[]>([]);

  const addLabel = () => {
    setLabels([
      ...labels,
      { name: "", id: `label-${uuidv4()}` }
    ]);
  };

  const updateLabel = (id: string, name: string) => {
    setLabels(
      labels.map(label => 
        label.id === id ? { ...label, name } : label
      )
    );
  };

  const removeLabel = (id: string) => {
    setLabels(labels.filter(label => label.id !== id));
  };

  return {
    labels,
    addLabel,
    updateLabel,
    removeLabel
  };
};
