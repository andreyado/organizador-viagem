import Storage from "./storage.js";

const Gamification = {

    state: {
        points: 0,
        level: 1,
        streak: 0
    },

    init(){
        const saved = Storage.getLocal("gamification");
        if(saved) this.state = saved;
    },

    addPoints(points = 10){
        this.state.points += points;
        this.updateLevel();
        this.save();
    },

    updateLevel(){
        this.state.level = Math.floor(this.state.points / 100) + 1;
    },

    addStreak(){
        this.state.streak += 1;
        this.save();
    },

    resetStreak(){
        this.state.streak = 0;
        this.save();
    },

    save(){
        Storage.setLocal("gamification", this.state);
    },

    getSummary(){
        return {
            points: this.state.points,
            level: this.state.level,
            streak: this.state.streak
        };
    }

};

export default Gamification;
