import HorasTrabalhadas, { validarFormatoHora, converterParaMinutos, interpretarHorarioSemPontos } from './HorasTrabalhadas';

describe('HorasTrabalhadas', () => {
    let horasTrabalhadas;

    beforeEach(() => {
        horasTrabalhadas = new HorasTrabalhadas();
    });

    describe('validarFormatoHora', () => {
        test('deve validar corretamente o formato HH:mm', () => {
            expect(validarFormatoHora('09:30')).toBe(true);
            expect(validarFormatoHora('23:59')).toBe(true);
            expect(validarFormatoHora('25:00')).toBe(false);
        });

        test('deve validar corretamente o formato h:mm', () => {
            expect(validarFormatoHora('9:30')).toBe(true);
            expect(validarFormatoHora('8:05')).toBe(true);
            expect(validarFormatoHora('9:65')).toBe(false);
        });

        test('deve validar corretamente o formato Hmm ou Hhmm', () => {
            expect(validarFormatoHora('930')).toBe(true);
            expect(validarFormatoHora('1230')).toBe(true);
            expect(validarFormatoHora('999')).toBe(false);
        });
    });

    describe('converterParaMinutos', () => {
        test('deve converter horário no formato HH:mm para minutos', () => {
            expect(converterParaMinutos('09:30')).toBe(570);
            expect(converterParaMinutos('23:59')).toBe(1439);
        });

        test('deve converter horário no formato h:mm para minutos', () => {
            expect(converterParaMinutos('9:05')).toBe(545);
            expect(converterParaMinutos('8:30')).toBe(510);
        });

        test('deve converter horário no formato Hmm ou Hhmm para minutos', () => {
            expect(converterParaMinutos('930')).toBe(570);
            expect(converterParaMinutos('1230')).toBe(750);
        });
    });

    describe('interpretarHorarioSemPontos', () => {
        test('deve interpretar corretamente o formato Hhmm ou Hmm', () => {
            expect(interpretarHorarioSemPontos('930')).toBe('09:30');
            expect(interpretarHorarioSemPontos('1230')).toBe('12:30');
        });

        test('deve lançar erro para formato inválido', () => {
            expect(() => interpretarHorarioSemPontos('99')).toThrow('Formato inválido. Use Hhmm ou Hmm.');
        });
    });

    describe('definirHorarios', () => {
        test('deve definir corretamente horários de início e fim sem inversão', () => {
            horasTrabalhadas.definirHorarios('09:00', '17:00');
            expect(horasTrabalhadas.horaInicio).toBe(540);
            expect(horasTrabalhadas.horaFim).toBe(1020);
        });

        test('deve lidar corretamente com a inversão dos horários (fim < início)', () => {
            horasTrabalhadas.definirHorarios('17:00', '09:00');
            expect(horasTrabalhadas.horaInicio).toBe(1020);
            expect(horasTrabalhadas.horaFim).toBe(540 + 24 * 60); // Adiciona 24 horas
        });

        test('deve lançar erro para formato inválido', () => {
            expect(() => horasTrabalhadas.definirHorarios('25:00', '17:00')).toThrow('Formato de hora inválido. Use o formato HH:mm, h:mm, ou Hhmm.');
        });
    });

    describe('definirIntervaloAlmoco', () => {
        test('deve definir corretamente o intervalo de almoço', () => {
            horasTrabalhadas.definirIntervaloAlmoco('12:00');
            expect(horasTrabalhadas.intervaloAlmoco).toBe(720); // 12:00 em minutos
        });

        test('deve lançar erro para intervalo com formato inválido', () => {
            expect(() => horasTrabalhadas.definirIntervaloAlmoco('25:00')).toThrow('Formato de intervalo inválido. Use o formato HH:mm, h:mm, ou Hhmm.');
        });
    });

    describe('calcularHorasTrabalhadas', () => {
        test('deve calcular corretamente as horas trabalhadas sem intervalo', () => {
            horasTrabalhadas.definirHorarios('09:00', '17:00');
            expect(horasTrabalhadas.calcularHorasTrabalhadas()).toBe('8h 0min');
        });

        test('deve calcular corretamente as horas trabalhadas com intervalo', () => {
            horasTrabalhadas.definirHorarios('09:00', '17:00');
            horasTrabalhadas.definirIntervaloAlmoco('01:00'); // Intervalo de almoço de 1 hora
            expect(horasTrabalhadas.calcularHorasTrabalhadas()).toBe('7h 0min');
        });

        test('deve calcular corretamente as horas trabalhadas com inversão de horários', () => {
            horasTrabalhadas.definirHorarios('17:00', '09:00');
            expect(horasTrabalhadas.calcularHorasTrabalhadas()).toBe('8h 0min');
        });

        test('deve lançar erro se horários de início ou fim não estiverem definidos', () => {
            expect(() => horasTrabalhadas.calcularHorasTrabalhadas()).toThrow('Horário de início ou fim não definidos.');
        });
    });
});
