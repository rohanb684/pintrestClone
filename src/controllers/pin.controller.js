import mongoose from "mongoose";
import PinModel from "../models/pinModel/pin.schema.js";
import UserModel from "../models/userModel/user.schema.js";



export const getHomepage = async (req, res, next) => {
    try{
        const user = await UserModel.findOne({username: req.session.passport.user});
        const pins = await PinModel.find({ user: { $ne: user._id } });
    
        if(user && user.savedPins){
          const savedPinIds = user.savedPins; 
          console.log(pins);
          res.render('exp', { pins: pins, savedPinIds: savedPinIds.map(id => id.toString()) }); 
        }else{
          res.render('exp', { pins: pins, savedPinIds: [] }); 
        }
        
      }catch(error){
        console.log(error);
        return next(err);
      }
}


export const filterPins = async(req, res, next) => {
    try {
        const query = req.query.query;
        let pins = [];
        if (query) {
            pins = await PinModel.find({ title: { $regex: new RegExp(query, 'i') } });
        } else {
            pins = await PinModel.find({});
        }
        
        const user = await UserModel.findOne({username: req.session.passport.user});
        if(user && user.savedPins){
          const savedPinIds = user.savedPins; 
          res.render('partials/homeImages', { pins: pins, savedPinIds: savedPinIds.map(id => id.toString())});
          
        }else{
          res.render('partials/homeImages', { pins: pins, savedPinIds: [] }); 
        }
  
    } catch (error) {
        console.error('Failed to search pins:', error);
        res.status(500).send('Error searching pins');
    }
}


export const getProfile = async(req, res, next) => {
    try{
        const user = await UserModel.findOne({username : req.session.passport.user});
        // console.log(user);
        if(user){
          const pins = await PinModel.find({user: user._id})
          // console.log(pins);
          res.render('profile', { pins: pins, name: user.fullname })
        }
      }catch(error){
        console.log(error);
        return next(err);
      }
}

export const uploadPin = async(req, res, next) =>{
    if(!req.file){
        res.status(400).send("no files were given")
      }
      try {
        
        const { title, description} = req.body;
        // console.log(req.session.passport)
       
        const user = await UserModel.findOne({username : req.session.passport.user});
        if (user) {
          const newPin = new PinModel({
            title: title,
            image: req.file.filename, 
            description: description,
            user: user._id
          });
    
          const savedPin = await newPin.save();
          user.pins.push(savedPin._id); // Add the pin's ObjectId to the user's pins array
          await user.save();
        }
        // Send a success response with the pin data
        res.redirect('/');
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while uploading the file.");
      }
}

export const savePin = async (req, res, next) =>{
    const { pinId } = req.body;
    // console.log(pinId);
    const username = req.session.passport.user;  
  
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).send('User not found');
        }
  
        const objectId = new mongoose.Types.ObjectId(pinId); 
        if (!user.savedPins.includes(objectId)) {
            user.savedPins.push(objectId);
            await user.save();
            res.json({ message: 'Pin saved successfully' });
        } else {
            res.status(400).json({ message: 'Pin already saved' });
        }
    } catch (error) {
        console.error('Error saving pin:', error);
        res.status(500).send('Error saving pin');
    }
}

export const unsavePin = async (req, res, next) => {
    const { pinId } = req.params;
    const userId = req.session.passport.user;
  
    try {
        const user = await UserModel.findOne({ username: userId });
        if (!user) {
            return res.status(404).send('User not found');
        }
  
        user.savedPins = user.savedPins.filter(id => id.toString() !== pinId);
        await user.save();
        res.json({ message: 'Pin unsaved successfully' });
        // res.redirect('/profile/saved-images');
    } catch (error) {
        console.error('Error unsaving pin:', error);
        res.status(500).send('Error unsaving pin');
    }
  }

  export const deletePin = async (req, res, next) => {
    const { pinId } = req.params;
    const username = req.session.passport.user;
  
    try {
      const user = await UserModel.findOne({username: username});
        const pin = await PinModel.findOne({ _id: pinId, user: user._id });
        if (!pin) {
            return res.status(404).send('Pin not found or you do not have permission to delete this pin');
        }
  
        // Delete the pin from the database
        await PinModel.deleteOne({ _id: pinId });
        user.savedPins = user.savedPins.filter(id => id.toString() !== pinId);
        user.pins = user.pins.filter(id => id.toString() !== pinId);
  
        await user.save();
        res.json({ message: 'Pin deleted successfully' });
    } catch (error) {
        console.error('Error deleting pin:', error);
        res.status(500).send('Error deleting pin');
    }
  }

  export const getCreatedImages = async (req, res, next) => {

    try{
      const user = await UserModel.findOne({username : req.session.passport.user});
      // console.log(user);
      if(user){
        const pins = await PinModel.find({user: user._id})
        // console.log(pins);
        res.render('partials/createdImages', { pins: pins });
      }
    }catch(error){
      console.log(error);
      return next(err);
    }
  }

  export const getSavedImages = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({username: req.session.passport.user});
        // console.log(user);
        if (user && user.savedPins.length > 0) {
            const pins = await PinModel.find({
                '_id': { $in: user.savedPins }
            });
            const savedPinIds = user.savedPins; 
            // console.log(pins);
            res.render('partials/savedImages', { pins: pins});
        } else {
            res.render('partials/savedImages', { pins: []}); // Render empty if no saved pins or no user found
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching saved images");
    }
  }