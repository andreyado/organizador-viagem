import Utils from "./utils.js";

const Charts = {

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
    }

};

export default Charts;
