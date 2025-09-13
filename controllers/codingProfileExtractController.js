const codingProfileExtractService = require('../services/codingProfileExtractService')

async function getLeetcode(req,res){
    try {
        const { username } = req.params;
        if(!username){
            return res.status(400).json({error:'Username required!!'});
        }
        const data = await codingProfileExtractService.getLeetcodeProfile(username);
        res.status(200).json(data);
        
    } catch (err) {
        console.log("SERVER ERROR",err.message);
        res.status(500).json(err);
    }
};

module.exports = { getLeetcode };
