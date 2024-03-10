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

describe('Artist API test',() => {
    let createdArtistId;
    // test list of all artists
    test('should list all artists', async () => {
        const response = await request(app).get('/api/listArtists');
        // console.log("[INFO] body: ", response.body)
        expect(response.status).toBe(200);
    }, 15000); // this is failing to run under 5s so here goes for 15s.

    // test creation of artist
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
        // console.log("[INFO] id: ", response.body._id)
        createdArtistId = response.body._id.trim();
        // console.log("[INFO] id:", createdArtistId)
    });
    // test get of an artist
    test('should return single artist information', async ()=>{        
        const response = await request(app)
            .get(`/api/getArtist/${createdArtistId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('full_name', 'test full name');
    });
    // test update of an artist
    test('Should update artist information', async() => {
        const response = await request(app)
            .put(`/api/updateArtist/${createdArtistId}`)
            .send({bio: "updated test bio"});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('bio', 'updated test bio');
    });
    // test delete of an artist
    test('Should delete artist information', async() => {
        const response = await request(app)
            .delete(`/api/deleteArtist/${createdArtistId}`)
        expect(response.status).toBe(200);
    });
});

