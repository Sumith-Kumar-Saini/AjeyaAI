"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onTextChange?: (value: string) => void;
};

const TextareaFrom1: React.FC<Props> = ({ onTextChange }) => {
  const [text, setText] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    // send value to parent
    if (onTextChange) {
      onTextChange(value);
    }
  };

  return (
    <div className="flex w-full max-h-46 sm:max-w-md flex-col gap-2">
      <Textarea
        className="bg-background min-h-46"
        id="message"
        placeholder="Paste your feedback"
        required
        value={text}
        onChange={handleChange}
      />
    </div>
  );
};

export default TextareaFrom1;