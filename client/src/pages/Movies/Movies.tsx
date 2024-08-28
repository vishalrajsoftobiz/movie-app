import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./movies.scss";
import add from "../../assets/add.svg";
import logout from "../../assets/logout.svg";
import edit from "../../assets/edit.png";
import config from "../config";

export default function Movies() {
  const { serverUrl } = config;
  const [movies, setMovies] = useState<any[]>([]);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 8;
  const pageCount = Math.ceil(movies.length / itemsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/movies`);
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % movies.length;
    setItemOffset(newOffset);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const currentItems = movies.slice(itemOffset, itemOffset + itemsPerPage);

  const handleEditClick = (movieId: any) => {
    navigate(`/edit-movie/${movieId}`);
  };

  const handleAddClick = () => {
    navigate(`/create-movie`);
  };
  return (
    <>
      {movies.length === 0 ? (
        <div className="wrapper empty-movies-wrapper">
          <div className="empty-list">
            <h1>Your movie list is empty</h1>
            <button className="primary-btn" onClick={handleAddClick}>
              Add a new movie
            </button>
          </div>
        </div>
      ) : (
        <div className="wrapper movies-wrapper">
          <div className="container">
            <div className="header">
              <div className="title">
                <h2>My Movies</h2>
                <button className="icon-btn" onClick={handleAddClick}>
                  <img src={add} alt="add" />
                </button>
              </div>
              <button className="icon-text-btn" onClick={handleLogout}>
                Logout
                <img src={logout} alt="logout" />
              </button>
            </div>

            <div className="movies-listing">
              {currentItems.map((movie) => (
                <div className="movie-card" key={movie._id}>
                  <div className="movie-img">
                    <img src={`${serverUrl}/uploads/${movie.poster}`} alt={movie.title} />
                  </div>
                  <div className="movie-details">
                    <div>
                      <h3>{movie.title}</h3>
                      <span>{movie.publishingYear}</span>
                    </div>
                    <button className="edit-button" onClick={() => handleEditClick(movie._id)}>
                      <img src={edit} alt="" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <ReactPaginate
              breakLabel="..."
              nextLabel="Next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="Prev"
              renderOnZeroPageCount={null}
              className="pagination"
            />
          </div>
        </div>
      )}
    </>
  );
}
