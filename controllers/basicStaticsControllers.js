const mongoose = require('mongoose')
const {ArtistModel} = require('../models/SongModel');

const totalNumberOfSongs = async (req, res) => {
    // total number of Songs[for every artist in albums and as a single]
    try{
        // here what if i can calculate the number single songs and number album songs individaully then i can add them up to get totalSongs
        const single_songs = await ArtistModel.aggregate([
            {$project: {
                singleSongs: { $size: '$single' }
            }
        },
        {
            $group: {
                _id: null,
                singleSongs: {$sum: "$singleSongs"}
            }
        }
        ]).exec();

        const album_songs = await ArtistModel.aggregate([
        {
            // here i updated the albumSongs because it was not returning correct value
            // so in updated code i am using $map to iterate over each albums array, then for each albums calculating the songs number
            // then sum that up
            $project: {
                albumSongs: {
                    $sum: {
                        $map: {
                            input: "$albums",
                            as: "album",
                            in: { $size: "$$album.songs"}
                        }
                    }
                }
            }
        },
        //     {$project: {
        //         albumSongs: { $size: '$albums.songs' }
        //     }
        // }, 
        {
            $group: {
                _id: null,
                albumSongs: {$sum: "$albumSongs"}
            }
        }
        ]).exec();
        totalSongs = single_songs[0].singleSongs + album_songs[0].albumSongs;
        // I can use the following code to get total songs on the platform[the default is now you can get total album songs and total single songs separately]
        // but this does not give correct songs number inside album
        // const number_of_songs = await ArtistModel.aggregate([
        //     {$project: {
        //         totalSongs: {
        //             $add: [
        //                 { $size: '$albums.songs' },
        //                 { $size: '$single' }
        //             ]
        //         }
        //     }
        // }, 
        // {
        //     $group: {
        //         _id: null,
        //         totalSongs: {$sum: "$totalSongs"}
        //     }
        // }
        // ]).exec();
        console.log("[INFO]: type of number of songs, ", (typeof totalSongs))

        res.status(200).json({"single_songs": single_songs[0].singleSongs, "albums_songs": album_songs[0].albumSongs, "total": totalSongs})
        
    } catch (err) {
        console.log(err)
        res.status(404).json({"Error": err});
    }
};

const totalNumberOfArtists = async (req, res) => {
    // total number of Artists
    // this could be done using .length() method
    try{
        const artists = await ArtistModel.find({});
        const number_of_artists = artists.length;
        console.log("[INFO]: number of artists, ", number_of_artists)
        res.status(200).json({"artists_number": number_of_artists})
    } catch (err) {
        console.log(err)
        res.status(404).json({"Error": err});
    }
};

const totalNumberOfAlbums = async (req, res) => {
    // total number of Albums
    try{
        const number_of_albums = await ArtistModel.aggregate([
            {$project: {
                albums: { $size: '$albums' }
            }
        }, 
        {
            $group: {
                _id: null,
                albums: {$sum: "$albums"}
            }
        }
        ]).exec();
        console.log("[INFO]: number_of_albums ", number_of_albums)

        res.status(200).json({"album_number": number_of_albums[0].albums})
    } catch (err) {
        console.log(err)
        res.status(404).json({"Error": err});
    }
};

