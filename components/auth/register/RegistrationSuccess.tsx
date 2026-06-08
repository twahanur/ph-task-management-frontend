import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

type TSuccessProps = {
  title: string;
  description: string;
  warning?: string;
  from: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

const RegistrationSuccess = ({
  title,
  description,
  warning,
  from,
  setOpen,
}: TSuccessProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 w-full md:w-[28vw] space-y-6 rounded-xl shadow-md dark:shadow-none mx-auto">
      <div className="flex justify-center items-center py-2">
        <span className="text-xl font-bold tracking-wider text-gray-800 dark:text-white">
          PH <span className="text-violet-500">TASKS</span>
        </span>
      </div>

      {/* Intro message */}
      <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </h1>

      {/* Explanation */}
      <p className="text-center text-sm text-[#a2b1ca] px-4">{description}</p>

      {/* Icon */}
      <div className="flex justify-center">
        <CheckCircle className="text-green-500 w-16 h-16" />
      </div>

      {/* Warning message */}
      {warning && (
        <p className="text-center text-xs text-red-500 font-medium px-6">
          ⚠️ You will not be able to login until your email is verified.
        </p>
      )}

      {/* Actions */}
      {from === "register" && (
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full p-2 rounded-lg transition bg-yellow-500 text-white hover:bg-[#ffc500] duration-300 text-center"
          >
            Back to Login
          </Link>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Didn’t receive the verification email?
            <Link
              href="/verify-email"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Resend email
            </Link>
          </p>
        </div>
      )}
      {from === "forget" && setOpen && (
        <button
          onClick={() => setOpen(false)}
          className="border-b border-[#ffc500] text-yellow-600 cursor-pointer"
        >
          Resend Email
        </button>
      )}
    </div>
  );
};

export default RegistrationSuccess;
