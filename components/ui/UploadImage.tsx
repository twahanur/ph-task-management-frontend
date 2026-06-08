"use client";

import { RefObject } from "react";

const UploadImage = ({
  fileInputRef,
  handleChange,
}: {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleChange: (imageFIile: File) => Promise<void>;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange(file);
    }
    return;
  };

  return (
    <input
      type="file"
      accept="image/*"
      className="hidden"
      ref={fileInputRef}
      onChange={(e) => handleFileChange(e)}
    />
  );
};

export default UploadImage;
