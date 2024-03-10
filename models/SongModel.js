const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SongSchema = new Schema({
    // _id: { type: Schema.Types.ObjectId},
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    file_url: { type: String, required: true },
    genre: { type: String, required: true},
    release_date: {type: Date, required: true},

}, {timestamps: true})

const AlbumSchema = new Schema({
    // _id: { type: Schema.Types.ObjectId},
    title: { type: String, required: true },
    cover_img_url: { type: String, required: true },
    release_date: {type: Date, required: true},
    songs: [SongSchema],
}, {timestamps: true})

const SingleSongSchema = new Schema({
    // _id: { type: Schema.Types.ObjectId},
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    file_url: { type: String, required: true },
    release_date: {type: Date, required: true},
    genre: { type: String, required: true},
}, {timestamps: true})

const ArtistSchema = new Schema({
    // _id: { type: Schema.Types.ObjectId},
    full_name: { type: String, required: true },
    bio: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    img_url: { type: String, required: true },
    albums: [AlbumSchema],
    single: [SingleSongSchema],
}, {timestamps: true})

module.exports = {
    ArtistModel: mongoose.model('Artist', ArtistSchema),
    AlbumModel: mongoose.model('Album', AlbumSchema),
    SongModel: mongoose.model('Song', SongSchema),
    SingleSongModel: mongoose.model('SingleSong', SingleSongSchema)
}
