exports.redirectToFrontend = (req, res) => {
    console.log('index.controller.redirectToFrontend called...')
    try {
        res.sendFile(process.env.INDEX)
    } catch(error) {
        throw error;
    }
}