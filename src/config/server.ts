import { app } from "../app";
import { env } from "./env";


export function server(){
    if(env.NODE_ENV==='development'){
        
        app.listen(env.PORT,()=>{
            console.log('server started')
        })
    }
}