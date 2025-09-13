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
        return { error: 'SERVICE ERROR' };
    }
}

async function getCodechefProfile(username) {
    try {
        const url = `https://www.codechef.com/users/${username}`;
        const { data } = await axios.get(url);

        const document = new JSDOM(data).window.document;

        const rating = document.querySelector('.rating-number')?.textContent.trim() || 'N/A';

        const rankElems = document.querySelectorAll('.rating-ranks a strong');
        const globalRank = rankElems[0] ? parseInt(rankElems[0].textContent) : 0;
        const countryRank = rankElems[1] ? parseInt(rankElems[1].textContent) : 0;

        const totalSolvedH3 = document.querySelector('.problems-solved h3:last-of-type')?.textContent;
        const totalSolved = totalSolvedH3 ? parseInt(totalSolvedH3.match(/\d+/)[0]) : 0;
        
        const contests = document.querySelectorAll('.problems-solved .content');
        const contestsAttended = contests.length;

        return { username, rating, globalRank, countryRank, totalSolved, contestsAttended };

    } catch (err) {
        console.log('CodeChef service error:', err.message);
        return { error: 'SERVICE ERROR' };
    }
}

module.exports = { getLeetcodeProfile , getCodechefProfile };
