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
        // expect(response.body).toHaveProperty('_id');
        // console.log("[INFO] id: ", response.body)
        createdAlbumId = response.body.albums[0]._id.trim();
        // console.log("[INFO] id:", createdAlbumId)
    });

    // test get of an album
    test('should return single album information', async ()=>{        
        const response = await request(app)
            .get(`/api/getAlbum/${createdAlbumId}`);
        expect(response.status).toBe(200);
        expect(response.body.albums[0]).toHaveProperty('title', 'test_album');
    });

    // test update of an album
    test('Should update album information', async() => {
        const response = await request(app)
            .put(`/api/updateAlbum/${createdAlbumId}`)
            .send({cover_img_url: "/updated_test_cover/url"});
        expect(response.status).toBe(200);
        expect(response.body.albums[0]).toHaveProperty('cover_img_url', '/updated_test_cover/url');
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

})