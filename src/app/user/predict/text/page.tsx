"use client";
import Title from "@/components/Title";
import { IconClipboardText, IconBrandYoutube } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface Response {
  title: string;
  ingredients: string;
  instructions: string;
  youtubeLink?: string;
}

const PredictFromImage = () => {
  const [text, setText] = useState<string>("");
  const [response, setResponse] = useState<Response[] | null>(null);

  const handleSubmit = async () => {
    try {
      const res = axios.post("/api/predict/text", { text: text });
      toast.promise(res, {
        loading: "Predicting...",
        success: (data) => {
          setResponse(data.data.result);
          return "Prediction successful!";
        },
        error: (error) => {
          console.log(error);
          return error.response?.data?.message || "Error predicting dish name.";
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Error uploading file. Please try again.");
    }
  };

  return (
    <>
      <Title title="Predict Dish Name From Text" />
      <div className="px-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col gap-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base font-bold">
                Enter dish name/ingredients<span className="text-error">*</span>
              </legend>
              <textarea
                className="textarea textarea-primary w-full border border-dotted"
                placeholder="Enter dish name or ingredients..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
              />
            </fieldset>
            <button className="btn btn-primary w-full" onClick={handleSubmit}>
              <IconClipboardText className="mr-2" /> Predict
            </button>
          </div>
        </div>

        {response && (
          <div className="max-w-3xl mx-auto mt-10 space-y-6">
            {response.map((item, index) => (
              <div
                key={index}
                className="card bg-base-200 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="card-body space-y-4">
                  <h2 className="card-title text-2xl text-accent font-bold">
                    {item.title}
                  </h2>

                  <div>
                    <p className="text-lg text-base-content font-semibold">
                      Ingredients:
                    </p>
                    <ul className="list-disc list-inside ml-4 text-base-content">
                      {item.ingredients.split(",").map((ing, idx) => (
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
                    <p className="text-base-content text-base whitespace-pre-line">
                      {item.instructions
                        .replace(/\*\*/g, "")
                        .replace(/(?=\d+\.)/g, "\n")}
                    </p>
                  </div>

                  {item.youtubeLink && (
                    <div className="space-y-2">
                      <p className="text-sm text-base-content font-semibold flex items-center">
                        <IconBrandYoutube className="mr-2 text-error" /> YouTube
                        Recommendation:
                      </p>
                      <iframe
                        src={`https://www.youtube.com/embed/${extractVideoId(
                          item.youtubeLink
                        )}`}
                        title="YouTube video"
                        allowFullScreen
                        className="w-full h-52 rounded-xl shadow"
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const extractVideoId = (url: string) => {
  const match = url.match(/v=([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
};

export default PredictFromImage;
