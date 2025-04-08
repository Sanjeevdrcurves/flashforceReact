
import { useState } from "react";

export const useUrlEntries = () => {
  const [urls, setUrls] = useState([]);

  const addUrlEntry = () => {
    setUrls([...urls, ""]);
  };

  const updateUrlEntry = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const removeUrlEntry = (index) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  return {
    urls,
    addUrlEntry,
    updateUrlEntry,
    removeUrlEntry
  };
};
