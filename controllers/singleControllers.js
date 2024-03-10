const mongoose = require('mongoose');
const {
    ArtistModel,
    AlbumModel, 
    SongModel,
    SingleSongModel
} = require('../models/SongModel')


const createSingle = async (req, res) => {
    // Implementation to create new Single Song
    try{
        const {title, duration, file_url, release_date, genre} = req.body;
        const artist_id = req.params.artist_id;
        const artist = await ArtistModel.findOneAndUpdate(
            {_id: artist_id},
            {$push: {'single': {title, duration, file_url, release_date, genre}}},
            {new: true}
        )
        if (!artist){
            return res.status(404).json({error:"Error on creating album"});
        }
        res.status(201).json(artist)
    } catch(error) {
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const getSingle = async (req, res) => {
    // Implementation to get specific single_song
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error:"Invalid Id"});
        }
        const single = await ArtistModel.findOne({'single._id': id}, {'single.$': 1});
    
        if (!single){
            return res.status(404).json({error:"Error on retriving Single Song"});
        }
        res.status(200).json(single);
    } catch(error){
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
   }
};


const deleteSingle = async (req, res) => {
    // Implementation to delete specific single song
    try{
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error:"Invalid Id"})
        }
        const single = await ArtistModel.findOneAndUpdate(
            // The $pull operator in MongoDB is used to remove elements from an array 
            {'single._id': id}, // find artist with specific single song id
            {$pull: {single: { _id: id }}}, // pulling out(removing element)
            { new: true } // return the update
        );
        if (!single){
            return res.status(404).json({error:"Error on deleteing single"})
        }
        res.status(200).json(single)
    
    } catch{
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const updateSingle = async (req, res) => {
    // Implementation to update specific single song
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid Id"})
    }
    const updateSingleData = {
        title: req.body.title,
        duration: req.body.duration,
        file_url: req.body.file_url,
        release_date: req.body.release_date,
        genre: req.body.genre,
    }
    const single = await ArtistModel.findOneAndUpdate(
        {'single._id': id},
        {$set: {
            'single.$.title': updateSingleData.title,
            'single.$.duration': updateSingleData.duration,
            'single.$.file_url': updateSingleData.file_url,
            'single.$.release_date': updateSingleData.release_date,
            'single.$.genre': updateSingleData.genre
        } },
        {new: true}
        )
    if (!single){
        return res.status(404).json({error:"Error on updating single"})
    }
    res.status(200).json(single);
};

module.exports = {
    createSingle: createSingle,
    getSingle: getSingle,
    deleteSingle: deleteSingle,
    updateSingle: updateSingle
}