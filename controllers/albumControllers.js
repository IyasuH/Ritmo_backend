const mongoose = require('mongoose');
const {
    ArtistModel
} = require('../models/SongModel')

/**
 * Handles the POST request for creating new album for specific artist.
 * 
 * The API is /api/newAlbum/:artist_id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns the created album's data
 * @throws {Error} - 404 Invalid Id / no artist found returns / 500 Internal Server error(if any other error happens).
 */
const createAlbum = async (req, res) => {
    // Implementation to create new album
    try{
        const {title, cover_img_url, release_date, songs} = req.body;
        const artist_id = req.params.artist_id;
        console.log("[INFO] ", req.body)
        const artist = await ArtistModel.findOneAndUpdate(
            {_id: artist_id},
            {$push: {'albums': {title, cover_img_url, release_date, songs}}},
            {new: true}
        )
        // await artist.save();
        if (!artist){
            return res.status(404).json({error:"Error on creating album"});
        }
        // artist.albums.push({title, cover_img_url, release_date});
        res.status(201).json(artist);
    } catch(error) {
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

/**
 * Handles the GET request for retrieving a specific album.
 * 
 * The API is /api/getAlbum/:id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Specifc Album information.
 * @throws {Error} - 404 Invalid Id / no artist found returns / 500 Internal Server error(if any other error happens).
 */
const getAlbum = async (req, res) => {
    // Implementation to get specific album
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error:"Invalid Id"});
        }
        // I don't know why i make the return to be like this, but it is being an issue on the frontend so i am chnaging for now
        const album = await ArtistModel.findOne({'albums._id': id}, {'albums.$': 1});
        const albm = album.albums.reduce((obj, albmData) => {
            const {_id, title, cover_img_url, release_date, songs, createdAt, updatedAt }= albmData;
            obj= {
                _id: _id.toString(),
                title,
                cover_img_url,
                release_date: new Date(release_date),
                songs,
                created_at: new Date(createdAt),
                updated_at: new Date(updatedAt)
            };
            return obj;
        }, {});
        console.log("albm: ", albm)
        // console.log("album: ", album)
            // }
        if (!albm){
            return res.status(404).json({error:"Error on retriving Album"});
        }
        res.status(200).json(albm);
    } catch(error){
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
   }
};

/**
 * Handles the DELETE request for deleting a specific album.
 * 
 * The API is /api/deleteAlbum/:id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns deleted album's information.
 * @throws {Error} - 404 Invalid Id / no artist found returns / 500 Internal Server error(if any other error happens).
 */
const deleteAlbum = async (req, res) => {
    // Implementation to delete specific album
    try{
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error:"Invalid Id"})
        }
        const album = await ArtistModel.findOneAndUpdate(
            // The $pull operator in MongoDB is used to remove elements from an array 
            {'albums._id': id}, // find artist with specific album id
            {$pull: {albums: { _id: id }}}, // pulling out(removing element)
            { new: true } // return the update
        );
        if (!album){
            return res.status(404).json({error:"Error on deleteing album"})
        }
        res.status(200).json(album)
    
    } catch{
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

/**
 * Handles the PUT request for updating a specific album.
 * 
 * The API is /api/updateAlbum/:id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns updated album's information.
 * @throws {Error} - 404 Invalid Id / no artist found returns / 500 Internal Server error(if any other error happens).
 */
const updateAlbum = async (req, res) => {
    // Implementation to update specific album
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid Id"})
    }
    const updateAlbumData = {
        title: req.body.title,
        cover_img_url: req.body.cover_img_url,
        release_date: req.body.release_date,
        songs: req.body.songs,
    }
    const album = await ArtistModel.findOneAndUpdate(
        {'albums._id': id},
        {$set: {
            'albums.$.title': updateAlbumData.title,
            'albums.$.cover_img_url': updateAlbumData.cover_img_url,
            'albums.$.release_date': updateAlbumData.release_date,
            'albums.$.songs': updateAlbumData.songs
        } },
        {new: true}
        )
    if (!album){
        return res.status(404).json({error:"Error on updating album"})
    }
    res.status(200).json(album);
};

const getArtistsAlbum = async(req, res) => {
    // I don't think this will be nessary since i can get same and additional info from getArtist
}

module.exports = {
    createAlbum: createAlbum,
    getAlbum: getAlbum,
    deleteAlbum: deleteAlbum,
    updateAlbum: updateAlbum
}
