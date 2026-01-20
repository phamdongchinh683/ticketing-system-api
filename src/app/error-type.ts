export class BadRequest extends Error {
    constructor(
        public message = 'Bad Request',
        public errorCode = 'BadRequest',
        public extra: object = {},
        public status = 400
    ) {
        super()
    }
}

export class Forbidden extends Error {
    constructor(
        public message = 'Forbidden',
        public extra: object = {},
        public errorCode = 'Forbidden',
        public status = 403
    ) {
        super()
    }
}

export class NotFound extends Error {
    constructor(
        public message = 'Not Found',
        public extra: object = {},
        public errorCode = 'NotFound',
        public status = 404
    ) {
        super()
    }
}

export class Unauthorized extends Error {
    constructor(
        public message = 'Unauthorized',
        public extra: object = {},
        public errorCode = 'Unauthorized',
        public status = 401
    ) {
        super()
    }
}

export class UnprocessableEntity extends Error {
    constructor(
        public message = 'UnprocessableEntity',
        public errorCode = 'UnprocessableEntity',
        public extra: object = {},
        public status = 422
    ) {
        super()
    }
}

export class TooManyRequests extends Error {
    constructor(
        public message = 'TooManyRequests',
        public errorCode = 'TooManyRequests',
        public extra: object = {},
        public status = 429
    ) {
        super()
    }
}
