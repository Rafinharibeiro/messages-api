export abstract class BaseApplicationError extends Error {
    constructor(
        message: string,
        public readonly code: string,
    ) {
        super(message);
        this.name = new.target.name;
    }
}