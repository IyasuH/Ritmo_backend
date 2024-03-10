const request = require('supertest');
const app = require('../index.js');

const mongoose = require('mongoose');

let server;

beforeAll(() => {
    // app.close();
    server = app.listen(3000, function(){
        console.log('[INFO] Test server running on port 3000.')
    });
    console.log("[INFO] before all")
});

afterAll(async () => {
    await server.close();
    mongoose.connection.close()
    console.log("[INFO] after all")
});

describe('Basic Stastics API test',() => {
    // test /api/totalNumberOfSongs endpont
    test('Should test total number of songs', async () => {
        const response = await request(app).get('/api/totalNumberOfSongs');
        // this API specific test
        expect(response.status).toBe(200);
    });

    // test /api/totalNumberOfArtists endpont
    test('Should test total number of artist', async () => {
        const response = await request(app).get('/api/totalNumberOfArtists');
        // this API specific test
        expect(response.status).toBe(200);
    });
    
    // test /api/totalNumberOfAlbums endpont
    test('Should test total number of albums', async () => {
        const response = await request(app).get('/api/totalNumberOfAlbums');
        // this API specific test
        expect(response.status).toBe(200);
    });

    // test /api/numberSongsGenres endpont
    test('Should test total number of songs with same genre', async () => {
        const response = await request(app).get('/api/numberSongsGenres');
        // this API specific test
        expect(response.status).toBe(200);
    });

    // test /api/NoSongAlubm/artist/:artist_id/album/:album_id endpont
    test('Should test total number of songs in album', async () => {
        // had to create fake artist and album
        // this API specific test
        // expect(response.status).toBe(200);
    });

    // test /api/NoSongArtist/:artist_id endpont
    test('Should test total number of songs artist has [test that the function returns both single and in album songs]', async () => {
        // had to create fake artist
        // this API specific test
        // expect(response.status).toBe(200);
    });

    // test /api/NoAlbumArtist/:artist_id endpont
    test('Should test total number of album artist has', async () => {
        // had to create fake artist
        // this API specific test
        // expect(response.status).toBe(200);
    });


});