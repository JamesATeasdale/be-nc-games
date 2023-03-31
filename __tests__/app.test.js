const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
require("jest-sorted");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("GET /api/categories should return all categories with the following properties: slug, description", () => {
	test("200 return all categories", () => {
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
	test("404 should return an error", () => {
		return request(app)
			.get("/api/categores") // typo
			.expect(404)
			.then(({ body }) => expect(body).toEqual({ msg: "Not found" }));
	});
});

describe("GET /api/reviews/:review_id should return the information bound to that review in te database", () => {
	test("200 should get information from the request review id", () => {
		return request(app)
			.get("/api/reviews/3")
			.expect(200)
			.then(({ body }) => {
				const review = [
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
				expect(body.review).toEqual(review);
			});
	});
	test("404 error with a corresponding message when no review is found", () => {
		return request(app)
			.get("/api/reviews/908")
			.expect(404)
			.then(({ body }) => expect(body).toEqual({ msg: "Not found" }));
	});
	test("400 Bad request if the data type of the review id is string ", () => {
		return request(app)
			.get("/api/reviews/myreview")
			.expect(400)
			.then(({ body }) => expect(body).toEqual({ msg: "Bad request" }));
	});
	test("400 Bad request if the data type of the review id is decimal ", () => {
		return request(app)
			.get("/api/reviews/3.2")
			.expect(400)
			.then(({ body }) => expect(body).toEqual({ msg: "Bad request" }));
	});
});

describe("GET /api/reviews", () => {
	test("200 should return all of the reviews with their corresponding comment count imported from the comment database ascending by date", () => {
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
	test("200 should return the comments of the review using the review_id", () => {
		return request(app)
			.get("/api/reviews/2/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments).toBeSortedBy("created_at", { descending: true });
				expect(body.comments).toHaveLength(3);
				body.comments.forEach((comment) => {
					expect(comment).toHaveProperty("comment_id");
					expect(comment).toHaveProperty("votes");
					expect(comment).toHaveProperty("created_at");
					expect(comment).toHaveProperty("author");
					expect(comment).toHaveProperty("body");
					expect(comment).toHaveProperty("review_id");
				});
			});
	});
	test("200 should return an empty array if the ID is valid, but there are no comments", () => {
		return request(app)
			.get("/api/reviews/4/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments).toHaveLength(0);
				expect(body.comments).toEqual([]);
			});
	});

	test("404 Not found if review_id isn't in the database", () => {
		return request(app)
			.get("/api/reviews/78/comments")
			.expect(404)
			.then(({ body }) => expect(body).toEqual({ msg: "Not found" }));
	});
	test("400 If key is not the correct data type", () => {
		return request(app)
			.get("/api/reviews/hello/comments")
			.expect(400)
			.then(({ body }) => expect(body).toEqual({ msg: "Bad request" }));
	});
});

describe("POST /api/reviews/:review_id/comments should post a new comment when given a body", () => {
	test("201 should add a new comment to the comments database", () => {
		return request(app)
			.post("/api/reviews/2/comments")
			.send({ author: "mallionaire", body: "Great for beginners" })
			.expect(201)
			.then(({ body }) => {
				expect(body.comment[0]).toHaveProperty("comment_id");
				expect(body.comment[0]).toHaveProperty("created_at");
				expect(body.comment[0].review_id).toBe(2);
				expect(body.comment[0].author).toBe("mallionaire");
				expect(body.comment[0].body).toBe("Great for beginners");
			});
	});
	test("404 should return an error if given review_id isn't found", () => {
		return request(app)
			.post("/api/reviews/9001/comments")
			.send({ author: "mallionaire", body: "Best wardrobe I've ever used" })
			.expect(404)
			.then(({ body }) => expect(body).toEqual({ msg: "Not found" }));
	});
	test("400 if datatype of the reviewId is wrong", () => {
		return request(app)
			.post("/api/reviews/hello/comments")
			.send({ author: "mallionaire", body: "Hello Granddad!" })
			.expect(400)
			.then(({ body }) => expect(body).toEqual({ msg: "Bad request" }));
	});
	test("400 If the object is in an unacceptable format", () => {
		return request(app)
			.post("/api/reviews/3/comments")
			.send({
				person: "Haz",
				msg: "Hello, I am still waiting for my delivery of oranges",
			})
			.expect(400)
			.then(({ body }) => expect(body).toEqual({ msg: "Bad request" }));
	});
	test("400 If the body is fine, but the author key isn't", () => {
		return request(app)
			.post("/api/reviews/3/comments")
			.send({
				person: "Dave",
				body: "I really love this breed of dog, thanks for sharing",
			})
			.expect(400)
			.then(({ body }) => expect(body).toEqual({ msg: "Bad request" }));
	});
});

describe("PATCH /api/reviews/:review_id should change vote value", () => {
	test("200 if the request was accepted and the vote of the review was incremented", () => {
		return request(app)
			.patch("/api/reviews/3")
			.send({ votes: 2 })
			.expect(200)
			.then(({ body }) => {
				const expectedBody = {
					review_id: 3,
					title: "Ultimate Werewolf",
					category: "social deduction",
					designer: "Akihisa Okui",
					owner: "bainesface",
					review_body: "We couldn't find the werewolf!",
					review_img_url:
						"https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
					created_at: "2021-01-18T10:01:41.251Z",
					votes: 7,
				};
				expect(body.review.votes).toEqual(7);
				expect(body.review.votes > data.reviewData[2].votes).toBe(true);
				expect(body.review).toEqual(expectedBody);
			});
	});
	test("200 if the request was accepted and the vote of the review was decremented", () => {
		return request(app)
			.patch("/api/reviews/2")
			.send({ votes: -2 })
			.expect(200)
			.then(({ body }) => {
				const expectedBody = {
					review_id: 2,
					title: "Jenga",
					category: "dexterity",
					designer: "Leslie Scott",
					owner: "philippaclaire9",
					review_body: "Fiddly fun for all the family",
					review_img_url:
						"https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
					created_at: "2021-01-18T10:01:41.251Z",
					votes: 3,
				};
				expect(body.review.votes).toEqual(3);
				expect(body.review.votes < data.reviewData[1].votes).toBe(true);
				expect(body.review).toEqual(expectedBody);
			});
	});
	test("404 if reviewId not found", () => {
		return request(app)
			.patch("/api/reviews/79")
			.send({ votes: 55 })
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Not found" });
			});
	});
	test("400 if the body is in an incorrect format", () => {
		return request(app)
			.patch("/api/reviews/4")
			.send({
				person: "Mitch",
				msg: "Hello! just letting you know that we did find your cat, he is doing well and is eating us out of pocket. Please pick him up ASAP!",
			})
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Bad request" });
			});
	});
	test("400 if the body is in an incorrect format", () => {
		return request(app)
			.patch("/api/reviews/1")
			.send({
				votes: "Bela likes this",
			})
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Bad request" });
			});
	});
	test("400 if reviewId is the wrong data type", () => {
		return request(app)
			.patch("/api/reviews/heather")
			.send({ votes: 89 })
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: "Bad request" });
			});
	});
});

