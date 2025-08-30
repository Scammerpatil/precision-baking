"use client";
import {
  IconBrandYoutube,
  IconClipboardText,
  IconCloudUpload,
} from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface Response {
  title: string;
  ingredients: string[];
  instructions: string;
  youtubeLinks?: string[];
}

const PredictFromImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a file first.");
      return;
    }
    try {
      const res = axios.postForm("/api/predict/image", { file });
      toast.promise(res, {
        loading: "Predicting...",
        success: (data) => {
          setResponse(data.data.result);
          console.log(data.data);
          return `Predicted dish name: ${data.data.name}`;
        },
        error: (error) => {
          console.log(error);
          return error.response.data.message || "Error predicting dish name.";
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Error uploading file. Please try again.");
    }
  };
  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Predict Dish Name From the Image itself
      </h1>
      <div className="flex mt-6 items-center justify-center w-full max-w-md mx-auto hover:bg-base-300">
        <label
          className="flex flex-col items-center justify-center w-full h-full border-2 border-base-content border-dashed rounded-lg cursor-pointer bg-base-100 py-2"
          htmlFor="dropzone-file"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <IconCloudUpload size={48} className="text-base-content" />
            <p className="mb-2 text-sm text-base-content">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-base-content">PDF (MAX. 800x400px)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setResponse(null);
            }}
          />
          {file && (
            <button className="btn btn-sm btn-info max-w-sm text-center">
              <IconClipboardText size={14} />
              {file?.name}
            </button>
          )}
        </label>
      </div>
      {file && (
        <div className="flex justify-center mt-6">
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded Preview"
            className="w-full max-w-md rounded-lg shadow-lg h-52 object-cover"
          />
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-primary w-full max-w-md"
          disabled={!file}
          onClick={handleSubmit}
        >
          Predict
        </button>
      </div>
      {response && (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
          <div className="card bg-base-200 shadow-lg transition-all hover:shadow-xl">
            <div className="card-body space-y-4">
              <h2 className="card-title text-2xl text-accent font-bold">
                {response.title}
              </h2>

              <div>
                <p className="text-lg text-base-content font-semibold">
                  Ingredients:
                </p>
                <ul className="list-disc list-inside ml-4 text-base-content">
                  {response.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-base">
                      {ing
                        .trim()
                        .replace("'", "")
                        .replace("'", "")
                        .replace("[", "")
                        .replace("]", "")}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-lg text-base-content/90 font-semibold">
                  Instructions:
                </p>
                <p className="text-base-content text-base">
                  {response.instructions
                    .replace(/\*\*/g, "")
                    .replace(/(?=\d+\.)/g, "\n")}
                </p>
              </div>

              {response.youtubeLinks && (
                <div className="space-y-2">
                  <p className="text-sm text-base-content font-semibold flex items-center">
                    <IconBrandYoutube className="mr-2 text-error" /> YouTube
                    Recommendation:
                  </p>
                  {response.youtubeLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base-content text-base font-semibold hover:underline flex items-center"
                    >
                      <IconBrandYoutube className="mr-2 text-error" />
                      {link}
                    </a>
                  ))}
                  {response.youtubeLinks.length === 0 && (
                    <p className="text-base-content text-base font-semibold">
                      No YouTube recommendations available.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const extractVideoId = (url: string) => {
  const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
};

export default PredictFromImage;
