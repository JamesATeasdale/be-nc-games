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
				expect(body.reviews).toHaveLength(13);
				for (review of body.reviews) {
					expect(review).toHaveProperty("title");
					expect(review).toHaveProperty("designer");
					expect(review).toHaveProperty("owner");
					expect(review).toHaveProperty("review_img_url");
					expect(review).toHaveProperty("category");
					expect(review).toHaveProperty("created_at");
					expect(review).toHaveProperty("review_id");
					expect(review).toHaveProperty("votes");
				}
			});
	});
});

describe("GET /api/reviews/:review_id/comments", () => {
	test("should return the comments of the review using the review_id", () => {
		return request(app)
			.get("/api/reviews/2/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments).toBeSortedBy("created_at", { descending: true });
				expect(body.comments).toHaveLength(3);
				for (comment of body.comments) {
					expect(comment).toHaveProperty("comment_id");
					expect(comment).toHaveProperty("votes");
					expect(comment).toHaveProperty("created_at");
					expect(comment).toHaveProperty("author");
					expect(comment).toHaveProperty("body");
					expect(comment).toHaveProperty("review_id");
				}
			});
	});
	test("404 Not found if review_id isn't in the database", () => {
		return request(app)
			.get("/api/reviews/78/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Not found" });
			});
	});
	test("400 If key is not the correct data type", () => {
		return request(app)
			.get("/api/reviews/hello/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Bad Request" });
			});
	});
});

