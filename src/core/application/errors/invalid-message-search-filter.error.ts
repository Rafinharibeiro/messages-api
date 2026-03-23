import { BaseApplicationError } from "./base-application.error";


export class InvalidMessageSearchFilterError extends BaseApplicationError {
    constructor() {
        super(
            'You must provide sender or startDate and endDate for search',
            'INVALID_MESSAGE_SEARCH_FILTER',
        );
    }
}