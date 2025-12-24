import { QueryClient } from "@tanstack/react-query"
import ConveneEvent from "../../../models/convene/event"
import ConveneImage from "../../../models/convene/images"
import type { HttpError } from "../../../interfaces/httpError"
import { conveneEndpoint } from "../../../api/urls/convene"

export const queryClient = new QueryClient()

interface IFetchEvents {
    signal?: AbortSignal;
    searchTerm?: string;
    max?: number;
}

// Convene

const httpError: HttpError = { info: "Ocorreu um erro ao criar evento", code: 500 }

export async function fetchEvents({ signal, searchTerm, max }: IFetchEvents): Promise<ConveneEvent[]>{
    let url: string = conveneEndpoint

    if (searchTerm && max !== undefined){
        url += '?search=' + searchTerm + '&max=' + max 
    } else if (searchTerm){
        url += '?search=' + searchTerm
    } else if (max){
        url += '?max=' + max
    }

    const response = await fetch(url, { signal: signal })

    if (!response.ok){
        const error = httpError
        error.code = response.status
        error.info = await response.json()
        throw error
    }

    const result = await response.json()

    return Array.isArray(result.events) ? result.events : []
}

export async function createNewEvent(eventData: ConveneEvent): Promise<ConveneEvent>{
    const response = await fetch(`${conveneEndpoint}`, {
        method: 'POST',
        body: JSON.stringify({ event: eventData }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok){
        const error = httpError
        error.code = response.status
        error.info = await response.json()
        throw error
    }

    const { event } = await response.json()

    return event
}

export async function fetchSelectableImages({ signal }: {
    signal?: AbortSignal
}): Promise<ConveneImage[]>{
    const response = await fetch(`${conveneEndpoint}/images`, { signal })

    if (!response.ok){
        const error = httpError
        error.code = response.status
        error.info = await response.json()
        throw error
    }

    const { images } = await response.json()

    return images
}

export async function fetchEvent({ id, signal }: {
    id: string;
    signal?: AbortSignal
}): Promise<ConveneEvent>{
    const response = await fetch(`${conveneEndpoint}/${id}`, { signal })

    if (!response.ok){
        const error = httpError
        error.code = response.status
        error.info = await response.json()
        throw error
    }

    const { event } = await response.json()

    return event
}

export async function deleteEvent({ id }: {
    id: string
}): Promise<void>{
    const response = await fetch(`${conveneEndpoint}/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok){
        const error = httpError
        error.code = response.status
        error.info = await response.json()
        throw error
    }

    return response.json()
}

export async function updateEvent({ id, event }: {
    id: string;
    event: ConveneEvent
}){
    return fetch(`${conveneEndpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ event }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}