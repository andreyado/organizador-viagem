import Utils from "./utils.js";
import Storage from "./storage.js";
import Auth from "./auth.js";
import { db } from "../firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const Register = {

    records: [],
    onSave: null,

    init(){
        this.loadRecords();
        this.bindEvents();
        this.bindMasks();
    },

    bindMasks(){
        const fields = ["registerSaved", "registerExtra"];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if(!el) return;
            el.addEventListener("input", () => {
                const digits = el.value.replace(/\D/g, "");
                const num = Number(digits) / 100;
                el.value = num > 0 ? num.toLocaleString("pt-BR", {minimumFractionDigits:2}) : "";
            });
        });
    },

    bindEvents(){
        const btnSave = document.getElementById("btnSaveRegister");
        if(btnSave){
            btnSave.addEventListener("click", () => this.saveRecord());
        }

        const btnBack = document.getElementById("btnBackFromRegister");
        if(btnBack){
            btnBack.addEventListener("click", () => {
                import("./router.js").then(m => m.default.show("dashboard"));
            });
        }
    },

    async loadRecords(){
        if(!Auth.currentUser) return;

        try{
            const snap = await getDoc(doc(db, "registros", Auth.currentUser.email));
            if(snap.exists()){
                this.records = snap.data().records || [];
            } else {
                this.records = [];
            }
        } catch(e){
            console.error("Erro ao carregar registros:", e);
            this.records = Storage.getLocal("registros") || [];
        }

        this.renderHistory();
    },

    async saveRecord(){
        const savedInput = document.getElementById("registerSaved");
        const extraInput = document.getElementById("registerExtra");
        const noteInput = document.getElementById("registerNote");

        const saved = Number((savedInput.value || "").replace(/\D/g, "")) / 100;
        const extra = Number((extraInput.value || "").replace(/\D/g, "")) / 100;
        const note = noteInput.value.trim();

        if(saved === 0 && extra === 0){
            savedInput.focus();
            return;
        }

        const record = {
            date: new Date().toISOString(),
            saved,
            extra,
            note,
            total: saved + extra
        };

        this.records.unshift(record);

        await this.persistRecords();

        savedInput.value = "";
        extraInput.value = "";
        noteInput.value = "";

        this.renderHistory();

        if(this.onSave) this.onSave(record);

        import("./router.js").then(m => m.default.show("dashboard"));
    },

    async persistRecords(){
        Storage.setLocal("registros", this.records);

        if(Auth.currentUser){
            try{
                await setDoc(doc(db, "registros", Auth.currentUser.email), {
                    records: this.records,
                    atualizadoEm: new Date().toISOString()
                });
            } catch(e){
                console.error("Erro ao salvar registros:", e);
            }
        }
    },

    getTotalSaved(){
        return this.records.reduce((sum, r) => sum + (r.saved || 0), 0);
    },

    getTotalExtra(){
        return this.records.reduce((sum, r) => sum + (r.extra || 0), 0);
    },

    renderHistory(){
        const container = document.getElementById("registerHistory");
        const box = document.getElementById("registerHistoryBox");

        if(!container || !box) return;

        if(this.records.length === 0){
            box.style.display = "none";
            return;
        }

        box.style.display = "block";

        container.innerHTML = this.records.map(r => `
            <div style="padding:10px 0; border-bottom:1px solid #E2E8F0;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:13px; color:#64748B;">
                        ${new Date(r.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span style="font-weight:600; color:#2563EB;">
                        + ${Utils.formatCurrency(r.total)}
                    </span>
                </div>
                ${r.saved > 0 ? `<div style="font-size:12px; color:#64748B;">Guardado: ${Utils.formatCurrency(r.saved)}</div>` : ""}
                ${r.extra > 0 ? `<div style="font-size:12px; color:#10B981;">Renda extra: ${Utils.formatCurrency(r.extra)}</div>` : ""}
                ${r.note ? `<div style="font-size:12px; color:#94A3B8; margin-top:2px;">${r.note}</div>` : ""}
            </div>
        `).join("");
    }

};

export default Register;
