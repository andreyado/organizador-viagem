import Utils from "./utils.js";

const Calculator = {

    calculate(data){

        const cost = Number(data.cost || 0);
        const saved = Number(data.saved || 0);
        const extraIncome = Number(data.extraIncome || 0);

        const remainingBeforeExtra = Math.max(cost - saved, 0);
        const remaining = Math.max(remainingBeforeExtra - extraIncome, 0);

        const scenarios = {
            6: this.monthly(remaining, 6),
            12: this.monthly(remaining, 12),
            24: this.monthly(remaining, 24)
        };

        const progress = Utils.percent(saved + extraIncome, cost);

        return {
            cost,
            saved,
            extraIncome,
            remaining,
            progress,
            scenarios
        };

    },

    monthly(amount, months){
        if(!months) return 0;
        return amount / months;
    },

    simulate(cost, saved, monthly, months){
        let current = saved;
        const history = [];

        for(let i = 1; i <= months; i++){
            current += monthly;
            if(current > cost) current = cost;
            history.push({
                month: i,
                value: current,
                percent: Utils.percent(current, cost)
            });
        }

        return history;
    }

};

export default Calculator;
