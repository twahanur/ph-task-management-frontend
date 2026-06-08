import { useState } from "react";
import { Paperclip, Trash2, FileText, FileSpreadsheet, FileArchive, File, Download, Loader2 } from "lucide-react";
import { getTimeAgo } from "@/utills/getTimeAgo";

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  uploader?: {
    id: string;
    name: string;
  };
}

interface CardAttachmentsProps {
  attachments: Attachment[];
  onDelete: (attachmentId: string) => Promise<void>;
}

export default function CardAttachments({ attachments, onDelete }: CardAttachmentsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) return null;

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string, fileName: string) => {
    const nameLower = fileName.toLowerCase();
    if (mimeType?.startsWith("image/")) {
      return { icon: File, color: "text-emerald-400", bgColor: "bg-emerald-500/10", typeLabel: "Image" };
    }
    if (mimeType === "application/pdf" || nameLower.endsWith(".pdf")) {
      return { icon: FileText, color: "text-rose-400", bgColor: "bg-rose-500/10", typeLabel: "PDF" };
    }
    if (mimeType === "application/zip" || mimeType === "application/x-zip-compressed" || nameLower.endsWith(".zip")) {
      return { icon: FileArchive, color: "text-amber-400", bgColor: "bg-amber-500/10", typeLabel: "ZIP Archive" };
    }
    if (mimeType === "text/plain" || mimeType === "text/csv" || nameLower.endsWith(".txt") || nameLower.endsWith(".csv")) {
      return { icon: FileText, color: "text-sky-400", bgColor: "bg-sky-500/10", typeLabel: "Text" };
    }
    if (
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      nameLower.endsWith(".doc") ||
      nameLower.endsWith(".docx")
    ) {
      return { icon: FileText, color: "text-blue-400", bgColor: "bg-blue-500/10", typeLabel: "Word Doc" };
    }
    if (
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      nameLower.endsWith(".xls") ||
      nameLower.endsWith(".xlsx")
    ) {
      return { icon: FileSpreadsheet, color: "text-emerald-400", bgColor: "bg-emerald-500/10", typeLabel: "Excel Sheet" };
    }
    return { icon: File, color: "text-slate-400", bgColor: "bg-slate-500/10", typeLabel: "File" };
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file directly, falling back to opening in a new tab", error);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-4">
        <div className="text-gray-500">
          <Paperclip size={20} />
        </div>
        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
          Attachments <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">{attachments.length}</span>
        </h4>
      </div>

      <div className="space-y-3 pl-10">
        {attachments.map((att) => {
          const isDeleting = deletingId === att.id;
          const { icon: FileIcon, color: iconColor, bgColor: iconBg, typeLabel } = getFileIcon(att.mime_type, att.file_name);
          const isImage = att.mime_type?.startsWith("image/");

          return (
            <div
              key={att.id}
              className={`flex items-center gap-4 silver-input p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 ${
                isDeleting ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {/* File Icon / Thumbnail */}
              <a
                href={att.file_url}
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload(att.file_url, att.file_name);
                }}
                className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden bg-gray-200 border border-gray-300 flex-shrink-0 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                title="Download attachment"
              >
                {isImage ? (
                  <img src={att.file_url} alt={att.file_name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gray-300/50`}>
                    <FileIcon size={22} className="text-gray-600" />
                  </div>
                )}
              </a>

              {/* Meta Info */}
              <div className="flex-1 min-w-0">
                <a
                  href={att.file_url}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(att.file_url, att.file_name);
                  }}
                  className="text-sm font-semibold text-gray-800 hover:text-gray-600 transition-colors truncate block max-w-[200px] sm:max-w-md md:max-w-lg cursor-pointer"
                  title={`Download ${att.file_name}`}
                >
                  {att.file_name}
                </a>
                <p className="text-xs text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                  <span className="font-semibold text-gray-700">{typeLabel}</span>
                  <span>•</span>
                  <span>{formatBytes(att.file_size)}</span>
                  <span>•</span>
                  <span>Added {getTimeAgo(att.created_at)}</span>
                  {att.uploader?.name && (
                    <>
                      <span>•</span>
                      <span>by <span className="font-semibold text-gray-600">{att.uploader.name}</span></span>
                    </>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleDownload(att.file_url, att.file_name)}
                  className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 rounded-lg transition-colors cursor-pointer"
                  title="Download attachment"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => handleDelete(att.id)}
                  disabled={isDeleting}
                  className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-100/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete attachment"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
