import Link from "next/link";
import logo from "../../../public/images/OptiluxBD.png";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type TSubbmissionProps = {
  title: string;
  content: string;
  path: string;
  buttonName: string;
  buttonTitle: string;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

const SubmissionSuccess = ({
  title,
  content,
  path,
  buttonName,
  buttonTitle,
  open,
  setOpen,
}: TSubbmissionProps) => {
  return (
    <div className="rounded-lg bg-[linear-gradient(331deg,rgba(238,235,255,0.04)_-7.38%,rgba(238,235,255,0.02)_-7.37%,rgba(238,235,255,0.08)_107.38%)] px-4 py-4 relative max-w-md">
      {/* top and bottom border */}
      <div className="absolute top-0 left-0 inset-1 border-l border-t border-[#221F33] rounded-tl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 inset-1 border-r border-b border-[#221F33] rounded-br-lg pointer-events-none" />

      <div className="space-y-4">
        <div className="space-y-5 px-6">
          <div className="flex items-center justify-center gap-2">
            <Link href="/" className="text-xl font-bold tracking-wider text-white">
              PH <span className="text-violet-500">TASKS</span>
            </Link>
          </div>

          <div className="space-y-1 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-medium text-[#C3C0D8]">{title}</h1>
            <p className="text-[#9B98AE] text-center">{content}</p>
          </div>
        </div>

        {/* Registration Link */}
        <div className=" flex flex-col items-center gap-1 text-[#9B98AE]">
          {open && setOpen ? (
            <p className="flex items-center gap-2">
              {buttonTitle}
              <button
                className="bg-linear-to-b from-[#C3C0D8] to-[#4E0C73] bg-clip-text text-transparent underline underline-offset-2 decoration-[#4E0C73] cursor-pointer"
                onClick={() => setOpen(false)}>
                {buttonName}
              </button>
            </p>
          ) : (
            <p className="flex items-center gap-2">
              {buttonTitle}
              <Link
                className="bg-linear-to-b from-[#C3C0D8] to-[#4E0C73] bg-clip-text text-transparent underline underline-offset-2 decoration-[#4E0C73] "
                href={path}>
                {buttonName}
              </Link>
            </p>
          )}

          <p className="">
            <Link
              className="bg-linear-to-b from-[#C3C0D8] to-[#4E0C73] bg-clip-text text-transparent underline underline-offset-2 decoration-[#4E0C73]"
              href="/login">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
