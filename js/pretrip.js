import Utils from "./utils.js";
import Components from "./components.js";
import Storage from "./storage.js";
import Auth from "./auth.js";

const PreTrip = {

    suggested: [
        { id: "passport", name: "Passaporte", value: 0, checked: false },
        { id: "visa", name: "Visto", value: 0, checked: false },
        { id: "vaccine", name: "Vacinas", value: 0, checked: false },
        { id: "insurance", name: "Seguro viagem", value: 0, checked: false },
        { id: "luggage", name: "Mala/bagagem", value: 0, checked: false },
        { id: "adapter", name: "Adaptador de tomada", value: 0, checked: false },
        { id: "clothes", name: "Roupas específicas", value: 0, checked: false },
        { id: "currency", name: "Câmbio inicial", value: 0, checked: false }
    ],

    custom: [],

    tripCost: 0,

    init(tripCost){
        this.tripCost = tripCost || 0;
        this.loadSaved();
        this.renderSuggested();
        this.bindEvents();
        this.updateTotals();
    },

    loadSaved(){
        const saved = Storage.getLocal("pretrip");
        if(saved){
            if(saved.suggested) this.suggested = saved.suggested;
            if(saved.custom) this.custom = saved.custom;
        }
    },

    save(){
        Storage.setLocal("pretrip", {
            suggested: this.suggested,
            custom: this.custom
        });

        if(Auth.currentUser){
            import("../firebase-config.js").then(({ db }) => {
                import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js").then(({ doc, setDoc }) => {
                    setDoc(doc(db, "pretrip", Auth.currentUser.email), {
                        suggested: this.suggested,
                        custom: this.custom,
                        atualizadoEm: new Date().toISOString()
                    });
                });
            });
        }
    },

    renderSuggested(){
        const container = document.getElementById("pretripSuggested");
        if(!container) return;

        container.innerHTML = this.suggested.map(item => `
            <div class="pretrip-item" style="display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #E2E8F0;">
                <input type="checkbox" id="check_${item.id}" ${item.checked ? "checked" : ""}
                    style="width:18px; height:18px; margin:0; cursor:pointer;">
                <label for="check_${item.id}" style="flex:1; margin:0; cursor:pointer;">${item.name}</label>
                <input type="text" id="val_${item.id}" value="${item.value > 0 ? item.value.toLocaleString("pt-BR", {minimumFractionDigits:2}) : ""}"
                    placeholder="R$ 0,00"
                    style="width:110px; margin:0; padding:6px 10px; font-size:13px; text-align:right;">
            </div>
        `).join("");

        this.suggested.forEach(item => {
            const checkbox = document.getElementById(`check_${item.id}`);
            const valueInput = document.getElementById(`val_${item.id}`);

            if(checkbox){
                checkbox.addEventListener("change", () => {
                    item.checked = checkbox.checked;
                    this.updateTotals();
                    this.save();
                });
            }

            if(valueInput){
                valueInput.addEventListener("input", () => {
                    const digits = valueInput.value.replace(/\D/g, "");
                    const num = Number(digits) / 100;
                    valueInput.value = num > 0 ? num.toLocaleString("pt-BR", {minimumFractionDigits:2}) : "";
                    item.value = num;
                    this.updateTotals();
                    this.save();
                });
            }
        });
    },

    bindEvents(){
        const btnAdd = document.getElementById("btnAddPretripItem");
        if(btnAdd){
            btnAdd.addEventListener("click", () => this.addCustomItem());
        }

        const btnBack = document.getElementById("btnBackDashboard");
        if(btnBack){
            btnBack.addEventListener("click", () => {
                import("./router.js").then(m => m.default.show("dashboard"));
            });
        }
    },

    addCustomItem(){
        const nameInput = document.getElementById("pretripItemName");
        const valueInput = document.getElementById("pretripItemValue");

        const name = nameInput.value.trim();
        const digits = (valueInput.value || "").replace(/\D/g, "");
        const value = Number(digits) / 100;

        if(!name){
            nameInput.focus();
            return;
        }

        this.custom.push({ id: Date.now(), name, value, checked: true });

        nameInput.value = "";
        valueInput.value = "";

        this.renderCustom();
        this.updateTotals();
        this.save();
    },

    renderCustom(){
        const container = document.getElementById("pretripCustomItems");
        const wrapper = document.getElementById("pretripCustomList");

        if(!container || !wrapper) return;

        if(this.custom.length === 0){
            wrapper.style.display = "none";
            return;
        }

        wrapper.style.display = "block";

        container.innerHTML = this.custom.map(item => `
            <div style="display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #E2E8F0;">
                <span style="flex:1; font-size:14px;">${item.name}</span>
                <span style="font-size:14px; color:#2563EB;">${Utils.formatCurrency(item.value)}</span>
                <button onclick="PreTrip.removeCustom(${item.id})"
                    style="background:none; border:none; color:#DC2626; padding:4px; cursor:pointer; font-size:16px;">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join("");
    },

    removeCustom(id){
        this.custom = this.custom.filter(item => item.id !== id);
        this.renderCustom();
        this.updateTotals();
        this.save();
    },

    getTotalSuggested(){
        return this.suggested
            .filter(i => i.checked)
            .reduce((sum, i) => sum + (i.value || 0), 0);
    },

    getTotalCustom(){
        return this.custom.reduce((sum, i) => sum + (i.value || 0), 0);
    },

    updateTotals(){
        const total = this.getTotalSuggested() + this.getTotalCustom();
        const grandTotal = total + this.tripCost;

        Components.setCurrency("pretripTotal", total);
        Components.setCurrency("pretripTripCost", this.tripCost);
        Components.setCurrency("pretripGrandTotal", grandTotal);
    }

};

window.PreTrip = PreTrip;

export default PreTrip;
