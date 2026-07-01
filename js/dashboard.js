import Components from "./components.js";
import Intelligence from "./intelligence.js";
import Charts from "./charts.js";

const Dashboard = {

    render(result, data){
        if(!result) return;
        this.header(data);
        this.cards(result);
        this.progress(result);
        this.scenarios(result);
        this.insight(result, data);
        this.chart(result, data);
    },

    header(data){
        Components.setText("dashDestination", data.destination || "Sua Viagem");
    },

    cards(result){
        Components.setCurrency("totalCost", result.cost);
        Components.setCurrency("currentSaved", result.saved);
    },

    progress(result){
        Components.setProgress("progressBar", result.progress);
        Components.setText("progressText", `${result.progress}% concluído`);
    },

    scenarios(result){
        Components.setCurrency("scenario6", result.scenarios[6]);
        Components.setCurrency("scenario12", result.scenarios[12]);
        Components.setCurrency("scenario24", result.scenarios[24]);
    },

    insight(result, data){
        const text = Intelligence.generate({
            cost: result.cost,
            saved: result.saved,
            monthly: data.monthly || 0
        });
        Components.setText("insightText", text);
    },

    chart(result, data){
        Charts.renderEvolution("chartDashboard", data, result);
    }

};

export default Dashboard;
