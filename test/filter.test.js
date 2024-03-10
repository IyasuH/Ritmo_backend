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


describe('filters API test',() => {
    // test /api/songs/filter?genre=genre_value&year=year_value
    // should test for each query parameter
    // test with both query parameter
    // test with no parameter
})