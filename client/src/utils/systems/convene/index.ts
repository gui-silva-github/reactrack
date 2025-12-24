export default function addDay(valueDate: Date){
    const date = new Date(valueDate)
    
    date.setDate(date.getDate() + 1)

    const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })

    return formattedDate
}