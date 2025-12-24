export function isValidText(value, minLength = 1){
    return value && value.trim().length >= minLength
}

export function isValidDate(value){
    const date = new Date(value);
    return value && date.toString() !== 'Data Inválida';
}