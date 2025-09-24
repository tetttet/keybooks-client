import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader: React.FC<{ onUploaded: (url: string, public_id: string) => void }> = ({ onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const t = useTranslations("All.responsesForm");

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      onUploaded(data.url, data.public_id);
    } else {
      alert(data.error || "Ошибка загрузки");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p>
          {t("loading")}
        </p>
      ) : (
        <p>
          {t("dropOrChoose")}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
