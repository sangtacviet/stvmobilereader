class ComicProvider {
    baseUrl = "";
    domain = "";
    name = "";
    description = "";
    headers = {};
    async getImgs(url){}
    async getInfo(url){}
    async getToc(url){}
    async getImages(url){
        return await this.getImgs(url);
    }
    async getTabs(){}
    async getComicList(url, page = 0){}
    fixChapterName(name){
        return name.replace(/Thứ (.*?) lời nói/i,"Chap $1");
    }
}
try{
    window.console;
}catch(e){
    globalThis.window = globalThis;
    if(!window.fetch && require){
	console.log("polyfill for fetch");
        var https = require("https");
        var http = require("http");
        var zlib = require("zlib");
        window.fetch = async function(url, options = {}){
            var isUseHttps = url.match(/^https/);
            return new Promise((resolve, reject) => {
                var req = (isUseHttps?https:http).request({
                    hostname: new URL(url).hostname,
                    path: new URL(url).pathname + new URL(url).search,
                    headers: options.headers || {},
                    method: options.method || "GET"
                }, res => {
                    var data = [];
                    var isGzip = res.headers["content-encoding"] == "gzip";
                    res.on("data", d => {
                        data.push(d);
                    });
                    res.on("end", () => {
                        data = Buffer.concat(data);
                        var ret = {
                            headers: {
                                get: function(name){
                                    return res.headers[name];
                                }
                            },
                            text: async function(){
                                return data;
                            },
                            json: async function(){
                                return JSON.parse(data);
                            }
                        }
                        if(isGzip){
                            zlib.gunzip(data, (err, result) => {
                                if(err) reject(err);
                                data = result.toString("utf-8");
                                resolve(ret);
                            });
                        }
                        else{
                            data = data.toString("utf-8");
                            resolve(ret);
                        }
                    });
                    res.on("error", reject);
                });
                if(options.body){
                    req.write(options.body);
                }
                req.end();
            });
        }
    }
}
var AutoHttp = {
    get: async function(url, headers = {}) {
        if(window.Capacitor && Capacitor.Plugins.Http){
            return (await Capacitor.Plugins.Http.get({
                url: url,
                headers: headers
            })).data;
        }
        return await fetch(url, {
            headers: headers
        }).then(res => {
            // check if json
            if(res.headers.get("content-type").match(/application\/json/)){
                return res.json();
            }
            return res.text();
        });
    },
    params2Object: function(params){
        var obj = {};
        params.split("&").forEach(e => {
            var p = e.split("=");
            obj[p[0]] = decodeURIComponent(p[1]);
        });
        return obj;
    },
    post: async function(url, data, headers = {}) {
        var contentType = headers["Content-Type"] || headers["content-type"];
        if(window.Capacitor && Capacitor.Plugins.Http){
            if(contentType.match(/form-urlencoded/) && typeof data == "string"){
                data = this.params2Object(data);
            }
            return (await Capacitor.Plugins.Http.request({
                method: "POST",
                url: url,
                headers: headers,
                data: data
            })).data;
        }
        return await fetch(url, {
            method: "POST",
            body: data,
            headers: headers
        }).then(res => {
            // check if json
            if(res.headers.get("content-type").match(/application\/json/)){
                return res.json();
            }
            return res.text();
        });
    }
}

