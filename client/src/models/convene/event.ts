export default class ConveneEvent {
    id: string
    title: string
    image: string
    date: Date
    time: string
    description: string
    location: string

    constructor() {
        this.id = ''
        this.title = ''
        this.image = ''
        this.date = new Date()
        this.time = ''
        this.description = ''
        this.location = ''
    }
}