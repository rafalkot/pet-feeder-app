import api from "./api";

export class ScheduledTasksService {

    async getAll(success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/scheduledtasks')
            .get()
            .json((data) => {
                let tasks = {};

                data.forEach(function (task, idx) {
                    if (typeof tasks[task.pet.id] === 'undefined') {
                        tasks[task.pet.id] = {
                            pet_name: task.pet.name,
                            tasks: []
                        };
                    }

                    tasks[task.pet.id].tasks.push(task);
                });

                let result = Object.keys(tasks).map(function (idx) {
                    return tasks[idx];
                });

                success(result);
            })
            .catch(error);
    }

    async complete(id, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/scheduledtasks/' + id)
            .put({completed: true})
            .res((data) => {
                success(data);
            })
            .catch(error);
    }

    async incomplete(id, success, error) {
        error = error || api.errorHandler;

        api
            .call()
            .url('/api/scheduledtasks/' + id)
            .put({completed: false})
            .res((data) => {
                success(data);
            })
            .catch(error);
    }
}