class Kuaikanmanhua extends ComicProvider {
    domain = "kuaikanmanhua.com";
    baseUrl = "https://www.kuaikanmanhua.com";
    name = "Kuaikanmanhua";
    description = "Đọc truyện Kuaikanmanhua";
    async getImgs(url) {
        if(!url.match(/\/web\/comic\/\d+/)) throw new Error("URL không hợp lệ");
        let html = await AutoHttp.get(url);
        var r = /<script>window.__NUXT__=(.+)<\/script>/g;
        var m = r.exec(html);
        if(!m) throw new Error("Không tìm thấy dữ liệu");
        r = /https:[^"]+\?sign=[abcedf\d]+&t=[abcedf\d]+/g;
        var list = [];
        var m2;
        while(m2 = r.exec(m[1])){
            list.push(m2[0].replace(/\\u002F/g,"/"));
        }
        return list;
    }
    async getTabs(){
        return [
            {
                "url": "https://www.kuaikanmanhua.com/tag/0?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Toàn bộ "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/20?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Yêu nhau "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/46?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Cổ phong "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/80?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Xuyên qua "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/77?region=1&pays=0&state=0&sort=1&page=1",
                "name": "Nữ chính "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/47?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Thanh xuân "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/92?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Phi nhân loại "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/22?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Kỳ huyễn "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/48?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Đô thị "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/52?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Tổng giám đốc "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/82?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Mạnh kịch bản "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/63?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Huyền huyễn "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/86?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Hệ thống "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/65?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Huyền nghi "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/91?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Tận thế "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/67?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Nhiệt huyết "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/62?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Manh hệ "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/71?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Khôi hài "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/89?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Trùng sinh "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/68?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Dị năng "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/93?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Mạo hiểm "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/85?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Võ hiệp "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/72?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Thi đấu "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/54?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Chính năng lượng "
            }
        ];
    }
    async searchComic(keyword, page = 0){
        return new MKuaikanmanhua().searchComic(keyword, page);
    }
    async getComicList(url, page = 0){
        return new MKuaikanmanhua().getComicList(url, page);
    }
    async getComicInfo(url){
        return new MKuaikanmanhua().getComicInfo(url);
    }
}
class MKuaikanmanhua extends ComicProvider {
    domain = "m.kuaikanmanhua.com";
    baseUrl = "https://m.kuaikanmanhua.com";
    name = "Kuaikanmanhua";
    description = "Đọc truyện Kuaikanmanhua";
    async getImgs(url) {
        if(!url.match(/\/mobile\/comics\/\d+/)) throw new Error("URL không hợp lệ");
        var chapterId = url.match(/\/mobile\/comics\/(\d+)/)[1];
        let html = await AutoHttp.get("https://www.kuaikanmanhua.com/web/comic/"+chapterId+"/");
        var r = /<script>window.__NUXT__=(.+)<\/script>/g;
        var m = r.exec(html);
        if(!m) throw new Error("Không tìm thấy dữ liệu");
        r = /https:[^"]+\?sign=[abcedf\d]+&t=[abcedf\d]+/g;
        var list = [];
        var m2;
        while(m2 = r.exec(m[1])){
            list.push(m2[0].replace(/\\u002F/g,"/"));
        }
        return list;
    }
    async getTabs(){
        return [
            {
                "url": "https://www.kuaikanmanhua.com/tag/0?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Toàn bộ "
            },
            {
                "url": "history",
                "name": "Lịch sử "
            },
            {
                "url": "search",
                "name": "Tìm kiếm"
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/20?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Yêu nhau "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/46?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Cổ phong "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/80?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Xuyên qua "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/77?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Lớn nữ chính "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/47?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Thanh xuân "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/92?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Phi nhân loại "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/22?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Kỳ huyễn "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/48?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Đô thị "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/52?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Tổng giám đốc "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/82?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Mạnh kịch bản "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/63?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Huyền huyễn "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/86?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Hệ thống "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/65?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Huyền nghi "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/91?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Tận thế "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/67?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Nhiệt huyết "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/62?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Manh hệ "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/71?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Khôi hài "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/89?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Trùng sinh "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/68?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Dị năng "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/93?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Mạo hiểm "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/85?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Võ hiệp "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/72?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Thi đấu "
            },
            {
                "url": "https://www.kuaikanmanhua.com/tag/54?region=1&pays=0&state=0&sort=1&page=1",
                "name": " Chính năng lượng "
            }
        ];
    }
    async searchComic(keyword, page = 0){
        if(page>0){
            return [];
        }
        var url = `https://www.kuaikanmanhua.com/search/web/complex?q=a${encodeURIComponent(keyword)}&f=3`;
        var html = await AutoHttp.get(url);
        var data = html.data ? html.data : JSON.parse(html).data;
        
        return translateObject(data.topics.hit.map(e => {
            return {
                "url": `https://www.kuaikanmanhua.com/web/topic/${e.id}`,
                "name": e.title,
                "thumb": e.vertical_image_url
            };
        }));
    }
    async getComicList(url, page = 0){
        if(url == "search"){
            return await this.searchComic(app.comicReader.currentSearchKeyword, page);
        }
        if(url == "history"){
            return await app.comicReader.getReadHistory(page);
        }
        var tag = url.match(/tag\/(\d+)/)[1];
        page = page + 1;
        var api = `https://www.kuaikanmanhua.com/search/mini/topic/multi_filter?page=${page}&size=48&tag_id=${tag}&update_status=0&pay_status=0&label_dimension_origin=1&sort=1`;
        var html = await AutoHttp.get(api);
        var data = html.hits;
        if(!data){
            data = JSON.parse(html).hits;
        }
        return translateObject(data.topicMessageList.map(e => {
            return {
                "url": `https://www.kuaikanmanhua.com/web/topic/${e.id}`,
                "name": e.title,
                "thumb": e.vertical_image_url
            };
        }));
    
    }
    async getComicInfo(url){
        var id = url.match(/\/web\/topic\/(\d+)/)[1];
        var data = await AutoHttp.get(`https://www.kuaikanmanhua.com/v2/pweb/topic/${id}`);
        data = data.data ? data.data : JSON.parse(data).data;
        data = data.topic_info;
        return translateObject({
            "url": url,
            "name": data.title,
            "chapters": data.comics.filter(c=>c.is_free).map(c=>{return {
                url: `https://www.kuaikanmanhua.com/webs/comic-next/` + c.id,
                name: c.title
            }}),
            "thumb": data.vertical_image_url,
            "desc": data.description,
            "tags": data.tags,
            "languageHint": "zh",
        });
    }
}
class BaoziManhua extends ComicProvider {
    domain = "www.baozimh.com";
    baseUrl = "https://www.baozimanhua.com";
    name = "BaoziManhua";
    description = "Đọc truyện BaoziManhua";
    async getImgs(url) {
        //https://www.hbmanga.com/comic/chapter/yaoshenji-taxuedongman/0_814.html
        if(!url.match(/\/comic\/chapter\//)) throw new Error("URL không hợp lệ");
        let html = await AutoHttp.get(`https://sangtacviet.vip/comicloader.php?url=${url}`);
        var json = JSON.parse(html);
        return json.map(e => e.url);
    }
    async getTabs(){
        return [
            {
                "url": "https://www.baozimh.com/classify?type=all&region=all&state=all&filter=%2a",
                "name": "Toàn bộ"
            },
            {
                "url": "history",
                "name": "Lịch sử"
            },
            {
                "url": "search",
                "name": "Tìm kiếm"
            },
            {
                "url": "https://www.baozimh.com/classify?type=all&region=cn&state=all&filter=%2a",
                "name": "Manhua"
            },
            {
                "url": "https://www.baozimh.com/classify?type=all&region=jp&state=all&filter=%2a",
                "name": "Manga"
            },
            {
                "url": "https://www.baozimh.com/classify?type=all&region=kr&state=all&filter=%2a",
                "name": "Manhwa"
            },
            {
                "url": "https://www.baozimh.com/classify?type=all&region=en&state=all&filter=%2a",
                "name": "Comic"
            },
            {
                "url": "https://www.baozimh.com/classify?type=lianai&region=all&state=all&filter=%2a",
                "name": "Luyến ái"
            },
            {
                "url": "https://www.baozimh.com/classify?type=chunai&region=all&state=all&filter=%2a",
                "name": "Thuần ái"
            },
            {
                "url": "https://www.baozimh.com/classify?type=gufeng&region=all&state=all&filter=%2a",
                "name": "Cổ phong"
            },
            {
                "url": "https://www.baozimh.com/classify?type=yineng&region=all&state=all&filter=%2a",
                "name": "Dị năng"
            },
            {
                "url": "https://www.baozimh.com/classify?type=xuanyi&region=all&state=all&filter=%2a",
                "name": "Huyền nghi"
            },
            {
                "url": "https://www.baozimh.com/classify?type=juqing&region=all&state=all&filter=%2a",
                "name": "Trinh thám"
            },
            {
                "url": "https://www.baozimh.com/classify?type=kehuan&region=all&state=all&filter=%2a",
                "name": "Khoa huyễn"
            },
            {
                "url": "https://www.baozimh.com/classify?type=qihuan&region=all&state=all&filter=%2a",
                "name": "Kỳ huyễn"
            },
            {
                "url": "https://www.baozimh.com/classify?type=xuanhuan&region=all&state=all&filter=%2a",
                "name": "Huyền huyễn"
            },
            {
                "url": "https://www.baozimh.com/classify?type=chuanyue&region=all&state=all&filter=%2a",
                "name": "Xuyên qua"
            },
            {
                "url": "https://www.baozimh.com/classify?type=mouxian&region=all&state=all&filter=%2a",
                "name": "Mạo hiểm"
            },
            {
                "url": "https://www.baozimh.com/classify?type=tuili&region=all&state=all&filter=%2a",
                "name": "Suy luận"
            },
            {
                "url": "https://www.baozimh.com/classify?type=wuxia&region=all&state=all&filter=%2a",
                "name": "Võ hiệp"
            },
            {
                "url": "https://www.baozimh.com/classify?type=gedou&region=all&state=all&filter=%2a",
                "name": "Cách đấu"
            },
            {
                "url": "https://www.baozimh.com/classify?type=zhanzheng&region=all&state=all&filter=%2a",
                "name": "Chiến tranh"
            },
            {
                "url": "https://www.baozimh.com/classify?type=rexie&region=all&state=all&filter=%2a",
                "name": "Nhiệt huyết"
            },
            {
                "url": "https://www.baozimh.com/classify?type=gaoxiao&region=all&state=all&filter=%2a",
                "name": "Khôi hài"
            },
            {
                "url": "https://www.baozimh.com/classify?type=danuzhu&region=all&state=all&filter=%2a",
                "name": "Nữ chính"
            },
            {
                "url": "https://www.baozimh.com/classify?type=dushi&region=all&state=all&filter=%2a",
                "name": "Đô thị"
            },
            {
                "url": "https://www.baozimh.com/classify?type=zongcai&region=all&state=all&filter=%2a",
                "name": "Tổng mạn"
            },
            {
                "url": "https://www.baozimh.com/classify?type=hougong&region=all&state=all&filter=%2a",
                "name": "Hậu cung"
            },
            {
                "url": "https://www.baozimh.com/classify?type=richang&region=all&state=all&filter=%2a",
                "name": "Thường ngày"
            },
            {
                "url": "https://www.baozimh.com/classify?type=hanman&region=all&state=all&filter=%2a",
                "name": "Manhwa"
            },
            {
                "url": "https://www.baozimh.com/classify?type=shaonian&region=all&state=all&filter=%2a",
                "name": "Shounen"
            },
            {
                "url": "https://www.baozimh.com/classify?type=qita&region=all&state=all&filter=%2a",
                "name": "Khác"
            }
        ];
    }
    async searchComic(keyword, page = 0){
        if(page>0){
            return [];
        }
        var url = `https://www.baozimh.com/search?q=${encodeURIComponent(keyword)}`;
        var html = await AutoHttp.get(url);
        var regex = /<a href="\/comic\/(.*?)" title="(.*?)"/g;
        var getThumbUrl = (url) => {
            return `https://static-tw.baozimh.com/cover/${url}.jpg?w=285&h=375&q=100`;
        };
        var list = [];
        var m;
        while(m = regex.exec(html)){
            list.push({
                "url": `https://www.baozimh.com/comic/${m[1]}`,
                "name": m[2],
                "thumb": getThumbUrl(m[1])
            });
        }
        return translateObject(list);
    }
    async getComicList(url, page = 0){
        if(url == "search"){
            return await this.searchComic(app.comicReader.currentSearchKeyword, page);
        }
        if(url == "history"){
            return await app.comicReader.getReadHistory(page);
        }
        var type = url.match(/type=(\w+)/)[1];
        var region = url.match(/region=(\w+)/)[1];
        var api = `https://www.baozimh.com/api/bzmhq/amp_comic_list?type=${type}&region=${region}&filter=*&page=${page}&limit=36&language=zh&__amp_source_origin=https%3A%2F%2Fwww.baozimh.com`;
        var html = await AutoHttp.get(api);
        var json = html.items;//JSON.parse(html);
        var getThumbUrl = (url) => {
            return `https://static-tw.baozimh.com/cover/${url}?w=285&h=375&q=100`;
        };
        return translateObject(json.map(e => {
            return {
                "url": `https://www.baozimh.com/comic/${e.comic_id}`,
                "name": e.name,
                "thumb": getThumbUrl(e.topic_img)
            };
        }));
    }
    async getComicInfo(url){
        var html = await AutoHttp.get(url);
        var regex = {
            name: /name="og:novel:book_name" content="(.+?)"/,
            //<a href="/user/page_direct?comic_id=zuiqiangfantaoluxitong-chuyingshe&amp;section_slot=0&amp;chapter_slot=634" rel="noopener" class="comics-chapters__item" data-v-057bf087><div style="flex: 1;" data-v-057bf087><span data-v-057bf087>630兩大仙帝</span>
            chapters: /<a href="\/user\/page_direct\?comic_id=[^"]+&amp;section_slot=\d+&amp;chapter_slot=(\d+)".*?><span.*?>([^<]+)<\/span>/g,
            desc: /<meta [^>]*?name="description" content="(.+?)"/,
            tags: /<span class="tag".*?>([^<]+)<\/span>/g
        };
        var m;
        var chapters = [];
        var after = html.substring(html.indexOf("章節目錄"));
        var index = 0;
        while(m = regex.chapters.exec(after)){
            index++;
            chapters.push({
                "url": `https://www.baozimh.com/` + m[0].match(/<a href="([^"]+)"/)[1].replace(/&amp;/g,"&"),
                "name": "["+index+"] "+ this.fixChapterName(m[2])
            });
        }
        var sluggedname = url.match(/\/comic\/([^\/]+)/)[1];
        var transModeHint = "perpair";
        var tags = html.match(regex.tags).map(e => e.replace(/<[^>]+>/g,"").trim());
        if(tags.indexOf("日本") > -1) transModeHint = "perpage";
        return translateObject({
            "url": url,
            "name": regex.name.exec(html)[1],
            "chapters": chapters,
            "thumb": `https://static-tw.baozimh.com/cover/${sluggedname}.jpg?w=285&h=375&q=100`,
            "desc": regex.desc.exec(html) ? regex.desc.exec(html)[1] : "",
            "tags": Array.from(tags),
            "languageHint": "zh",
            "transModeHint": transModeHint
        });
    }
}
class YemanComic extends ComicProvider {
    domain = "www.yemancomic.com";
    baseUrl = "https://www.yemancomic.com";
    name = "YemanComic";
    description = "Đọc truyện YemanComic";
    headers = {
        "Referer": "https://www.yemancomic.com/",
        "User-Agent": "Mozilla/5.0 (Linux; Android 11.0; Surface Duo) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36"
    };
    async getImgs(url) {
        //https://www.hbmanga.com/comic/chapter/yaoshenji-taxuedongman/0_814.html
        if(!url.match(/\/comic\/chapter\//)) throw new Error("URL không hợp lệ");
        let html = await AutoHttp.get(`https://sangtacviet.vip/comicloader.php?url=${url}`, this.headers);
        var json = JSON.parse(html);
        return json.map(e => e.url);
    }
    async searchComic(keyword, page = 0){
        if(page > 0){
            return [];
        }
        var url = `https://yemancomic.com/api/front/index/search?key=${encodeURIComponent(keyword)}`;
        var data = await AutoHttp.get(url, this.headers);
        if(!data.data){
            data = JSON.parse(data);
        }
        var list = data.data.map(e => {
            return {
                "url": `https://www.yemancomic.com/book/${e.id}/`,
                "name": e.name,
                "thumb": e.cover
            };
        });
        return translateObject(list);
    }
    async getTabs(){
        return [
            {
                "url": "/comiclists/9/全部/3/1.html",
                "name": "Toàn bộ"
            },
            {
                "url": "history",
                "name": "Lịch sử"
            },
            {
                "url": "search",
                "name": "Tìm kiếm"
            },
            {
                "url": "/comiclists/9/长条/3/1.html",
                "name": "Thơ dài"
            },
            {
                "url": "/comiclists/9/大女主/3/1.html",
                "name": "Nữ chính"
            },
            {
                "url": "/comiclists/9/百合/3/1.html",
                "name": "Bách hợp"
            },
            {
                "url": "/comiclists/9/耽美/3/1.html",
                "name": "Đam mỹ"
            },
            {
                "url": "/comiclists/9/纯爱/3/1.html",
                "name": "Thuần ái"
            },
            {
                "url": "/comiclists/9/後宫/3/1.html",
                "name": "Hậu cung"
            },
            {
                "url": "/comiclists/9/韩漫/3/1.html",
                "name": "Manhwa"
            },
            {
                "url": "/comiclists/9/奇幻/3/1.html",
                "name": "Kỳ huyễn"
            },
            {
                "url": "/comiclists/9/轻小说/3/1.html",
                "name": "Light novel"
            },
            {
                "url": "/comiclists/9/生活/3/1.html",
                "name": "Sinh hoạt"
            },
            {
                "url": "/comiclists/9/悬疑/3/1.html",
                "name": "Huyền nghi"
            },
            {
                "url": "/comiclists/9/格斗/3/1.html",
                "name": "Cách đấu"
            },
            {
                "url": "/comiclists/9/搞笑/3/1.html",
                "name": "Khôi hài"
            },
            {
                "url": "/comiclists/9/伪娘/3/1.html",
                "name": "Ngụy nương"
            },
            {
                "url": "/comiclists/9/竞技/3/1.html",
                "name": "Cạnh kỹ"
            },
            {
                "url": "/comiclists/9/职场/3/1.html",
                "name": "Công sở"
            },
            {
                "url": "/comiclists/9/萌系/3/1.html",
                "name": "Cute"
            },
            {
                "url": "/comiclists/9/冒险/3/1.html",
                "name": "Mạo hiểm"
            },
            {
                "url": "/comiclists/9/治愈/3/1.html",
                "name": "Chữa trị"
            },
            {
                "url": "/comiclists/9/都市/3/1.html",
                "name": "Đô thị"
            },
            {
                "url": "/comiclists/9/霸总/3/1.html",
                "name": "Giám đốc"
            },
            {
                "url": "/comiclists/9/神鬼/3/1.html",
                "name": "Quỷ thần"
            },
            {
                "url": "/comiclists/9/侦探/3/1.html",
                "name": "Thám tử"
            },
            {
                "url": "/comiclists/9/爱情/3/1.html",
                "name": "Tình ái"
            },
            {
                "url": "/comiclists/9/古风/3/1.html",
                "name": "Cổ phong"
            },
            {
                "url": "/comiclists/9/欢乐向/3/1.html",
                "name": "Giải trí"
            },
            {
                "url": "/comiclists/9/科幻/3/1.html",
                "name": "Khoa huyễn"
            },
            {
                "url": "/comiclists/9/穿越/3/1.html",
                "name": "Xuyên việt"
            },
            {
                "url": "/comiclists/9/性转换/3/1.html",
                "name": "Tính chuyển"
            },
            {
                "url": "/comiclists/9/校园/3/1.html",
                "name": "Sân trường"
            },
            {
                "url": "/comiclists/9/美食/3/1.html",
                "name": "Mỹ thực"
            },
            {
                "url": "/comiclists/9/悬疑/3/1.html",
                "name": "Huyền nghi"
            },
            {
                "url": "/comiclists/9/剧情/3/1.html",
                "name": "Drama"
            },
            {
                "url": "/comiclists/9/热血/3/1.html",
                "name": "Nhiệt huyết"
            },
            {
                "url": "/comiclists/9/节操/3/1.html",
                "name": "Tiết tháo"
            },
            {
                "url": "/comiclists/9/励志/3/1.html",
                "name": "Cố gắng"
            },
            {
                "url": "/comiclists/9/异世界/3/1.html",
                "name": "Dị thế giới"
            },
            {
                "url": "/comiclists/9/历史/3/1.html",
                "name": "Lịch sử"
            },
            {
                "url": "/comiclists/9/战争/3/1.html",
                "name": "Chiến tranh"
            },
            {
                "url": "/comiclists/9/恐怖/3/1.html",
                "name": "Kinh dị"
            },
            {
                "url": "/comiclists/9/霸总/3/1.html",
                "name": "Giám đốc"
            },
            {
                "url": "/comiclists/1/全部/3/1.html",
                "name": "Manga"
            },
            {
                "url": "/comiclists/2/全部/3/1.html",
                "name": "Hong Kong"
            },
            {
                "url": "/comiclists/3/全部/3/1.html",
                "name": "Comic"
            },
            {
                "url": "/comiclists/4/全部/3/1.html",
                "name": "Manhua"
            },
            {
                "url": "/comiclists/5/全部/3/1.html",
                "name": "Manhwa"
            },
            {
                "url": "/comiclists/6/全部/3/1.html",
                "name": "Chưa phân loại"
            }
        ];
    }
    async getComicList(url, page = 0){
        if(url == "search"){
            return await this.searchComic(app.comicReader.currentSearchKeyword, page);
        }
        if(url == "history"){
            return await app.comicReader.getReadHistory(page);
        }
        page = page + 1;
        var url = `https://www.yemancomic.com${url}`.replace("/1.html",`/${page}.html`);
        var html = await AutoHttp.get(url, this.headers);
        // var regex = /<li class="acgn-item[^"]+" onmouseover="get_content\(\d+,'([^']+)','([^']+)','([^']+)','([^']+)','([^']+)','([^']+)'/g;
        // var m;
        // var list = [];
        // while(m = regex.exec(html)){
        //     list.push({
        //         "url": `https://www.yemancomic.com${m[3]}`,
        //         "name": m[1],
        //         "thumb": m[4]
        //     });
        // }
        var dom = new DOMParser().parseFromString(html, "text/html");
        if(dom.querySelector(".acgn-item")){
            var list = Array.from(dom.querySelectorAll(".acgn-item")).map(e => {
                return {
                    "url": `https://www.yemancomic.com${e.querySelector("a").getAttribute("href")}`,
                    "name": e.querySelector("a").title,
                    "thumb": e.querySelector("img").src
                };
            });
            return translateObject(list);
        }
        if(dom.querySelector(".item.comic-item")){
            var list = Array.from(dom.querySelectorAll(".item.comic-item")).map(e => {
                return {
                    "url": `https://www.yemancomic.com${e.querySelector("a").getAttribute("href")}`,
                    "name": e.querySelector("a").title,
                    "thumb": e.querySelector("img").src
                };
            });
            return translateObject(list);
        }
    }
    async getComicInfo(url){
        var html = await AutoHttp.get(url, this.headers);
        var regex = {
            name: /property="og:novel:book_name" content="(.+?)"/,
            /**<li class="item " data-id="18" data-chapter="770640"><a title="第18话" href="/chapter/7688/770640.html" target="_self"><p class="name"><i class="j_chapter_badge "></i>第18话</p></a></li> */
            //chapters: /<li class="item (?:lock acgn-hide)?" data-id.*?a title="(.*?)" href="(\/chapter\/\d+\/\d+\.html)"/g,
            chapters: /<a class="comic-chapter-link" href="(\/chapter\/\d+\/\d+\.html)".*?title="(.*?)"/sg,
            desc: /property="og:description" content="(.*?)"/s,
            tags: /property="og:novel:category" content="(.*?)"/,
        };
        var m;
        var chapters = [];
        //var after = html.substring(html.indexOf("j_chapter_list"));
        var ccount = 0;
        while(m = regex.chapters.exec(html)){
            ccount++;
            chapters.push({
                "url": `https://www.yemancomic.com${m[1]}`,
                "name": "["+ccount+"] " + this.fixChapterName(m[2])
            });
        }
        return translateObject({
            "url": url,
            "name": regex.name.exec(html)[1],
            "chapters": chapters,
            "thumb": html.match(/property="og:image" content="([^"]+)"/)[1],
            "desc": regex.desc.exec(html)[1],
            "tags": regex.tags.exec(html)[1].split(",").filter(e => e)
        });
    }
}
class ManhuaSFACG extends ComicProvider {
    domain = "manhua.sfacg.com";
    baseUrl = "https://manhua.sfacg.com";
    name = "ManhuaSFACG";
    description = "Đọc truyện ManhuaSFACG";
    async getTabs(){
        return [
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=-1",
                "name": "Toàn bộ"
            },
            {
                "url": "history",
                "name": "Lịch sử"
            },
            {
                "url": "search",
                "name": "Tìm kiếm"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=1",
                "name": "Nhiệt huyết"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=2",
                "name": "Sân trường"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=3",
                "name": "Suy luận"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=4",
                "name": "Cơ chiến"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=5",
                "name": "Mạo hiểm"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=6",
                "name": "Vận động"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=7",
                "name": "Đam mỹ"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=8",
                "name": "Hài hước"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=9",
                "name": "Khoa huyễn"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=10",
                "name": "Ma huyễn"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=11",
                "name": "Kinh dị"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=12",
                "name": "Xã hội"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=13",
                "name": "Tình yêu"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=14",
                "name": "Võ hiệp"
            },
            {
                "url": "https://manhua.sfacg.com/catalog/default.aspx?tid=15",
                "name": "Ôn hòa"
            },
        ];
    }
    async searchComic(keyword, page = 0){
        if(page>1){
            return [];
        }
        var url = `https://s.sfacg.com/?Key=${encodeURIComponent(keyword)}&S=&SS=`;
        var html = await AutoHttp.get(url);
        var regex = /<img src="\/\/rs.sfacg.com\/web\/comic\/images\/Logo\/(.*?)".*?<strong class="F14PX"><a href="(.*?)" id="SearchResultList1___ResultList_LinkInfo_1" class="orange_link2">(.*?)<\/a><\/strong>/gs;
        
        var list = [];
        var m;
        while(m = regex.exec(html)){
            list.push({
                url: `https:${m[2]}`,
                name: m[3],
                thumb: `https://rs.sfacg.com/web/comic/images/Logo/${m[1]}`
            });
        }
        return translateObject(list);
    }
    async getComicList(url, page = 1){
        if(url == "search"){
            return await this.searchComic(app.comicReader.currentSearchKeyword, page);
        }
        if(url == "history"){
            return await app.comicReader.getReadHistory(page);
        }
        url += "&PageIndex=" + page;
        var html = await AutoHttp.get(url);
        var regex = /<img src="\/\/rs.sfacg.com\/web\/comic\/images\/Logo\/(.*?)".*?<strong class="F14PX"><a href="(.*?)" class="orange_link2">(.*?)<\/a><\/strong>/gs;
        var m;
        var list = [];
        while(m = regex.exec(html)){
            list.push({
                url: `https:${m[2]}`,
                name: m[3],
                thumb: `https://rs.sfacg.com/web/comic/images/Logo/${m[1]}`
            });
        }
        return translateObject(list);
    }
    async getComicInfo(url){
        var html = await AutoHttp.get(url);
        var regex = {
            info: /<img src="(?:https:)?\/\/rs.sfacg.com\/web\/comic\/images\/Logo\/(.*?)".*?<span>(.*?)<\/span><br \/>(.*?)<span.*?作品类型：<\/span>(.*?)<br \/>/su,
            id: /var cid = (\d+);/,
            tags: /<a href="#">(.*?)<\/a>/g
        };
        var id = regex.id.exec(html)[1];
        var chapters = await AutoHttp.get(STV_SERVER + "/open/sfacg/gateway.php?api=getcomicchapterlist&id=" + id);
        var info = regex.info.exec(html);
        return translateObject({
            "url": url,
            "name": info[2],
            "chapters": chapters,
            "thumb": `https://rs.sfacg.com/web/comic/images/Logo/${info[1]}`,
            "desc": info[3],
            "tags": Array.from(info[4].matchAll(regex.tags)).map(e => e[1]),
            "languageHint": "zh",
            "transModeHint": "perpage"
        });
    }
}
class Colamanga extends ComicProvider {
    domain = "www.colamanga.com";
    baseUrl = "https://www.colamanga.com";
    name = "Colamanga";
    description = "Đọc truyện Colamanga";
    proxyUrl = "https://comic.sangtacvietcdn.xyz/proxy4colamanga.php?url=";
    getProxyLink(url){
        return this.proxyUrl + encodeURIComponent(url);
    }
    async getTabs(){
        return [
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount",
                    "name": "Toàn bộ"
                },
                {
                    "url": "history",
                    "name": "Lịch sử"
                },
                {
                    "url": "search",
                    "name": "Tìm kiếm"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=update",
                    "name": "Mới cập nhật"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10023",
                    "name": "Nhiệt huyết"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10024",
                    "name": "Huyền huyễn"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10126",
                    "name": "Yêu nhau"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10210",
                    "name": "Mạo hiểm"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10143",
                    "name": "Cổ phong"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10124",
                    "name": "Đô thị"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10129",
                    "name": "Xuyên qua"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10242",
                    "name": "Kỳ huyễn"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10560",
                    "name": "Khác"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10122",
                    "name": "Khôi hài"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10641",
                    "name": "Thiếu nam"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10309",
                    "name": "Chiến đấu"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10461",
                    "name": "Trùng sinh"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=11224",
                    "name": "Mạo hiểm nhiệt huyết"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10201",
                    "name": "Cười vang"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10943",
                    "name": "Nghịch tập"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10138",
                    "name": "Hậu cung"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10321",
                    "name": "Thiếu niên"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10301",
                    "name": "Thiếu nữ"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=12044",
                    "name": "Nhiệt huyết"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10722",
                    "name": "Hệ thống"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10125",
                    "name": "Động tác"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10131",
                    "name": "Sân trường"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=12123",
                    "name": "Mạo hiểm"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10133",
                    "name": "Tu chân"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10453",
                    "name": "Tu tiên"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10480",
                    "name": "Kịch bản"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10706",
                    "name": "Nữ chính"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10127",
                    "name": "Bá tổng"
                },
                {
                    "url": "https://www.colamanga.com/show?orderBy=weeklyCount&mainCategoryId=10142",
                    "name": "Sinh hoạt"
                }
            ]
    }
    async searchComic(keyword, page = 0){
        if(page>1){
            return [];
        }
        var url = this.getProxyLink(`https://www.colamanga.com/search?type=1&searchString=${encodeURIComponent(keyword)}`);
        var html = await AutoHttp.get(url);
        var regex = /data-original="(.*?)".*?href="(.*?)">(.*?)<\/a>/gs;
        var m;
        var list = [];
        while(m = regex.exec(html)){
            list.push({
                url: `https://www.colamanga.com${m[2]}`,
                name: m[3],
                thumb: this.getProxyLink(m[1])
            });
        }
        return translateObject(list);
    }
    async getComicList(url, page = 1){
        if(url == "search"){
            return await this.searchComic(app.comicReader.currentSearchKeyword, page);
        }
        if(url == "history"){
            return await app.comicReader.getReadHistory(page);
        }
        url += "&page=" + page;
        url = this.getProxyLink(url);
        var html = await AutoHttp.get(url);
        var regex = /data-original="(.*?)".*?href="(.*?)">(.*?)<\/a>/gs;
        var m;
        var list = [];
        while(m = regex.exec(html)){
            list.push({
                url: `https://www.colamanga.com${m[2]}`,
                name: m[3],
                thumb: this.getProxyLink(m[1])
            });
        }
        return translateObject(list);
    }
    async getComicInfo(url){
        var url2 = this.getProxyLink(url);
        var html = await AutoHttp.get(url2);
        var regex = {
            info: /og:comic:category" content(?:="(.*?)")?.*?og:comic:book_name" content="(.*?)".*?data-original="(.*?)".*?>简介<\/span>(.*?)<\/div>/su,
            chapters: /<a class="fed-btns-info fed-rims-info fed-part-eone" title="(.*?)" href="(.*?)">/g
        };
        var m;
        var chapters = [];
        var after = html;
        var ccount = 0;
        while(m = regex.chapters.exec(after)){
            chapters.push({
                "url": `https://www.colamanga.com${m[2]}`,
                "name": m[1]
            });
        }
        chapters.reverse();
        for(var i = 0; i < chapters.length; i++){
            ccount++;
            chapters[i].name = "["+ccount+"] " + chapters[i].name;
        }
        var info = regex.info.exec(html);
        return translateObject({
            "url": url,
            "name": info[2],
            "chapters": chapters,
            "thumb": this.getProxyLink(info[3]),
            "desc": info[4],
            "tags": info[1] ? info[1].split(" ") : [],
            "languageHint": "zh",
            "transModeHint": "perpair"
        });
    }
}
class YuewenDongman extends ComicProvider {
    domain = "cartoon.reader.qq.com";
    baseUrl = "https://cartoon.reader.qq.com";
    name = "Manhua Qidian";
    description = "Đọc manhua Qidian";
    static parseId(qurl){
        return qurl.match(/cid=(\d+)/)[1];
    }
    headers = {
        "c_platform": "android",
        "c_version": "qqreader_8.0.7.0888_android",
        "channel": "200001047",
        "Connection": "Keep-Alive",
        "csigs": "$2a$04$sgm6ciP7OGu2LxVn1txdz.jpQlt/tk/joWB6TATz0.4DwetT9NaLO",
        "gselect": "2",
        "Host": "commontgw.reader.qq.com",
        "mldt": "31bc4c00395d71059e0513bf41c05e53",
        "mversion": "8.0.7.890",
        "nosid": "1",
        "os": "android",
        "qrsn": "qqreader-20240318_180516",
        "qrsn_new": "3ec3331b6752bce74215f3e710001631820c",
        "rcmd": "1",
        "server_sex": "2",
        "supportTS": "3",
        "ttime": "1711122701005",
        "ua": "RMX3000#REE2ADL1#33",
        "User-Agent": "okhttp/3.12.13",
        "youngerMode": "0",
    };
    async getTabs(){
        return [
            {
                "url": "https://commontgw.reader.qq.com/v7_6_6/listDispatch?action=rank&actionTag=comics&actionId=510511&pagestamp={page}&rankFlag=4&plan=1&pageSize=200",
                "name": "Hot"
            },
            {
                "url": "history",
                "name": "Lịch sử"
            },
            {
                "url": "search",
                "name": "Tìm kiếm"
            },
        ];
    }
    async searchComic(keyword, page = 0){
        if(page>1){
            return [];
        }
        var url = `https://commontgw.reader.qq.com/common/result/search_comic?key=${encodeURIComponent(keyword)}&needFacedTags=1&needFacedCates=1&n=10&start=0&searchFrom=29261`;
        var html = await AutoHttp.get(url, this.headers);
        var json = html.cardlist || JSON.parse(html).cardlist;
        var getThumb = (id) => `https://public-1252317822.image.myqcloud.com/cover/${id}/cover.jpg`;
        return translateObject(json.map(e => {
            var id = YuewenDongman.parseId(e.info.qurl);
            return {
                "url": `https://cartoon.reader.qq.com/comic/${id}`,
                "name": e.info.audioName,
                "thumb": getThumb(id)
            };
        }));
    }
    async getComicList(url, page = 1){
        if(url == "search"){
            return await this.searchComic(app.comicReader.currentSearchKeyword, page);
        }
        if(url == "history"){
            return await app.comicReader.getReadHistory(page);
        }
        url = url.replace("{page}", page);
        var html = await AutoHttp.get(url, this.headers);
        var json = html.bookList || JSON.parse(html).bookList;
        return translateObject(json.map(e=>{
            var id = YuewenDongman.parseId(e.bookqurl);
            return {
                "url": `https://cartoon.reader.qq.com/comic/${id}`,
                "name": e.title,
                "thumb": `https://public-1252317822.image.myqcloud.com/cover/${id}/cover.jpg`
            };
        }));
    }
    async getComicInfo(url){
        var id = url.match(/\/comic\/(\d+)/)[1];
        var url2 = `https://cartoon.reader.qq.com/v7_6_6/nativepage/cartoon/preRead?comicId=${id}&sectionId=`;
        var html = await AutoHttp.get(url2);
        var data = html.data || JSON.parse(html).data;
        var info = data.cartoonInfo;
        var chapters = await AutoHttp.get(`https://cartoon.reader.qq.com/v7_6_6/nativepage/cartoon/dir?comicId=${id}&lastUpdateTime=0&lastCount=0&wd=1080`);
        var getChapterUrl = (id, fc, cc) => `https://cartoon.reader.qq.com/comic/${id}/${fc}/${cc}`;
        chapters = chapters.data || JSON.parse(chapters).data;
        chapters = chapters.fullChapterList;
        var firstChapterId = chapters[0].chid;
        var i = 0;
        chapters = chapters.map(e => {
            i++;
            return {
                "url": getChapterUrl(id, firstChapterId, e.chid),
                "name": "[" + i + "]" +e.huaTitle
            };
        });
        return translateObject({
            "url": url,
            "name": info.name,
            "chapters": chapters,
            "thumb": `https://public-1252317822.image.myqcloud.com/cover/${info.bid}/cover.jpg`,
            "desc": info.intro,
            "tags": [info.category],
            "languageHint": "zh",
            "transModeHint": "perpair"
        });
    }
}

class Manhwasco extends ComicProvider {
    domain = "manhwasco.net";
    baseUrl = "https://manhwasco.net";
    name = "Manhwasco";
    description = "Đọc manhwa Manhwasco";
    async getTabs(){
        return [
            {
                "url": "https://manhwasco.net/manga-genre/",
                "name": "Toàn bộ"
            },
            {
                "url": "history",
                "name": "Lịch sử"
            },
            {
                "url": "search",
                "name": "Tìm kiếm"
            },
            {
                "url": "https://manhwasco.net/manga-genre/action",
                "name": "Hành động"
            },
            {
                "url": "https://manhwasco.net/manga-genre/adventure",
                "name": "Mạo hiểm"
            },
            {
                "url": "https://manhwasco.net/manga-genre/fantasy",
                "name": "Huyễn tưởng"
            },
            {
                "url": "https://manhwasco.net/manga-genre/harem",
                "name": "Hậu cung"
            },
            {
                "url": "https://manhwasco.net/manga-genre/historical",
                "name": "Lịch sử"
            },
            {
                "url": "https://manhwasco.net/manga-genre/horror",
                "name": "Kinh dị"
            },
            {
                "url": "https://manhwasco.net/manga-genre/isekai",
                "name": "Xuyên không"
            },
            {
                "url": "https://manhwasco.net/manga-genre/magic",
                "name": "Phép thuật"
            },
            {
                "url": "https://manhwasco.net/manga-genre/manga",
                "name": "Manga"
            },
            {
                "url": "https://manhwasco.net/manga-genre/manhua",
                "name": "Manhua"
            },
            {
                "url": "https://manhwasco.net/manga-genre/manhwa",
                "name": "Manhwa"
            },
            {
                "url": "https://manhwasco.net/manga-genre/martial-arts",
                "name": "Võ thuật"
            },
            {
                "url": "https://manhwasco.net/manga-genre/romance",
                "name": "Tình cảm"
            },
            {
                "url": "https://manhwasco.net/manga-genre/school-life",
                "name": "Trường học"
            },
            {
                "url": "https://manhwasco.net/manga-genre/sci-fi",
                "name": "Khoa học viễn tưởng"
            },
            {
                "url": "https://manhwasco.net/manga-genre/seinen",
                "name": "Seinen"
            },
            {
                "url": "https://manhwasco.net/manga-genre/shoujo",
                "name": "Thiếu nữ"
            },
            {
                "url": "https://manhwasco.net/manga-genre/shounen",
                "name": "Thiếu niên"
            },
            {
                "url": "https://manhwasco.net/manga-genre/supernatural",
                "name": "Siêu nhiên"
            },
            {
                "url": "https://manhwasco.net/manga-genre/webtoons",
                "name": "Webtoon"
            },
        ];
    }
    async searchComic(keyword, page = 0){
        if(page>1){
            return [];
        }
        var url = `https://manhwasco.net/?s=${encodeURIComponent(keyword)}&post_type=wp-manga`;
        var html = await AutoHttp.get(url);
        var regex = /<a href="https:\/\/manhwasco.net\/manga\/(.+?)" title="(.*?)".*?(?:data-)?src="(.*?)"/gs
        var list = [];
        var m;
        while(m = regex.exec(html)){
            list.push({
                name: m[2],
                url: `https://manhwasco.net/manga/${m[1]}`,
                thumb: m[3]
            });
        }
        return list;
    }
    async getComicList(url, page = 0){
        if(url == "search"){
            return await this.searchComic(app.comicReader.currentSearchKeyword, page);
        }
        if(url == "history"){
            return await app.comicReader.getReadHistory(page);
        }
        page = page - 1;
        if(page < 0) page = 0;
        var category = url.match(/manga-genre\/(.*)/)[1];
        url = "https://manhwasco.net/wp-admin/admin-ajax.php";
        var param = `action=madara_load_more&page=${page}&template=madara-core%2Fcontent%2Fcontent-archive&vars%5Bwp-manga-genre%5D=${category}&vars%5Berror%5D=&vars%5Bm%5D=&vars%5Bp%5D=0&vars%5Bpost_parent%5D=&vars%5Bsubpost%5D=&vars%5Bsubpost_id%5D=&vars%5Battachment%5D=&vars%5Battachment_id%5D=0&vars%5Bname%5D=&vars%5Bpagename%5D=&vars%5Bpage_id%5D=0&vars%5Bsecond%5D=&vars%5Bminute%5D=&vars%5Bhour%5D=&vars%5Bday%5D=0&vars%5Bmonthnum%5D=0&vars%5Byear%5D=0&vars%5Bw%5D=0&vars%5Bcategory_name%5D=&vars%5Btag%5D=&vars%5Bcat%5D=&vars%5Btag_id%5D=&vars%5Bauthor%5D=&vars%5Bauthor_name%5D=&vars%5Bfeed%5D=&vars%5Btb%5D=&vars%5Bpaged%5D=${page}&vars%5Bmeta_key%5D=_latest_update&vars%5Bmeta_value%5D=&vars%5Bpreview%5D=&vars%5Bs%5D=&vars%5Bsentence%5D=&vars%5Btitle%5D=&vars%5Bfields%5D=&vars%5Bmenu_order%5D=&vars%5Bembed%5D=&vars%5Bignore_sticky_posts%5D=false&vars%5Bsuppress_filters%5D=false&vars%5Bcache_results%5D=true&vars%5Bupdate_post_term_cache%5D=true&vars%5Bupdate_menu_item_cache%5D=false&vars%5Blazy_load_term_meta%5D=true&vars%5Bupdate_post_meta_cache%5D=true&vars%5Bpost_type%5D=wp-manga&vars%5Bposts_per_page%5D=30&vars%5Bnopaging%5D=false&vars%5Bcomments_per_page%5D=50&vars%5Bno_found_rows%5D=false&vars%5Btaxonomy%5D=wp-manga-genre&vars%5Bterm%5D=${category}&vars%5Border%5D=desc&vars%5Borderby%5D=meta_value_num&vars%5Btemplate%5D=archive&vars%5Bsidebar%5D=right&vars%5Bpost_status%5D=publish&vars%5Bmeta_query%5D%5Brelation%5D=AND`;
        var html = await AutoHttp.post(url, param, {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        });
        var regex = /<a href="https:\/\/manhwasco.net\/manga\/([^"]+?)" title="(.*?)".*?(?:data-)?src="(.*?)"/gs
        var list = [];
        var m;
        while(m = regex.exec(html)){
            list.push({
                "url": "https://manhwasco.net/manga/" + m[1],
                "name": m[2],
                "thumb": m[3]
            });
        }
        return list;
    }
    async getComicInfo(url){
        var html = await AutoHttp.get(url);
        var regex = {
            name: /<h1>(.*?)<\/h1>/s,
            tags: /class="genres-box">(.*?)<\/a>/gs,
            thumb: /<meta property="og:image" content="(.*?)"/s,
            chapters: /<a href="(https:\/\/manhwasco.net\/manga\/[^\/]+?\/[^\/]+?\/)">([^<]*?)<\/a>/gs
        };
        var chapters = [];
        var m;
        var i = 0;
        while(m = regex.chapters.exec(html)){
            i++;
            chapters.push({
                "url": m[1],
                "name": m[2]
            });
        }
        chapters = chapters.reverse();
        return {
            "url": url,
            "name": regex.name.exec(html)[1],
            "chapters": chapters,
            "thumb": regex.thumb.exec(html)[1],
            "desc": "",
            "tags": Array.from(html.matchAll(regex.tags)).map(e => e[1]),
            "languageHint": "en",
            "transModeHint": "perpair"
        };
    }
}

