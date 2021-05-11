/**
 * Clase con funciones comunes a usar en el proyecto
 */
export default class DateTimeUtils {
    /**
     * Obtiene rango de fechas de la semana pasada
     * @returns 
     */
    static getLastWeekRange() {
        let beforeWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
        let beforeWeekClone = new Date(beforeWeek);
        let day = beforeWeek.getDay();
        let diffToMonday = beforeWeek.getDate() - day + (day === 0 ? -6 : 1);
        let lastMonday = new Date(beforeWeek.setDate(diffToMonday));
        let lastSunday = new Date(beforeWeekClone.setDate(diffToMonday + 6));
        return {
            start: lastMonday, 
            end: lastSunday
        }
    }
}