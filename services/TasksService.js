import api from "./api";

export class TasksService {

    async getById(id, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/tasks/' + id)
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
            .url('/api/tasks')
            .get()
            .json((data) => {
                let tasks = {};

                data.forEach(function (task, idx) {
                    if (typeof tasks[task.pet.id] === 'undefined') {
                        tasks[task.pet.id] = [];
                    }

                    tasks[task.pet.id].push(task);
                });

                success(tasks);
            })
            .catch(error);
    }

    async put(id, data, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/tasks/' + id)
            .json(data)
            .put()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }

    async post(data, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/tasks')
            .json(data)
            .post()
            .json((data) => {
                success(data);
            })
            .catch(error);
    }
}