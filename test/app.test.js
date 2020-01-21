const expect = require("chai").expect;
const supertest = require("supertest");
const app = require("../app")


const auth = { 'Authorization': `Bearer ${process.env.API_KEY}`}

describe("moviedex app", () => {
  it("Returns a list of movie objects on /movies", () => {
    return supertest(app)
      .get("/movie")
      .set(auth)    
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an("array");
      })
  });
  it("Returns a 400 error if no results", () => {
    return supertest(app)
      .get("/movie")
      .query({ genre: "ERROR" })
      .set(auth)
      .expect(400, { error: { message: "query peramiter didn't didnt match any movies"}});
  });
  it("Returns a list of Dramas", () => {
    return supertest(app)
      .get("/movie")
      .query({ genre: "Drama"})
      .set(auth)    
      .expect(200)
      .then(res => {
          expect(res.body[0].genre).to.include("Drama")
      })
  });
  it("Returns a list movies from Italy", () => {
    return supertest(app)
      .get("/movie")
      .query({ country: "Italy"})
      .set(auth)    
      .expect(200)
      .then(res => {
        expect(res.body[0].country).to.include("Italy");
      });
  });
  it("Returns 400 if avg_vote is NaN", () => {
    return supertest(app)
      .get("/movie")
      .query({ avg_vote: "Italy"})
      .set(auth)    
      .expect(400)
  });
  it("Returns a list filtered by average vote", () => {
    return supertest(app)
      .get("/movie")
      .query({ avg_vote: 9})
      .set(auth)
      .expect(200)
      .then(res => {
        let filtered = true;
  
        let i = 0;
    
        while (i < res.body.length) {
          const voteAtI = res.body[i].avg_vote;
          if (voteAtI < 9) {
            filtered = false;
            break;
          }
          i++;
        }
        expect(filtered).to.be.true;    
      });
  });
});

