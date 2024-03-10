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


describe('Album API',() => {
    let createdArtistId;
    let createdAlbumId;
    let createdSongId;

    // to create new artist
    test('should create new artist', async ()=>{
        const response = await request(app)
            .post('/api/newArtist')
            .send({
                full_name: "test full name",
                bio: "test bio",
                dob: "2000-03-14",
                gender: "F",
                img_url: "/test/url",
                albums: [],
                single: []
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        createdArtistId = response.body._id.trim();
    });

    // test creation of new album
    test('should create new album', async ()=>{
        const response = await request(app)
            .post(`/api/newAlbum/${createdArtistId}`)
            .send({
                title: "test_album",
                cover_img_url: "/test_cover/url",
                release_date: "2000-03-14",
                single: []
            });
        expect(response.status).toBe(201);
        createdAlbumId = response.body.albums[0]._id.trim();
    });

    // test creation of new song
    test('should create new song', async ()=>{
        const response = await request(app)
            .post(`/api/newSong/artist/${createdArtistId}/album/${createdAlbumId}`)
            .send({
                title: "test_song",
                duration: 60,
                file_url: "/test_song/url",
                release_date: "2000-03-14",
                genre: "test_genere"
            });
        expect(response.status).toBe(201);
        createdSongId = response.body.albums[0].songs[0]._id.trim();
    });

    // test get of an song
    test('should return single artist information', async ()=>{        
        const response = await request(app)
            .get(`/api/getSong/artist/${createdArtistId}/album/${createdAlbumId}/songs/${createdSongId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('title', 'test_song');
    });

    // test update of an song
    test('Should update song information', async() => {
        const response = await request(app)
            .put(`/api/updateSong/album/${createdAlbumId}/songs/${createdSongId}`)
            .send({file_url: "/updated/test/song/url"});
        expect(response.status).toBe(200);
        console.log("[INFO][BODY]: ", response.body.albums[0].songs[0]);
        expect(response.body.albums[0].songs[0]).toHaveProperty("file_url", "/updated/test/song/url");
    });

    // test deletetion of song
    test('Should delete song', async() => {
        const response = await request(app)
            .delete(`/api/deleteSong/album/${createdAlbumId}/songs/${createdSongId}`)
        expect(response.status).toBe(200);
    });

    // test deletetion of album
    test('Should delete album information', async() => {
        const response = await request(app)
            .delete(`/api/deleteAlbum/${createdAlbumId}`)
        expect(response.status).toBe(200);
    });

    // test deletetion of artist
    test('Should delete artist information', async() => {
        const response = await request(app)
            .delete(`/api/deleteArtist/${createdArtistId}`)
        expect(response.status).toBe(200);
    });

});