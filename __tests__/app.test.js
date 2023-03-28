const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
require("jest-sorted");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("200 GET /api/categories should return all categories with the following properties: slug, description", () => {
	test("should return all categories", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then(({ body }) => {
				expect(body.categories).toHaveLength(4);
				expect(body.categories).toBeInstanceOf(Array);
				expect(body.categories).toMatchObject(data.categoryData);
				expect(body.categories[2]).toHaveProperty(
					"description",
					"Games involving physical skill"
				);
			});
	});
	test("404 GET should return an error", () => {
		return request(app)
			.get("/api/categores") // typo
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Not found" });
			});
	});
});

describe("200 GET /api/reviews/:review_id should return the information bound to that review in te database", () => {
	test("should get information from the request review id", () => {
		return request(app)
			.get("/api/reviews/3")
			.expect(200)
			.then(({ body }) => {
				const review3 = [
					{
						category: "social deduction",
						created_at: "2021-01-18T10:01:41.251Z",
						designer: "Akihisa Okui",
						owner: "bainesface",
						review_body: "We couldn't find the werewolf!",
						review_id: 3,
						review_img_url:
							"https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
						title: "Ultimate Werewolf",
						votes: 5,
					},
				];
				expect(body.review).toEqual(review3);
			});
	});
	test("404 error with a corresponding message when no review is found", () => {
		return request(app)
			.get("/api/reviews/908")
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Not found" });
			});
	});
	test("400 Bad request if the data type of the review id is string ", () => {
		return request(app)
			.get("/api/reviews/myreview")
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Bad Request" });
			});
	});
	test("400 Bad request if the data type of the review id is decimal ", () => {
		return request(app)
			.get("/api/reviews/3.2")
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Bad Request" });
			});
	});
});

describe("GET /api/reviews", () => {
	test("should return all of the reviews with their corresponding comment count imported from the comment database ascending by date", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then(({ body }) => {
				expect(body.reviews).toBeSortedBy("created_at", { descending: true });
			});
	});
});


