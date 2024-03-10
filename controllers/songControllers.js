const mongoose = require('mongoose');

const {
    ArtistModel,
    AlbumModel, 
    SongModel,
    SingleSongModel
} = require('../models/SongModel')

/**
 * Handles the POST request for creating new song for specific album.
 * 
 * The API is /api/newSong/artist/:artist_id/album/:album_id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns the created song's data
 * @throws {Error} - 404 Invalid Id / no artist found returns / 500 Internal Server error(if any other error happens).
 */
const createSong = async (req, res) => {
    // Implementation to create new song under specifc album
    try{
        const artist_id = req.params.artist_id;
        const album_id = req.params.album_id;
        const {title, duration, file_url, release_date, genre} = req.body;

        const artist = await ArtistModel.findOneAndUpdate(
            {_id: artist_id, 'albums._id': album_id},
            {$push: {'albums.$.songs': {title, duration, file_url, release_date, genre}}},
            {new: true}
        )

        if (!artist){
            return res.status(404).json({error:"Error on creating album"});
        }
        res.status(201).json(artist);
    } catch(error) {
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

/**
 * Handles the GET request for retrieving a specific song.
 * 
 * The API is /api/getSong/artist/:artist_id/album/:album_id/songs/:song_id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Specifc song information.
 * @throws {Error} - 404 Invalid Id / no artist found returns / 500 Internal Server error(if any other error happens).
 */
const getSong = async (req, res) => {
    // Implementation to get specifc song under specifc album
    try{
        const artist_id = req.params.artist_id;
        const album_id = req.params.album_id;
        const song_id = req.params.song_id;

        // I can use the code bellow but it will return all the artist data not specifcally the song data 
        // but the advantage is i don't have to specify artist_id
        // artist = await ArtistModel.findOne({'albums._id': album_id, 'albums.songs._id': song_id})
        // res.status(200).json(artist);

        artist = await ArtistModel.findOne({ _id: artist_id});
        if (!artist){
            return res.status(404).json({error:"Artist not found"});
        }
        album = artist.albums.id(album_id);
        if (!album){
            return res.status(404).json({error:"Song not found in the artist\'s albums"});
        }

        song = album.songs.id(song_id);
        if (!song){
            return res.status(404).json({error:"Song not found"});
        }
        res.status(200).json(song);
    } catch(error){
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
   }
};

/**
 * Handles the DELETE request for deleting a specific song.
 * 
 * The API is /api/deleteSong/album/:album_id/songs/:song_id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns deleted song's information.
 * @throws {Error} - 404 Invalid Id / no artist found returns / 500 Internal Server error(if any other error happens).
 */
const deleteSong = async (req, res) => {
    // Implementation to delete specifc song under specifc album
    try{    
        const album_id = req.params.album_id;
        const song_id = req.params.song_id;
        const song = await ArtistModel.findOneAndUpdate(
            {'albums._id': album_id, 'albums.songs._id': song_id},
            {
                $pull: {
                    'albums.$.songs': {_id: song_id}
                }
            },
            {new: true},
        );
        if (!song){
            return res.status(404).json({error: 'Artist or Album nott found'});
        }
        res.status(200).json(song)
    } catch(error) {
        res.status(500).json({error: "Internal server error"});
    }
};

/**
 * Handles the PUT request for updating a specific song.
 * 
 * The API is /api/updateSong/album/:album_id/songs/:song_id
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {ArtistModel} - Returns updated song's information.
 * @throws {Error} - 404 Invalid Id / no artist found returns / 500 Internal Server error(if any other error happens).
 */
const updateSong = async (req, res) => {
    // Implementation to update specifc song under specifc album
    try{
        const album_id = req.params.album_id;
        const song_id = req.params.song_id;
        const updateSongData = {
            title: req.body.title,
            duration: req.body.duration,
            file_url: req.body.file_url,
            genre: req.body.genre,
            release_date: req.body.release_date
        }
        console.log(updateSongData)
        song = await ArtistModel.findOneAndUpdate(
            {'albums._id': album_id, 'albums.songs._id': song_id},
            {
                $set: {
                    'albums.$[album].songs.$[song].title': updateSongData.title,
                    'albums.$[album].songs.$[song].duration': updateSongData.duration,
                    'albums.$[album].songs.$[song].file_url': updateSongData.file_url,
                    'albums.$[album].songs.$[song].genre': updateSongData.genre,
                    'albums.$[album].songs.$[song].release_date': updateSongData.release_date,
                }
            },
            {
                arrayFilters: [
                    { 'album._id': album_id },
                    { 'song._id': song_id }
                ],
                new: true,
            }
            );
        // the thing is that it returns all the artist data so use it only to update
        // maybe i should only respons success messages 
        res.status(200).json(song)
    
    } catch(error){
        console.log("[ERROR]: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

module.exports = {
    createSong: createSong,
    getSong: getSong,
    updateSong: updateSong,
    deleteSong: deleteSong
}