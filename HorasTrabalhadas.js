// Funções fora da classe
function validarFormatoHora(hora) {
    const regexComPontos = /^([0-9]|[01]\d|2[0-3]):([0-5]\d)$/;
    const regexSemPontos = /^([0-9]|[01]\d|2[0-3])([0-5]\d)?$/; // Aceita 1 ou 2 dígitos para horas e 2 para minutos
    return regexComPontos.test(hora) || regexSemPontos.test(hora);
}

function converterParaMinutos(hora) {
    if (/^\d{1,4}$/.test(hora)) {
        hora = interpretarHorarioSemPontos(hora);
    }
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
}

function interpretarHorarioSemPontos(hora) {
    if (!/^\d{1,4}$/.test(hora)) {
        throw new Error('Formato inválido. Use Hhmm ou Hmm.');
    }
    let horas, minutos;
    if (hora.length === 3) {
        horas = `0${hora[0]}`;
        minutos = hora.slice(1);
    } else if (hora.length === 4) {
        horas = hora.slice(0, 2);
        minutos = hora.slice(2);
    } else {
        throw new Error('Formato inválido. Use Hhmm ou Hmm.');
    }
    if (horas.length > 2 || minutos.length > 2) {
        throw new Error('Formato inválido. Use Hhmm ou Hmm.');
    }
    return `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`;
}

// Exportação com ES Modules
export { validarFormatoHora, converterParaMinutos, interpretarHorarioSemPontos };

// Classe HorasTrabalhadas
class HorasTrabalhadas {
    constructor() {
        this.horaInicio = null;
        this.horaFim = null;
        this.intervaloAlmoco = 0;
    }

    definirHorarios(horaInicio, horaFim) {
        if (!validarFormatoHora(horaInicio) || !validarFormatoHora(horaFim)) {
            throw new Error('Formato de hora inválido. Use o formato HH:mm, h:mm, ou Hhmm.');
        }
        const inicioMinutos = converterParaMinutos(horaInicio);
        const fimMinutos = converterParaMinutos(horaFim);
        // Ajusta a hora de fim se for menor que a hora de início
        this.horaInicio = inicioMinutos;
        this.horaFim = (fimMinutos <= inicioMinutos) ? fimMinutos + 24 * 60 : fimMinutos;
    }

    definirIntervaloAlmoco(intervalo) {
        if (!validarFormatoHora(intervalo)) {
            throw new Error('Formato de intervalo inválido. Use o formato HH:mm, h:mm, ou Hhmm.');
        }
        this.intervaloAlmoco = converterParaMinutos(intervalo);
    }

    calcularHorasTrabalhadas() {
        if (this.horaInicio === null || this.horaFim === null) {
            throw new Error('Horário de início ou fim não definidos.');
        }

        let totalMinutos = this.horaFim - this.horaInicio;

        // Subtraia o intervalo de almoço, se houver
        if (this.intervaloAlmoco) {
            totalMinutos -= this.intervaloAlmoco;
        }

        // Garante que o totalMinutos não seja negativo
        totalMinutos = Math.max(totalMinutos, 0);

        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        return `${horas}h ${minutos}min`;
    }
}

export default HorasTrabalhadas;
