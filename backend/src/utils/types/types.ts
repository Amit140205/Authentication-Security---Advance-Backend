export type ApiResponse<T> = {
    success: boolean;
    message: string,
    data?: T;
};

export type JWTPayload = {
    userId: string;
    sessionId: string;
};

export type ValidateTarget = "body" | "params" | "query"; 