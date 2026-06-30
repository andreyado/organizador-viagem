import { db } from "../firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const Storage = {

    /**
     * Salva plano no Firestore
     */
    async savePlan(email, planData){
        try{
            await setDoc(doc(db, "planos", email), {
                ...planData,
                atualizadoEm: new Date().toISOString()
            });
            return true;
        } catch(e){
            console.error("Erro ao salvar plano:", e);
            return false;
        }
    },

    /**
     * Carrega plano do Firestore
     */
    async loadPlan(email){
        try{
            const snap = await getDoc(doc(db, "planos", email));
            if(snap.exists()){
                return snap.data();
            }
            return null;
        } catch(e){
            console.error("Erro ao carregar plano:", e);
            return null;
        }
    },

    /**
     * Salva dado local (sessão)
     */
    setLocal(key, value){
        try{
            localStorage.setItem(key, JSON.stringify(value));
        } catch(e){
            console.error("Erro no localStorage:", e);
        }
    },

    /**
     * Carrega dado local (sessão)
     */
    getLocal(key){
        try{
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch(e){
            return null;
        }
    },

    /**
     * Remove dado local
     */
    removeLocal(key){
        try{
            localStorage.removeItem(key);
        } catch(e){
            console.error("Erro ao remover localStorage:", e);
        }
    }

};

export default Storage;
