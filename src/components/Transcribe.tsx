"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import {CopyButton} from "./copybutton";
import ModelSelector from "./selectmodel";
import PromptUploader from "./promptBox";
import Loader from "./loading";
import Button from "./generateButton";
import DownloadButton from "./downloadButton";
import CLoader from "./componentLoading";
import uploadSvg from "../assets/upload.svg"; // Adjust path if needed
import LogoutButton from "./Logout";

interface UserDetails {
    name : string | null | undefined,
    email : string | null | undefined,
    id : string | null | undefined
}

export default function Transcribe({name,email,id}:UserDetails) {
  const promptRef = useRef<string | null>(null);

  const GeminiAPIref = useRef<HTMLInputElement | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [GeminiAPI, setGeminiAPI] = useState<string>("");

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioFile(e.target.files?.[0] || null);
    setTranscript("");
    setDownloadUrl("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      setError("Please select an audio file first.");
      return;
    }
    if (!promptRef.current) {
      setError("Prompt is missing");
      return;
    }
    setLoading(true);
    setError("");
    setTranscript("");
    setDownloadUrl("");

    await deleteOldDownloads();
    
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("SelectModel", selectedModel);
      formData.append("prompt", promptRef.current ?? "");
      formData.append("GeminiAPI", GeminiAPI ?? "");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Failed to transcribe.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTranscript(data.result || "");
      setDownloadUrl(data.downloadUrl || "");

      const filename = data.downloadUrl;

      const downloads = JSON.parse(localStorage.getItem("allDownloads") || "[]");

      downloads.push(filename);

      localStorage.setItem("allDownloads", JSON.stringify(downloads));

    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const deleteOldDownloads = async (): Promise<void> => {
      
    type DeleteFilePayload = {
        filename: string;
      };

      const allDownloads: string[] = JSON.parse(
        localStorage.getItem('allDownloads') || '[]'
      );

      for (const filename of allDownloads) {
        try {
          const res = await fetch("/api/delete-download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: filename }),
              });

          if (!res.ok) {
            console.warn(`Failed to delete ${filename}:`, await res.text());
          }
        } catch (err) {
          console.error(`Error deleting ${filename}:`, err);
        }
      }

      localStorage.removeItem('allDownloads');
    };


  const models = [
    "gemini-2.5-pro-exp-03-25",
    "gemini-2.5-pro-preview-03-25",
    "gemini-2.5-flash-preview-04-17",
    "gemini-2.5-flash-preview-05-20",
    "gemini-2.5-flash-preview-04-17-thinking",
    "gemini-2.5-pro-preview-05-06",
    "gemini-2.5-pro-preview-06-05",
    "gemini-2.0-pro-exp",
    "gemini-2.0-pro-exp-02-05",
    "gemini-exp-1206",
    "gemini-2.0-flash-thinking-exp-01-21",
    "gemini-2.0-flash-thinking-exp",
    "gemini-2.0-flash-thinking-exp-1219",
    "gemini-2.5-flash-preview-tts",
    "gemini-2.5-pro-preview-tts",
    "gemini-2.0-flash",
  ];

  const handleModelSelect = (m: string) => {
    if (!m) {
      console.log("No model selected");
    } else {
      setSelectedModel(m);
      console.log("Selected model:", m);
    }
  };

  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      console.log("File dropped:", file.name);
      setAudioFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

    

    useEffect(()=>{
    try{
        const value = localStorage.getItem("API_KEY");
        const v = GeminiAPIref.current;
    
        //@ts-ignore
        v.value = value;

        const API_Key = localStorage.getItem("API_KEY");
        setGeminiAPI(API_Key!);
    

    }catch(e){
        console.log("no API key stored")
    }
    },[])

        function go(){
            const value = GeminiAPIref.current?.value;
            localStorage.setItem("API_KEY",value!);
            const API_Key = localStorage.getItem("API_KEY");
            setGeminiAPI(API_Key!);   
        }

  return (

    <div className="flex h-screen bg-zinc-100 gap-3 justify-center">
      <div className="p-6 relative h-150 bg-stone-50 rounded-md shadow-md mt-20">
          <div className="flex  w-full text-2xl absolute font-semibold mb-6 text-slate-800 top-[-50px] left-[-150px]">
            <p>
            Welcome, {name || email}
            </p>
            
        <div className="flex items-center relative">
               <div><input
                name="API_key"
                ref={GeminiAPIref}
                autoComplete="off"
                type="text"
                placeholder="Enter your API key"
                className="border-2 font-normal bg-white ml-4 border-slate-600 text-lg px-4 py-[2px] rounded-md"
                //@ts-ignore
                style={{ WebkitTextSecurity: 'disc' }}
                />
                </div>
                        <div className="bg-white absolute right-1 pl-4 flex ml-[-69px] h-[30px] justify-end item-center ">
                            <button className="cursor-pointer border-1 font-normal bg-white border-slate-600 text-lg px-3 active:bg-gray-400 hover:bg-gray-300 py-[-1px] rounded-md" onClick={go}>go</button>

                        </div>
                </div>    
              </div>
       
      
       <div className="flex bg-gray-900 items-center gap-20 ">
       <h1 className="text-2xl font-semibold mb-6 text-slate-800">
        Audio Transcription    
        </h1>
        <LogoutButton />
        </div>

        
        <form
          onSubmit={handleSubmit}
          className="py-4 relative flex-col gap-2 justify-center flex items-center"
        >
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center py-2 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <span
              id="file-label "
              className="flex items-center justify-center gap-2 text-[18px] min-w-110"
            >
              {audioFile ? (
                audioFile.name
              ) : (
                <>
                  <Image src={uploadSvg} alt="upload icon" width={24} height={24} />
                  <p className="text-gray-600 w-full">Drag/Click to upload</p>
                </>
              )}
              <input
                id="file-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </span>
          </label>
          <ModelSelector models={models} onSelect={handleModelSelect} />
          <PromptUploader promptRef={promptRef} />
          <button
            type="submit"
            disabled={loading}
            className={`absolute bottom-[32px] right-[20px] ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading ? <Loader /> : <Button />}
          </button>
          
        </form>
      </div>
    

      {/* Display transcript and other UI here as needed */}
     <div className="w-xl mr-6 mt-20 relative">      
         {error && <p className="text-red-600 font-medium">{error}</p>}

      {transcript && (
        <div  ref={transcriptRef} className=" w-full p-4 bg-gray-50 border border-gray-200 rounded-md max-h-150 overflow-y-auto whitespace-pre-wrap text-gray-800">
          <ReactMarkdown>{transcript}</ReactMarkdown>
        </div>
      )}

      {
        !loading && !transcript && !error &&  <div  ref={transcriptRef} className=" w-full p-4 bg-gray-50 border border-gray-200 rounded-md max-h-150 overflow-y-auto whitespace-pre-wrap text-gray-800">
         Preview will appear here
        </div>
      }
      
          {loading ?
          <div  ref={transcriptRef} className="w-xl h-150 flex items-center justify-center mr-6 relative w-full p-4 bg-stone-50 border border-gray-200 rounded-md overflow-y-auto whitespace-pre-wrap text-gray-800">

          <CLoader /> 
        </div>: ""}

      {downloadUrl && (
        <div className="mt-2 absolute top-0 right-[-170px] ">
          <a
            href={`${downloadUrl}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className=""
          ><DownloadButton  text="download" />
          </a>
          <CopyButton targetRef={transcriptRef}/>
        </div>
      )}
    </div>
    </div>
  );
}