class ZYMK extends ComicProvider {
    domain = "www.zymk.cn";
    baseUrl = "https://www.zymk.cn";
    name = "ZYMK";
    description = "Tri Âm Mạn Khách";
    async getTabs(){}
    async getComicList(url, page = 0){}
    async getComicInfo(url){}
}
class KanMan extends ZYMK {
    domain = "kanman.com";
    baseUrl = "https://www.kanman.com";
    name = "KanMan";
    description = "KanMan";

    async getTabs(){
        return [
            {
                "url": "https://www.kanman.com/sort/story.html",
                "name": "Toàn bộ"
            },
            {
                "url": "https://www.kanman.com/sort/rexue.html",
                "name": "Nhiệt huyết"
            },
            {
                "url": "https://www.kanman.com/sort/jizhan.html",
                "name": "Cơ chiến"
            },
            {
                "url": "https://www.kanman.com/sort/yundong.html",
                "name": "Vận động"
            },
            {
                "url": "https://www.kanman.com/sort/tuili.html",
                "name": "Suy luận"
            },
            {
                "url": "https://www.kanman.com/sort/maoxian.html",
                "name": "Mạo hiểm"
            },
            {
                "url": "https://www.kanman.com/sort/gaoxiao.html",
                "name": "Khôi hài"
            },
            {
                "url": "https://www.kanman.com/sort/zhanzhen.html",
                "name": "Chiến tranh"
            },
            {
                "url": "https://www.kanman.com/sort/shenmo.html",
                "name": "Thần Ma"
            },
            {
                "url": "https://www.kanman.com/sort/renzhe.html",
                "name": "Ninja"
            },
            {
                "url": "https://www.kanman.com/sort/jingji.html",
                "name": "Thi đấu"
            },
            {
                "url": "https://www.kanman.com/sort/xuanyi.html",
                "name": "Huyền nghi"
            },
            {
                "url": "https://www.kanman.com/sort/shehui.html",
                "name": "Xã hội"
            },
            {
                "url": "https://www.kanman.com/sort/lianai.html",
                "name": "Yêu nhau"
            },
            {
                "url": "https://www.kanman.com/sort/chongwu.html",
                "name": "Sủng vật"
            },
            {
                "url": "https://www.kanman.com/sort/xixue.html",
                "name": "Hút máu"
            },
            {
                "url": "https://www.kanman.com/sort/luoli.html",
                "name": "La lỵ"
            },
            {
                "url": "https://www.kanman.com/sort/yujie.html",
                "name": "Ngự tỷ"
            },
            {
                "url": "https://www.kanman.com/sort/bazong.html",
                "name": "Bá tổng"
            },
            {
                "url": "https://www.kanman.com/sort/xuanhuan.html",
                "name": "Huyền huyễn"
            },
            {
                "url": "https://www.kanman.com/sort/gufeng.html",
                "name": "Cổ phong"
            },
            {
                "url": "https://www.kanman.com/sort/lishi.html",
                "name": "Lịch sử"
            },
            {
                "url": "https://www.kanman.com/sort/mangai.html",
                "name": "Khắp đổi"
            },
            {
                "url": "https://www.kanman.com/sort/youxi.html",
                "name": "Trò chơi"
            },
            {
                "url": "https://www.kanman.com/sort/chuanyue.html",
                "name": "Xuyên qua"
            },
            {
                "url": "https://www.kanman.com/sort/kongbu.html",
                "name": "Kinh khủng"
            },
            {
                "url": "https://www.kanman.com/sort/zhenren.html",
                "name": "Chân nhân"
            },
            {
                "url": "https://www.kanman.com/sort/kehuan.html",
                "name": "Khoa huyễn"
            },
            {
                "url": "https://www.kanman.com/sort/dushi.html",
                "name": "Đô thị"
            },
            {
                "url": "https://www.kanman.com/sort/wuxia.html",
                "name": "Võ hiệp"
            },
            {
                "url": "https://www.kanman.com/sort/xiuzhen.html",
                "name": "Tu chân"
            },
            {
                "url": "https://www.kanman.com/sort/shenghuo.html",
                "name": "Sinh hoạt"
            },
            {
                "url": "https://www.kanman.com/sort/dongzuo.html",
                "name": "Động tác"
            }
        ];
    }
}
var ComicProviderTable = {
    "kuaikanmanhua.com": Kuaikanmanhua,
    "m.kuaikanmanhua.com": MKuaikanmanhua,
    "www.baozimh.com": BaoziManhua,
    "yemancomic.com": YemanComic,
    "manhua.sfacg.com": ManhuaSFACG,
    "cartoon.reader.qq.com": YuewenDongman,
    "manhwasco.net": Manhwasco,
    "colamanga.com": Colamanga,
    // "kanman.com": KanMan,
    // "manhuatai": Manhuatai,
}

