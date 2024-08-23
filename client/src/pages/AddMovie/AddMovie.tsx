import React, { useState } from "react";
import axios from "axios";
import drop from "../../assets/drop.svg";
import "./addMovie.scss";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function AddMovie() {
  const { serverUrl } = config;
  console.log(serverUrl)
  const [title, setTitle] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("publishingYear", publishingYear);
    if (poster) {
      formData.append("poster", poster);
    }
    try {
      const response = await axios.post(`${serverUrl}/api/movies`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTitle("");
      setPublishingYear("");
      setPoster(null);
      setPosterPreview(null);
      navigate("/movies");
    } catch (error) {
      console.error("Error creating movie:", error);
    }
  };
 const handleCancel = () => {
   navigate("/movies");
 };

  return (
    <div className="wrapper movies-wrapper">
      <div className="container">
        <div className="header">
          <div className="title">
            <h2>Create a new movie</h2>
          </div>
        </div>
        <div className="create-movie">
          <div className="dropbox">
            <label htmlFor="upload">
              <div>
                {poster ? (
                  <img src={URL.createObjectURL(poster)} alt="poster" />
                ) : (
                  <>
                    <img className="drop-icon" src={drop} alt="drop" />
                    <span>Drop an image here or click to upload</span>
                  </>
                )}
              </div>
              <input type="file" id="upload" hidden onChange={handleFileChange} />
            </label>
          </div>
          <div className="form-wrapper">
            <form>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="number"
                  placeholder="Publishing year"
                  value={publishingYear}
                  onChange={(e) => setPublishingYear(e.target.value)}
                  required
                />
              </div>
              <div className="button-wrapper">
                <button type="button" className="outlined" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
