import app from "./app"
import  config  from "./types/env"


app.listen(config.PORT, () => {
    console.log('Server is up on port ' + config.PORT)
})
