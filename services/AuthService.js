import api from "./api";

export class AuthService {

    async validateToken(token, success, error) {
        api
            .call()
            .url('/api/auth/validateToken')
            .auth(`Bearer ${ token }`)
            .get()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }

    async login(username, password, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/auth/login')
            .json({
                username: username,
                password: password
            })
            .post()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }

    async register(data, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/persons')
            .json(data)
            .post()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }
}
