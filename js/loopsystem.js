import Router from "./router.js";
import Calculator from "./calculator.js";
import Dashboard from "./dashboard.js";
import Result from "./result.js";
import Gamification from "./gamification.js";
import Wizard from "./wizard.js";
import Storage from "./storage.js";
import Auth from "./auth.js";

const LoopSystem = {

    state: {
        data: null,
        result: null
    },

    init(){
        Router.init();
        Gamification.init();
        Wizard.init();
        this.bindEvents();
    },

    bindEvents(){
        document.addEventListener("click", (e) => {
            const id = e.target.id;

            if(id === "btnStart") Router.show("wizard");

            if(id === "btnNextStep") Wizard.next();

            if(id === "btnBackStep") Wizard.back();

            if(id === "btnRestart" || id === "btnNewPlan") this.goHome();

            if(id === "btnSeeResult") this.goResult();

            if(id === "btnLogout") Auth.logout();
        });
    },

    goHome(){
        this.state.data = null;
        this.state.result = null;
        Router.show("home");
    },

    async goDashboard(data){
        this.state.data = data;
        this.state.result = Calculator.calculate(data);

        Router.show("dashboard");
        Dashboard.render(this.state.result, data);

        if(Auth.currentUser){
            await Storage.savePlan(Auth.currentUser.email, data);
        }

        Gamification.addPoints(10);
    },

    goResult(){
        Router.show("result");
        Result.render(this.state.result);
    }

};

export default LoopSystem;
