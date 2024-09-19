import HorasTrabalhadas from './HorasTrabalhadas.js';
import readline from 'readline';

// Criar uma interface de readline para entrada do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para pedir horários ao usuário
function perguntarHorarios() {
  rl.question('Digite o horário de início (formato HH:mm, h:mm, ou Hhmm): ', (horaInicio) => {
    rl.question('Digite o horário de fim (formato HH:mm, h:mm, ou Hhmm): ', (horaFim) => {
      rl.question('Digite o intervalo de almoço (formato HH:mm, h:mm, ou Hhmm): ', (intervaloAlmoco) => {
        
        // Instanciar a classe HorasTrabalhadas e processar os horários
        const horario = new HorasTrabalhadas();
        
        try {
          horario.definirHorarios(horaInicio, horaFim);
          horario.definirIntervaloAlmoco(intervaloAlmoco);
          const resultado = horario.calcularHorasTrabalhadas();
          console.log(`Horas trabalhadas: ${resultado}`);
        } catch (error) {
          console.error('Erro:', error.message);
        }

        // Fechar a interface de readline
        rl.close();
      });
    });
  });
}

// Chamar a função para começar a perguntar ao usuário
perguntarHorarios();
