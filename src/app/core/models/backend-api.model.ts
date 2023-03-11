export interface LoginRequestModel {
  login: string;
  password: string;
}

export interface LoginResponseModel {
  token: string;
}

export interface SignUpRequestModel extends LoginRequestModel {
  name: string;
}

export interface SignUpResponseModel {
  _id: string;
  name: string;
  login: string;
}

export interface UpdateUserRequestModel extends SignUpRequestModel {}

export interface UpdateUserResponseModel extends SignUpResponseModel {}

export interface DeleteUserResponseModel extends SignUpResponseModel {}

export interface ErrorResponseModel {
  statusCode: string;
  message: string;
}

export interface TokenModel {
  exp: number;
  iat: number;
  id: string;
  login: string;
}
