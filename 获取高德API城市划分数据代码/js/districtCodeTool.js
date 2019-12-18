//var my1 = new DistrictCodeTool();
//my1.click = function(data){
//alert(data.name);
//};
/***
 * author-tlr
 * date-2018.10.17
 * 
 */
/***
 * 选择行政区划代码工具 - tlr
 * @param top 距离上面多少px
 * @param left 距离左面多少px
 * @param click 点击确定后的方法
 * @returns {DistrictCodeTool}
 */
 //
 //这里用到的高德APIKey要换成自己的哦
var amapKey = "1beab631e1f93f4ef01f5b4501cef6fe";
document.write('<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.4.10&key='+amapKey+'&plugin=AMap.DistrictSearch"><\/script>');

function DistrictCodeTool(top, left, click) {
	try {
		AMap.DistrictSearch;
	} catch (e) {
		console.error("未加载高德API");
		return;
	}
	this.toolId = "amapTool" + Math.floor(Math.random() * (500 - 1 + 1) + 1);
	var toolCopy = jQuery.extend(true, {}, toolObj);
	toolCopy.clickFunction = this.click;
	toolCopy.init(this.toolId, top, left);
	tools[this.toolId] = toolCopy;
	this.Tool = tools[this.toolId];
	this.clickSelect = function(f){
		tools[this.toolId].clickFunction = f;
	};
	this.clickSelect(click);
	this.hide = function(){
		$("#"+this.toolId+"_div").hide();
	};
	this.show = function(t,l){
		$("#"+this.toolId+"_div").show();
		if(t){
			$("#"+this.toolId+"_div").css("top",t);
		}
		if(l){
			$("#"+this.toolId+"_div").css("left",l);
		}
		this.Tool.provinceSelect.value = "--请选择--";
		this.Tool.citySelect.innerHTML = '';
		this.Tool.districtSelect.innerHTML = '';
		this.Tool.selectDate='';
	};
};
var tools = {};
var getTool = {
  search : function(obj,id){
	  tools[id].search(obj);
  }
};
var toolObj = {
		toolId : null, // id
		provinceSelect : null, // 省选择框
		citySelect : null, // 市选择框
		districtSelect : null, //区县选择框
		district : null,//
		selectDate : null, //选中的数据
		clickFunction : null,
		init : function(toolId,top, left) {
			var that = this;
			this.toolId = toolId;
			this.htmlInit(toolId,top, left);
			$("#" + this.toolId + "_select").click(function() {
				if (that.clickFunction === undefined) {
					console.error("未设置click事件");
					return;
				}
				that.clickFunction(that.selectDate);
			});
			$("#"+this.toolId+"_close").click(function(){
				$("#"+that.toolId+"_div").hide();
			});
			
			this.provinceSelect = document.getElementById(this.toolId + '_province');
			this.citySelect = document.getElementById(this.toolId + '_city');
			this.districtSelect = document.getElementById(this.toolId + '_district');
			this.provinceSelect.onchange = function() {
				that.search(this);
			};
			this.citySelect.onchange = function() {
				that.search(this);
			};
			this.districtSelect.onchange = function() {
				that.search(this);
			};
			// 行政区划查询
			var opts = {
				subdistrict : 1, // 返回下一级行政区
				showbiz : false // 最后一级返回街道信息
			};
			this.district = new AMap.DistrictSearch(opts);// 注意：需要使用插件同步下发功能才能这样直接使用
			this.district.search('中国', function(status, result) {
				if (status == 'complete') {
					that.getData(result.districtList[0]);
				}
			});
		},
		search : function(obj) {
			var that = this;
			var option = obj[obj.options.selectedIndex];
			var keyword = option.text; // 关键字
			var adcode = option.adcode;
			this.district.setLevel(option.value); // 行政区级别
			this.district.setExtensions('all');
			if(keyword=="--请选择--"){
				var s = obj.id.split("_");
				if(s[1] == "province"){
					$("#"+s[0]+"_city").html("");
					$("#"+s[0]+"_district").html("");
					this.selectDate = "";
				}else if(s[1] == "city"){
					$("#"+s[0]+"_district").html("");
					this.search(this.provinceSelect);
				}else{
					this.search(this.citySelect);
				}
			}
			// 行政区查询
			// 按照adcode进行查询可以保证数据返回的唯一性
			this.district.search(adcode, function(status, result) {
				if (status === 'complete') {
					that.getData(result.districtList[0], obj.id);
				}
			});
		},
		getData : function(data, level) {
			var that = this;
			var bounds = data.boundaries;
			if(level){
				level = level.split("_")[1];
			}
			this.selectDate = data;
			// 清空下一级别的下拉列表
			if (level === 'province') {
				this.citySelect.innerHTML = '';
				this.districtSelect.innerHTML = '';
			} else if (level === 'city') {
				this.districtSelect.innerHTML = '';
			} else if (level === 'district') {
				console.log(data);
				// data {adcode:1,name:"xx"}
				return;
			}
			var subList = data.districtList;
			if (subList) {
				var contentSub = new Option('--请选择--');
				var curlevel = subList[0].level;
				if (curlevel == "street") {
					return;
				}
				var curList = document.querySelector('#' + this.toolId + '_'+ curlevel);
				curList.add(contentSub);
				for ( var i = 0, l = subList.length; i < l; i++) {
					var name = subList[i].name;
					var levelSub = subList[i].level;
					var cityCode = subList[i].citycode;
					var adcode = subList[i].adcode;
					contentSub = new Option(name);
					contentSub.setAttribute("value", adcode);
					contentSub.center = subList[i].center;
					contentSub.adcode = adcode;
					curList.add(contentSub);
				}
			}
		},
		htmlInit : function(toolId,top, left) {
			var t = "10px", l = "10px";
			if (top && top != "") {
				t = top;
			}
			if (left && left != "") {
				l = left;
			}
			var text = "";
			text += "<div id='"+toolId+"_div' name=\"districtCodeTool\" title=\"点击后开始拖动\" class=\"input-card\" style=\"z-index:9999999;position: absolute;top:" + t+ ";left:" + l + ";height: 195px;display:none;\">";
			text += "    <h4>下属行政区查询</h4>";
			text += " <a id=\""+toolId+"_close\" href=\"javascirpt:void(0)\" style=\"position: absolute;right: 10px;top: 2px;cursor: -webkit-grabbing;\">x</a>";
			text += "    <div class=\"input-item\">";
			text += "        <div class=\"input-item-prepend\"><span class=\"input-item-text\" >省市区</span></div>";
			text += "        <select id='" + toolId+ "_province' style=\"width:100px\"></select>";
			text += "    </div>";
			text += "    <div class=\"input-item\">";
			text += "        <div class=\"input-item-prepend\"><span class=\"input-item-text\"  >地级市</span></div>";
			text += "        <select id='"+ toolId+ "_city' style=\"width:100px\" onchange=\"getTool.search(this,'"+ toolId+"')\"></select>";
			text += "    </div>";
			text += "    <div class=\"input-item\">";
			text += "        <div class=\"input-item-prepend\"><span class=\"input-item-text\"  >区县</span></div>";
			text += "        <select id='"+ toolId+ "_district' style=\"width:100px\" onchange=\"getTool.search(this,'"+toolId+"')\"></select>";
			text += "    </div>";

			text += "<div class=\"input-item\">";
			text += "	<button id='" + toolId + "_select' class=\"btn\" style=\"width: 100%;\">确定选择</button>";
			text += "</div>";

			text += "</div>";
			$("body").append(text);
			
			var _move = false;//移动标记  
			var _x, _y;//鼠标离控件左上角的相对位置  
			$("#"+toolId+"_div").click(function() {
				//alert("click");//点击（松开后触发）  
			}).mousedown(function(e) {
				_move = true;
				_x = e.pageX - parseInt($("#"+toolId+"_div").css("left"));
				_y = e.pageY - parseInt($("#"+toolId+"_div").css("top"));
				$("#"+toolId+"_div").fadeTo(20, 0.7);//点击后开始拖动并透明显示  
			});
			//document
			$("#"+toolId+"_div").mousemove(function(e) {
				if (_move) {
					var x = e.pageX - _x;//移动时根据鼠标位置计算控件左上角的绝对位置  
					var y = e.pageY - _y;
					$("#"+toolId+"_div").css({
						top : y,
						left : x
					});//控件新位置  
				}
			}).mouseup(function() {
				_move = false;
				$("#"+toolId+"_div").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明  
			});
			
		},cssInit:function(){
			var text = "<style>";
			text += "[name='districtCodeTool'] {";
			text += " font-size: 12px;";
			text += "}";
			text += "[name='districtCodeTool'] h4 {";
			text += "    font-family: inherit;";
			text += "    line-height: 1.8;";
			text += "    font-weight: 300;";
			text += "    color: inherit;";
			text += "    font-size: 1.1rem;";
			text += "    margin-top: 0;";
			text += "    margin-bottom: .5rem;";
			text += "}";
			text += "";
			text += ".input-card {";
			text += "    display: flex;";
			text += "    flex-direction: column;";
			text += "    min-width: 0;";
			text += "    word-wrap: break-word;";
			text += "    background-color: #fff;";
			text += "    background-clip: border-box;";
			text += "    border-radius: .25rem;";
			text += "    width: 22rem;";
			text += "    border-width: 0;";
			text += "    border-radius: 0.4rem;";
			text += "    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);";
			text += "    position: fixed;";
			text += "    bottom: 1rem;";
			text += "    right: 1rem;";
			text += "    -ms-flex: 1 1 auto;";
			text += "    flex: 1 1 auto;";
			text += "    padding: 0.75rem 1.25rem;";
			text += "}";
			text += "[name='districtCodeTool'] .input-item {";
			text += "    position: relative;";
			text += "    display: -ms-flexbox;";
			text += "    display: flex;";
			text += "    -ms-flex-wrap: wrap;";
			text += "    flex-wrap: wrap;";
			text += "    -ms-flex-align: center;";
			text += "    align-items: center;";
			text += "    width: 100%;";
			text += "    height: 3rem;";
			text += "}";
			text += "";
			text += "";
			text += "[name='districtCodeTool'] .input-item-prepend {";
			text += "    margin-right: -1px;";
			text += "}";
			text += "";
			text += "[name='districtCodeTool'] .input-item>select:not(:first-child),[name='districtCodeTool'] .input-item>input[type=text]:not(:first-child) {";
			text += "    border-top-left-radius: 0;";
			text += "    border-bottom-left-radius: 0;";
			text += "}";
			text += "[name='districtCodeTool'] .input-item>select,[name='districtCodeTool'] .input-item>input[type=text] {";
			text += "    position: relative;";
			text += "    -ms-flex: 1 1 auto;";
			text += "    flex: 1 1 auto;";
			text += "    width: 1%;";
			text += "    margin-bottom: 0;";
			text += "}";
			text += "[name='districtCodeTool'] select,[name='districtCodeTool'] input[type=text] {";
			text += "  display: inline-block;";
			text += "  width: 100%;";
			text += "  padding: .375rem 1.75rem .375rem .75rem;";
			text += "  line-height: 1.5;";
			text += "  color: #495057;";
			text += "  vertical-align: middle;";
			text += "  background: #fff url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E\") no-repeat right .75rem center;";
			text += "  background-size: 8px 10px;";
			text += "  border: 1px solid #ced4da;";
			text += "  border-radius: .25rem;";
			text += "  -webkit-appearance: none;";
			text += "  -moz-appearance: none;";
			text += "  appearance: none";
			text += "}";
			text += "";
			text += "[name='districtCodeTool'] .btn:hover {";
			text += "    text-decoration: none;";
			text += "}";
			text += "[name='districtCodeTool'] .btn:hover {";
			text += "    color: #fff;";
			text += "    background-color: #25A5F7;";
			text += "    border-color: #25A5F7;";
			text += "}";
			text += "";
			text += "[name='districtCodeTool'] .btn {";
			text += "    display: inline-block;";
			text += "    font-weight: 400;";
			text += "    text-align: center;";
			text += "    white-space: nowrap;";
			text += "    vertical-align: middle;";
			text += "    -webkit-user-select: none;";
			text += "    -moz-user-select: none;";
			text += "    -ms-user-select: none;";
			text += "    user-select: none;";
			text += "    border: 1px solid transparent;";
			text += "    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;";
			text += "    background-color: transparent;";
			text += "    background-image: none;";
			text += "    color: #25A5F7;";
			text += "    border-color: #25A5F7;";
			text += "    padding: .25rem .5rem;";
			text += "    line-height: 1.5;";
			text += "    border-radius: 1rem;";
			text += "    -webkit-appearance: button;";
			text += "    cursor: pointer;";
			text += "}";
			text += "[name='districtCodeTool'] label,[name='districtCodeTool'] .btn {";
			text += "    margin-left: 0;";
			text += "    font-size: 1rem;";
			text += "}";
			text += "[name='districtCodeTool'] .input-item-text {";
			text += "    width: 6rem;";
			text += "    text-align: justify;";
			text += "    padding: 0.4rem 0.7rem;";
			text += "    display: inline-block;";
			text += "    text-justify: distribute-all-lines;";
			text += "    text-align-last: justify;";
			text += "    -moz-text-align-last: justify;";
			text += "    -webkit-text-align-last: justify;";
			text += "    -ms-flex-align: center;";
			text += "    align-items: center;";
			text += "    margin-bottom: 0;";
			text += "    font-size: 1rem;";
			text += "    font-weight: 400;";
			text += "    line-height: 1.5;";
			text += "    color: #495057;";
			text += "    text-align: center;";
			text += "    white-space: nowrap;";
			text += "    background-color: #e9ecef;";
			text += "    border: 1px solid #ced4da;";
			text += "    border-radius: .25rem;";
			text += "    border-bottom-right-radius: 0;";
			text += "    border-top-right-radius: 0;";
			text += "}";
			text += "[name='districtCodeTool'] .input-item-text,[name='districtCodeTool'] input[type=text],[name='districtCodeTool'] select {";
			text += "    height: calc(2.2rem + 2px);";
			text += "}";
			text += "</style>";
			$("head").append(text);
		}
};
toolObj.cssInit();