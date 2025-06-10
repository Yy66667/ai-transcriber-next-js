import  { useState, useRef } from "react";
import type { ChangeEvent, RefObject } from "react";
import mammoth from "mammoth";

interface PromptUploaderProps {
  promptRef: RefObject<string | null>;
}



//@ts-ignore



export default function PromptUploader({promptRef }: PromptUploaderProps){
  const [promptFile, setPromptFile] = useState<File | null>(null);
  const [promptText, setPromptText] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

 
  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value;
  };

  const handlePromptFileChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPromptFile(file);
    const extension = file.name.split(".").pop()?.toLowerCase();

    try {
      if (extension === "txt") {
        const text = await file.text();
        setPromptText(text);
      } else if (extension === "pdf") {
        alert("`.pdf` files aren't supported in browser. Please upload .docx instead.");
        setPromptText("");
      } else if (extension === "docx") {
        const text = await extractTextFromDocx(file);
        setPromptText(text);
      } else if (extension === "doc") {
        alert("`.doc` files aren't supported in browser. Please upload .docx instead.");
        setPromptText("");
      } else {
        alert("Unsupported file type.");
        setPromptText("");
      }
    } catch (err) {
      console.error("Error reading file:", err);
      alert("Failed to read file content.");
      setPromptText("");
    }
  };


  return (
    <div>
      <form  className="space-y-4">    
        <div className="relative">
        <textarea
          className="focus:outline-none min-w-120 w-full text-lg h-90 p-4 pb-40 border-gray-200 border-2 bg-slate-0 text-gray-700 rounded-xl resize-none"
          placeholder="Type the prompt or select a .txt or .docx file "
          value={promptText}
          onChange={(e) => {setPromptText(e.target.value); promptRef.current = promptText }}
        />

         <label
          htmlFor="prompt-file-upload"
          className="w-74 absolute left-3 bg-white bottom-[14px] items-center border-slate-200 gap-20 justify-center py-[10px] border-2 rounded-lg cursor-pointer transition-colors"
        >
          <span className="flex relative bg-white flex-row items-center justify-center gap-2 text-[18px]">
           
              <div className=" inline-block group">
                  <p className="text-gray-600 bg-white cursor-pointer">
                    Click to upload prompt
                  </p>
                  <span className="absolute bottom-full mb-1 right-0 text-xs text-emerald-300 bg-gray-600 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    .txt, .docx supported
                  </span>
              </div>


            <input
              id="prompt-file-upload"
              ref={fileInputRef}
              type="file"
              accept=".txt,.docx"
              onChange={handlePromptFileChange}
              className="hidden"
            />
          </span> 
        </label>
        </div>      
      </form>
    </div>

    
  );
}
