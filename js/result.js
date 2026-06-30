import Components from "./components.js";

const Result = {

    render(result){
        if(!result) return;
        this.header();
        this.summary(result);
        this.plan(result);
        this.scenarios(result);
    },

    header(){
        Components.setText("resultDestination", "Sua Viagem");
    },

    summary(result){
        Components.setCurrency("resTotalCost", result.cost);
        Components.setCurrency("resCurrentSaved", result.saved);
        Components.setCurrency("resExtraIncome", result.extraIncome);
        Components.setCurrency("resRemaining", result.remaining);
    },

    plan(result){
        const monthly = result.scenarios[12];
        Components.setCurrency("resMonthlyPlan", monthly);
        Components.setProgress("resProgressBar", result.progress);
        Components.setText("resProgressText", `${result.progress}% do objetivo atingido`);
    },

    scenarios(result){
        Components.setCurrency("res6m", result.scenarios[6]);
        Components.setCurrency("res12m", result.scenarios[12]);
        Components.setCurrency("res24m", result.scenarios[24]);
    }

};

export default Result;
