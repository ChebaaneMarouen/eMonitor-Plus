const Twitter = require("twitter");
const TwitterV2 = require("twitter-v2");
const cron = require("node-cron");
const {getSettings} = require("./settings");
const eventServices = require("./eventServices");

let cronTasks = null;

exports.getPosts = getPosts;
exports.cronJob = cronJob;
exports.stopCronJob = stopCronJob;
exports.getUserMentions = getUserMentions;

function getClient() {
  return new Twitter({
    consumer_key: getSettings("consumer_key"),
    consumer_secret: getSettings("consumer_secret"),
    access_token_key: getSettings("access_token_key"),
    access_token_secret: getSettings("access_token_secret"),
  });
}

function getClientV2() {
  return new TwitterV2({
    consumer_key: getSettings("consumer_key"),
    consumer_secret: getSettings("consumer_secret"),
    access_token_key: getSettings("access_token_key"),
    access_token_secret: getSettings("access_token_secret"),
  });
}

// eslint-disable-next-line
function getPosts({ screen_name, max_id }) {
  const client = getClient();
  return client
      .get("statuses/user_timeline", {
        screen_name,
        count: getSettings("twitterLimit"),
        max_id,
        include_rts: true,
        exclude_replies: true,
        tweet_mode: "extended",
      })
      .then((data) => {
        console.log("data pip", JSON.stringify(data, null, 4))
        return data;
      });
}

async function getUserMentions(id_user, conversation_id) {
  try {
    const client = getClientV2();
  console.log("in client", id_user, conversation_id,getSettings("twitterCommentsLimit"))
  let first_page = await client.get(`users/${id_user}/mentions`, {
    max_results: getSettings("twitterCommentsLimit")? getSettings("twitterCommentsLimit"):20,
    expansions : "author_id",
    "tweet.fields":"conversation_id"
  })
  const second_page = first_page["meta"] ? await client.get(`users/${id_user}/mentions`, {
    max_results: getSettings("twitterCommentsLimit")? getSettings("twitterCommentsLimit"):20,
    expansions : "author_id",
    "tweet.fields":"conversation_id",
    pagination_token : first_page["meta"]["next_token"]
  }) : {data : []}

  const third_page = second_page["meta"] ? await client.get(`users/${id_user}/mentions`, {
    max_results: getSettings("twitterCommentsLimit")? getSettings("twitterCommentsLimit"):20,
    expansions : "author_id",
    "tweet.fields":"conversation_id",
    pagination_token : second_page["meta"]["next_token"]
  }) : {data : []}
  first_page = first_page["data"] ? first_page : {data : []};
  const result =first_page["data"].concat(second_page["data"],third_page["data"]); 
  const final_result = result.filter(el=>el["conversation_id"] === conversation_id);
  final_result.forEach((res)=>{
    res["comment"] = res["text"]
  })
  console.log("final_result", final_result);
  console.log("result length", result.length);
  return final_result;
        
  } catch (error) {
    console.log(error)
    return []
  }
  
}

function getMentions() {
  const client = getClient();
  return client
      .get("statuses/mentions_timeline.json", {
        count: getSettings("twitterLimit"),
      })
      .then((data) => {
        return data;
      });
}

function cronJob(data) {
  console.log("cron job ", data["cron_mentions"])
  if (cronTasks){
    console.log("stopping ...");
    cronTasks.stop();

    console.log("destroying ...");

    cronTasks.destroy();
    console.log("creating ...");
    cronTasks = cron.schedule(data["cron_mentions"],()=>{
      getMentions().then(posts=>{
         posts.forEach((post) => {
            const data = {
              ...post,
              source: "twitter_mentions",
              created: new Date(post.created_at).getTime(),
              crawlTime: Date.now(),
            };
            eventServices.create("crawlingDone", data);
          });
        }).catch(err=>console.log(err))
    })
  } else{
    cronTasks = cron.schedule(data["cron_mentions"],()=>{
      getMentions().then(posts=>{
         posts.forEach((post) => {
            const data = {
              ...post,
              source: "twitter_mentions",
              created: new Date(post.created_at).getTime(),
              crawlTime: Date.now(),
            };
            eventServices.create("crawlingDone", data);
          });
        }).catch(err=>console.log(err))
    })
  }
}

function stopCronJob(){
  if(cronTasks){
    console.log("stopping ...");
    cronTasks.stop();

    console.log("destroying ...");

    cronTasks.destroy();
  }
}

