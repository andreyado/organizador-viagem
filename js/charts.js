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

    /**
     * Renderiza gráfico de evolução mensal
     */
    renderEvolution(canvasId, data, result){
        const canvas = document.getElementById(canvasId);
        if(!canvas) return;

        const months = this.monthsUntilTrip(data.date);
        const history = Calculator.simulate(
            result.cost,
            result.saved,
            result.scenarios[12],
            months
        );

        const labels = history.map(h => `Mês ${h.month}`);
        const values = history.map(h => h.value);

        // Destroi instância anterior se existir
        if(this.instances[canvasId]){
            this.instances[canvasId].destroy();
        }

        this.instances[canvasId] = new Chart(canvas, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Valor acumulado",
                    data: values,
                    borderColor: "#2563EB",
                    backgroundColor: "rgba(37,99,235,0.1)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: "#2563EB"
                }, {
                    label: "Meta",
                    data: Array(months).fill(result.cost),
                    borderColor: "#10B981",
                    borderWidth: 2,
                    borderDash: [6, 4],
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { font: { family: "Poppins", size: 12 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => Utils.formatCurrency(ctx.raw)
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => Utils.formatCurrency(value),
                            font: { family: "Poppins", size: 11 }
                        }
                    },
                    x: {
                        ticks: { font: { family: "Poppins", size: 11 } }
                    }
                }
            }
        });
    }

};

export default Charts;
