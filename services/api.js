import wretch from "wretch";
import {Toast} from "native-base";

class api {
    static token;

    static setToken(token)
    {
        api.token = token;
    }

    call()
    {
        let apiObj = wretch("http://localhost")
            .headers({
                "Content-Type": 'application/json',
                Accept: "application/json"
            })
            .resolve(_ => _.error(error => {
                this.errorHandler(error);
            }));

        if (api.token) {
            apiObj = apiObj.auth(`Bearer ${ api.token }`)
        }

        return  apiObj
    }

    errorHandler(error)
    {
        console.log(error);

        Toast.show({
            text: "API error!",
            buttonText: "Okay",
            duration: 3000,
            type: "danger"
        });
    }
}

export function setToken(token) {
    api.setToken(token);
}

const obj = new api();

export default obj;