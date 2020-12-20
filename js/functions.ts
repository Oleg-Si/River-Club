import {DESKTOP_WIDTH} from './constants';

enum Days {
  FRIDAY = 5,
  SATURDAY = 6
}

enum Prices {
  PRICE_WEEKEND = 150,
  PRICE_WORK = 110
}

// Получение следующего деня
export const getNextDay = (date: Date): Date => {
  const nextDay = new Date(date.getTime() + 1000*60*60*24); // добавляем 24*60*60*1000 миллисекунд (1 день)

  return nextDay;
}

// Валидация инпутов
export const validateInput = (input: HTMLInputElement): boolean => {
  if (input.value) {

    if (window.innerWidth < DESKTOP_WIDTH) {
      if (input.parentElement.classList.contains('invalid')) {
        input.parentElement.classList.remove('invalid');
      }

      return true;
    } else {
      if (input.classList.contains('invalid')) {
        input.classList.remove('invalid');
      }

      return true;
    }


  } else {
    if (window.innerWidth < DESKTOP_WIDTH) {
      input.parentElement.classList.add('invalid');

      return false;
    } else {
      input.classList.add('invalid');

      return false;
    }
  }
}

// Преобразование даты в dd.mm.yyy
export const getHumanDate = (date: Date): string => {
  return date.toLocaleString('ru-ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'}
  );
}

// Рассчитывает стоимость
export const calculatePrice = (dateIn: Date, dateOut: Date): number => {
  let currentDay = dateIn;

  const dateStart: number = dateIn.getDate(); // дата начала
  const dateEnd: number = dateOut.getDate(); // дата окончания

  const prices = [];

  for (let i = dateStart; i < dateEnd; i++) {
    const day = currentDay.getDay(); // текущий день

    if (day === Days.FRIDAY || day === Days.SATURDAY) {
      prices.push(Prices.PRICE_WEEKEND);
    } else {
      prices.push(Prices.PRICE_WORK);
    }

    currentDay = getNextDay(currentDay)
  }

  return prices.reduce((a, b) => a + b);
}
