import { ReadableStream } from 'stream/web'
import { type LoaderFunction } from '@remix-run/node'

export let loader: LoaderFunction = async ({ request }) => {
	if (request.headers.get('Accept') !== 'text/event-stream') {
		return new Response('This endpoint is designed for SSE', { status: 400 })
	}

	let interval: any

	const stream = new ReadableStream({
		start(controller) {
			interval = setInterval(() => {
        const data = `data: ping ${Date.now().toString()}\n\n`;
				controller.enqueue(data)
			}, 1000)
		},
		cancel() {
			// Clean up the interval if the stream is cancelled
			clearInterval(interval)
		},
	})

	// Ensure that the interval is cleared when the stream is closed
	// @ts-ignore
	stream?.closed?.then(() => clearInterval(interval))

	// @ts-ignore
	return new Response(stream, {
		status: 200,
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		},
	})
}
