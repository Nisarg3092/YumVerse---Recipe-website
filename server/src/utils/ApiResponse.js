class ApiResponse {
    constructor(statusCode, data, message = "Success") {

        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;

    }
    
    // 200 - OK
    static okResponse(data, message = "Success") {
        return new ApiResponse(200, data, message);
    }

    // 201 - Created
    static created(data, message = "Resource created successfully") {
        return new ApiResponse(201, data, message);
    }
}

module.exports = ApiResponse;