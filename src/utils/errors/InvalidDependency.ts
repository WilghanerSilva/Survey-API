export default class InvalidDependencyError extends Error {
	constructor(paramName: string) {
		super(`InvalidDependency: ${paramName}`);
		this.name = "InvalidDependency";
	}
}