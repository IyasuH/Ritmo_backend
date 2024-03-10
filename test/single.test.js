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

// here goes the test for single songs

describe('Album API',() => {
    let createdArtistId;
    let createdSingleId;
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

    // test creation of new single
    test('should create new single', async ()=>{
        const response = await request(app)
            .post(`/api/newSingle/${createdArtistId}`)
            .send({
                title: "test_single",
                duration: 60,
                file_url: "/test_single/url",
                release_date: "2000-03-14",
                genre: "test"
            });
        expect(response.status).toBe(201);
        createdSingleId = response.body.single[0]._id.trim();
    });

    // test get of an single
    test('should return single song information', async ()=>{        
        const response = await request(app)
            .get(`/api/getSingle/${createdSingleId}`);
        expect(response.status).toBe(200);
        expect(response.body.single[0]).toHaveProperty('title', 'test_single');
    });

    // test update of an single
    test('Should update single song information', async() => {
        const response = await request(app)
            .put(`/api/updateSingle/${createdSingleId}`)
            .send({file_url: "/updated_test_single/url"});
        expect(response.status).toBe(200);
        expect(response.body.single[0]).toHaveProperty('file_url', '/updated_test_single/url');
    });

    // test deletetion of single
    test('Should delete album information', async() => {
        const response = await request(app)
            .delete(`/api/deleteSingle/${createdSingleId}`)
        expect(response.status).toBe(200);
    });

    // test deletetion of artist
    test('Should delete artist information', async() => {
        const response = await request(app)
            .delete(`/api/deleteArtist/${createdArtistId}`)
        expect(response.status).toBe(200);
    });
})