
import { createRefreshToken, type GoogleServiceAccount } from './utils'

type storageTokenSchema = { token: string, expire: number }

const defaultCorsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-type'
}

const defaultJsonHeaders = { 'Content-type': 'application/json' }

const defaultNotfound = `<!DOCTYPE html>
<html lang=en>
  <head>
    <meta charset=UTF-8>
    <meta content="width=device-width,initial-scale=1"name=viewport>
    <title>404 | Not Found</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>@font-face{font-family:"Exo 2";font-style:normal;font-weight:300 600;font-display:swap;src:url(https://fonts.gstatic.com/s/exo2/v24/7cHmv4okm5zmbtYoK-4W4nIp.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}body{font-family:"Exo 2",sans-serif;font-optical-sizing:auto;font-weight:300;font-style:normal}</style>
  </head>
  <body style=margin:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;user-select:none;background:white>
    <article style=display:flex;gap:.8em;align-items:center>
      <h1 style=font-size:1.6em;margin:0>404</h1>
      <span style=width:1px;height:3rem;background:#000></span>
      <p style="margin:0">This page could not be found</p>
    </article>
  </body>
</html>`

const credential = {
    client_email: "firebase-adminsdk-q039q@web-application-5963b.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyBokLOijVaxtm\nkL29IzXgrgEtTQezclBXm/FOYbGqG1+E9IBrFtprkviQOZq/GGNjw4+7u1cucjXg\n1/T/BZoz1KRtgbdjlCkYFbve/erGhBya4FBphk0KctElZe4y+KeDtSbkml5sLyme\nwFix55zrSe5q+ZOvuhZ9WLoJF053VQdBhrY6GJ7vFwq05BpmnG9oS+RJ3EBEYWWH\nladYkFUZyIgcKGpZf+laUSMh8pMGitvgzvI5GwL8JlmI5MfQgNIIqVrDjmhYK8Lu\nSZVXynuo0D15G6GFxEMx1iLH/PMrakwpYvW8COmZV1jA0E1o71czae2bJF0/9FGi\nTM/wgBydAgMBAAECggEAFNbygnOxtX/3AmvlpichxrYf0aV/hghW8taAqigCA/N1\n3ErB4KdZdLfM7Jctr/qDIfnR0MxWoYuBlps5JQRLH4+gGuiRJvFAWT8sEafALLJo\n5dFl4GB2EsfLh1j2CBX3CBIz5hVTAc+Ii/qgt1yxUBLEu9WQ7gR23v/8sRU/HHVP\n63G7Mx64mDxm0LZK+6obMg8m9AomKr+rO8MYx86OwV1me4B1QlAb8g3UIaxJdvXK\n0Qx441oaewpq7o8qLB4Q8zh9GpRRzwm4KKfe47Mz1yFqW1hsxVm765ejEKjC2pV7\nnQLBGgH0m7E1knE/r8RDLdGK9adgqpYuRL23tn+tmQKBgQDW55E9FVlU/viWLbo/\n2A6gShiSFSiZ55ajfGfrZq1CCrqiXeAD+lTSUE/lscdG0nss/aUJUhe3gRugqjLu\neSFfjB95VnnR6Ho6OT00AwZMh24DBUkFtAOeygY8sbBmPffKUTcCXGYsKQTqjMqN\njpEZIB2A9+lRP6YaC0h6tzYIdQKBgQDUEZfARmCuFrGg1IJ3qQ3vR8RRcLidbmh4\nO7yJQIB5i+ZeTzUHWjE/D1n4hbyXQDDTgcqI0DjVO21Lranw7IRK+eRXiLZws1T2\nGpkfHa/8bndgYErVfSDLeE2LkDX1iWdSay8b0Q4+R9OEx97eujGQHoDQI1C55cP0\n8AV17Tx+iQKBgEYdSy+ItZqbjXNB/BA0Z6E4S4fty09bVbSFNEqDN2fipD2xLxNd\nKytq9IZWWFPs/C8TmjLOS9qdDux+Wxue/Zp01xf5dMlddfNlFWjQy89QKD5oDQkF\nUGEQPLS0rH7PHPcvRClLCDLEN0xnHvbMWt69saKQP9k4UPMSV1ViTQi5AoGAMAok\nNDw9HnKpnmNFgtHbBD9fq4s7Zv5h0ArINNdVwzL75pVOz/GQglZ57SBujlzOMruO\nI9v3Y+ZoZeJbQuZxOYLORT4FBha5wl5YHYJeIXLsu/pUOXR0/2KrPlhWwN51d2gs\nbcK31Uf0FHoqdI39OEaQq5W0bcgs0cmlkwdA0vECgYEAm+A+GgP9lxdbZuM0BGTn\n5IE2GmR/5s55KNffBswqIvBSyHoF8tPAzV70Mg5KQxxx2nm1yL1tUH+1PFZCoNdn\nADVQeMC5Qprt/X0urJBC6EGO41+epgkS2DgxYgyAEJf1KtDbtnSCJuHjEFyBFJCr\nTGUzDbunTm40cZ5OObd+NU0=\n-----END PRIVATE KEY-----\n"
}

export default {
    async fetch( request: Request, env ) {

        const link = new URL( request.url )

        if ( request.method == 'OPTIONS' ) {
            return new Response( null, { status: 204, headers: defaultCorsHeaders })
        }

        if ( request.method == 'POST' && link.pathname == '/action/google/oauth2/token' && String( request.headers.get('content-type') || '' ).includes('application/json') ) {
            
            // find token from KV and set it if not exists
            const store = await env.storage.get( 'prefix', 'json' ) as storageTokenSchema ?? {} as storageTokenSchema
            if ( !store.token || store.expire < Date.now() ) {
                const token = await createRefreshToken( credential )
                store.token = token
                store.expire = Date.now() + 3598e3
                await env.storage.put( 'prefix', JSON.stringify( store ) );
            }

            const { client_email, private_key } = await request.json() as GoogleServiceAccount
            if ( typeof client_email != 'string' || !client_email.includes('@') || !client_email.includes('.') || typeof private_key != 'string' ) {
                return new Response( null, { status: 400 } )
            }

            const target = String( client_email ).replace(/[@.]/g, '-')

            // find member token from realtime database
            const request_store = await fetch(`https://web-application-5963b-default-rtdb.asia-southeast1.firebasedatabase.app/tokens/${target}.json`, {
                headers: { Authorization: `Bearer ${ store.token }` }
            }).then( e => e.json() ).catch( () => undefined ) as storageTokenSchema ?? {} as storageTokenSchema
            if ( !request_store.token || request_store.expire < Date.now() ) {
                const token = await createRefreshToken({ client_email, private_key })
                if ( !token ) {
                    return new Response( null, { status: 400 } )
                }
                request_store.token = token
                request_store.expire = Date.now() + 3598e3
                await fetch(`https://web-application-5963b-default-rtdb.asia-southeast1.firebasedatabase.app/tokens/${target}.json`, {
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
} satisfies ExportedHandler<{ storage: KVNamespace<'prefix'> }>
