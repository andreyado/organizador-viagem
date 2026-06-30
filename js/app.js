import Auth from "./auth.js";
import LoopSystem from "./loopsystem.js";
import Router from "./router.js";

const App = {

    init(){
        Router.init();
        LoopSystem.init();
        Auth.bindEvents();

        Router.show("splash");

        setTimeout(() => {
            Auth.init();
        }, 2000);
    }

};

App.init();
