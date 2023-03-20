var isSearchBarInputBusy = false;
var interValTimeout = 1800000;
var intervalSeconds = 0;

function dynamicJsFixes(){
    const constantMock = window.fetch;
     window.fetch = function() {
      ////console.log(arguments);

        return new Promise((resolve, reject) => {
            constantMock.apply(this, arguments)
                .then((response) => {
                    //console.log("fetchapi response = ",response);
                    var bool = (response.url.indexOf("/search") !== -1) && isSearchBarInputBusy;
                    if(bool){
                        var inputEl = document.querySelector(".tab-content .form-horizontal .form-group input[name='all_text'][type='text']");
                        if(inputEl.parentElement.classList.contains("has-loader")){
                            isSearchBarInputBusy = false;
                            inputEl.parentElement.classList.remove("has-loader");
                        }
                    }
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                    //console.error("fetchapi error = ", error);
                })
        });
    }

    var inputEventListener = function(event){
        var evTarget = event.target;
        if(evTarget.matches(".tab-content .form-horizontal .form-group input[name='all_text'][type='text']")){
            evTarget.parentElement.classList.add("has-loader");
            isSearchBarInputBusy = true;
            //console.log("starting request !");
        }
    }

    var mouseoverEventListener = function(event){
        var evTarget = event.target;
        var anchorEl;

        //console.log("mouseoverEventListener evTarget = ", evTarget);

        if(evTarget.matches(".sidebar-menu > .treeview")){
            anchorEl = evTarget.firstElementChild;
        }
        else if(evTarget.matches(".sidebar-menu > .treeview > a")){
            anchorEl = evTarget;
        }

        if(anchorEl){
            if(!anchorEl.parentElement.classList.contains("menu-open")){
                //anchorEl.click();
                anchorEl.parentElement.classList.add("menu-open");
                anchorEl.classList.add("custom-open");
                anchorEl.parentElement.querySelector(".treeview-menu").style.top = anchorEl.getBoundingClientRect().top + "px";
            }
        }
    }

var mouseenterEventListener = function(event){
        var evTarget = event.target;
        var anchorEl;

        //console.log("mouseenterEventListener evTarget = ", evTarget);

        if(evTarget.matches(".sidebar-menu > .treeview")){
            anchorEl = evTarget.firstElementChild;
        }
        else if(evTarget.matches(".sidebar-menu > .treeview > a")){
            anchorEl = evTarget;
        }

        if(anchorEl){
            if(!anchorEl.parentElement.classList.contains("menu-open")){
                //anchorEl.click();
                anchorEl.parentElement.classList.add("menu-open");
                anchorEl.classList.add("custom-open");
                anchorEl.parentElement.querySelector(".treeview-menu").style.top = anchorEl.getBoundingClientRect().top + "px";
            }
        }
    }

    var mouseleaveEventListener = function(event){
        var evTarget = event.target;
        var anchorEl;
        //console.log("mouseleaveEventListener evTarget = ", evTarget);

        if(evTarget.matches(".sidebar-menu > .treeview")){
            anchorEl = evTarget.firstElementChild;
        }

        /*else if(evTarget.matches(".sidebar-menu > .treeview > ")){
            anchorEl = evTarget.firstElementChild;
        }*/

        if(anchorEl){
            if(anchorEl.parentElement.classList.contains("menu-open")){
                anchorEl.parentElement.classList.remove("menu-open");
                anchorEl.classList.remove("custom-open");
                anchorEl.parentElement.querySelector(".treeview-menu").style.top = "";
            }
        }
    }

    var mouseoutEventListener = function(event){
        var evTarget = event.target;
        var anchorEl;
        //console.log("mouseoutEventListener evTarget = ", evTarget);

        if(evTarget.matches(".sidebar-menu > .treeview")){
            anchorEl = evTarget.firstElementChild;
        }

        /*else if(evTarget.matches(".sidebar-menu > .treeview > ")){
            anchorEl = evTarget.firstElementChild;
        }*/

        if(anchorEl){
            if(anchorEl.parentElement.classList.contains("menu-open")){
                anchorEl.parentElement.classList.remove("menu-open");
                anchorEl.classList.remove("custom-open");
                anchorEl.parentElement.querySelector(".treeview-menu").style.top = "";
            }
        }
    }

    var asideScrollEventLostener = function(event){
        var evTarget = event.target;
        var anchorEl;

        var treeviewEl = evTarget.querySelector(".sidebar-menu > .treeview.menu-open");
        if(treeviewEl){
            var subTreeviewEl = treeviewEl.querySelector(".treeview-menu"); 
            subTreeviewEl.style.top = treeviewEl.getBoundingClientRect().top + "px";
        }

        //console.log("mouseoutEventListener evTarget = ", evTarget);

        if(evTarget.matches(".sidebar-menu > .treeview")){
            anchorEl = evTarget.firstElementChild;
        }

        /*else if(evTarget.matches(".sidebar-menu > .treeview > ")){
            anchorEl = evTarget.firstElementChild;
        }*/

        if(anchorEl){
            if(anchorEl.parentElement.classList.contains("menu-open")){
                anchorEl.parentElement.classList.remove("menu-open");
                anchorEl.classList.remove("custom-open");
                anchorEl.parentElement.querySelector(".treeview-menu").style.top = "";
            }
        }
    }

    document.addEventListener("input",inputEventListener);

    var waitForElementsInterval = setInterval(()=>{
        intervalSeconds+=500;
        var treeviewEls = document.querySelectorAll(".sidebar-menu > .treeview");
        var asideEl = document.querySelector(".main-header + aside");
        //console.log("waitForElementsInterval call !");
        if(treeviewEls.length && asideEl){
            treeviewEls.forEach((el)=>{
                el.addEventListener("mouseenter", mouseenterEventListener);
            });

            treeviewEls.forEach((el)=>{
                el.addEventListener("mouseleave", mouseleaveEventListener);
            });

            asideEl.addEventListener("scroll", asideScrollEventLostener);

            clearInterval(waitForElementsInterval);
        }
        if(interValTimeout < intervalSeconds){
            clearInterval(waitForElementsInterval);
        }
    },500);
}

if(document.readyState){
    dynamicJsFixes();
}
else{
    window.onload = function(){
        dynamicJsFixes();
    }
}