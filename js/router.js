const Router = {

    current: null,

    screens: {},

    init(){
    this.screens = {
        splash: document.getElementById("screen-splash"),
        login: document.getElementById("screen-login"),
        home: document.getElementById("screen-home"),
        wizard: document.getElementById("screen-wizard"),
        dashboard: document.getElementById("screen-dashboard"),
        pretrip: document.getElementById("screen-pretrip"),
        result: document.getElementById("screen-result")
    };
},

    show(name){
        const next = this.screens[name];

        if(!next){
            console.error("Tela não encontrada:", name);
            return;
        }

        if(this.current){
            this.current.classList.remove("active");
        }

        next.classList.add("active");
        this.current = next;
    }

};

export default Router;
