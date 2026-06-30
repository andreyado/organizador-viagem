import Utils from "./utils.js";
import Components from "./components.js";

const Wizard = {

    step: 1,
    maxSteps: 4,

    init(){
        this.updateUI();
        this.bindCurrencyMask();
    },

    bindCurrencyMask(){
        const fields = ["tripCost", "currentSavings", "monthlySavings", "extraIncome"];

        fields.forEach(id => {
            const el = document.getElementById(id);
            if(!el) return;

            el.addEventListener("input", () => {
                let digits = el.value.replace(/\D/g, "");
                if(!digits){
                    el.value = "";
                    return;
                }
                const value = Number(digits) / 100;
                el.value = value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            });
        });
    },

    next(){
        if(this.step < this.maxSteps){
            this.step++;
            this.updateUI();
            return;
        }
        this.finish();
    },

    back(){
        if(this.step > 1){
            this.step--;
            this.updateUI();
        }
    },

    updateUI(){
        const steps = document.querySelectorAll(".wizard-step");

        steps.forEach(step => {
            const s = Number(step.dataset.step);
            step.classList.toggle("hidden", s !== this.step);
        });

        const progress = (this.step / this.maxSteps) * 100;
        Components.setProgress("wizardProgress", progress);
        Components.setText("wizardStep", this.step);

        const backBtn = document.getElementById("btnBackStep");
        if(backBtn) backBtn.style.display = this.step === 1 ? "none" : "block";

        const nextBtn = document.getElementById("btnNextStep");
        if(nextBtn){
            nextBtn.innerHTML = this.step === this.maxSteps
                ? 'Finalizar <i class="bi bi-check-circle"></i>'
                : 'Próximo <i class="bi bi-arrow-right"></i>';
        }
    },

    finish(){
        const data = this.collectData();
        import("./loopsystem.js").then(m => m.default.goDashboard(data));
    },

    collectData(){
        return {
            destination: document.getElementById("tripDestination")?.value || "",
            cost: Utils.parseCurrency(document.getElementById("tripCost")?.value || "0"),
            saved: Utils.parseCurrency(document.getElementById("currentSavings")?.value || "0"),
            monthly: Utils.parseCurrency(document.getElementById("monthlySavings")?.value || "0"),
            extraIncome: Utils.parseCurrency(document.getElementById("extraIncome")?.value || "0"),
            date: document.getElementById("tripDate")?.value || "",
            notes: document.getElementById("tripNotes")?.value || ""
        };
    }

};

export default Wizard;
