
import { createRefreshToken, type GoogleServiceAccount } from './utils'

type storageTokenSchema = { token: string, expire: number }

const defaultCorsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-type'
}

const defaultJsonHeaders = { 'Content-type': 'application/json' }

const defaultNotfound = atob('PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ZW4+CjxoZWFkPgogIDxtZXRhIGNoYXJzZXQ9VVRGLTg+CiAgPG1ldGEgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MSJuYW1lPXZpZXdwb3J0PgogIDx0aXRsZT40MDQgfCBOb3QgRm91bmQ8L3RpdGxlPgogIDxsaW5rIHJlbD0ic2hvcnRjdXQgaWNvbiIgaHJlZj0iL2Zhdmljb24uaWNvIiB0eXBlPSJpbWFnZS94LWljb24iPgogIDxsaW5rIHJlbD0icHJlY29ubmVjdCIgaHJlZj0iaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbSIgY3Jvc3NvcmlnaW4+CiAgPHN0eWxlPkBmb250LWZhY2V7Zm9udC1mYW1pbHk6IkV4byAyIjtmb250LXN0eWxlOm5vcm1hbDtmb250LXdlaWdodDozMDAgNjAwO2ZvbnQtZGlzcGxheTpzd2FwO3NyYzp1cmwoaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbS9zL2V4bzIvdjI0LzdjSG12NG9rbTV6bWJ0WW9LLTRXNG5JcC53b2ZmMikgZm9ybWF0KCJ3b2ZmMiIpO3VuaWNvZGUtcmFuZ2U6VSswMDAwLTAwRkYsVSswMTMxLFUrMDE1Mi0wMTUzLFUrMDJCQi0wMkJDLFUrMDJDNixVKzAyREEsVSswMkRDLFUrMDMwNCxVKzAzMDgsVSswMzI5LFUrMjAwMC0yMDZGLFUrMjBBQyxVKzIxMjIsVSsyMTkxLFUrMjE5MyxVKzIyMTIsVSsyMjE1LFUrRkVGRixVK0ZGRkR9Ym9keXtmb250LWZhbWlseToiRXhvIDIiLHNhbnMtc2VyaWY7Zm9udC1vcHRpY2FsLXNpemluZzphdXRvO2ZvbnQtd2VpZ2h0OjMwMDtmb250LXN0eWxlOm5vcm1hbH08L3N0eWxlPgo8L2hlYWQ+Cjxib2R5IHN0eWxlPW1hcmdpbjowO3dpZHRoOjEwMHZ3O2hlaWdodDoxMDB2aDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7dXNlci1zZWxlY3Q6bm9uZTtiYWNrZ3JvdW5kOndoaXRlPgogIDxhcnRpY2xlIHN0eWxlPWRpc3BsYXk6ZmxleDtnYXA6LjhlbTthbGlnbi1pdGVtczpjZW50ZXI+CiAgICA8aDEgc3R5bGU9Zm9udC1zaXplOjEuNmVtO21hcmdpbjowPjQwNDwvaDE+CiAgICA8c3BhbiBzdHlsZT13aWR0aDoxcHg7aGVpZ2h0OjNyZW07YmFja2dyb3VuZDojMDAwPjwvc3Bhbj4KICAgIDxwIHN0eWxlPSJtYXJnaW46MCI+VGhpcyBwYWdlIGNvdWxkIG5vdCBiZSBmb3VuZDwvcD4KICA8L2FydGljbGU+CjwvYm9keT4KPC9odG1sPg==')

export default {

    async fetch( request: Request, env ) {

        const link = new URL( request.url )

        if ( request.method == 'OPTIONS' ) {
            return new Response( null, { status: 204, headers: defaultCorsHeaders })
        }

        if ( request.method == 'POST' && link.pathname == '/action/google/oauth2/token' && String( request.headers.get('content-type') || '' ).includes('application/json') ) {
            
            const store = await env.storage.get( 'prefix', 'json' ) as storageTokenSchema ?? {} as storageTokenSchema
            if ( !store.token || store.expire < Date.now() ) {
                const token = await createRefreshToken( env.CREDENTIAL )
                store.token = token
                store.expire = Date.now() + 3598e3
                await env.storage.put( 'prefix', JSON.stringify( store ) );
            }

            const { client_email, private_key } = await request.json() as GoogleServiceAccount
            if ( typeof client_email != 'string' || !client_email.includes('@') || !client_email.includes('.') || typeof private_key != 'string' ) {
                return new Response( null, { status: 400 } )
            }

            const target = "https://web-application-5963b-default-rtdb.asia-southeast1.firebasedatabase.app/tokens/" + String( client_email ).replace(/[@.]/g, '-') + ".json"
            
            const request_store = await fetch( target, {
                headers: { Authorization: `Bearer ${ store.token }` }
            }).then( e => e.json() ).catch( () => undefined ) as storageTokenSchema ?? {} as storageTokenSchema
            if ( !request_store.token || request_store.expire < Date.now() ) {
                let token: string
                try {
                    token = await createRefreshToken({ client_email, private_key })
                    if ( !token ) {
                        return new Response( null, { status: 400 } )
                    }
                } catch {
                    return new Response( null, { status: 400 } )
                }
                request_store.token = token
                request_store.expire = Date.now() + 3598e3
                await fetch( target, {
                    method: 'PUT',
                    body: JSON.stringify( request_store ),
                    headers: { Authorization: `Bearer ${ store.token }`, ...defaultJsonHeaders }
                })
            }

            return new Response( JSON.stringify( request_store ), { headers: { ...defaultJsonHeaders, ...defaultCorsHeaders } } )

        }

        return request.method == 'GET'
            ? new Response( defaultNotfound, { status: 404, headers: { 'Content-type': 'text/html' } } )
            : new Response( JSON.stringify({ status: 404, message: 'This page could not be found' }), { status: 404, headers: defaultJsonHeaders } )

    }

} satisfies ExportedHandler<{ storage: KVNamespace<'prefix'>, CREDENTIAL: GoogleServiceAccount }>
