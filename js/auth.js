import { auth } from "../firebase-config.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import Storage from "./storage.js";
import Router from "./router.js";
import LoopSystem from "./loopsystem.js";

const Auth = {

    currentUser: null,

    init(){
        onAuthStateChanged(auth, (user) => {
            if(user){
                Auth.currentUser = user;
                Auth.loadAndRedirect();
            } else {
                Router.show("login");
            }
        });
    },

    bindEvents(){
        const btn = document.getElementById("btnLogin");
        if(btn){
            btn.addEventListener("click", () => Auth.login());
        }
    },

    async login(){
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const errorEl = document.getElementById("loginError");

        errorEl.textContent = "";

        if(!email || !password){
            errorEl.textContent = "Preencha email e senha.";
            return;
        }

        const btn = document.getElementById("btnLogin");
        btn.disabled = true;
        btn.textContent = "Entrando...";

        try{
            await signInWithEmailAndPassword(auth, email, password);
        } catch(e){
            btn.disabled = false;
            btn.textContent = "Entrar";

            if(e.code === "auth/user-not-found" || e.code === "auth/wrong-password" || e.code === "auth/invalid-credential"){
                errorEl.textContent = "Email ou senha incorretos.";
            } else {
                errorEl.textContent = "Erro ao entrar. Tente novamente.";
            }
        }
    },

    async loadAndRedirect(){
        const plan = await Storage.loadPlan(Auth.currentUser.email);
        if(plan){
            LoopSystem.goDashboard(plan);
        } else {
            Router.show("home");
        }
    },

    async logout(){
        await signOut(auth);
        Router.show("login");
    }

};

export default Auth;
