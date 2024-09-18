import { createInterface } from 'readline'
 
class HorasTrabalhadas {
    constructor() {
        this.horaInicio = null
        this.horaFim = null
        this.intervaloAlmoco = null
    }
 
    static validarFormatoHora(hora) {
        const regexComPontos = /^([0-9]|[01]\d|2[0-3]):([0-5]\d)$/
        const regexSemPontos = /^\d{3,4}$/
        return regexComPontos.test(hora) || regexSemPontos.test(hora)
    }
 
    static converterParaMinutos(hora) {
        if (/^\d{3,4}$/.test(hora)) {
            hora = HorasTrabalhadas.interpretarHorarioSemPontos(hora)
        }
        const [h, m] = hora.split(":").map(Number)
        return h * 60 + m
    }
 
    definirHorarios(horaInicio, horaFim) {
        if (!HorasTrabalhadas.validarFormatoHora(horaInicio) || !HorasTrabalhadas.validarFormatoHora(horaFim)) {
            throw new Error('Formato de hora inválido. Use o formato HH:mm, h:mm, ou Hhmm.')
        }
        const inicioMinutos = HorasTrabalhadas.converterParaMinutos(horaInicio)
        const fimMinutos = HorasTrabalhadas.converterParaMinutos(horaFim)
        this.horaInicio = inicioMinutos
        this.horaFim = fimMinutos >= inicioMinutos ? fimMinutos : fimMinutos + 24 * 60
    }
 
    definirIntervaloAlmoco(intervalo) {
        if (!HorasTrabalhadas.validarFormatoHora(intervalo)) {
            throw new Error('Formato de intervalo inválido. Use o formato HH:mm, h:mm, ou Hhmm.')
        }
        this.intervaloAlmoco = HorasTrabalhadas.converterParaMinutos(intervalo)
    }
 
    calcularHorasTrabalhadas() {
        if (this.horaInicio === null || this.horaFim === null) {
            throw new Error('Horário de início ou fim não definidos.')
        }
        let totalMinutos = this.horaFim - this.horaInicio
        if (this.intervaloAlmoco) {
            totalMinutos -= this.intervaloAlmoco
        }
        const horas = Math.floor(totalMinutos / 60)
        const minutos = totalMinutos % 60
        return `${horas}h ${minutos}min`
    }
 
    static interpretarHorarioSemPontos(hora) {
        if (!/^\d{3,4}$/.test(hora)) {
            throw new Error('Formato inválido. Use Hhmm ou Hmm.')
        }
        let horas = hora.slice(0, -2)
        let minutos = hora.slice(-2)
        return `${horas.padStart(2, '0')}:${minutos}`
    }
}
 
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})
 
const horasTrabalhadas = new HorasTrabalhadas()
 
rl.question('Digite o horário de início (HH:mm, h:mm ou Hhmm): ', (horaInicio) => {
    rl.question('Digite o horário de término (HH:mm, h:mm ou Hhmm): ', (horaFim) => {
        try {
            horasTrabalhadas.definirHorarios(horaInicio, horaFim)
 
            rl.question('Você deseja inserir o intervalo de almoço? (HH:mm, h:mm, Hhmm ou Enter para ignorar): ', (intervalo) => {
                if (intervalo) {
                    horasTrabalhadas.definirIntervaloAlmoco(intervalo)
                }
 
                console.log(`Horas trabalhadas: ${horasTrabalhadas.calcularHorasTrabalhadas()}`)
                rl.close()
            })
        } catch (error) {
            console.error(error.message)
            rl.close()
        }
    })
})

