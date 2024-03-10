const mongoose = require('mongoose')
const {ArtistModel} = require('../models/SongModel');

const filterGenreYear = async (req, res) => {
    // to filter for genre and year
    try{
        // the inital aggregate
        const aggregatePipe =[
            {
                $project: {
                    allSongs: {
                        $concatArrays: [
                            "$single",
                            { $reduce: {
                                input: "$albums.songs", // - this value is the value where operation performed
                                initialValue: [], // - this is just the inital value of reduce return
                                in: { $concatArrays: ["$$value", "$$this"] } // - this the operation and here it concatArrays $$this values[each albums.songs] to the value(where initally it was empty array)
                            }
                        }
                    ]
                }
            }
        },
        {
            $match: {
                allSongs: { $ne: [] }
            }
        },
        {
            $unwind: "$allSongs"
        },];
        const query_year=Number(req.query.year);
        const query_genre=req.query.genre;
        if (query_year){
            // query_year is given
            aggregatePipe.push({$addFields: {"allSongs.release_year": { $year: "$allSongs.release_date"}}},{$match: {"allSongs.release_year": query_year}});
        }
        if (query_genre){
            // query_genre is givern
            aggregatePipe.push({$match: {"allSongs.genre": query_genre}});
        }
        const filter_songs = await ArtistModel.aggregate(aggregatePipe).exec();
        // console.log("[INFO] genre: ", genre)
        res.status(200).json(filter_songs)
        console.log(filter_songs)
    } catch (err) {
        console.log(err)
        res.status(404).json({"Error": err});
    }
};

module.exports = {
    filterGenreYear: filterGenreYear
}