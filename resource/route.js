import Controller from "./controllers/Controller.js"

export default class extends Controller {
    route(){
        return [
            { path: "/", view: "verify-otp" },
        ]
    }
}