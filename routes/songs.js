const express = require('express')

const {
    createArtist,
    listArtist,
    getArtist,
    deleteArtist,
    updateArtist,
} = require('../controllers/artistControllers.js');

const {
    createAlbum,
    getAlbum,
    deleteAlbum,
    updateAlbum,
}  = require('../controllers/albumControllers');

const {
    createSong,
    getSong,
    updateSong,
    deleteSong
} = require('../controllers/songControllers');

const  {
    createSingle, 
    getSingle,
    deleteSingle,
    updateSingle
} = require('../controllers/singleControllers');

const {
    numberSongsInAlbum,
    numberSongsArtist,
    numberAlbumArtist,
    totalNumberOfSongs,
    totalNumberOfArtists,
    totalNumberOfAlbums,
    numberSongsGenres
} = require('../controllers/basicStaticsControllers');

const {
    filterGenreYear
} = require('../controllers/filterControllers');

const router = express.Router()

// CRUD Artis endpoints
router.post('/newArtist', createArtist)
router.get('/listArtists', listArtist)
router.get('/getArtist/:id', getArtist)
router.delete('/deleteArtist/:id', deleteArtist)
router.put('/updateArtist/:id', updateArtist)

// CRUD Album endpoints
router.post('/newAlbum/:artist_id', createAlbum)
router.get('/getAlbum/:id', getAlbum)
router.delete('/deleteAlbum/:id', deleteAlbum)
router.put('/updateAlbum/:id', updateAlbum)

// CRUD Song endpoints
router.post('/newSong/artist/:artist_id/album/:album_id', createSong)
router.get('/getSong/artist/:artist_id/album/:album_id/songs/:song_id', getSong)
router.put('/updateSong/album/:album_id/songs/:song_id', updateSong)
router.delete('/deleteSong/album/:album_id/songs/:song_id', deleteSong)

// CRUD Single ENDPOINTS
router.post('/newSingle/:artist_id', createSingle)
router.get('/getSingle/:id', getSingle)
router.delete('/deleteSingle/:id', deleteSingle)
router.put('/updateSingle/:id', updateSingle)

// basic Statics
router.get('/NoSongAlubm/artist/:artist_id/album/:album_id', numberSongsInAlbum)
router.get('/NoSongArtist/:artist_id', numberSongsArtist)
router.get('/NoAlbumArtist/:artist_id', numberAlbumArtist)

router.get('/totalNumberOfSongs', totalNumberOfSongs)
router.get('/totalNumberOfArtists', totalNumberOfArtists)
router.get('/totalNumberOfAlbums', totalNumberOfAlbums)
router.get('/numberSongsGenres', numberSongsGenres)

// filtering
router.get('/songs/filter', filterGenreYear)

module.exports = router
