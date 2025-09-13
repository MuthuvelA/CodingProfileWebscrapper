const axios = require('axios');

async function getLeetcodeProfile(username) {
    try {
        const url = 'https://leetcode.com/graphql';
        const query ={
            "query": `query getUserProfile($username: String!) { 
                userContestRanking(username:  $username) {
                    attendedContestsCount 
                    rating
                    globalRanking
                } 
                matchedUserStats: matchedUser(username: $username) {
                    submitStats: submitStatsGlobal {        
                        acSubmissionNum {
                            difficulty
                            count
                            submissions  
                        }       
                        totalSubmissionNum {   
                            difficulty  
                            count          
                            submissions    
                        }  
                    }
                }  
            }`,
            "variables": {"username": `${username}`}
        };

        
        const  { data }  = await axios.post(url, query);

        const contest = data.data.userContestRanking || {};

        
        const userStats = data.data.matchedUserStats;
        if (!userStats) return { error: 'User not found' };

        const submitStats = userStats.submitStats.acSubmissionNum || [];

        const leetcodeTotal  = submitStats[0]?.count || 0;
        const leetcodeEasy   = submitStats[1]?.count || 0;
        const leetcodeMedium = submitStats[2]?.count || 0;
        const leetcodeHard   = submitStats[3]?.count || 0;

        return {
            username,
            leetcodeNoContest: contest.attendedContestsCount || 0,
            leetcodeRanking: contest.globalRanking || 0,
            leetcodeRating: contest.rating || 0,
            leetcodeTotal,
            leetcodeEasy,
            leetcodeMedium,
            leetcodeHard
        };

    } catch (err) {
        console.log('Service error:', err.message);
        return { error: 'SERVICE ERROR' };
    }
}

module.exports = { getLeetcodeProfile };
