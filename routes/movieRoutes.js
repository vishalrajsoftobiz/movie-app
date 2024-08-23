const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const multer = require('multer');
const path = require('path');

// file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  
  }
});

const upload = multer({ storage: storage });

//new movie
router.post('/', upload.single('poster'), async (req, res) => {
  try {
    const { title, publishingYear, userId } = req.body;
    const movie = new Movie({
      title,
      publishingYear,
      poster: req.file.filename,
      userId 
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get-All movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a movie
router.put('/:id', upload.single('poster'), async (req, res) => {
  try {
    const { title, publishingYear } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.title = title || movie.title;
    movie.publishingYear = publishingYear || movie.publishingYear;
    if (req.file) {
      movie.poster = req.file.filename;
    }

    await movie.save();
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a movie
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
