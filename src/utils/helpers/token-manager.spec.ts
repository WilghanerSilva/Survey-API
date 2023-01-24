import MissingParamError from "../errors/MissingParam";
import jwt from "jsonwebtoken";
import TokenManager from "./token-manager";

jest.mock("jsonwebtoken");

describe("Token Manager", () => {
	const mockedJwt = jwt as jest.Mocked<typeof jwt>;

	test("shold throw error if empty userId is send to generate method", () => {
		const sut = new TokenManager();
		expect(()=>{sut.generate("");}).toThrow(new MissingParamError("userId"));
	});

	test("should call JWT with correct params", () => {
		const sut = new TokenManager();
		const id = "any_userid";
		let calledUserid;
		mockedJwt.sign.mockImplementation((userId)=>{
			calledUserid = userId;
			return "any_token";
		});

		sut.generate(id);

		expect(calledUserid).toBe(id);
	});

	test("should return null if JWT returns null", () => {
		const sut = new TokenManager();
		mockedJwt.sign.mockImplementation(()=>{return null;});
		const token = sut.generate("any_id");

		expect(token).toBeNull();
	});

	test("should return token if JWT returs token", () => {
		const sut = new TokenManager();
		mockedJwt.sign.mockImplementation(()=>{return "any_token";});
		const token = sut.generate("any_id");

		expect(token).toEqual("any_token");
	});
});