import Utils from "./utils.js";
import Calculator from "./calculator.js";

const Charts = {

    instances: {},

    renderCircleProgress(element, percent){
        if(!element) return;
        const value = Math.max(0, Math.min(percent || 0, 100));
        element.style.background = `conic-gradient(var(--primary) ${value}%, var(--border) ${value}% 100%)`;
    },

    setProgressBar(element, percent){
        if(!element) return;
        const value = Math.max(0, Math.min(percent || 0, 100));
        element.style.width = value + "%";
    },

    updateAll(map = {}){
        Object.entries(map).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if(el) this.setProgressBar(el, value);
        });
    },

    animateNumber(element, start, end, duration = 600){
        if(!element) return;
        const range = end - start;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = start + range * progress;
            element.textContent = Utils.formatCurrency(value);
            if(progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    },

    /**
     * Calcula quantos meses até a data da viagem
     */
    monthsUntilTrip(dateStr){
        if(!dateStr) return 12;
        const today = new Date();
        const tripDate = new Date(dateStr);
        const diff = (tripDate.getFullYear() - today.getFullYear()) * 12
            + (tripDate.getMonth() - today.getMonth());
        return Math.max(1, Math.min(diff, 60));
    },