function getComicProvider(domain){
    try{
        var url = new URL(domain);
        domain = url.hostname;
    }
    catch(e){}
    if(ComicProviderTable[domain]) return new ComicProviderTable[domain]();
    domain = domain.replace("www.","");
    if(ComicProviderTable[domain]) return new ComicProviderTable[domain]();
    return null;
}
function getComicProviderMenu(){
    var menu = {
        type: "select",
        item: [
            {text: "BaoziManhua", value:"www.baozimh.com", onclick: function(){
                app.comicReader.currentProviderName = "BaoziManhua";
                app.topPage().q(".name").textContent = "BaoziManhua";
                app.comicReader.renderComicBrowser(app.topPage(),"www.baozimh.com");
            }},
            {text: "YemanComic", value:"yemancomic.com", onclick: function(){
                app.comicReader.currentProviderName = "YemanComic";
                app.topPage().q(".name").textContent = "YemanComic";
                app.comicReader.renderComicBrowser(app.topPage(),"yemancomic.com");
            }},
            {text: "KuaikanManhua", value:"m.kuaikanmanhua.com", onclick: function(){
                app.comicReader.currentProviderName = "KuaikanManhua";
                app.topPage().q(".name").textContent = "KuaikanManhua";
                app.comicReader.renderComicBrowser(app.topPage(),"m.kuaikanmanhua.com");
            }},
            {text: "ManhuaSFACG", value:"manhua.sfacg.com", onclick: function(){
                app.comicReader.currentProviderName = "ManhuaSFACG";
                app.topPage().q(".name").textContent = "ManhuaSFACG";
                app.comicReader.renderComicBrowser(app.topPage(),"manhua.sfacg.com");
            }},
            {text: "Qidian", value:"cartoon.reader.qq.com", onclick: function(){
                app.comicReader.currentProviderName = "Manhua Qidian";
                app.topPage().q(".name").textContent = "Manhua Qidian";
                app.comicReader.renderComicBrowser(app.topPage(),"cartoon.reader.qq.com");
            }},
            {text: "Manhwasco", value:"manhwasco.net", onclick: function(){
                app.comicReader.currentProviderName = "Manhwasco";
                app.topPage().q(".name").textContent = "Manhwasco";
                app.comicReader.renderComicBrowser(app.topPage(),"manhwasco.net");
            }},
            {text: "Colamanga", value:"colamanga.com", onclick: function(){
                app.comicReader.currentProviderName = "Colamanga";
                app.topPage().q(".name").textContent = "Colamanga";
                app.comicReader.renderComicBrowser(app.topPage(),"colamanga.com");
            }},
        ],
        selection: "app.comicReader.currentProviderHost",

    };
    return menu;
}
// test code
// var kkmh = new window["Kuaikanmanhua"]();
// kkmh.getImgs("https://www.kuaikanmanhua.com/web/comic/375872/").then(console.log).catch(console.error);

try{
    module.exports = {
        ComicProvider: ComicProvider,
        ComicProviderTable: ComicProviderTable,
        getComicProvider: getComicProvider,
        AutoHttp: AutoHttp,
    };
    window.translateObject = window.translateObject || function(o){return o;};
}catch(ex){}

