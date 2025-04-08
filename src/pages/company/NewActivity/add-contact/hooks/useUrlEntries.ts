
import { useState } from "react";

export const useUrlEntries = () => {
  const [urls, setUrls] = useState<string[]>([]);

  const addUrlEntry = () => {
    setUrls([...urls, ""]);
  };

  const updateUrlEntry = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const removeUrlEntry = (index: number) => {
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
