const mongoose = require('mongoose');
const {
    ArtistModel,
    AlbumModel, 
    SongModel,
    SingleSongModel
} = require('../models/SongModel')


/**
 * Handles the POST request for creating new artist.
 * 
 * The API is /api/newArtist
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns the created artist data
 * @throws {Error} - 404 no artist found returns.
 */
const createArtist = async (req, res) => {
    // Implementation to  arcreate new artist.
    const {full_name, bio, dob, gender, img_url, albums, single} = req.body;
    const artist = await ArtistModel.create({full_name, bio, dob, gender, img_url, albums, single});
    // console.log(full_name, bio, dob, gender, img_url, albums, single);
    if (!artist){
        console.log("[INFO]: ", artist)
        return res.status(404).json({error:"Error on creating artist"})
    }
    res.status(201).json(artist)
}

/**
 * Handles the GET request for retrieving a list of artists.
 * 
 * The API is /api/listArtists
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Array[ArtistModel]} - The list of artists with detail information about their albums and songs.
 * @throws {Error} - 404 no artist found returns.
 */
const listArtist = async (req, res) => {
    // Implementation to list all artist
    const artists = await ArtistModel.find({});
    if (!artists){
        return res.status(404).json({error: "No artist found"})
    }
    res.status(200).json(artists)
}

/**
 * Handles the GET request for retrieving a specific artist.
 * 
 * The API is /api/getArtist/:id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Specifc Artist information.
 * @throws {Error} - 404 Invalid Id /no artist found returns.
 */
const getArtist = async (req, res) => {
    // Implementation to get specific artist
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid Id"})
    }
    const artist = await ArtistModel.findById(id)
    if (!artist){
        return res.status(404).json({error:"Error on creating artist"})
    }
    res.status(200).json(artist)
}

/**
 * Handles the DELETE request for deleting a specific artist.
 * 
 * The API is /api/deleteArtist/:id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns deleted artist's information.
 * @throws {Error} - 404 Invalid Id /no artist found returns.
 */
const deleteArtist = async (req, res) => {
    // Implementation to delete specific artist
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid Id"})
    }
    const artist = await ArtistModel.findByIdAndDelete(id)
    if (!artist){
        return res.status(404).json({error:"Error on creating artist"})
    }
    res.status(200).json(artist)
}

/**
 * Handles the PUT request for updating a specific artist.
 * 
 * The API is /api/updateArtist/:id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns updated artist's information.
 * @throws {Error} - 404 Invalid Id /no artist found returns.
 */
const updateArtist = async (req, res) => {
    // Implementation to update specific artist
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"Invalid Id"})
    }
    const artist = await ArtistModel.findByIdAndUpdate(id, {...req.body}, {new: true});
    if (!artist){
        return res.status(404).json({error:"Error on updating artist"})
    }
    res.status(200).json(artist)
}

module.exports = {
    createArtist: createArtist,
    listArtist: listArtist,
    getArtist: getArtist,
    deleteArtist: deleteArtist,
    updateArtist: updateArtist,
}