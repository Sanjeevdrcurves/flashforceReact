
import React from "react";
import { Input } from "@/components/ui/input";

const ActivityTitleInput = ({
  title,
  setTitle
}) => {
  return (
    <div>
      <Input
        placeholder="Activity title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export { ActivityTitleInput };
