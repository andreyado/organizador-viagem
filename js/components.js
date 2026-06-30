import Utils from "./utils.js";
import Charts from "./charts.js";

const Components = {

    setText(id, value){
        const el = document.getElementById(id);
        if(el) el.textContent = value ?? "";
    },

    setCurrency(id, value){
        const el = document.getElementById(id);
        if(el) el.textContent = Utils.formatCurrency(value);
    },

    setProgress(id, percent){
        const el = document.getElementById(id);
        if(el) Charts.setProgressBar(el, percent);
    },

    toggle(id, show){
        const el = document.getElementById(id);
        if(el) el.style.display = show ? "block" : "none";
    },

    addClass(id, className){
        const el = document.getElementById(id);
        if(el) el.classList.add(className);
    },

    removeClass(id, className){
        const el = document.getElementById(id);
        if(el) el.classList.remove(className);
    }

};

export default Components;
