import Router from "./router.js";
import Calculator from "./calculator.js";
import Dashboard from "./dashboard.js";
import Result from "./result.js";
import Gamification from "./gamification.js";
import Wizard from "./wizard.js";
import PreTrip from "./pretrip.js";
import Register from "./register.js";

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
            if(id === "btnPreTrip") this.goPreTrip();
            if(id === "btnRegister") this.goRegister();
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

        Register.init();
        Register.onSave = (record) => {
            this.onNewRecord(record);
        };

        import("./storage.js").then(m => {
            import("./auth.js").then(a => {
                if(a.default.currentUser){
                    m.default.savePlan(a.default.currentUser.email, data);
                }
            });
        });

        Gamification.addPoints(10);
    },

    onNewRecord(record){
        if(!this.state.data) return;

        this.state.data.saved = (this.state.data.saved || 0) + record.saved + record.extra;
        this.state.result = Calculator.calculate(this.state.data);

        Dashboard.render(this.state.result, this.state.data);

        import("./storage.js").then(m => {
            import("./auth.js").then(a => {
                if(a.default.currentUser){
                    m.default.savePlan(a.default.currentUser.email, this.state.data);
                }
            });
        });
    },

    goResult(){
        Router.show("result");
        Result.render(this.state.result, this.state.data);
    },

    goPreTrip(){
        const tripCost = this.state.result ? this.state.result.cost : 0;
        PreTrip.init(tripCost);
        Router.show("pretrip");
        PreTrip.renderCustom();
    },

    goRegister(){
        Router.show("register");
    }

};

export default LoopSystem;
