import Router from "./router.js";
import Calculator from "./calculator.js";
import Dashboard from "./dashboard.js";
import Result from "./result.js";
import Gamification from "./gamification.js";
import Wizard from "./wizard.js";

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
            if(id === "btnLogout") import("./auth.js").then(m => m.default.logout());
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

        import("./storage.js").then(m => {
            import("./auth.js").then(a => {
                if(a.default.currentUser){
                    m.default.savePlan(a.default.currentUser.email, data);
                }
            });
        });

        Gamification.addPoints(10);
    },

    goResult(){
    Router.show("result");
    Result.render(this.state.result, this.state.data);
    }

};

export default LoopSystem;
