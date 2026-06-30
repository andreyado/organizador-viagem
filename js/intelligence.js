const Intelligence = {

    generate(data){

        const cost = Number(data.cost || 0);
        const saved = Number(data.saved || 0);
        const monthly = Number(data.monthly || 0);
        const remaining = Math.max(cost - saved, 0);

        if(cost === 0){
            return "Defina o valor da sua viagem para começar seu planejamento.";
        }

        if(saved >= cost){
            return "🎉 Você já tem o valor necessário para sua viagem!";
        }

        if(monthly <= 0){
            return "Defina quanto você consegue guardar por mês para criar seu plano.";
        }

        const months = remaining / monthly;

        if(months <= 6)  return "🔥 Você pode realizar essa viagem em até 6 meses.";
        if(months <= 12) return "📅 Seu objetivo está a cerca de 1 ano de distância.";
        if(months <= 24) return "⏳ Com disciplina, sua viagem pode acontecer em até 2 anos.";

        return "💡 Pequenos ajustes no seu planejamento podem acelerar sua viagem.";

    }

};

export default Intelligence;
