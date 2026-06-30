import Utils from "./utils.js";

const Animations = {

    fadeIn(element, duration = 300){
        if(!element) return;
        element.style.opacity = 0;
        element.style.display = "block";
        const start = performance.now();

        const animate = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            element.style.opacity = progress;
            if(progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    },

    fadeOut(element, duration = 300){
        if(!element) return;
        element.style.opacity = 1;
        const start = performance.now();

        const animate = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            element.style.opacity = 1 - progress;
            if(progress >= 1){
                element.style.display = "none";
            } else {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    count(element, start, end, duration = 600){
        if(!element) return;
        const range = end - start;
        const startTime = performance.now();

        const step = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const value = start + range * progress;
            element.textContent = Utils.formatCurrency(value);
            if(progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    },

    shake(element){
        if(!element) return;
        element.classList.add("shake");
        setTimeout(() => element.classList.remove("shake"), 500);
    }

};

export default Animations;
