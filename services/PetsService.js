import api from "./api";

export class PetsService {

    async getById(id, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/pets/' + id)
            .get()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }

    async getAll(success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/pets')
            .get()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }

    async delete(petId, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/pets/' + petId)
            .delete()
            .res((data) => {
                success(data);
            })
            .catch(error);
    }

    async post(data, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/pets')
            .json(data)
            .post()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }

    async put(petId, data, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/pets/' + petId)
            .json(data)
            .put()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }
}
