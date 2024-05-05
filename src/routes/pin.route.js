import express from 'express';
import isLoggedIn from '../middleware/auth.js';
import upload from '../../multer.js';
import { getHomepage, filterPins, getProfile, uploadPin, savePin, unsavePin, getCreatedImages, getSavedImages, deletePin } from '../controllers/pin.controller.js';

const pinRouter = express.Router();

/* GET home page. */
pinRouter.get('/', isLoggedIn, (req, res, next) => {
    getHomepage(req, res, next);
});

// Filter home images on the basis of user input
pinRouter.get('/search-pins', isLoggedIn, (req, res, next) => {
    filterPins(req, res, next);
});

// Profile Page
pinRouter.get('/profile', isLoggedIn, (req, res, next) => {
    getProfile(req, res, next);
});

// Create Pin page
pinRouter.get('/create', isLoggedIn, (req, res) => {
    res.render("createpin");
});

// Uploading pin route
pinRouter.post("/upload", isLoggedIn, upload.single("file"), (req, res, next) => {
    uploadPin(req, res, next);
});

// Save Pin
pinRouter.post('/save-pin', isLoggedIn, (req, res, next) => {
    savePin(req, res, next);
});

// Unsave Pin
pinRouter.delete('/unsave-pin/:pinId', isLoggedIn, (req, res, next) => {
    unsavePin(req, res, next);
});

// Delete created pin
pinRouter.delete('/delete-pin/:pinId', isLoggedIn, (req, res, next) => {
    deletePin(req, res, next); // This function should be defined in your pin controller
});

// Show Created images in profile page
pinRouter.get('/profile/created-images', isLoggedIn, (req, res, next) => {
    getCreatedImages(req, res, next);
});

// Show Saved images in profile page
pinRouter.get('/profile/saved-images', isLoggedIn, (req, res, next) => {
    getSavedImages(req, res, next);
});

export default pinRouter;
