/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { UseFormRegister, FieldErrors } from "react-hook-form";

type TInputTypeProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<any>;
  errors?: FieldErrors;
  required?: boolean;
};

export function InputType({
  name,
  label,
  placeholder,
  type = "text",
  register,
  errors,
  required = false,
}: TInputTypeProps) {
  const hasError = errors?.[name];

  return (
    <div className="space-y-2 w-full">
      <label className="text-text-secondary">
        {label}
        {required && <span className="text-gray-700 ml-1">*</span>}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className={`bg-white/10 border border-[#404040] py-2 px-4 w-full placeholder:text-text-secondary placeholder:text-sm rounded-xl outline-none
          ${hasError ? "border border-gray-300" : ""}`}
      />

      {hasError && (
        <p className="text-sm text-gray-700">{String(hasError.message)}</p>
      )}
    </div>
  );
}