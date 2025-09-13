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
        console.log("LEETCODE SERVER ERROR",err.message);
        res.status(500).json(err);
    }
};

async function getCodechef(req,res){
    try {
        const { username } = req.params;
        if(!username){
            return res.status(400).json({error:'Username required!!'});
        }
        const data = await codingProfileExtractService.getCodechefProfile(username);
        res.status(200).json(data);
        
    } catch (err) {
        console.log("CODECHEF SERVER ERROR",err.message);
        res.status(500).json(err);
    }
};

async function getCodeforce(req,res){
    try {
        const { username } = req.params;
        if(!username){
            return res.status(400).json({error:'Username required!!'});
        }
        const data = await codingProfileExtractService.getCodeforceProfile(username);
        res.status(200).json(data);
        
    } catch (err) {
        console.log("CODEFORCE SERVER ERROR",err.message);
        res.status(500).json(err);
    }
};

module.exports = { getLeetcode, getCodechef , getCodeforce };
