const axios = require('axios');
const { JSDOM } = require('jsdom');

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
        console.log('Leetcode Service error:', err.message);
        return { error: 'LEETCODE SERVICE ERROR' };
    }
}

async function getCodechefProfile(username) {
    try {
        const url = `https://www.codechef.com/users/${username}`;
        const { data } = await axios.get(url);

        const document = new JSDOM(data).window.document;

        const rating = document.querySelector('.rating-number')?.textContent.trim() || 'N/A';

        const rank = document.querySelectorAll('.rating-ranks a strong');
        const globalRank = rank[0] ? parseInt(rank[0].textContent) : 0;
        const countryRank = rank[1] ? parseInt(rank[1].textContent) : 0;

        const temph3 = document.querySelector('.problems-solved h3:last-of-type')?.textContent;
        const totalSolved = temph3 ? parseInt(temph3.match(/\d+/)[0]) : 0;

        const contests = document.querySelectorAll('.problems-solved .content');
        const contestsAttended = contests.length;

        return { username, rating, globalRank, countryRank, totalSolved, contestsAttended };

    } catch (err) {
        console.log('CodeChef service error:', err.message);
        return { error: 'CODECHEF SERVICE ERROR' };
    }
}


async function getCodeforceProfile(username) {
    try {
        const { data } = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        if (data.status !== 'OK') throw new Error('User not found');

        const user = data.result[0];

        return {
            username: user.handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rankTitle: user.rank || 'N/A'
        };
    } catch (err) {
        console.log('Codeforces service error:', err.message);
        return { error: 'CODEFORCES SERVICE ERROR' };
    }
}

module.exports = { getLeetcodeProfile , getCodechefProfile , getCodeforceProfile};