const numberSongsGenres = async (req, res) => {
    // number of songs for each genre and total number of genres
    try{
        const number_of_geners = await ArtistModel.aggregate([
            {
                // concatenate single and in album songs
                $project: {
                  allSongs: {
                    $concatArrays: [
                      "$single",
                    //   "$albums.songs" -- when using this it will not add same generes as one it just concatArray them
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
              // remove the empty arrays
              {
                $match: {
                    allSongs: { $ne: [] }
                }
              },
              
              {
                $unwind: "$allSongs"
              },
            // then group them by genere and append one per similar genre[by if i used $albums.songs only it just didn't increase the 1 per similar genre]
            {
              $group: {
                _id: "$allSongs.genre",
                count: { $sum: 1 }
              }
            },
            //  rearragne the result
            { 
              $group: {
                _id: null,
                genreCounts: { $push: { genre: "$_id", count: "$count" } }
              }
            },
            // avoid _id
            {
              $project: {
                _id: 0,
                genreCounts: 1
              }
            }
        ]).exec();
        const genreCountsClean = {};
        number_of_geners[0].genreCounts.forEach((item) => {
          genreCountsClean[item.genre] = item.count;
        });
        const number_of_genres = Object.keys(genreCountsClean).length  // this is to get totalNumber of genre
        console.log("[INFO]: ", number_of_genres);
        res.status(200).json(genreCountsClean);
    } catch (err) {
        console.log(err)
        res.status(404).json({"Error": err});
    }

}

const numberAlbumArtist = async (req, res) => {
    // number of songs in an album
    // This function could jsut be .length() method [Rethink & Review]
    const artist_id = req.params.artist_id;
    try {
        const result = await ArtistModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(artist_id)}},
            {$project: {totalAlbums: { $size: '$albums' }}}
        ]).exec();
        console.log("[INFO]: result", result)
        if (result && result.length > 0 &&result[0].totalAlbums !== undefined){
            const totalAlbums  = result[0].totalAlbums;
            console.log(totalAlbums);
            console.log("[INFO] totalAlbums", totalAlbums);
            res.status(200).json({totalAlbums});
        } else {
            console.log("[INFO] result ",result);
            console.log('unable to retrive song count.');
            res.status(404).json({"Error": "error"});    
        }
    } catch (err) {
        console.log(err)
        res.status(404).json({"Error": err});
    }
};

const numberSongsArtist = async (req, res) => {
    // number of songs for an artist
    const artist_id = req.params.artist_id;
    try{
        const single_songs = await ArtistModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(artist_id)}},
            {$project: {
                singleSongs: { $size: '$single' }
            }},
            {$group: {
                _id: null,
                singleSongs: {$sum: "$singleSongs"}
                }}
        ]).exec();
        const album_songs = await ArtistModel.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(artist_id)}},
            {$project: {
                albumSongs: {
                    $sum: {
                        $map: {
                            input: "$albums",
                            as: "album",
                            in: { $size: "$$album.songs"}
                        }
                    }
                }
            }
        },
        {$group: {
            _id: null,
            albumSongs: {$sum: "$albumSongs"}
            }
        }]).exec();
        totalSongs = single_songs[0].singleSongs + album_songs[0].albumSongs
        // this does not give correct songs number inside album
        // const result = await ArtistModel.aggregate([
        //     {$match: {_id: new mongoose.Types.ObjectId(artist_id)}},
        //     {$project: {
        //         totalSongs: {
        //             $add: [
        //                 { $size: '$albums.songs' },
        //                 { $size: '$single'}
        //             ]
        //         }
        //     }}
        // ]).exec();
        res.status(200).json({"single_songs": single_songs[0].singleSongs, "albums_songs": album_songs[0].albumSongs, "total": totalSongs})
    } catch (err) {
        console.log(err)
        res.status(404).json({"Error": err});
    }
}

const numberSongsInAlbum = async (req, res) =>{
    // number of songs in album
    // This function could be jsut run using .length() method [Rethink & Review]
    const artist_id = req.params.artist_id;
    const album_id = req.params.album_id;
    try{
        const result = await ArtistModel.aggregate([
            { $match: {_id: new mongoose.Types.ObjectId(artist_id)}},
            { $unwind: '$albums' },
            { $match: {'albums._id': new mongoose.Types.ObjectId(album_id)}},
            { $project: {songCount: {$size: '$albums.songs'}}}
        ]).exec();
        
        if (result && result.length > 0 &&result[0].songCount !== undefined){
            const songCount  = result[0].songCount;
            console.log(songCount);
            console.log("[INFO] songCount", songCount);
            res.status(200).json({songCount});    
        } else {
            console.log("[INFO] result ",result);
            console.log('unable to retrive song count.');
            res.status(404).json({"Error": "error"});    
        }
    } catch (err){
        console.log(err)
        res.status(404).json({"Error": err});
    }
}

// const numberSong

module.exports = {
    numberSongsInAlbum: numberSongsInAlbum,
    numberSongsArtist: numberSongsArtist,
    numberAlbumArtist: numberAlbumArtist,
    totalNumberOfSongs: totalNumberOfSongs,
    totalNumberOfArtists: totalNumberOfArtists,
    totalNumberOfAlbums: totalNumberOfAlbums,
    numberSongsGenres: numberSongsGenres
}