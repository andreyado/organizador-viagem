const Utils = {

    formatCurrency(value){
        const number = Number(value || 0);
        return number.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    },

    parseCurrency(value){
        if(!value) return 0;
        return Number(String(value).replace(/\D/g, "")) / 100;
    },

    percent(part, total){
        const p = Number(part || 0);
        const t = Number(total || 0);
        if(t === 0) return 0;
        return Math.round((p / t) * 100);
    },

    wait(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    formatDate(date){
        if(!date) return "";
        return new Date(date).toLocaleDateString("pt-BR");
    },

    debounce(fn, delay = 300){
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

};

export default Utils;
