const rp = require("request-promise");
const { crowdTangle_url, crowdTangle_token, crowdTangle_search_url} = require("../config");

exports.extractPageId = extractPageId;
exports.getPosts = getPosts;
exports.searchPosts = searchPosts;

const pageNameReg = /facebook.com\/([^\/\?]+)[\/\?]?/;

function extractPageId(url) {
  const pageName = url.match(pageNameReg)[1];

  console.debug("[DEBUG] getting Id of " + pageName);
  return pageName
}

async function getPosts({pageId, next}, cb){
  try {
    next = next || crowdTangle_url + "token=" + crowdTangle_token + "&accounts=" + pageId;
    let result = await rp({
      uri: next,
      method: "GET"
    })
    result= JSON.parse(result);
    console.log(JSON.stringify(result, null, 4))
    if(result.result){
      const posts = result.result.posts;
    next = result.result.pagination.nextPage;
    cb(null, posts, next);
  }else{
    cb(new Error("Page is not available"))
  }
    
    
  } catch (error) {
    cb(error)
  }
}

async function searchPosts({pageId, next}, cb){
  try {
    console.log("url crowdsearch", crowdTangle_search_url)
    let url = encodeURI(crowdTangle_search_url + "token=" + crowdTangle_token + "&searchTerm=" + pageId);
    next = next || url;
    let result = await rp({
      uri: next,
      method: "GET"
    })
    result= JSON.parse(result);
    console.log(JSON.stringify(result, null, 4))
    if(result.result){
      const posts = result.result.posts;
    next = result.result.pagination.nextPage;
    cb(null, posts, next);
  }else{
    cb(new Error("Page is not available"))
  }
    
    
  } catch (error) {
    cb(error)
  }
}