describe("DELETE /api/comments/:comment_id", () => {
	test("204 if deleting was a success ", () => {
		return request(app)
			.delete("/api/comments/6")
			.expect(204)
			.then(() => db.query("SELECT * FROM comments"))
			.then((body) => expect(body.rows).toHaveLength(5));
	});
	test("404 if no comment found", () => {
		return request(app)
			.delete("/api/comments/70")
			.expect(404)
			.then(({ body }) => expect(body).toEqual({ msg: "Not found" }));
	});
	test("400 if wrong data type", () => {
		return request(app)
			.delete("/api/comments/hello")
			.expect(400)
			.then(({ body }) => expect(body).toEqual({ msg: "Bad request" }));
	});
});

describe("GET /api/users should return a list of all users", () => {
	test("200 should return a body containing all users", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body }) => expect(body.users).toHaveLength(4));
	});
});

describe("GET /api/reviews (queries) should get reviews and sort them by the given value", () => {
	test("200 should return the reviews in the correct order", () => {
		return Promise.all([
			request(app)
				.get("/api/reviews?sortBy=votes")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("votes", { descending: true });
				}),
			request(app)
				.get("/api/reviews?sortBy=review_id")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("review_id", { descending: true });
				}),
			request(app)
				.get("/api/reviews?sortBy=category")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("category", { descending: true });
				}),
		]);
	});
	test("200 if given the correct orderBy values", () => {
		return Promise.all([
			request(app)
				.get("/api/reviews?sortBy=votes&orderBy=ASC")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("votes", { descending: false });
				}),
			request(app)
				.get("/api/reviews?sortBy=review_id&orderBy=DESC")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("review_id", { descending: true });
				}),
			request(app)
				.get("/api/reviews?sortBy=category&orderBy=ASC")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("category", { descending: false });
				}),
		]);
	});
	test("200 if given the correct category values", () => {
		return Promise.all([
			request(app)
				.get("/api/reviews?sortBy=votes&category=social deduction")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("votes", { descending: true });
					body.reviews.forEach((game) => {
						expect(game.category).toEqual("social deduction");
					});
				}),
			request(app)
				.get("/api/reviews?sortBy=votes&orderBy=ASC&category=dexterity")

				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("votes");
					body.reviews.forEach((game) => {
						expect(game.category).toEqual("dexterity");
					});
				}),
			request(app)
				.get("/api/reviews?sortBy=category&orderBy=ASC")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toBeSortedBy("category", { descending: false });
				}),
		]);
	});
	test("400 if sortBy, orderBy or category is invalid", () => {
		return Promise.all([
			request(app)
				.get("/api/reviews?sortBy=bestdog")
				.expect(400)
				.then(({ body }) => {
					expect(body).toEqual({ msg: "Bad request" });
				}),
			request(app)
				.get("/api/reviews?orderBy=birthday")
				.expect(400)
				.then(({ body }) => {
					expect(body).toEqual({ msg: "Bad request" });
				}),
			request(app)
				.get("/api/reviews?sortBy=vote&orderBy=ASC&?category=dexterity")
				.expect(400)
				.then(({ body }) => {
					expect(body).toEqual({ msg: "Bad request" });
				}),
		]);
	});
	test("200 with empty array if categories don't exist", () => {
		return Promise.all([
			request(app)
				.get("/api/reviews?category=birthday")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toEqual([]);
				}),
			request(app)
				.get("/api/reviews?category=7")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toEqual([]);
				}),
		]);
	});
});

describe("returns the endpoint json contents", () => {
	test("200 should return the endpoints.json as a body", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body.endpoints).toEqual(endpoints);
			});
	});
});

describe.only("Returns a user that matches the specified username", () => {
	test("200 Should return the correct user", () => {
		const philippa = [
			{
				username: "philippaclaire9",
				name: "philippa",
				avatar_url:
					"https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
			},
		];
		return request(app)
			.get("/api/users/philippaclaire9")
			.expect(200)
			.then(({ body }) => {
				expect(body.user).toEqual(philippa);
			});
	});
	test("200 Should return an empty array if no user was found", () => {
		return request(app)
			.get("/api/users/bela")
			.expect(200)
			.then(({ body }) => {
				expect(body.user).toEqual([]);
			});
	});
});
