
window.onload = function(){
    chrome.runtime.getBackgroundPage(function(bk){
        let old_filter = JSON.parse(JSON.stringify(bk.global.config.filter));
        let app = new Vue({
            el:"#app",
            data:function(){
                return {
                    form:{
                        filter:old_filter
                    }
                }
            },
            methods:{
                changeFilter(){
                    bk.global.config.filter = this.form.filter.split(",");
                }
            }
        });
    });
}
