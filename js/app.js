import Auth from "./auth.js";
import LoopSystem from "./loopsystem.js";
import Router from "./router.js";
import Storage from "./storage.js";

const App = {

    init(){
        Router.init();
        LoopSystem.init();
        Auth.bindEvents();

        Auth.onLoginSuccess = async (user) => {
            const plan = await Storage.loadPlan(user.email);
            if(plan){
                LoopSystem.goDashboard(plan);
            } else {
                Router.show("home");
            }
        };

        Router.show("splash");

        setTimeout(() => {
            Auth.init();
        }, 2000);
    }

};

App.init();
