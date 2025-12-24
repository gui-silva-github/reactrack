import express from "express"

import { getAll, get, add, replace, remove } from "../services/events.js"
import { isValidText, isValidDate } from "../util/validation.js"
import { getAllImages } from "../services/images.js"

export const router = express.Router()

router.get('/', async (req, res) => {
    const query = req.query
    
    const eventsFileContent = await getAll()
    let events = eventsFileContent.events

    const search = query.search
    const max = query.max ? Number(query.max) : undefined

    if (search){
        events = events.filter((event) => {
            const searchableText = `${event.title} ${event.description} ${event.location}`
            return searchableText.toLowerCase().includes(search.toLowerCase())
        })
    }

    if (max) {
        const today = new Date()
        const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)

        events = events
            .filter(event => {
                const eventDate = new Date(event.date)
                const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
                return eventDay >= yesterday
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, max)
    }

    if (!events || events.length === 0){
        return res.json({ events: [] })
    }

    res.json({
        events: events.map((event) => ({
            id: event.id,
            title: event.title,
            image: event.image,
            date: event.date,
            location: event.location
        }))
    })
})

router.get('/images', async (req, res) => {
    const images = await getAllImages()

    res.status(200).json({ images })
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    const event = await get(id)

    if (!event){
        return res
            .status(404)
            .json({ message: `Para o id ${id}, nenhum evento pode ser encontrado.`})
    }

    res.json({ event })
})

router.post('/', async (req, res, next) => {
    const { event } = req.body

    if (!event){
        return res.status(400).json({ message: 'Evento é requerido' })
    }

    let errors = {}

    if (!isValidText(event.title)){
        errors.title = 'Título inválido.'
    }

    if (!isValidText(event.description)){
        errors.description = 'Descrição inválida.'
    }

    if (!isValidDate(event.date)){
        errors.date = 'Data inválida.'
    }

    if (!isValidText(event.location)){
        errors.location = 'Localização inválida.'
    }

    if (Object.keys(errors).length > 0){
        return res.status(422).json({
            message: "",
            errors
        })
    }

    const newEvent = {
        id: crypto.randomUUID(),
        ...event
    }

    try{
        await add(newEvent)
        res.status(201).json({ event: newEvent })
    } catch (error){
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    const { id } = req.params
    const { event } = req.body

    if (!event){
        return res.status(400).json({ message: 'Evento é requerido'})
    }

    let errors = {}

    if (!isValidText(event.title)){
        errors.title = 'Título inválido.'
    }

    if (!isValidText(event.description)){
        errors.description = 'Descrição inválida.'
    }

    if (!isValidDate(event.date)){
        errors.date = 'Data inválida.'
    }

    if (!isValidText(event.location)){
        errors.location = 'Localização inválida.'
    }

    if (Object.keys(errors).length > 0){
        return res.status(422).json({
            message: '',
            errors
        })
    }

    try{
        await replace(id, event)
        res.json({ message: 'Evento atualizado.', event: event })
    } catch(error){
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params

    try{
        await remove(id)
        res.json({ message: 'Evento excluído.'})
    } catch(error){
        next(error)
    }
})

export default router