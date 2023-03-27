const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("200 GET /api/categories should return all categories with the following properties: slug, description", () => {
	test("should return all categories", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then(({ body }) => {
				expect(body.rows).toHaveLength(4);
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
